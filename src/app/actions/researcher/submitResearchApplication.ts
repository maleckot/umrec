// src/app/actions/submitResearchApplication.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  generateApplicationFormPdf,
  generateResearchProtocolPdf,
  generateConsentFormPdf
} from '@/app/actions/generatePdfFromDatabase';
import { autoClassifyFromDatabase } from '@/app/actions/autoClassifyFromDatabase';

async function extractAndUploadImages(htmlContent: string, userId: string, supabase: any, sectionName: string) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return { htmlContent: htmlContent || '', uploadedImages: [] };
  }

  const uploadedImages = [];
  let updatedHtml = htmlContent;

  const base64ImageRegex = /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"[^>]*>/gi;
  const matches = [...htmlContent.matchAll(base64ImageRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const fullImgTag = match[0];
    const base64Src = match[1];

    try {
      const base64Data = base64Src.split(',')[1];
      const mimeType = base64Src.match(/data:([^;]+);/)?.[1] || 'image/png';
      const buffer = Buffer.from(base64Data, 'base64');

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const extension = mimeType.split('/')[1];
      const filePath = `${userId}/protocol-images/${sectionName}-${i + 1}-${timestamp}-${randomStr}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: false
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('research-documents')
          .getPublicUrl(filePath);

        const newImgTag = fullImgTag.replace(base64Src, urlData.publicUrl);
        updatedHtml = updatedHtml.replace(fullImgTag, newImgTag);

        uploadedImages.push({
          section: sectionName,
          imageNumber: i + 1,
          filePath: filePath,
          publicUrl: urlData.publicUrl,
          fileSize: buffer.length
        });

        console.log(`✅ Uploaded ${sectionName} image ${i + 1}: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error uploading ${sectionName} image:`, error);
    }
  }

  return { htmlContent: updatedHtml, uploadedImages };
}

export async function submitResearchApplication(
  formData: any,
  files: {
    step2TechnicalReview?: string;
    step5?: string;
    step6?: string;
    step7?: string
  }
) {
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
        status: 'new_submission',
        submitted_at: new Date().toISOString(),
        study_site: safeString(formData.step2?.studySite),
      })
      .select()
      .single();

    if (submissionError) {
      throw submissionError;
    }

    // 2. Insert application form
    if (formData.step2 && Object.keys(formData.step2).length > 0) {
      const { error: appFormError } = await supabase
        .from('application_forms')
        .insert({
          submission_id: submission.id,
          study_site: safeString(formData.step2?.studySite),
          researcher_first_name: safeString(formData.step2?.researcherFirstName),
          researcher_middle_name: safeString(formData.step2?.researcherMiddleName),
          researcher_last_name: safeString(formData.step2?.researcherLastName),
          contact_info: {
            telNo: formData.step2?.telNo || '',
            mobileNo: formData.step2?.mobileNo || '',
            email: formData.step2?.email || '',
            faxNo: formData.step2?.faxNo || 'N/A',
          },
          co_researcher: formData.step2?.coResearchers?.map((co: any) => ({
            fullName: co.name,
            contactNumber: co.contact,
            emailAddress: co.email
          })) || [],
          technical_advisers: formData.step2?.technicalAdvisers?.map((adv: any) => ({
            fullName: adv.name,
            contactNumber: adv.contact,
            emailAddress: adv.email
          })) || [],
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
        console.error('Application form insert error:', appFormError);
        throw appFormError;
      }
    }

    if (formData.step3?.formData && Object.keys(formData.step3.formData).length > 0) {
      console.log('📸 Extracting and uploading embedded images...');

      console.log('🔍 Introduction content:', formData.step3.formData?.introduction?.substring(0, 500));
      console.log('🔍 Has data:image?', formData.step3.formData?.introduction?.includes('data:image'));
      console.log('🔍 Background content:', formData.step3.formData?.background?.substring(0, 500));
      console.log('🔍 Background has data:image?', formData.step3.formData?.background?.includes('data:image'));
      const introductionResult = await extractAndUploadImages(
        formData.step3.formData?.introduction || '',
        user.id,
        supabase,
        'introduction'
      );

      const backgroundResult = await extractAndUploadImages(
        formData.step3.formData?.background || '',
        user.id,
        supabase,
        'background'
      );

      const problemStatementResult = await extractAndUploadImages(
        formData.step3.formData?.problemStatement || '',
        user.id,
        supabase,
        'problem_statement'
      );

      const scopeDelimitationResult = await extractAndUploadImages(
        formData.step3.formData?.scopeDelimitation || '',
        user.id,
        supabase,
        'scope_delimitation'
      );

      const literatureReviewResult = await extractAndUploadImages(
        formData.step3.formData?.literatureReview || '',
        user.id,
        supabase,
        'literature_review'
      );

      const methodologyResult = await extractAndUploadImages(
        formData.step3.formData?.methodology || '',
        user.id,
        supabase,
        'methodology'
      );

      const populationResult = await extractAndUploadImages(
        formData.step3.formData?.population || '',
        user.id,
        supabase,
        'population'
      );

      const samplingTechniqueResult = await extractAndUploadImages(
        formData.step3.formData?.samplingTechnique || '',
        user.id,
        supabase,
        'sampling_technique'
      );

      const researchInstrumentResult = await extractAndUploadImages(
        formData.step3.formData?.researchInstrument || '',
        user.id,
        supabase,
        'research_instrument'
      );

      const statisticalTreatmentResult = await extractAndUploadImages(
        formData.step3.formData?.statisticalTreatment || '',
        user.id,
        supabase,
        'statistical_treatment'
      );

      const ethicalConsiderationResult = await extractAndUploadImages(
        formData.step3.formData?.ethicalConsideration || '',
        user.id,
        supabase,
        'ethical_consideration'
      );

      const referencesResult = await extractAndUploadImages(
        formData.step3.formData?.references || '',
        user.id,
        supabase,
        'references'
      );

      const totalImages =
        introductionResult.uploadedImages.length +
        backgroundResult.uploadedImages.length +
        problemStatementResult.uploadedImages.length +
        scopeDelimitationResult.uploadedImages.length +
        literatureReviewResult.uploadedImages.length +
        methodologyResult.uploadedImages.length +
        populationResult.uploadedImages.length +
        samplingTechniqueResult.uploadedImages.length +
        researchInstrumentResult.uploadedImages.length +
        statisticalTreatmentResult.uploadedImages.length +
        ethicalConsiderationResult.uploadedImages.length +
        referencesResult.uploadedImages.length;

      console.log(`✅ Images processed: ${totalImages} images uploaded`);

      const { error: protocolError } = await supabase
        .from('research_protocols')
        .insert({
          submission_id: submission.id,
          title: safeString(formData.step3.formData?.title),
          introduction: introductionResult.htmlContent,
          background: backgroundResult.htmlContent,
          problem_statement: problemStatementResult.htmlContent,
          scope_delimitation: scopeDelimitationResult.htmlContent,
          literature_review: literatureReviewResult.htmlContent,
          methodology: methodologyResult.htmlContent,
          population: populationResult.htmlContent,
          sampling_technique: samplingTechniqueResult.htmlContent,
          research_instrument: researchInstrumentResult.htmlContent,
          statistical_treatment: statisticalTreatmentResult.htmlContent,
          ethical_consideration: ethicalConsiderationResult.htmlContent,
          research_references: referencesResult.htmlContent,
          researchers: formData.step3?.researchers || [],
        });

      if (protocolError) throw protocolError;

      // Track uploaded images in uploaded_documents table
      const allUploadedImages = [
        ...introductionResult.uploadedImages,
        ...backgroundResult.uploadedImages,
        ...problemStatementResult.uploadedImages,
        ...scopeDelimitationResult.uploadedImages,
        ...literatureReviewResult.uploadedImages,
        ...methodologyResult.uploadedImages,
        ...populationResult.uploadedImages,
        ...samplingTechniqueResult.uploadedImages,
        ...researchInstrumentResult.uploadedImages,
        ...statisticalTreatmentResult.uploadedImages,
        ...ethicalConsiderationResult.uploadedImages,
        ...referencesResult.uploadedImages
      ];

      if (allUploadedImages.length > 0) {
        const imageDocuments = allUploadedImages.map((img) => ({
          submission_id: submission.id,
          document_type: `protocol_image_${img.section}`,
          file_name: `${img.section}-image-${img.imageNumber}.${img.filePath.split('.').pop()}`,
          file_size: img.fileSize,
          file_url: img.filePath,
        }));

        const { error: imageDocsError } = await supabase
          .from('uploaded_documents')
          .insert(imageDocuments);

        if (!imageDocsError) {
          console.log(`✅ Tracked ${allUploadedImages.length} images in uploaded_documents table`);
        } else {
          console.error('Error tracking images:', imageDocsError);
        }
      }

      // Process and upload signatures
      if (formData.step3?.researchers && Array.isArray(formData.step3.researchers)) {
        console.log('📝 Processing researcher signatures...');

        const researchersWithPaths = await Promise.all(
          formData.step3.researchers.map(async (researcher: any, index: number) => {
            if (!researcher.signatureBase64) {
              return {
                id: researcher.id,
                name: researcher.name,
                signaturePath: null,
                signatureBase64: null
              };
            }

            try {
              const base64Data = researcher.signatureBase64.split(',')[1];
              const buffer = Buffer.from(base64Data, 'base64');
              const signaturePath = `${user.id}/signatures/researcher-${index + 1}-${Date.now()}.png`;

              const { error: uploadError } = await supabase.storage
                .from('research-documents')
                .upload(signaturePath, buffer, {
                  contentType: 'image/png',
                  upsert: false
                });

              if (uploadError) {
                console.error('Signature upload error:', uploadError);
                return {
                  id: researcher.id,
                  name: researcher.name,
                  signaturePath: null,
                  signatureBase64: researcher.signatureBase64
                };
              }

              console.log(`✅ Uploaded signature for ${researcher.name}`);

              return {
                id: researcher.id,
                name: researcher.name,
                signaturePath: signaturePath,
                signatureBase64: researcher.signatureBase64
              };
            } catch (error) {
              console.error('Error processing signature:', error);
              return {
                id: researcher.id,
                name: researcher.name,
                signaturePath: null,
                signatureBase64: researcher.signatureBase64
              };
            }
          })
        );

        const { error: updateError } = await supabase
          .from('research_protocols')
          .update({
            researchers: researchersWithPaths
          })
          .eq('submission_id', submission.id);

        if (updateError) {
          console.error('Failed to update researcher signatures:', updateError);
        } else {
          console.log('✅ Researcher signatures saved to database');
        }
      }
    }

    // 4. Insert consent forms
    if (formData.step4?.consentType) {
      const { error: consentError } = await supabase
        .from('consent_forms')
        .insert({
          submission_id: submission.id,
          consent_type: formData.step4.consentType,
          informed_consent_for: formData.step4.formData?.participantGroupIdentity,



          // ✅ ADULT CONSENT - ALL 14 SECTIONS
          adult_consent: formData.step4.consentType === 'adult' || formData.step4.consentType === 'both' ? {
            adultLanguage: formData.step4.adultLanguage || 'english', // ✅ Save 'english' or 'tagalog' or 'both'        // ✅ ALWAYS save BOTH languages regardless of selection!

            introductionEnglish: formData.step4.formData?.introductionEnglish || '',
            introductionTagalog: formData.step4.formData?.introductionTagalog || '',

            purposeEnglish: formData.step4.formData?.purposeEnglish || '',
            purposeTagalog: formData.step4.formData?.purposeTagalog || '',

            researchInterventionEnglish: formData.step4.formData?.researchInterventionEnglish || '',
            researchInterventionTagalog: formData.step4.formData?.researchInterventionTagalog || '',

            participantSelectionEnglish: formData.step4.formData?.participantSelectionEnglish || '',
            participantSelectionTagalog: formData.step4.formData?.participantSelectionTagalog || '',

            voluntaryParticipationEnglish: formData.step4.formData?.voluntaryParticipationEnglish || '',
            voluntaryParticipationTagalog: formData.step4.formData?.voluntaryParticipationTagalog || '',

            proceduresEnglish: formData.step4.formData?.proceduresEnglish || '',
            proceduresTagalog: formData.step4.formData?.proceduresTagalog || '',

            durationEnglish: formData.step4.formData?.durationEnglish || '',
            durationTagalog: formData.step4.formData?.durationTagalog || '',

            risksEnglish: formData.step4.formData?.risksEnglish || '',
            risksTagalog: formData.step4.formData?.risksTagalog || '',

            benefitsEnglish: formData.step4.formData?.benefitsEnglish || '',
            benefitsTagalog: formData.step4.formData?.benefitsTagalog || '',

            reimbursementsEnglish: formData.step4.formData?.reimbursementsEnglish || '',
            reimbursementsTagalog: formData.step4.formData?.reimbursementsTagalog || '',

            confidentialityEnglish: formData.step4.formData?.confidentialityEnglish || '',
            confidentialityTagalog: formData.step4.formData?.confidentialityTagalog || '',

            sharingResultsEnglish: formData.step4.formData?.sharingResultsEnglish || '',
            sharingResultsTagalog: formData.step4.formData?.sharingResultsTagalog || '',

            rightToRefuseEnglish: formData.step4.formData?.rightToRefuseEnglish || '',
            rightToRefuseTagalog: formData.step4.formData?.rightToRefuseTagalog || '',

            whoToContactEnglish: formData.step4.formData?.whoToContactEnglish || '',
            whoToContactTagalog: formData.step4.formData?.whoToContactTagalog || '',
          } : null,

          // ✅ MINOR ASSENT - ALL 9 SECTIONS
          minor_assent: formData.step4.consentType === 'minor' || formData.step4.consentType === 'both' ? {
            minorLanguage: formData.step4.minorLanguage || 'english', // ✅ Save 'english' or 'tagalog' or 'both'        // ✅ ALWAYS save BOTH languages regardless of selection!

            introductionMinorEnglish: formData.step4.formData?.introductionMinorEnglish || '',
            introductionMinorTagalog: formData.step4.formData?.introductionMinorTagalog || '',

            purposeMinorEnglish: formData.step4.formData?.purposeMinorEnglish || '',
            purposeMinorTagalog: formData.step4.formData?.purposeMinorTagalog || '',

            choiceOfParticipantsEnglish: formData.step4.formData?.choiceOfParticipantsEnglish || '',
            choiceOfParticipantsTagalog: formData.step4.formData?.choiceOfParticipantsTagalog || '',

            voluntarinessMinorEnglish: formData.step4.formData?.voluntarinessMinorEnglish || '',
            voluntarinessMinorTagalog: formData.step4.formData?.voluntarinessMinorTagalog || '',

            proceduresMinorEnglish: formData.step4.formData?.proceduresMinorEnglish || '',
            proceduresMinorTagalog: formData.step4.formData?.proceduresMinorTagalog || '',

            risksMinorEnglish: formData.step4.formData?.risksMinorEnglish || '',
            risksMinorTagalog: formData.step4.formData?.risksMinorTagalog || '',

            benefitsMinorEnglish: formData.step4.formData?.benefitsMinorEnglish || '',
            benefitsMinorTagalog: formData.step4.formData?.benefitsMinorTagalog || '',

            confidentialityMinorEnglish: formData.step4.formData?.confidentialityMinorEnglish || '',
            confidentialityMinorTagalog: formData.step4.formData?.confidentialityMinorTagalog || '',

            sharingFindingsEnglish: formData.step4.formData?.sharingFindingsEnglish || '',
            sharingFindingsTagalog: formData.step4.formData?.sharingFindingsTagalog || '',
          } : null,

          contact_person: safeString(formData.step4.formData?.contactPerson),
          contact_number: safeString(formData.step4.formData?.contactNumber),
        });

      if (consentError) throw consentError;
    }


    // 5. Upload files and save metadata
    const documentInserts = [];

    if (files.step2TechnicalReview && formData.step2?.technicalReviewFileName) {
      const fileUrl = await uploadFile(
        files.step2TechnicalReview,
        formData.step2.technicalReviewFileName,
        'technical-review'
      );
      documentInserts.push({
        submission_id: submission.id,
        document_type: 'technical_review',
        file_name: formData.step2.technicalReviewFileName,
        file_size: formData.step2.technicalReviewFileSize || 0,
        file_url: fileUrl,
      });
    }

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

    // 6. Generate and upload PDFs
    try {
      const uploadGeneratedPdf = async (pdfResult: any, documentType: string, baseFileName: string) => {
        if (!pdfResult.success || !pdfResult.pdfData) {
          console.warn(`Failed to generate ${documentType} PDF`);
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

        await supabase
          .from('uploaded_documents')
          .insert({
            submission_id: submission.id,
            document_type: documentType,
            file_name: `${baseFileName}_${submissionId}.pdf`,
            file_size: pdfBuffer.length,
            file_url: pdfPath,
          });
      };

      const appFormPdf = await generateApplicationFormPdf(formData);
      await uploadGeneratedPdf(appFormPdf, 'application_form', 'Application_For_Ethics_Review');

      const protocolPdf = await generateResearchProtocolPdf(formData);
      await uploadGeneratedPdf(protocolPdf, 'research_protocol', 'Research_Protocol');

      // ✅ BUILD proper structure for consent PDF
      // MATCH the saveStep4 structure EXACTLY
        const { data: consent } = await supabase
          .from('consent_forms')
          .select('*')
          .eq('submission_id', submission.id)
          .single();

        // ✅ Build step4PdfData using the SPREAD pattern
        const consentPdfData = {
          step2: submission,
          step4: {
            ...(consent?.adult_consent || {}),        // ✅ Flatten adult
            ...(consent?.minor_assent || {}),         // ✅ Flatten minor
            consent_type: consent?.consent_type,
            contact_person: consent?.contact_person,
            contact_number: consent?.contact_number,
            informed_consent_for: consent?.informed_consent_for,
            consentType: consent?.consent_type,
          },
        };

      const consentPdf = await generateConsentFormPdf(consentPdfData);


      await uploadGeneratedPdf(consentPdf, 'consent_form', 'Informed_Consent_Form');

    } catch (pdfError) {
      console.error('PDF generation error (non-critical):', pdfError);
    }

    autoClassifyFromDatabase(submission.id)
      .then(result => {
        if (result.success) {
          console.log(`Auto-classified as: ${result.classification} (confidence: ${(result.confidence * 100).toFixed(1)}%)`);
        } else {
          console.error('Classification failed:', result.error);
        }
      })
      .catch(err => {
        console.error('Classification error:', err);
      });

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
