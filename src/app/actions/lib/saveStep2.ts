// src/app/actions/lib/saveStep2.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { generateApplicationFormPdf } from '@/app/actions/generatePdfFromDatabase';

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

    // ✅ 1. Handle technical review file upload
    const isFileNew = technicalReviewFile instanceof File;
    const hasExistingFile = technicalReviewFile && !isFileNew;

    if (!isFileNew && !hasExistingFile) {
      // Delete old
      await supabase
        .from('uploaded_documents')
        .delete()
        .eq('submission_id', submissionId)
        .eq('document_type', 'technical_review');

      await supabase
        .from('application_forms')
        .delete()
        .eq('submission_id', submissionId);
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
      document_checklist: formData.hasApplicationForm ? {
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
      } : {},
    };

    if (!isFileNew && !hasExistingFile) {
      const { error } = await supabase
        .from('application_forms')
        .insert(applicationFormsData);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('application_forms')
        .update(applicationFormsData)
        .eq('submission_id', submissionId);
      if (error) throw error;
    }

    let documentsChanged: string[] = [];

    if (isFileNew) {
      documentsChanged.push('technical_review');
    }

    documentsChanged.push('application_form');

    console.log('📝 Documents changed:', documentsChanged);

    // ✅ Get the document_ids for changed documents
    const { data: documentsToReset } = await supabase
      .from('uploaded_documents')
      .select('id, document_type')
      .eq('submission_id', submissionId)
      .in('document_type', documentsChanged);

    console.log('📊 Documents to reset:', documentsToReset);

    // ✅ Reset verification for each document_id
    if (documentsToReset && documentsToReset.length > 0) {
      const documentIds = documentsToReset.map(doc => doc.id);

      const { data: updated, error: updateError } = await supabase
        .from('document_verifications')
        .update({
          is_approved: null,
          verified_at: null,
          feedback_comment: null,
        })
        .in('document_id', documentIds)
        .select();

      console.log('✅ Reset verifications for documents:', { count: updated?.length, error: updateError });
    }

    // ✅ Check ALL verifications for status
    const { data: verificationData } = await supabase
      .from('document_verifications')
      .select('id, is_approved')
      .eq('submission_id', submissionId);

    console.log('📊 All verifications after reset:', verificationData);

    let newStatus = 'Resubmit';
    if (!verificationData || verificationData.length === 0) {
      newStatus = 'Pending';
    } else {
      const hasRejected = verificationData.some(v => v.is_approved === false);
      const hasUnverified = verificationData.some(v => v.is_approved === null);

      if (!hasRejected && !hasUnverified) {
        newStatus = 'Pending';
      } else if (hasRejected) {
        newStatus = 'Resubmit';
      } else if (hasUnverified) {
        newStatus = 'Pending';
      }
    }

    console.log('📌 New status:', newStatus);



    // ✅ 5. Update research_submissions
    const { error: submissionError } = await supabase
      .from('research_submissions')
      .update({
        title: formData.title,
        status: newStatus,
        updated_at: new Date().toISOString(),
        co_authors: coResearchers,
      })
      .eq('id', submissionId);

    if (submissionError) throw submissionError;

    // ✅ 6. Generate PDF
    console.log('🔄 Starting PDF generation...');

    try {
      const pdfFormData = {
        step1: {
          title: formData.title,
          projectLeaderFirstName: formData.researcherFirstName,
          projectLeaderMiddleName: formData.researcherMiddleName,
          projectLeaderLastName: formData.researcherLastName,
          projectLeaderEmail: formData.project_leader_email,
          projectLeaderContact: formData.project_leader_contact,
          coAuthors: coResearchers,
          college: formData.college,
          organization: formData.institutionAddress,
          typeOfStudy: formData.typeOfStudy,
          sourceOfFunding: formData.sourceOfFunding,
          fundingOthers: formData.fundingOthers,
          startDate: formData.startDate,
          endDate: formData.endDate,
          numParticipants: parseInt(formData.numParticipants) || 0,
          technicalReview: formData.technicalReview === 'yes' ? 'Yes' : 'No',
          submittedToOtherUMREC: formData.submittedToOther === 'yes' ? 'Yes' : 'No',
        },
        step2: {
          studySite: formData.studySite,
          studySiteType: formData.studySiteType,
          college: formData.college,
          institution: formData.institution,
          institutionAddress: formData.institutionAddress,
          typeOfStudy: formData.typeOfStudy,
          typeOfStudyOthers: formData.typeOfStudyOthers,
          sourceOfFunding: formData.sourceOfFunding,
          pharmaceuticalSponsor: formData.pharmaceuticalSponsor,
          fundingOthers: formData.fundingOthers,
          startDate: formData.startDate,
          endDate: formData.endDate,
          numParticipants: parseInt(formData.numParticipants) || 0,
          technicalReview: formData.technicalReview === 'yes' ? 'Yes' : 'No',
          submittedToOther: formData.submittedToOther === 'yes' ? 'Yes' : 'No',
          documentChecklist: {
            hasApplicationForm: formData.hasApplicationForm,
            hasResearchProtocol: formData.hasResearchProtocol,
            hasInformedConsent: formData.hasInformedConsent,
            hasInformedConsentEnglish: formData.hasInformedConsent,
            hasInformedConsentFilipino: false,
            hasEndorsementLetter: formData.hasEndorsementLetter,
            hasQuestionnaire: formData.hasQuestionnaire,
            hasTechnicalReview: formData.hasTechnicalReview,
            hasDataCollectionForms: formData.hasDataCollectionForms,
            hasProductBrochure: formData.hasProductBrochure,
            hasFDAAuthorization: formData.hasFDAAuthorization,
            hasCompanyPermit: formData.hasCompanyPermit,
            hasSpecialPopulationPermit: formData.hasSpecialPopulationPermit,
          },
        },
      };

      console.log('📋 PDF form data prepared');

      const pdfResult = await generateApplicationFormPdf(pdfFormData);
      console.log('📄 PDF generation result:', { success: pdfResult.success, hasData: !!pdfResult.pdfData, error: pdfResult.error });

      if (pdfResult.success && pdfResult.pdfData) {
        try {
          const base64Data = pdfResult.pdfData.includes('base64,')
            ? pdfResult.pdfData.split(',')[1]
            : pdfResult.pdfData;

          const pdfBuffer = Buffer.from(base64Data, 'base64');
          const timestamp = Date.now();
          const pdfPath = `${user.id}/application_form_revised_${submissionId}_${timestamp}.pdf`;

          console.log('🗑️ Deleting old PDF records...');

          // Delete old document record
          const { error: deleteError } = await supabase
            .from('uploaded_documents')
            .delete()
            .eq('submission_id', submissionId)
            .eq('document_type', 'application_form');

          console.log('✅ Delete result:', { error: deleteError });

          console.log('📤 Uploading new PDF to storage:', pdfPath);

          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('research-documents')
            .upload(pdfPath, pdfBuffer, {
              contentType: 'application/pdf',
              upsert: false
            });

          if (uploadError) {
            console.error('❌ Storage upload error:', uploadError);
          } else {
            console.log('✅ PDF uploaded successfully');

            console.log('💾 Inserting new document record...');

            const { error: insertError, data: insertData } = await supabase
              .from('uploaded_documents')
              .insert({
                submission_id: submissionId,
                document_type: 'application_form',
                file_name: `Application_Form_${submissionId}.pdf`,
                file_size: pdfBuffer.length,
                file_url: pdfPath,
              });

            if (insertError) {
              console.error('❌ Insert error:', insertError);
            } else {
              console.log('✅ Document record inserted:', insertData);
            }
          }
        } catch (processingError) {
          console.error('❌ PDF processing error:', processingError);
        }
      } else {
        console.error('❌ PDF generation failed:', pdfResult.error);
      }
    } catch (pdfError) {
      console.error('❌ PDF section error (non-critical):', pdfError);
    }
    // ✅ 6. Generate PDF
    console.log('🔄 Starting PDF generation...');

    try {
      const pdfFormData = {
        step1: {
          title: formData.title,
          projectLeaderFirstName: formData.researcherFirstName,
          projectLeaderMiddleName: formData.researcherMiddleName,
          projectLeaderLastName: formData.researcherLastName,
          projectLeaderEmail: formData.project_leader_email,
          projectLeaderContact: formData.project_leader_contact,
          // ✅ REMOVED coAuthors - it's in step2 with technical advisers
          college: formData.college,
          organization: formData.institutionAddress,
          typeOfStudy: Array.isArray(formData.typeOfStudy) ? formData.typeOfStudy.join(', ') : formData.typeOfStudy,
          sourceOfFunding: Array.isArray(formData.sourceOfFunding) ? formData.sourceOfFunding.join(', ') : formData.sourceOfFunding,
          fundingOthers: formData.fundingOthers,
          startDate: formData.startDate,
          endDate: formData.endDate,
          numParticipants: parseInt(formData.numParticipants) || 0,
          technicalReview: formData.technicalReview === 'yes' ? 'Yes' : 'No',
          submittedToOtherUMREC: formData.submittedToOther === 'yes' ? 'Yes' : 'No',
        },
        step2: {
          studySite: formData.studySite,
          studySiteType: formData.studySiteType,
          college: formData.college,
          institution: formData.institution,
          institutionAddress: formData.institutionAddress,
          typeOfStudy: Array.isArray(formData.typeOfStudy) ? formData.typeOfStudy.join(', ') : formData.typeOfStudy,
          typeOfStudyOthers: formData.typeOfStudyOthers,
          sourceOfFunding: Array.isArray(formData.sourceOfFunding) ? formData.sourceOfFunding.join(', ') : formData.sourceOfFunding,
          pharmaceuticalSponsor: formData.pharmaceuticalSponsor,
          fundingOthers: formData.fundingOthers,
          startDate: formData.startDate,
          endDate: formData.endDate,
          numParticipants: parseInt(formData.numParticipants) || 0,
          technicalReview: formData.technicalReview === 'yes' ? 'Yes' : 'No',
          submittedToOther: formData.submittedToOther === 'yes' ? 'Yes' : 'No',
          coResearchers: coResearchers, // ✅ Keep as array object
          technicalAdvisers: technicalAdvisers, // ✅ Keep as array object
          documentChecklist: {
            hasApplicationForm: formData.hasApplicationForm,
            hasResearchProtocol: formData.hasResearchProtocol,
            hasInformedConsent: formData.hasInformedConsent,
            hasInformedConsentEnglish: formData.hasInformedConsent,
            hasInformedConsentFilipino: false,
            hasEndorsementLetter: formData.hasEndorsementLetter,
            hasQuestionnaire: formData.hasQuestionnaire,
            hasTechnicalReview: formData.hasTechnicalReview,
            hasDataCollectionForms: formData.hasDataCollectionForms,
            hasProductBrochure: formData.hasProductBrochure,
            hasFDAAuthorization: formData.hasFDAAuthorization,
            hasCompanyPermit: formData.hasCompanyPermit,
            hasSpecialPopulationPermit: formData.hasSpecialPopulationPermit,
          },
        },
      };


      console.log('📋 PDF form data prepared');

      const pdfResult = await generateApplicationFormPdf(pdfFormData);
      console.log('📄 PDF generation result:', { success: pdfResult.success, hasData: !!pdfResult.pdfData, error: pdfResult.error });

      if (pdfResult.success && pdfResult.pdfData) {
        try {
          const base64Data = pdfResult.pdfData.includes('base64,')
            ? pdfResult.pdfData.split(',')[1]
            : pdfResult.pdfData;

          const pdfBuffer = Buffer.from(base64Data, 'base64');
          const timestamp = Date.now();
          const pdfPath = `${user.id}/application_form_revised_${submissionId}_${timestamp}.pdf`;

          console.log('🗑️ Deleting old PDF records...');

          // Delete old document record
          const { error: deleteError } = await supabase
            .from('uploaded_documents')
            .delete()
            .eq('submission_id', submissionId)
            .eq('document_type', 'application_form');

          console.log('✅ Delete result:', { error: deleteError });

          console.log('📤 Uploading new PDF to storage:', pdfPath);

          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('research-documents')
            .upload(pdfPath, pdfBuffer, {
              contentType: 'application/pdf',
              upsert: false
            });

          if (uploadError) {
            console.error('❌ Storage upload error:', uploadError);
          } else {
            console.log('✅ PDF uploaded successfully');

            console.log('💾 Inserting new document record...');

            const { error: insertError, data: insertData } = await supabase
              .from('uploaded_documents')
              .insert({
                submission_id: submissionId,
                document_type: 'application_form',
                file_name: `Application_Form_${submissionId}.pdf`,
                file_size: pdfBuffer.length,
                file_url: pdfPath,
              });

            if (insertError) {
              console.error('❌ Insert error:', insertError);
            } else {
              console.log('✅ Document record inserted:', insertData);
            }
          }
        } catch (processingError) {
          console.error('❌ PDF processing error:', processingError);
        }
      } else {
        console.error('❌ PDF generation failed:', pdfResult.error);
      }
    } catch (pdfError) {
      console.error('❌ PDF section error (non-critical):', pdfError);
    }

    return {
      success: true,
      message: newStatus === 'Pending'
        ? '✅ Changes saved and resubmitted successfully!'
        : '✅ Changes saved! Please address the verification issues before resubmitting.',
      status: newStatus,
    };
  } catch (error) {
    console.error('Revision submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save changes',
    };
  }
}
