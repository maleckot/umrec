// src/app/actions/saveClassification.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { generateApprovalDocuments } from '@/utils/pdf/generateApprovalDocs'; // ✅ Import the same function

export async function saveClassification(
  submissionId: string,
  category: 'Exempted' | 'Expedited' | 'Full Review',
  revisionComments?: string
) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const reviewersRequired = {
      'Exempted': 0,
      'Expedited': 3,
      'Full Review': 5,
    }[category];

    // ✅ CONDITIONAL: If Exempted, mark as approved and generate cert; else mark as classified
    if (category === 'Exempted') {
      console.log('✅ Exempted classification detected. Marking as approved...');

      // Update submission with approved status
      const { error: updateError } = await supabase
        .from('research_submissions')
        .update({
          classification_type: category,
          assigned_reviewers_count: reviewersRequired,
          status: 'approved',
          classified_at: new Date().toISOString(),
          classified_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        return { success: false, error: 'Failed to save classification' };
      }

      // ✅ Mark all documents as approved
      console.log('📋 Marking all documents as approved...');

      const { data: allDocs } = await supabase
        .from('uploaded_documents')
        .select('id')
        .eq('submission_id', submissionId);

      if (allDocs && allDocs.length > 0) {
        const { error: verifyError } = await supabase
          .from('document_verifications')
          .update({
            is_approved: true,
            verified_at: new Date().toISOString(),
            feedback_comment: 'Exempted from review - automatically approved',
          })
          .eq('submission_id', submissionId);

        if (verifyError) {
          console.warn('⚠️ Could not update document verifications:', verifyError);
        } else {
          console.log('✅ All documents marked as approved');
        }

        // ✅ Mark all comments as resolved
        const { error: commentError } = await supabase
          .from('submission_comments')
          .update({ is_resolved: true })
          .eq('submission_id', submissionId)
          .eq('is_resolved', false);

        if (commentError) {
          console.warn('⚠️ Could not mark comments as resolved:', commentError);
        } else {
          console.log('✅ All submission comments marked as resolved');
        }
      }

      // ✅ GENERATE CERTIFICATE OF APPROVAL ONLY
      console.log('📄 Generating Certificate of Approval...');
      try {
        await generateApprovalDocuments(submissionId);
        console.log('✅ Certificate of Approval generated');
      } catch (genError) {
        console.error('⚠️ Failed to generate approval documents:', genError);
        // Don't fail the whole process if document generation fails
        // Return success but log warning
      }

      console.log('✅ Exempted submission approved successfully with Certificate of Approval!');
      return {
        success: true,
        classification: category,
        status: 'approved',
        reviewersRequired,
        message: 'Exempted submission approved and Certificate of Approval generated',
      };
    } else {
      // ✅ For Expedited or Full Review, use classified status (no documents yet)
      console.log(`📋 ${category} classification. Marking as classified...`);

      const { error: updateError } = await supabase
        .from('research_submissions')
        .update({
          classification_type: category,
          assigned_reviewers_count: reviewersRequired,
          status: 'classified',
          classified_at: new Date().toISOString(),
          classified_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        return { success: false, error: 'Failed to save classification' };
      }

      console.log(`✅ ${category} classification saved successfully!`);
      return {
        success: true,
        classification: category,
        status: 'classified',
        reviewersRequired,
        message: `${category} classification saved. Awaiting reviewer assignments.`,
      };
    }
  } catch (error) {
    console.error('❌ Error saving classification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save classification',
    };
  }
}
