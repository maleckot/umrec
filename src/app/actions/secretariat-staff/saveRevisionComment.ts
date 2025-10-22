// app/actions/secretariat-staff/saveRevisionComment.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function saveRevisionComment(
  submissionId: string,
  comment: string,
  checklist?: any
) {
  try {
    const supabase = await createClient();

    // Verify user is staff or secretariat
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return { success: false, error: 'User profile not found' };
    }

    if (!['staff', 'secretariat'].includes(profile.role || '')) {
      return { success: false, error: 'Unauthorized - Staff or Secretariat access required' };
    }

    // Build formatted comment if checklist provided
    let finalComment = comment;
    const documentsToReject: string[] = [];

    if (checklist) {
      const checklistItems = Object.entries(checklist)
        .filter(([_, checked]) => checked)
        .map(([key, _]) => {
          const nameMap: any = {
            researchProtocol: 'Research Protocol',
            consentForm: 'Informed Consent Form',
            researchInstrument: 'Research Instrument',
            endorsementLetter: 'Endorsement Letter',
            proposalDefense: 'Proposal Defense',
            applicationForm: 'Application Form',
          };

          // Store document types for updating verifications
          const docTypeMap: any = {
            researchProtocol: 'research_protocol',
            consentForm: 'consent_form',
            researchInstrument: 'research_instrument',
            endorsementLetter: 'endorsement_letter',
            proposalDefense: 'proposal_defense',
            applicationForm: 'application_form',
          };

          documentsToReject.push(docTypeMap[key]);
          return nameMap[key] || key;
        });

      if (checklistItems.length > 0) {
        finalComment = `Documents requiring revision:\n${checklistItems.map(d => `• ${d}`).join('\n')}\n\nFeedback:\n${comment}`;
      }
    }

    // Save comment to submission_comments table
    const { error: commentError } = await supabase
      .from('submission_comments')
      .insert({
        submission_id: submissionId,
        commenter_id: user.id,
        commenter_role: profile.role,
        comment_text: finalComment,
        comment_type: 'revision_request',
        created_at: new Date().toISOString(),
      });

    if (commentError) {
      console.error('Error saving comment:', commentError);
      return { success: false, error: commentError.message };
    }

    // ✅ UPDATE document_verifications for checked documents
    if (documentsToReject.length > 0) {
      console.log('🔍 Looking for documents with types:', documentsToReject);
      
      // Get document IDs for the documents that need revision
      const { data: documents, error: docError } = await supabase
        .from('uploaded_documents')
        .select('id, document_type, file_name')
        .eq('submission_id', submissionId)
        .in('document_type', documentsToReject);

      console.log('📄 Found documents:', documents);
      
      if (docError) {
        console.error('Error fetching documents:', docError);
      }

      if (documents && documents.length > 0) {
        // Update or insert verifications for each document
        for (const doc of documents) {
          console.log(`📝 Processing document: ${doc.file_name} (ID: ${doc.id})`);
          
          // Try UPDATE first
          const { data: updateData, error: updateError } = await supabase
            .from('document_verifications')
            .update({
              is_approved: false,
            })
            .eq('document_id', doc.id)
            .select();

          console.log('Update result:', updateData, updateError);

          // If no rows updated, INSERT new verification
          if (!updateData || updateData.length === 0) {
            console.log('No existing verification found, inserting new one...');
            
            const { data: insertData, error: insertError } = await supabase
              .from('document_verifications')
              .insert({
                submission_id: submissionId,
                document_id: doc.id,
                verified_by: user.id,
                is_approved: false,
                feedback_comment: finalComment,
                verified_at: new Date().toISOString(),
              })
              .select();

            console.log('Insert result:', insertData, insertError);
            
            if (insertError) {
              console.error('❌ Error inserting verification:', insertError);
            } else {
              console.log('✅ Inserted verification for document:', doc.id);
            }
          } else {
            console.log('✅ Updated verification for document:', doc.id);
          }
        }
      } else {
        console.warn('⚠️ No documents found matching the selected types');
      }
    }

    // Update submission status to needs_revision
    const { error: statusError } = await supabase
      .from('research_submissions')
      .update({
        status: 'needs_revision',
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (statusError) {
      console.error('Error updating status:', statusError);
      return { success: false, error: 'Failed to update submission status' };
    }

    console.log('✅ Revision request completed successfully');

    return {
      success: true,
      message: 'Revision request sent successfully',
    };

  } catch (error) {
    console.error('Error in saveRevisionComment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save comment',
    };
  }
}
