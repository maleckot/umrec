// src/app/actions/submitResearchApplication.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { 
  generateApplicationFormPdf, 
  generateResearchProtocolPdf, 
  generateConsentFormPdf 
} from '@/app/actions/generatePdfFromDatabase';

export async function submitResearchApplication(formData: any, files: { step5?: string; step6?: string; step7?: string }) {
  const supabase = await createClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Helper functions
    const formatDate = (dateString: string | undefined | null) => {
      if (!dateString || dateString.trim() === '') return null;
      return dateString;
    };

    const parseNumber = (value: any) => {
      const num = parseInt(value);
      return isNaN(num) ? 0 : num;
    };

    const safeString = (value: any) => {
      return value && value.trim() !== '' ? value : null;
    };

    // Helper to upload file to Supabase Storage
    const uploadFile = async (base64Data: string, fileName: string, fileType: string) => {
      try {
        const base64Response = await fetch(base64Data);
        const blob = await base64Response.blob();

        const timestamp = Date.now();
        const filePath = `${user.id}/${fileType}-${timestamp}.pdf`;

        const { data, error } = await supabase.storage
          .from('research-documents')
          .upload(filePath, blob, {
            contentType: 'application/pdf',
            upsert: false
          });

        if (error) throw error;

        return filePath;
      } catch (error) {
        console.error('File upload error:', error);
        throw error;
      }
    };

    // Generate submission ID
    const submissionId = `UMREC-${Date.now()}`;

    console.log('🔍 Step 2 Data Received:', {
      studySiteType: formData.step2?.studySiteType,
      typeOfStudy: formData.step2?.typeOfStudy,
      sourceOfFunding: formData.step2?.sourceOfFunding
    });

    // 1. Insert main submission record
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .insert({
        submission_id: submissionId,
        user_id: user.id,
        title: formData.step1?.title || 'Untitled',
        project_leader_first_name: formData.step1?.projectLeaderFirstName || '',
        project_leader_middle_name: safeString(formData.step1?.projectLeaderMiddleName),
        project_leader_last_name: formData.step1?.projectLeaderLastName || '',
        project_leader_email: formData.step1?.projectLeaderEmail || user.email,
        project_leader_contact: formData.step1?.projectLeaderContact || '',
        co_authors: safeString(formData.step1?.coAuthors),
        organization: safeString(formData.step1?.organization),
        college: safeString(formData.step2?.college),
        type_of_study: formData.step2?.typeOfStudy || [],
        source_of_funding: formData.step2?.sourceOfFunding || [],
        funding_others: safeString(formData.step2?.fundingOthers),
        start_date: formatDate(formData.step2?.startDate),
        end_date: formatDate(formData.step2?.endDate),
        num_participants: parseNumber(formData.step2?.numParticipants),
        technical_review: safeString(formData.step2?.technicalReview),
        submitted_to_other_umrec: safeString(formData.step2?.submittedToOther),
        status: 'pending_review',
        submitted_at: new Date().toISOString(),
        study_site: safeString(formData.step2?.studySiteType),

      })
      .select()
      .single();

    if (submissionError) {
      console.error('❌ Submission insert error:', submissionError);
      throw submissionError;
    }

    console.log('✅ Submission created with ID:', submission.id);

    // 2. Insert application form
    if (formData.step2 && Object.keys(formData.step2).length > 0) {
      const { error: appFormError } = await supabase
        .from('application_forms')
        .insert({
          submission_id: submission.id,
          study_site: safeString(formData.step2?.study_site),
          researcher_first_name: safeString(formData.step2?.researcherFirstName),
          researcher_middle_name: safeString(formData.step2?.researcherMiddleName),
          researcher_last_name: safeString(formData.step2?.researcherLastName),
          contact_info: {
            telNo: formData.step2?.telNo || '',
            mobileNo: formData.step2?.mobileNo || '',
            email: formData.step2?.email || '',
            faxNo: formData.step2?.faxNo || 'N/A',
          },
          co_researcher: safeString(formData.step2?.coResearcher),
          college: safeString(formData.step2?.college),
          institution: formData.step2?.institution || 'University of Makati',
          institution_address: safeString(formData.step2?.institutionAddress),
          type_of_study: formData.step2?.typeOfStudy || [],
          type_of_study_others: safeString(formData.step2?.typeOfStudyOthers),
          study_site_type: safeString(formData.step2?.studySiteType),
          source_of_funding: formData.step2?.sourceOfFunding || [],
          pharmaceutical_sponsor: safeString(formData.step2?.pharmaceuticalSponsor),
          funding_others: safeString(formData.step2?.fundingOthers),
          study_duration: {
            startDate: formData.step2?.startDate || null,
            endDate: formData.step2?.endDate || null,
          },
          num_participants: parseNumber(formData.step2?.numParticipants),
          technical_review: safeString(formData.step2?.technicalReview),
          submitted_to_other: safeString(formData.step2?.submittedToOther),
          document_checklist: {
            hasApplicationForm: formData.step2?.hasApplicationForm || false,
            hasResearchProtocol: formData.step2?.hasResearchProtocol || false,
            hasInformedConsentEnglish: formData.step2?.hasInformedConsentEnglish || false,
            hasInformedConsentFilipino: formData.step2?.hasInformedConsentFilipino || false,
            hasEndorsementLetter: formData.step2?.hasEndorsementLetter || false,
          },
        });

      if (appFormError) {
        console.error('❌ Application form insert error:', appFormError);
        throw appFormError;
      }

      console.log('✅ Application form created');
    }

    // 3. Insert research protocol
    if (formData.step3?.formData && Object.keys(formData.step3.formData).length > 0) {
      const { error: protocolError } = await supabase
        .from('research_protocols')
        .insert({
          submission_id: submission.id,
          title: safeString(formData.step3.formData?.title),
          introduction: safeString(formData.step3.formData?.introduction),
          background: safeString(formData.step3.formData?.background),
          problem_statement: safeString(formData.step3.formData?.problemStatement),
          scope_delimitation: safeString(formData.step3.formData?.scopeDelimitation),
          literature_review: safeString(formData.step3.formData?.literatureReview),
          methodology: safeString(formData.step3.formData?.methodology),
          population: safeString(formData.step3.formData?.population),
          sampling_technique: safeString(formData.step3.formData?.samplingTechnique),
          research_instrument: safeString(formData.step3.formData?.researchInstrument),
          statistical_treatment: safeString(formData.step3.formData?.statisticalTreatment),
          research_references: safeString(formData.step3.formData?.references),
          researchers: formData.step3?.researchers || [],
        });

      if (protocolError) throw protocolError;
    }

    // 4. Insert consent forms
    if (formData.step4?.consentType) {
      const { error: consentError } = await supabase
        .from('consent_forms')
        .insert({
          submission_id: submission.id,
          consent_type: formData.step4.consentType,
          adult_consent: formData.step4.consentType === 'adult' || formData.step4.consentType === 'both' ? {
            purposeEnglish: formData.step4.formData?.purposeEnglish || '',
            purposeTagalog: formData.step4.formData?.purposeTagalog || '',
            risksEnglish: formData.step4.formData?.risksEnglish || '',
            risksTagalog: formData.step4.formData?.risksTagalog || '',
            benefitsEnglish: formData.step4.formData?.benefitsEnglish || '',
            benefitsTagalog: formData.step4.formData?.benefitsTagalog || '',
            proceduresEnglish: formData.step4.formData?.proceduresEnglish || '',
            proceduresTagalog: formData.step4.formData?.proceduresTagalog || '',
            voluntarinessEnglish: formData.step4.formData?.voluntarinessEnglish || '',
            voluntarinessTagalog: formData.step4.formData?.voluntarinessTagalog || '',
            confidentialityEnglish: formData.step4.formData?.confidentialityEnglish || '',
            confidentialityTagalog: formData.step4.formData?.confidentialityTagalog || '',
          } : null,
          minor_assent: formData.step4.consentType === 'minor' || formData.step4.consentType === 'both' ? {
            introduction: formData.step4.formData?.introduction || '',
            purpose: formData.step4.formData?.purpose || '',
            choiceOfParticipants: formData.step4.formData?.choiceOfParticipants || '',
            voluntariness: formData.step4.formData?.voluntariness || '',
            procedures: formData.step4.formData?.procedures || '',
            risks: formData.step4.formData?.risks || '',
            benefits: formData.step4.formData?.benefits || '',
            confidentiality: formData.step4.formData?.confidentiality || '',
            sharingFindings: formData.step4.formData?.sharingFindings || '',
            certificateAssent: formData.step4.formData?.certificateAssent || '',
          } : null,
          contact_person: safeString(formData.step4.formData?.contactPerson),
          contact_number: safeString(formData.step4.formData?.contactNumber),
        });

      if (consentError) throw consentError;
    }

    // 5. Upload files and save metadata
    const documentInserts = [];

    if (files.step5 && formData.step5?.fileName) {
      const fileUrl = await uploadFile(files.step5, formData.step5.fileName, 'research-instrument');
      documentInserts.push({
        submission_id: submission.id,
        document_type: 'research_instrument',
        file_name: formData.step5.fileName,
        file_size: formData.step5.fileSize || 0,
        file_url: fileUrl,
      });
    }

    if (files.step6 && formData.step6?.fileName) {
      const fileUrl = await uploadFile(files.step6, formData.step6.fileName, 'proposal-defense');
      documentInserts.push({
        submission_id: submission.id,
        document_type: 'proposal_defense',
        file_name: formData.step6.fileName,
        file_size: formData.step6.fileSize || 0,
        file_url: fileUrl,
      });
    }

    if (files.step7 && formData.step7?.fileName) {
      const fileUrl = await uploadFile(files.step7, formData.step7.fileName, 'endorsement-letter');
      documentInserts.push({
        submission_id: submission.id,
        document_type: 'endorsement_letter',
        file_name: formData.step7.fileName,
        file_size: formData.step7.fileSize || 0,
        file_url: fileUrl,
      });
    }

    if (documentInserts.length > 0) {
      const { error: docsError } = await supabase
        .from('uploaded_documents')
        .insert(documentInserts);

      if (docsError) throw docsError;
    }

    // ✅ 6. GENERATE AND SAVE 3 SEPARATE PDFs
    console.log('📄 Generating separate PDFs...');

    try {
      // Helper to upload generated PDF
      const uploadGeneratedPdf = async (pdfResult: any, documentType: string, baseFileName: string) => {
        if (!pdfResult.success || !pdfResult.pdfData) {
          console.warn(`⚠️ Failed to generate ${documentType} PDF`);
          return;
        }

        const base64Data = pdfResult.pdfData.split(',')[1];
        const pdfBuffer = Buffer.from(base64Data, 'base64');
        const pdfPath = `${user.id}/${documentType}-${submission.id}-${Date.now()}.pdf`;

        const { error: uploadError } = await supabase.storage
          .from('research-documents')
          .upload(pdfPath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: false
          });

        if (uploadError) {
          console.error(`Failed to upload ${documentType} PDF:`, uploadError);
          return;
        }

        // Save PDF record to database
        await supabase
          .from('uploaded_documents')
          .insert({
            submission_id: submission.id,
            document_type: documentType,
            file_name: `${baseFileName}_${submissionId}.pdf`,
            file_size: pdfBuffer.length,
            file_url: pdfPath,
          });

        console.log(`✅ ${documentType} PDF generated and saved`);
      };

      // Generate Application Form PDF
      const appFormPdf = await generateApplicationFormPdf(formData);
      await uploadGeneratedPdf(appFormPdf, 'application_form', 'Application_For_Ethics_Review');

      // Generate Research Protocol PDF
      const protocolPdf = await generateResearchProtocolPdf(formData);
      await uploadGeneratedPdf(protocolPdf, 'research_protocol', 'Research_Protocol');

      // Generate Consent Form PDF
      const consentPdf = await generateConsentFormPdf(formData);
      await uploadGeneratedPdf(consentPdf, 'consent_form', 'Informed_Consent_Form');

      console.log('✅ All separate PDFs generated successfully');

    } catch (pdfError) {
      console.error('PDF generation error (non-critical):', pdfError);
      // Don't throw - submission succeeds even if PDF generation fails
    }

    revalidatePath('/researchermodule/submissions');

    return {
      success: true,
      submissionId: submission.submission_id,
      id: submission.id
    };

  } catch (error) {
    console.error('Submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit application'
    };
  }
}
