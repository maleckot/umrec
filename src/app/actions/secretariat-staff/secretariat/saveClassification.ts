'use server';

import { createClient } from '@/utils/supabase/server';
import { generateApprovalDocuments } from '@/utils/pdf/generateApprovalDocs';
import { generateConsolidatedReviewerPdf } from '@/app/actions/generatePdfFromDatabase';

// ✅ FIX: Add in-memory lock to prevent concurrent generation
const generationLocks = new Map<string, Promise<void>>();

// ✅ FIXED HELPER: Use lock + transaction-like check to prevent duplication
async function generateAndUploadConsolidatedReview(
  supabase: any,
  submissionId: string,
  submissionData: any
) {
  // ✅ Check if generation is already in progress for this submission
  if (generationLocks.has(submissionId)) {
    console.log(`⏳ Consolidated review generation already in progress for ${submissionId}, skipping...`);
    await generationLocks.get(submissionId); // Wait for it to complete
    return;
  }

  // ✅ Create a lock promise for this submission
  let resolveLock: () => void;
  const lockPromise = new Promise<void>((resolve) => {
    resolveLock = resolve;
  });
  generationLocks.set(submissionId, lockPromise);

  try {
    console.log('📄 Generating Consolidated Document for Reviewer...');

    // ✅ CHECK: Get existing consolidated_review documents with FOR UPDATE-like behavior
    const { data: existingDocs, error: fetchError } = await supabase
      .from('uploaded_documents')
      .select('id, file_url, uploaded_at')
      .eq('submission_id', submissionId)
      .eq('document_type', 'consolidated_review')
      .order('uploaded_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching existing docs:', fetchError);
      return;
    }

    const existingCount = existingDocs?.length || 0;
    
    // ✅ If already exists, skip generation entirely
    if (existingCount > 0) {
      console.log(`✅ Consolidated review already exists (${existingCount} found). Skipping generation.`);
      return;
    }

    console.log('🔨 No existing consolidated review found. Generating new one...');

    const pdfData = {
      ...submissionData,
      submissionId: submissionId  
    };
    
    const pdfResult = await generateConsolidatedReviewerPdf(pdfData);

    if (pdfResult.success && pdfResult.pdfData) {
      const base64Data = pdfResult.pdfData.split(',')[1] || pdfResult.pdfData;
      const buffer = Buffer.from(base64Data, 'base64');

      // ✅ Upload NEW file with unique timestamp
      const timestamp = Date.now();
      const fileName = `consolidated_review_${submissionId}_${timestamp}.pdf`;
      const filePath = `consolidated/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(filePath, buffer, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Failed to upload consolidated review:', uploadError);
        return;
      }

      // ✅ Double-check one more time before inserting
      const { data: recheckDocs } = await supabase
        .from('uploaded_documents')
        .select('id')
        .eq('submission_id', submissionId)
        .eq('document_type', 'consolidated_review');

      if (recheckDocs && recheckDocs.length > 0) {
        console.warn('⚠️ Race condition detected! Document was created by another process. Deleting uploaded file...');
        await supabase.storage
          .from('research-documents')
          .remove([filePath]);
        return;
      }

      // ✅ Insert document reference
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
        console.error('❌ Failed to save document reference:', docError);
        // Clean up uploaded file
        await supabase.storage
          .from('research-documents')
          .remove([filePath]);
      } else {
        console.log('✅ Consolidated Document for Reviewer generated and saved successfully');
      }
    } else {
      console.error('❌ PDF generation failed:', pdfResult.error);
    }
  } catch (error) {
    console.error('❌ Error in generateAndUploadConsolidatedReview:', error);
  } finally {
    // ✅ Release the lock
    generationLocks.delete(submissionId);
    resolveLock!();
  }
}


// --- MAIN FUNCTION UPDATE STARTS HERE ---

export async function saveClassification(
  submissionId: string,
  category: 'Exempted' | 'Expedited' | 'Full Review',
  revisionComments?: string,
  dueDate?: Date // <--- 1. ADDED THIS ARGUMENT
) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // ✅ Check if already classified to prevent re-running
    const { data: existingSubmission } = await supabase
      .from('research_submissions')
      .select('status, classification_type, classified_at')
      .eq('id', submissionId)
      .single();

    if (existingSubmission?.classified_at && existingSubmission?.classification_type === category) {
      console.log('⚠️ Submission already classified. Skipping...');
      return {
        success: true,
        classification: category,
        status: existingSubmission.status,
        message: 'Submission was already classified',
        alreadyClassified: true
      };
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

    // ✅ GENERATE CONSOLIDATED PDF ONCE (with lock protection)
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
          due_date: dueDate ? dueDate.toISOString() : null, // <--- 2. SAVING DUE DATE (optional for exempted, but good for records)
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
          due_date: dueDate ? dueDate.toISOString() : null, // <--- 2. SAVING DUE DATE HERE (Crucial for dashboard)
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
