// src/app/actions/lib/saveStep2.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { generateApplicationFormPdf } from '@/app/actions/generatePdfFromDatabase';
import { generateResearchProtocolPdf } from '@/app/actions/generatePdfFromDatabase';
import { generateConsentFormPdf } from '@/app/actions/generatePdfFromDatabase';
import { regeneratePdfWithTitle } from './pdfDocumentManager';

export async function handleRevisionSubmit(
  submissionId: string,
  formData: any,
  coResearchers: any[],
  technicalAdvisers: any[],
  technicalReviewFile?: File | null
) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('📝 Saving Step 2 - Application Form...');

    // ✅ 1. Handle technical review file upload
    const isFileNew = technicalReviewFile instanceof File;
    const hasExistingFile = technicalReviewFile && !isFileNew;

    if (!isFileNew && !hasExistingFile) {
      await supabase
        .from('uploaded_documents')
        .delete()
        .eq('submission_id', submissionId)
        .eq('document_type', 'technical_review');
    } else if (isFileNew) {
      const fileExtension = technicalReviewFile.name.split('.').pop();
      const technicalReviewPath = `submissions/${submissionId}/technical_review.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(technicalReviewPath, technicalReviewFile, {
          upsert: true,
          contentType: technicalReviewFile.type
        });

      if (uploadError) {
        throw new Error(`Failed to upload technical review: ${uploadError.message}`);
      }

      await supabase
        .from('uploaded_documents')
        .delete()
        .eq('submission_id', submissionId)
        .eq('document_type', 'technical_review');

      const { error: docError } = await supabase
        .from('uploaded_documents')
        .insert({
          submission_id: submissionId,
          document_type: 'technical_review',
          file_name: technicalReviewFile.name,
          file_size: technicalReviewFile.size,
          file_url: technicalReviewPath,
        });

      if (docError) throw docError;
    }

    // ✅ 2. Update or create application_forms
    const applicationFormsData = {
      submission_id: submissionId,
      study_site: formData.studySite,
      researcher_first_name: formData.researcherFirstName,
      researcher_middle_name: formData.researcherMiddleName,
      researcher_last_name: formData.researcherLastName,
      contact_info: {
        email: formData.project_leader_email,
        mobile_no: formData.project_leader_contact,
        tel_no: formData.telNo,
        fax_no: formData.faxNo,
      },
      co_researcher: coResearchers,
      technical_advisers: technicalAdvisers,
      college: formData.college,
      institution: formData.institution,
      institution_address: formData.institutionAddress,
      type_of_study: formData.typeOfStudy,
      type_of_study_others: formData.typeOfStudyOthers,
      study_site_type: formData.studySiteType,
      source_of_funding: formData.sourceOfFunding,
      pharmaceutical_sponsor: formData.pharmaceuticalSponsor,
      funding_others: formData.fundingOthers,
      study_duration: {
        start_date: formData.startDate,
        end_date: formData.endDate,
      },
      num_participants: parseInt(formData.numParticipants) || 0,
      technical_review: formData.technicalReview,
      submitted_to_other: formData.submittedToOther,
      document_checklist: formData.hasApplicationForm
        ? {
            hasApplicationForm: formData.hasApplicationForm,
            hasResearchProtocol: formData.hasResearchProtocol,
            hasInformedConsent: formData.hasInformedConsent,
            hasInformedConsentOthers: formData.hasInformedConsentOthers,
            informedConsentOthers: formData.informedConsentOthers,
            hasAssentForm: formData.hasAssentForm,
            hasAssentFormOthers: formData.hasAssentFormOthers,
            assentFormOthers: formData.assentFormOthers,
            hasEndorsementLetter: formData.hasEndorsementLetter,
            hasQuestionnaire: formData.hasQuestionnaire,
            hasTechnicalReview: formData.hasTechnicalReview,
            hasDataCollectionForms: formData.hasDataCollectionForms,
            hasProductBrochure: formData.hasProductBrochure,
            hasFDAAuthorization: formData.hasFDAAuthorization,
            hasCompanyPermit: formData.hasCompanyPermit,
            hasSpecialPopulationPermit: formData.hasSpecialPopulationPermit,
            specialPopulationPermitDetails: formData.specialPopulationPermitDetails,
            hasOtherDocs: formData.hasOtherDocs,
            otherDocsDetails: formData.otherDocsDetails,
          }
        : {},
    };

    const { data: existingForm } = await supabase
      .from('application_forms')
      .select('id')
      .eq('submission_id', submissionId)
      .single();

    if (existingForm) {
      const { error } = await supabase
        .from('application_forms')
        .update(applicationFormsData)
        .eq('submission_id', submissionId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('application_forms')
        .insert(applicationFormsData);
      if (error) throw error;
    }

    // ✅ 3. Update submission metadata
    await supabase
      .from('research_submissions')
      .update({
        title: formData.title,
        updated_at: new Date().toISOString(),
        co_authors: coResearchers,
      })
      .eq('id', submissionId);

    // ✅ 3b. Update research_protocols title
    const { error: protocolError } = await supabase
      .from('research_protocols')
      .update({
        title: formData.title,
        updated_at: new Date().toISOString(),
      })
      .eq('submission_id', submissionId);

    if (protocolError) {
      throw new Error(
        `Failed to update research protocol title: ${protocolError.message}`
      );
    }

    // ✅ 4. FETCH ALL DATA FOR PDF REGENERATION
    console.log('📋 Fetching data for all 3 PDF regenerations...');

    const { data: submission } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    const { data: protocol } = await supabase
      .from('research_protocols')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    // ✅ 5. BUILD PDF DATA FOR ALL 3

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

    const { data: consent } = await supabase
      .from('consent_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    const step4PdfData = {
      step2: submission,
      step4: {
        ...(consent?.adult_consent || {}),
        ...(consent?.minor_assent || {}),
        consent_type: consent?.consent_type,
        contact_person: consent?.contact_person,
        contact_number: consent?.contact_number,
        informed_consent_for: consent?.informed_consent_for,
        consentType: consent?.consent_type,
      },
    };

    // ✅ 6. REGENERATE ALL 3 PDFS IN PARALLEL
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

    // ✅ 7. RESET VERIFICATION ONLY FOR APPLICATION_FORM
    console.log('🔄 Resetting application_form verification...');

    const { data: appFormDoc } = await supabase
      .from('uploaded_documents')
      .select('id')
      .eq('submission_id', submissionId)
      .eq('document_type', 'application_form')
      .single();

    if (appFormDoc) {
      const { data: existingVerif } = await supabase
        .from('document_verifications')
        .select('id')
        .eq('document_id', appFormDoc.id)
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

        console.log('✅ Application form verification cleared');
      } else {
        await supabase
          .from('document_verifications')
          .insert({
            document_id: appFormDoc.id,
            submission_id: submissionId,
            is_approved: null,
            feedback_comment: null,
            verified_at: null,
          });

        console.log('✅ New application form verification created');
      }
    }

    // ✅ 8. CHECK STATUS: If all document verifications are null → "pending", else → "needs_revision"
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

    return {
      success: true,
      message: '✅ Changes saved and all PDFs updated!',
    };
  } catch (error) {
    console.error('❌ Revision submission error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to save changes',
    };
  }
}
