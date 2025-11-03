'use server';

import { createClient } from '@/utils/supabase/server';
import { generateApprovalDocuments } from '@/utils/pdf/generateApprovalDocs';
import { generateConsolidatedReviewerPdf } from '@/app/actions/generatePdfFromDatabase';

// ✅ HELPER: Generate and upload consolidated PDF once
// ✅ HELPER: Generate and upload consolidated PDF once
async function generateAndUploadConsolidatedReview(
  supabase: any,
  submissionId: string,
  submissionData: any
) {
  console.log('📄 Generating Consolidated Document for Reviewer...');
  try {
    const pdfResult = await generateConsolidatedReviewerPdf(submissionData);

    if (pdfResult.success && pdfResult.pdfData) {
      const base64Data = pdfResult.pdfData.split(',')[1] || pdfResult.pdfData;
      const buffer = Buffer.from(base64Data, 'base64');

      const fileName = `consolidated_review_${submissionId}.pdf`;
      const filePath = `consolidated/${fileName}`;

      // ✅ Check if existing consolidated_review exists
      const { data: existingDoc } = await supabase
        .from('uploaded_documents')
        .select('id')
        .eq('submission_id', submissionId)
        .eq('document_type', 'consolidated_review')
        .maybeSingle();

      // ✅ If exists, delete the old one from database
      if (existingDoc) {
        console.log('🔄 Existing consolidated review found. Deleting old record...');
        await supabase
          .from('uploaded_documents')
          .delete()
          .eq('id', existingDoc.id);
      }

      // Upload to storage (upsert handles overwrite)
      const { error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(filePath, buffer, {
          contentType: 'application/pdf',
          upsert: true  // ✅ This overwrites the file if it exists
        });

      if (!uploadError) {
        // ✅ Insert new record
        const { error: docError } = await supabase
          .from('uploaded_documents')
          .insert({
            submission_id: submissionId,
            document_type: 'consolidated_review',
            file_name: fileName,
            file_url: filePath,
            file_size: buffer.length,
            uploaded_at: new Date().toISOString()
          });

        if (docError) {
          console.warn('⚠️ Failed to save document reference:', docError);
        } else {
          console.log('✅ Consolidated Document for Reviewer generated and saved');
        }
      } else {
        console.warn('⚠️ Failed to upload consolidated review:', uploadError);
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to generate consolidated review:', error);
  }
}


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

    // ✅ FETCH ALL SUBMISSION DATA
    console.log('📚 Fetching submission data for consolidated PDF...');
    const { data: submission } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    const { data: appForm } = await supabase
      .from('application_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    const { data: protocol } = await supabase
      .from('research_protocols')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    const { data: consent } = await supabase
      .from('consent_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    // ✅ BUILD SUBMISSION DATA FOR PDF
    const submissionData = {
      step1: {
        title: submission?.title,
        projectLeaderFirstName: submission?.project_leader_first_name,
        projectLeaderLastName: submission?.project_leader_last_name,
        organization: submission?.organization,
      },
      step2: {
        college: submission?.college,
        institution: appForm?.institution || 'University of Makati',
        typeOfStudy: submission?.type_of_study,
        sourceOfFunding: submission?.source_of_funding,
        startDate: submission?.start_date,
        endDate: submission?.end_date,
        numParticipants: submission?.num_participants,
      },
      step3: {
        formData: {
          title: protocol?.title,
          introduction: protocol?.introduction,
          background: protocol?.background,
          problemStatement: protocol?.problem_statement,
          scopeDelimitation: protocol?.scope_delimitation,
          literatureReview: protocol?.literature_review,
          methodology: protocol?.methodology,
          population: protocol?.population,
          samplingTechnique: protocol?.sampling_technique,
          researchInstrument: protocol?.research_instrument,
          statisticalTreatment: protocol?.statistical_treatment,
          ethicalConsideration: protocol?.ethical_consideration,
          references: protocol?.research_references,
        },
      },
      step4: {
        consentType: consent?.consent_type,
        adultLanguage: consent?.adult_consent?.adultLanguage,
        minorLanguage: consent?.minor_assent?.minorLanguage,
        formData: {
          participantGroupIdentity: consent?.informed_consent_for,
          contactPerson: consent?.contact_person,
          contactNumber: consent?.contact_number,
          ...(consent?.adult_consent || {}),
          ...(consent?.minor_assent || {}),
        },
      },
    };

    // ✅ GENERATE CONSOLIDATED PDF ONCE (Before classification logic)
    await generateAndUploadConsolidatedReview(supabase, submissionId, submissionData);

    // ✅ CONDITIONAL: If Exempted, mark as approved and generate cert; else mark as classified
    if (category === 'Exempted') {
      console.log('✅ Exempted classification detected. Marking as approved...');

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

      // ✅ GENERATE CERTIFICATE OF APPROVAL
      console.log('📄 Generating Certificate of Approval...');
      try {
        await generateApprovalDocuments(submissionId);
        console.log('✅ Certificate of Approval generated');
      } catch (genError) {
        console.error('⚠️ Failed to generate approval documents:', genError);
      }

      console.log('✅ Exempted submission approved successfully with Certificate of Approval and Consolidated Review!');
      return {
        success: true,
        classification: category,
        status: 'approved',
        reviewersRequired,
        message: 'Exempted submission approved and Certificate of Approval generated',
      };
    } else {
      // ✅ For Expedited or Full Review, use classified status
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
