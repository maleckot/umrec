// src/app/actions/saveStep4Data.ts

'use server';

import { createClient } from '@/utils/supabase/server';
import { generateConsentFormPdf } from '@/app/actions/generatePdfFromDatabase';

export async function saveStep4Data({
  submissionId,
  formData
}: {
  submissionId: string;
  formData: any;
}) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('📝 Saving Step 4 - Consent Forms (REVISION)...');

    // ✅ Check if consent form already exists
    const { data: existingConsent } = await supabase
      .from('consent_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    // Build adult and minor consent data...
    const adultConsentData = formData.consentType === 'adult' || formData.consentType === 'both' 
      ? {
          adultLanguage: formData.adultLanguage || 'english',
          introductionEnglish: formData.introductionEnglish || '',
          introductionTagalog: formData.introductionTagalog || '',
          purposeEnglish: formData.purposeEnglish || '',
          purposeTagalog: formData.purposeTagalog || '',
          researchInterventionEnglish: formData.researchInterventionEnglish || '',
          researchInterventionTagalog: formData.researchInterventionTagalog || '',
          participantSelectionEnglish: formData.participantSelectionEnglish || '',
          participantSelectionTagalog: formData.participantSelectionTagalog || '',
          voluntaryParticipationEnglish: formData.voluntaryParticipationEnglish || '',
          voluntaryParticipationTagalog: formData.voluntaryParticipationTagalog || '',
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

    const minorAssentData = formData.consentType === 'minor' || formData.consentType === 'both'
      ? {
          minorLanguage: formData.minorLanguage || 'english',
          introductionMinorEnglish: formData.introductionMinorEnglish || '',
          introductionMinorTagalog: formData.introductionMinorTagalog || '',
          purposeMinorEnglish: formData.purposeMinorEnglish || '',
          purposeMinorTagalog: formData.purposeMinorTagalog || '',
          choiceOfParticipantsEnglish: formData.choiceOfParticipantsEnglish || '',
          choiceOfParticipantsTagalog: formData.choiceOfParticipantsTagalog || '',
          voluntarinessMinorEnglish: formData.voluntarinessMinorEnglish || '',
          voluntarinessMinorTagalog: formData.voluntarinessMinorTagalog || '',
          proceduresMinorEnglish: formData.proceduresMinorEnglish || '',
          proceduresMinorTagalog: formData.proceduresMinorTagalog || '',
          risksMinorEnglish: formData.risksMinorEnglish || '',
          risksMinorTagalog: formData.risksMinorTagalog || '',
          benefitsMinorEnglish: formData.benefitsMinorEnglish || '',
          benefitsMinorTagalog: formData.benefitsMinorTagalog || '',
          confidentialityMinorEnglish: formData.confidentialityMinorEnglish || '',
          confidentialityMinorTagalog: formData.confidentialityMinorTagalog || '',
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
      const { data: newConsent, error: insertError } = await supabase
        .from('consent_forms')
        .insert(updateData)
        .select('id')
        .single();

      if (insertError) throw insertError;
      console.log('✅ Consent form created');
    }

    // ✅ FIND DOCUMENT_ID FIRST (like Step 3)
    const { data: existingDoc } = await supabase
      .from('uploaded_documents')
      .select('id, file_url')
      .eq('submission_id', submissionId)
      .eq('document_type', 'consent_form')
      .single();

    let documentId: string;

    if (!existingDoc) {
      // ✅ CREATE NEW DOCUMENT ENTRY
      const { data: newDoc, error: docError } = await supabase
        .from('uploaded_documents')
        .insert({
          submission_id: submissionId,
          document_type: 'consent_form',
          file_name: `Consent_Form_${submissionId}`,
          file_url: `${submissionId}/consent-form.pdf`,
          file_size: 0,
          uploaded_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (docError) throw docError;
      documentId = newDoc.id;
      console.log('✅ Consent form document entry created');
    } else {
      documentId = existingDoc.id;
    }

    // ✅ FIND & UPDATE VERIFICATION BY DOCUMENT_ID
    const { data: existingVerification } = await supabase
      .from('document_verifications')
      .select('id')
      .eq('document_id', documentId)
      .single();

    if (existingVerification) {
      const { data: updated, error: updateError } = await supabase
        .from('document_verifications')
        .update({
          is_approved: null,
          feedback_comment: null,
          verified_at: null
        })
        .eq('id', existingVerification.id)
        .select();

      if (updateError) {
        console.warn('⚠️ Verification update warning:', updateError);
      } else {
        console.log('✅ Document verification cleared:', updated?.length);
      }
    } else {
      const { error: insertError } = await supabase
        .from('document_verifications')
        .insert({
          document_id: documentId,
          submission_id: submissionId,
          is_approved: null,
          feedback_comment: null,
          verified_at: null
        });

      if (insertError) {
        console.warn('⚠️ Verification insert warning:', insertError);
      } else {
        console.log('✅ New document verification created');
      }
    }

    // ✅ FETCH Step 2 data for PDF generation
    const { data: step2Data } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    // ✅ GENERATE PDF WITH FULL DATA
    console.log('🔄 Generating Consent Form PDF...');
    const pdfData = {
      step2: step2Data,
      step4: {
        formData,
        consentType: formData.consentType
      }
    };

    const pdfResult = await generateConsentFormPdf(pdfData);

    if (pdfResult.success && pdfResult.pdfData) {
      // ✅ DELETE OLD PDF FROM STORAGE (if exists)
      if (existingDoc?.file_url) {
        try {
          await supabase.storage
            .from('research-documents')
            .remove([existingDoc.file_url]);
          console.log('✅ Deleted old consent form PDF');
        } catch (err) {
          console.warn('⚠️ Could not delete old PDF:', err);
        }
      }

      // ✅ UPLOAD NEW PDF
      const base64Data = pdfResult.pdfData.includes('base64,')
        ? pdfResult.pdfData.split(',')[1]
        : pdfResult.pdfData;

      const pdfBuffer = Buffer.from(base64Data, 'base64');
      const timestamp = Date.now();
      const pdfPath = `${user.id}/consent_form_${submissionId}_${timestamp}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(pdfPath, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (!uploadError) {
        // ✅ UPDATE DOCUMENT RECORD WITH NEW FILE PATH
        const { error: updateDocError } = await supabase
          .from('uploaded_documents')
          .update({
            file_name: `Consent_Form_${submissionId}.pdf`,
            file_size: pdfBuffer.length,
            file_url: pdfPath,
            uploaded_at: new Date().toISOString()
          })
          .eq('id', documentId);

        if (!updateDocError) {
          console.log('✅ Consent Form PDF uploaded and linked');
        }
      } else {
        console.warn('⚠️ PDF upload error:', uploadError);
      }
    } else {
      console.warn('⚠️ PDF generation failed:', pdfResult.error);
    }

    // ✅ Update submission status
    const { error: statusError } = await supabase
      .from('research_submissions')
      .update({
        status: 'Resubmit',
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (statusError) console.warn('⚠️ Status warning:', statusError);

    console.log('✅ Step 4 saved successfully!');
    return { success: true };

  } catch (error) {
    console.error('❌ Save error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}
