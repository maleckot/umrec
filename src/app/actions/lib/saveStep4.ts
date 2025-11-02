// src/app/actions/lib/saveStep4.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { generateApplicationFormPdf } from '@/app/actions/generatePdfFromDatabase';
import { generateResearchProtocolPdf } from '@/app/actions/generatePdfFromDatabase';
import { generateConsentFormPdf } from '@/app/actions/generatePdfFromDatabase';
import { regeneratePdfWithTitle } from './pdfDocumentManager';

export async function saveStep4Data({
  submissionId,
  formData,
}: {
  submissionId: string;
  formData: any;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('📝 Saving Step 4 - Consent Forms...');

    // ✅ Check if consent form already exists
    const { data: existingConsent } = await supabase
      .from('consent_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    // Build adult consent data
    const adultConsentData =
      formData.consentType === 'adult' || formData.consentType === 'both'
        ? {
            adultLanguage: formData.adultLanguage || 'english',
            introductionEnglish: formData.introductionEnglish || '',
            introductionTagalog: formData.introductionTagalog || '',
            purposeEnglish: formData.purposeEnglish || '',
            purposeTagalog: formData.purposeTagalog || '',
            researchInterventionEnglish:
              formData.researchInterventionEnglish || '',
            researchInterventionTagalog:
              formData.researchInterventionTagalog || '',
            participantSelectionEnglish:
              formData.participantSelectionEnglish || '',
            participantSelectionTagalog:
              formData.participantSelectionTagalog || '',
            voluntaryParticipationEnglish:
              formData.voluntaryParticipationEnglish || '',
            voluntaryParticipationTagalog:
              formData.voluntaryParticipationTagalog || '',
            proceduresEnglish: formData.proceduresEnglish || '',
            proceduresTagalog: formData.proceduresTagalog || '',
            durationEnglish: formData.durationEnglish || '',
            durationTagalog: formData.durationTagalog || '',
            risksEnglish: formData.risksEnglish || '',
            risksTagalog: formData.risksTagalog || '',
            benefitsEnglish: formData.benefitsEnglish || '',
            benefitsTagalog: formData.benefitsTagalog || '',
            reimbursementsEnglish: formData.reimbursementsEnglish || '',
            reimbursementsTagalog: formData.reimbursementsTagalog || '',
            confidentialityEnglish: formData.confidentialityEnglish || '',
            confidentialityTagalog: formData.confidentialityTagalog || '',
            sharingResultsEnglish: formData.sharingResultsEnglish || '',
            sharingResultsTagalog: formData.sharingResultsTagalog || '',
            rightToRefuseEnglish: formData.rightToRefuseEnglish || '',
            rightToRefuseTagalog: formData.rightToRefuseTagalog || '',
            whoToContactEnglish: formData.whoToContactEnglish || '',
            whoToContactTagalog: formData.whoToContactTagalog || '',
          }
        : null;

    // Build minor assent data
    const minorAssentData =
      formData.consentType === 'minor' || formData.consentType === 'both'
        ? {
            minorLanguage: formData.minorLanguage || 'english',
            introductionMinorEnglish:
              formData.introductionMinorEnglish || '',
            introductionMinorTagalog:
              formData.introductionMinorTagalog || '',
            purposeMinorEnglish: formData.purposeMinorEnglish || '',
            purposeMinorTagalog: formData.purposeMinorTagalog || '',
            choiceOfParticipantsEnglish:
              formData.choiceOfParticipantsEnglish || '',
            choiceOfParticipantsTagalog:
              formData.choiceOfParticipantsTagalog || '',
            voluntarinessMinorEnglish:
              formData.voluntarinessMinorEnglish || '',
            voluntarinessMinorTagalog:
              formData.voluntarinessMinorTagalog || '',
            proceduresMinorEnglish: formData.proceduresMinorEnglish || '',
            proceduresMinorTagalog: formData.proceduresMinorTagalog || '',
            risksMinorEnglish: formData.risksMinorEnglish || '',
            risksMinorTagalog: formData.risksMinorTagalog || '',
            benefitsMinorEnglish: formData.benefitsMinorEnglish || '',
            benefitsMinorTagalog: formData.benefitsMinorTagalog || '',
            confidentialityMinorEnglish:
              formData.confidentialityMinorEnglish || '',
            confidentialityMinorTagalog:
              formData.confidentialityMinorTagalog || '',
            sharingFindingsEnglish: formData.sharingFindingsEnglish || '',
            sharingFindingsTagalog: formData.sharingFindingsTagalog || '',
          }
        : null;

    const updateData = {
      submission_id: submissionId,
      consent_type: formData.consentType,
      contact_person: formData.contactPerson || '',
      contact_number: formData.contactNumber || '',
      informed_consent_for: formData.participantGroupIdentity || '',
      adult_consent: adultConsentData,
      minor_assent: minorAssentData,
    };

    // Update or insert consent form
    if (existingConsent) {
      const { error: updateError } = await supabase
        .from('consent_forms')
        .update(updateData)
        .eq('submission_id', submissionId);

      if (updateError) throw updateError;
      console.log('✅ Consent form updated');
    } else {
      const { error: insertError } = await supabase
        .from('consent_forms')
        .insert(updateData);

      if (insertError) throw insertError;
      console.log('✅ Consent form created');
    }

    // ✅ FETCH DATA FOR ALL 3 PDFS
    console.log('📋 Fetching data for all 3 PDF regenerations...');

    const { data: submission } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (!submission) {
      throw new Error('Submission not found');
    }

    const { data: protocol } = await supabase
      .from('research_protocols')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    // ✅ BUILD PDF DATA FOR ALL 3

    const step2PdfData = {
      step1: {
        title: submission?.title,
      },
      step2: {
        title: submission?.title,
      },
    };

    const step3PdfData = {
      step1: {},
      step2: {},
      step3: {
        formData: {
          introduction: protocol?.introduction || '',
          background: protocol?.background || '',
          problemStatement: protocol?.problem_statement || '',
          scopeDelimitation: protocol?.scope_delimitation || '',
          literatureReview: protocol?.literature_review || '',
          methodology: protocol?.methodology || '',
          population: protocol?.population || '',
          samplingTechnique: protocol?.sampling_technique || '',
          researchInstrument: protocol?.research_instrument || '',
          ethicalConsideration: protocol?.ethical_consideration || '',
          statisticalTreatment: protocol?.statistical_treatment || '',
          references: protocol?.research_references || '',
          title: submission?.title,
        },
        researchers: protocol?.researchers || [],
      },
      step4: {},
    };

    const step4PdfData = {
      step2: submission,
      step4: {
        formData,
        consentType: formData.consentType,
      },
    };

    // ✅ REGENERATE ALL 3 PDFS IN PARALLEL
    console.log('🔄 Regenerating all 3 PDFs...');

    await Promise.all([
      regeneratePdfWithTitle({
        submissionId,
        documentType: 'application_form',
        pdfData: step2PdfData,
        generatePdfFn: generateApplicationFormPdf,
        filePrefix: 'application_form',
      }),
      regeneratePdfWithTitle({
        submissionId,
        documentType: 'research_protocol',
        pdfData: step3PdfData,
        generatePdfFn: generateResearchProtocolPdf,
        filePrefix: 'research_protocol',
      }),
      regeneratePdfWithTitle({
        submissionId,
        documentType: 'consent_form',
        pdfData: step4PdfData,
        generatePdfFn: generateConsentFormPdf,
        filePrefix: 'consent_form',
      }),
    ]);

    console.log('✅ All 3 PDFs regenerated successfully!');

    // ✅ RESET VERIFICATION ONLY FOR CONSENT_FORM
    console.log('🔄 Resetting consent_form verification...');

    const { data: consentDoc } = await supabase
      .from('uploaded_documents')
      .select('id')
      .eq('submission_id', submissionId)
      .eq('document_type', 'consent_form')
      .single();

    if (consentDoc) {
      const { data: existingVerif } = await supabase
        .from('document_verifications')
        .select('id')
        .eq('document_id', consentDoc.id)
        .single();

      if (existingVerif) {
        await supabase
          .from('document_verifications')
          .update({
            is_approved: null,
            feedback_comment: null,
            verified_at: null,
          })
          .eq('id', existingVerif.id);

        console.log('✅ Consent form verification cleared');
      } else {
        await supabase
          .from('document_verifications')
          .insert({
            document_id: consentDoc.id,
            submission_id: submissionId,
            is_approved: null,
            feedback_comment: null,
            verified_at: null,
          });

        console.log('✅ New consent form verification created');
      }
    }

    // ✅ CHECK STATUS: If all document verifications are null → "pending", else → "needs_revision"
    console.log('🔍 Checking document verification status...');

    const { data: allDocs } = await supabase
      .from('uploaded_documents')
      .select('id')
      .eq('submission_id', submissionId);

    if (allDocs && allDocs.length > 0) {
      // Get all verification records for this submission
      const { data: allVerifications } = await supabase
        .from('document_verifications')
        .select('is_approved')
        .eq('submission_id', submissionId);

      // Check if ALL verifications are null/approved is null
      const allAreNull = !allVerifications || allVerifications.every(v => v.is_approved === null);

      const newStatus = allAreNull ? 'pending' : 'needs_revision';

      console.log(`📊 Status update: ${newStatus} (${allAreNull ? 'All verifications null' : 'Some verifications exist'})`);

      // Update submission status
      const { error: statusError } = await supabase
        .from('research_submissions')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (statusError) {
        throw new Error(`Failed to update submission status: ${statusError.message}`);
      }

      console.log(`✅ Submission status updated to: ${newStatus}`);
    }

    console.log('✅ Step 4 saved successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Save error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : String(error),
    };
  }
}
