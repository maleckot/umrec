// app/actions/researcher/submitRevisionApplication.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  generateApplicationFormPdf,
  generateResearchProtocolPdf,
  generateConsentFormPdf
} from '@/app/actions/generatePdfFromDatabase';

// --- HELPER FUNCTIONS ---

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

async function extractAndUploadImages(
  htmlContent: string,
  userId: string,
  submissionId: string,
  supabase: any,
  sectionName: string
) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return { htmlContent: htmlContent || '', uploadedImages: [] };
  }

  let updatedHtml = htmlContent;
  const uploadedImages: any[] = [];

  // Process new base64 images
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
      const filePath = `${userId}/${submissionId}/protocol-images/${sectionName}-${i + 1}-${timestamp}-${randomStr}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: false
        });

      if (uploadError) throw uploadError;

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
    } catch (error) {
      console.error(`Error uploading ${sectionName} image:`, error);
    }
  }
  return { htmlContent: updatedHtml, uploadedImages };
}

// ✅ REVISED uploadRevisedFile - handles missing documents
async function uploadRevisedFile(
  supabase: any,
  userId: string,
  submissionId: string,
  base64Data: string,
  documentType: string,
  fileName: string,
  fileSize: number
) {
  try {
    console.log(`🔧 Processing ${documentType}...`);
    
    if (!base64Data) {
      console.warn(`⚠️ No file data for ${documentType}, skipping`);
      return { success: true, skipped: true };
    }

    // 1. Try to find existing document
    const { data: oldDoc, error: findError } = await supabase
      .from('uploaded_documents')
      .select('id, file_url')
      .eq('submission_id', submissionId)
      .eq('document_type', documentType)
      .maybeSingle(); // ✅ Use maybeSingle instead of single

    // 2. Extract and convert base64
    let base64String = base64Data;
    if (base64Data.includes(',')) {
      base64String = base64Data.split(',')[1];
    }
    
    const pdfBuffer = Buffer.from(base64String, 'base64');
    const filePath = `${userId}/${submissionId}/${documentType}_${Date.now()}.pdf`;

    // 3. Delete old file if it exists
    if (oldDoc?.file_url) {
      const { error: deleteError } = await supabase.storage
        .from('research-documents')
        .remove([oldDoc.file_url]);
      if (deleteError) console.warn(`⚠️ Could not delete old file: ${deleteError.message}`);
    }

    // 4. Upload new file
    console.log(`📤 Uploading ${documentType} to: ${filePath}`);
    const { error: uploadError } = await supabase.storage
      .from('research-documents')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    // 5. If document exists, UPDATE it; otherwise CREATE it
    if (oldDoc) {
      // Update existing
      const { error: updateError } = await supabase
        .from('uploaded_documents')
        .update({
          file_url: filePath,
          file_name: fileName,
          file_size: pdfBuffer.length,
          uploaded_at: new Date().toISOString(),
        })
        .eq('id', oldDoc.id);

      if (updateError) throw new Error(`Update failed: ${updateError.message}`);
      console.log(`✅ Updated ${documentType}`);
    } else {
      // ✅ CREATE new document record if it doesn't exist
      const { error: insertError } = await supabase
        .from('uploaded_documents')
        .insert({
          submission_id: submissionId,
          document_type: documentType,
          file_url: filePath,
          file_name: fileName,
          file_size: pdfBuffer.length,
          uploaded_at: new Date().toISOString(),
        });

      if (insertError) throw new Error(`Insert failed: ${insertError.message}`);
      console.log(`✅ Created new ${documentType}`);
    }

    // 6. Reset verification if document exists
    if (oldDoc) {
      const { data: verificationDoc } = await supabase
        .from('document_verifications')
        .select('id')
        .eq('document_id', oldDoc.id)
        .maybeSingle();

      if (verificationDoc) {
        await supabase
          .from('document_verifications')
          .update({
            is_approved: null,
            feedback_comment: null,
            verified_at: null,
          })
          .eq('id', verificationDoc.id);
      }
    }

    return { success: true, filePath };

  } catch (error) {
    console.error(`❌ Error with ${documentType}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function overwriteGeneratedPdf(
  supabase: any,
  userId: string,
  submissionId: string,
  pdfResult: any,
  documentType: string,
  baseFileName: string
) {
  try {
    if (!pdfResult.success || !pdfResult.pdfData) {
      console.warn(`Failed to generate ${documentType} PDF. Skipping overwrite.`);
      return;
    }

    // 1. Find the old document record
    const { data: oldDoc, error: findError } = await supabase
      .from('uploaded_documents')
      .select('id, file_url')
      .eq('submission_id', submissionId)
      .eq('document_type', documentType)
      .single();

    if (findError) {
      console.warn(`Could not find old ${documentType} record. This may be fine if it failed first time.`);
      return;
    }

    // 2. Delete the old file from storage
    if (oldDoc.file_url) {
      console.log(`Deleting old generated PDF: ${oldDoc.file_url}`);
      const { error: deleteError } = await supabase.storage
        .from('research-documents')
        .remove([oldDoc.file_url]);
      if (deleteError) console.warn(`Could not delete old generated PDF, proceeding anyway: ${deleteError.message}`);
    }

    // 3. Upload the new file
    const base64Data = pdfResult.pdfData.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    const pdfPath = `${userId}/${submissionId}/${documentType}_${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('research-documents')
      .upload(pdfPath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) throw new Error(`Failed to upload new ${documentType} PDF: ${uploadError.message}`);

    // 4. Update the 'uploaded_documents' record
    const { error: updateError } = await supabase
      .from('uploaded_documents')
      .update({
        file_url: pdfPath,
        file_name: `${baseFileName}_${submissionId}.pdf`,
        file_size: pdfBuffer.length,
        uploaded_at: new Date().toISOString(),
      })
      .eq('id', oldDoc.id);

    if (updateError) throw new Error(`Failed to update ${documentType} record: ${updateError.message}`);

    console.log(`✅ Successfully overwrote ${documentType} PDF.`);
  } catch (error) {
    console.error(`Error in overwriteGeneratedPdf for ${documentType}:`, error);
  }
}

// --- MAIN REVISION ACTION ---
export async function submitRevisionApplication(
  submissionId: string,
  revisionData: any,
  files: {
    step2TechnicalReview?: string;
    step5?: string;
    step6?: string;
    step7?: string;
  }
) {
  const supabase = await createClient();

  try {
    // 1. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const revisedSteps: number[] = revisionData.revisedSteps || [];
    console.log(`Starting revision for submission ID: ${submissionId}`);
    console.log(`Revising steps: ${revisedSteps.join(', ')}`);

    // --- 2. Conditionally update tables ---

    // Update Step 1 (Main Submission Table)
    if (revisedSteps.includes(1) && revisionData.step1) {
      console.log('Updating research_submissions (Step 1)...');
      const { error: step1Error } = await supabase
        .from('research_submissions')
        .update({
          title: revisionData.step1.title,
          project_leader_first_name: revisionData.step1.projectLeaderFirstName,
          project_leader_middle_name: safeString(revisionData.step1.projectLeaderMiddleName),
          project_leader_last_name: revisionData.step1.projectLeaderLastName,
          project_leader_email: revisionData.step1.projectLeaderEmail,
          project_leader_contact: revisionData.step1.projectLeaderContact,
          co_authors: safeString(revisionData.step1.coAuthors),
          organization: safeString(revisionData.step1.organization),
        })
        .eq('id', submissionId);
      if (step1Error) throw new Error(`Step 1 Update Error: ${step1Error.message}`);
    }

    // Update Step 2 (Application Form)
    if (revisedSteps.includes(2) && revisionData.step2) {
      console.log('Updating application_forms (Step 2)...');
      const { error: step2Error } = await supabase
        .from('application_forms')
        .update({
          study_site: safeString(revisionData.step2.studySite),
          researcher_first_name: safeString(revisionData.step2.researcherFirstName),
          researcher_middle_name: safeString(revisionData.step2.researcherMiddleName),
          researcher_last_name: safeString(revisionData.step2.researcherLastName),
          contact_info: {
            telNo: revisionData.step2.telNo || '',
            mobileNo: revisionData.step2.project_leader_contact || '',
            email: revisionData.step2.project_leader_email || '',
            faxNo: revisionData.step2.faxNo || 'N/A',
          },
          co_researcher: revisionData.step2.coResearchers?.map((co: any) => ({
            fullName: co.name,
            contactNumber: co.contact,
            emailAddress: co.email
          })) || [],
          technical_advisers: revisionData.step2.technicalAdvisers?.map((adv: any) => ({
            fullName: adv.name,
            contactNumber: adv.contact,
            emailAddress: adv.email
          })) || [],
          college: safeString(revisionData.step2.college),
          institution: revisionData.step2.institution || 'University of Makati',
          institution_address: safeString(revisionData.step2.institutionAddress),
          type_of_study: revisionData.step2.typeOfStudy || [],
          type_of_study_others: safeString(revisionData.step2.typeOfStudyOthers),
          study_site_type: safeString(revisionData.step2.studySiteType),
          source_of_funding: revisionData.step2.sourceOfFunding || [],
          pharmaceutical_sponsor: safeString(revisionData.step2.pharmaceuticalSponsor),
          funding_others: safeString(revisionData.step2.fundingOthers),
          study_duration: {
            startDate: revisionData.step2.startDate || null,
            endDate: revisionData.step2.endDate || null,
          },
          num_participants: parseNumber(revisionData.step2.numParticipants),
          technical_review: safeString(revisionData.step2.technicalReview),
          submitted_to_other: safeString(revisionData.step2.submittedToOther),
          document_checklist: {
            hasApplicationForm: revisionData.step2?.hasApplicationForm || false,
            hasResearchProtocol: revisionData.step2?.hasResearchProtocol || false,
            hasInformedConsent: revisionData.step2?.hasInformedConsent || false,
            hasInformedConsentOthers: revisionData.step2?.hasInformedConsentOthers || false,
            informedConsentOthers: revisionData.step2?.informedConsentOthers || '',
            hasAssentForm: revisionData.step2?.hasAssentForm || false,
            hasAssentFormOthers: revisionData.step2?.hasAssentFormOthers || false,
            assentFormOthers: revisionData.step2?.assentFormOthers || '',
            hasEndorsementLetter: revisionData.step2?.hasEndorsementLetter || false,
            hasQuestionnaire: revisionData.step2?.hasQuestionnaire || false,
            hasTechnicalReview: revisionData.step2?.hasTechnicalReview || false,
            hasDataCollectionForms: revisionData.step2?.hasDataCollectionForms || false,
            hasProductBrochure: revisionData.step2?.hasProductBrochure || false,
            hasFDAAuthorization: revisionData.step2?.hasFDAAuthorization || false,
            hasCompanyPermit: revisionData.step2?.hasCompanyPermit || false,
            hasSpecialPopulationPermit: revisionData.step2?.hasSpecialPopulationPermit || false,
            specialPopulationPermitDetails: revisionData.step2?.specialPopulationPermitDetails || '',
            hasOtherDocs: revisionData.step2?.hasOtherDocs || false,
            otherDocsDetails: revisionData.step2?.otherDocsDetails || '',
          },
        })
        .eq('submission_id', submissionId);
      if (step2Error) throw new Error(`Step 2 Update Error: ${step2Error.message}`);
    }

    // Update Step 3 (Research Protocol)
    if (revisedSteps.includes(3) && revisionData.step3?.formData) {
      console.log('Updating research_protocols (Step 3)...');

      const intro = await extractAndUploadImages(
        revisionData.step3.formData.introduction,
        user.id,
        submissionId,
        supabase,
        'introduction'
      );
      const background = await extractAndUploadImages(
        revisionData.step3.formData.background,
        user.id,
        submissionId,
        supabase,
        'background'
      );
      const problemStatement = await extractAndUploadImages(
        revisionData.step3.formData.problemStatement,
        user.id,
        submissionId,
        supabase,
        'problem_statement'
      );
      const scopeDelimitation = await extractAndUploadImages(
        revisionData.step3.formData.scopeDelimitation,
        user.id,
        submissionId,
        supabase,
        'scope_delimitation'
      );
      const literatureReview = await extractAndUploadImages(
        revisionData.step3.formData.literatureReview,
        user.id,
        submissionId,
        supabase,
        'literature_review'
      );
      const methodology = await extractAndUploadImages(
        revisionData.step3.formData.methodology,
        user.id,
        submissionId,
        supabase,
        'methodology'
      );
      const population = await extractAndUploadImages(
        revisionData.step3.formData.population,
        user.id,
        submissionId,
        supabase,
        'population'
      );
      const samplingTechnique = await extractAndUploadImages(
        revisionData.step3.formData.samplingTechnique,
        user.id,
        submissionId,
        supabase,
        'sampling_technique'
      );
      const researchInstrument = await extractAndUploadImages(
        revisionData.step3.formData.researchInstrument,
        user.id,
        submissionId,
        supabase,
        'research_instrument'
      );
      const statisticalTreatment = await extractAndUploadImages(
        revisionData.step3.formData.statisticalTreatment,
        user.id,
        submissionId,
        supabase,
        'statistical_treatment'
      );
      const ethicalConsideration = await extractAndUploadImages(
        revisionData.step3.formData.ethicalConsideration,
        user.id,
        submissionId,
        supabase,
        'ethical_consideration'
      );
      const references = await extractAndUploadImages(
        revisionData.step3.formData.references,
        user.id,
        submissionId,
        supabase,
        'references'
      );

      let researchersWithPaths = revisionData.step3?.researchers || [];
if (Array.isArray(researchersWithPaths)) {
  console.log('📝 Processing researcher signatures for revision...');
  
  researchersWithPaths = await Promise.all(
    researchersWithPaths.map(async (researcher: any, index: number) => {
      // ✅ NEW UPLOAD - signatureBase64 is present
      if (researcher.signatureBase64) {
        try {
          let base64Data = researcher.signatureBase64;
          if (base64Data.includes(',')) {
            base64Data = base64Data.split(',')[1];
          }
          
          const buffer = Buffer.from(base64Data, 'base64');
          const signaturePath = `${user.id}/${submissionId}/signatures/researcher-${index + 1}-${Date.now()}.png`;

          console.log(`Uploading NEW signature for ${researcher.name} to: ${signaturePath}`);
          const { error: uploadError } = await supabase.storage
            .from('research-documents')
            .upload(signaturePath, buffer, {
              contentType: 'image/png',
              upsert: true
            });

          if (uploadError) {
            console.error(`Signature upload error for ${researcher.name}:`, uploadError);
            // Return old data if upload fails
            return {
              id: researcher.id,
              name: researcher.name,
              signaturePath: researcher.signaturePath || null,
              signatureBase64: researcher.signatureBase64, // ✅ Keep base64 for PDF
            };
          }

          console.log(`✅ Uploaded NEW signature for ${researcher.name}`);
          return {
            id: researcher.id,
            name: researcher.name,
            signaturePath: signaturePath,
            signatureBase64: researcher.signatureBase64, // ✅ Keep base64 for PDF
          };
        } catch (err) {
          console.error(`Error processing signature for ${researcher.name}:`, err);
          return {
            id: researcher.id,
            name: researcher.name,
            signaturePath: researcher.signaturePath || null,
            signatureBase64: researcher.signatureBase64, // ✅ Keep base64 for PDF
          };
        }
      }
      
      // ✅ EXISTING SIGNATURE - fetch from storage and convert to base64
      if (researcher.signaturePath) {
        try {
          console.log(`♻️ Fetching existing signature for ${researcher.name}: ${researcher.signaturePath}`);
          
          // Download the file from storage
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('research-documents')
            .download(researcher.signaturePath);

          if (downloadError) throw downloadError;

          // Convert blob to base64
          const arrayBuffer = await fileData.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64 = `data:image/png;base64,${buffer.toString('base64')}`;

          console.log(`✅ Converted existing signature to base64 for ${researcher.name}`);
          
          return {
            id: researcher.id,
            name: researcher.name,
            signaturePath: researcher.signaturePath,
            signatureBase64: base64, // ✅ Add base64 for PDF generation
          };
        } catch (err) {
          console.error(`Error fetching existing signature for ${researcher.name}:`, err);
          return {
            id: researcher.id,
            name: researcher.name,
            signaturePath: researcher.signaturePath,
            signatureBase64: null,
          };
        }
      }
      
      // ✅ NO SIGNATURE
      console.warn(`⚠️ No signature for researcher ${researcher.name}`);
      return {
        id: researcher.id,
        name: researcher.name,
        signaturePath: null,
        signatureBase64: null,
      };
    })
  );
}

      const { error: step3Error } = await supabase
        .from('research_protocols')
        .update({
          title: safeString(revisionData.step3.formData.title),
          introduction: intro.htmlContent,
          background: background.htmlContent,
          problem_statement: problemStatement.htmlContent,
          scope_delimitation: scopeDelimitation.htmlContent,
          literature_review: literatureReview.htmlContent,
          methodology: methodology.htmlContent,
          population: population.htmlContent,
          sampling_technique: samplingTechnique.htmlContent,
          research_instrument: researchInstrument.htmlContent,
          statistical_treatment: statisticalTreatment.htmlContent,
          ethical_consideration: ethicalConsideration.htmlContent,
          research_references: references.htmlContent,
          researchers: researchersWithPaths,
        })
        .eq('submission_id', submissionId);
      if (step3Error) throw new Error(`Step 3 Update Error: ${step3Error.message}`);
    }

    // Update Step 4 (Consent Form)
    if (revisedSteps.includes(4) && revisionData.step4?.consentType) {
      console.log('Updating consent_forms (Step 4)...');

      const { error: step4Error } = await supabase
        .from('consent_forms')
        .update({
          consent_type: revisionData.step4.consentType,
          informed_consent_for: revisionData.step4.participantGroupIdentity,
          adult_consent:
            revisionData.step4.consentType === 'adult' || revisionData.step4.consentType === 'both'
              ? {
                  adultLanguage: revisionData.step4.adultLanguage || 'english',
                  introductionEnglish: revisionData.step4.introductionEnglish || '',
                  introductionTagalog: revisionData.step4.introductionTagalog || '',
                  purposeEnglish: revisionData.step4.purposeEnglish || '',
                  purposeTagalog: revisionData.step4.purposeTagalog || '',
                  researchInterventionEnglish: revisionData.step4.researchInterventionEnglish || '',
                  researchInterventionTagalog: revisionData.step4.researchInterventionTagalog || '',
                  participantSelectionEnglish: revisionData.step4.participantSelectionEnglish || '',
                  participantSelectionTagalog: revisionData.step4.participantSelectionTagalog || '',
                  voluntaryParticipationEnglish: revisionData.step4.voluntaryParticipationEnglish || '',
                  voluntaryParticipationTagalog: revisionData.step4.voluntaryParticipationTagalog || '',
                  proceduresEnglish: revisionData.step4.proceduresEnglish || '',
                  proceduresTagalog: revisionData.step4.proceduresTagalog || '',
                  durationEnglish: revisionData.step4.durationEnglish || '',
                  durationTagalog: revisionData.step4.durationTagalog || '',
                  risksEnglish: revisionData.step4.risksEnglish || '',
                  risksTagalog: revisionData.step4.risksTagalog || '',
                  benefitsEnglish: revisionData.step4.benefitsEnglish || '',
                  benefitsTagalog: revisionData.step4.benefitsTagalog || '',
                  reimbursementsEnglish: revisionData.step4.reimbursementsEnglish || '',
                  reimbursementsTagalog: revisionData.step4.reimbursementsTagalog || '',
                  confidentialityEnglish: revisionData.step4.confidentialityEnglish || '',
                  confidentialityTagalog: revisionData.step4.confidentialityTagalog || '',
                  sharingResultsEnglish: revisionData.step4.sharingResultsEnglish || '',
                  sharingResultsTagalog: revisionData.step4.sharingResultsTagalog || '',
                  rightToRefuseEnglish: revisionData.step4.rightToRefuseEnglish || '',
                  rightToRefuseTagalog: revisionData.step4.rightToRefuseTagalog || '',
                  whoToContactEnglish: revisionData.step4.whoToContactEnglish || '',
                  whoToContactTagalog: revisionData.step4.whoToContactTagalog || '',
                }
              : null,
          minor_assent:
            revisionData.step4.consentType === 'minor' || revisionData.step4.consentType === 'both'
              ? {
                  minorLanguage: revisionData.step4.minorLanguage || 'english',
                  introductionMinorEnglish: revisionData.step4.introductionMinorEnglish || '',
                  introductionMinorTagalog: revisionData.step4.introductionMinorTagalog || '',
                  purposeMinorEnglish: revisionData.step4.purposeMinorEnglish || '',
                  purposeMinorTagalog: revisionData.step4.purposeMinorTagalog || '',
                  choiceOfParticipantsEnglish: revisionData.step4.choiceOfParticipantsEnglish || '',
                  choiceOfParticipantsTagalog: revisionData.step4.choiceOfParticipantsTagalog || '',
                  voluntarinessMinorEnglish: revisionData.step4.voluntarinessMinorEnglish || '',
                  voluntarinessMinorTagalog: revisionData.step4.voluntarinessMinorTagalog || '',
                  proceduresMinorEnglish: revisionData.step4.proceduresMinorEnglish || '',
                  proceduresMinorTagalog: revisionData.step4.proceduresMinorTagalog || '',
                  risksMinorEnglish: revisionData.step4.risksMinorEnglish || '',
                  risksMinorTagalog: revisionData.step4.risksMinorTagalog || '',
                  benefitsMinorEnglish: revisionData.step4.benefitsMinorEnglish || '',
                  benefitsMinorTagalog: revisionData.step4.benefitsMinorTagalog || '',
                  confidentialityMinorEnglish: revisionData.step4.confidentialityMinorEnglish || '',
                  confidentialityMinorTagalog: revisionData.step4.confidentialityMinorTagalog || '',
                  sharingFindingsEnglish: revisionData.step4.sharingFindingsEnglish || '',
                  sharingFindingsTagalog: revisionData.step4.sharingFindingsTagalog || '',
                }
              : null,
          contact_person: safeString(revisionData.step4.contactPerson),
          contact_number: safeString(revisionData.step4.contactNumber),
        })
        .eq('submission_id', submissionId);
      if (step4Error) throw new Error(`Step 4 Update Error: ${step4Error.message}`);
    }

    // --- 3. Conditionally update files ---
    if (revisedSteps.includes(5) && files.step5) {
      const uploadResult = await uploadRevisedFile(
        supabase,
        user.id,
        submissionId,
        files.step5,
        'research_instrument',
        revisionData.step5?.fileName || 'research_instrument.pdf',
        revisionData.step5?.fileSize || 0
      );
      if (!uploadResult.success) {
        console.warn(`⚠️ Step 5 upload warning: ${uploadResult.error}`);
      }
    }

    if (revisedSteps.includes(6) && files.step6) {
      const uploadResult = await uploadRevisedFile(
        supabase,
        user.id,
        submissionId,
        files.step6,
        'proposal_defense',
        revisionData.step6?.fileName || 'proposal_defense.pdf',
        revisionData.step6?.fileSize || 0
      );
      if (!uploadResult.success) {
        console.warn(`⚠️ Step 6 upload warning: ${uploadResult.error}`);
      }
    }

    if (revisedSteps.includes(7) && files.step7) {
      const uploadResult = await uploadRevisedFile(
        supabase,
        user.id,
        submissionId,
        files.step7,
        'endorsement_letter',
        revisionData.step7?.fileName || 'endorsement_letter.pdf',
        revisionData.step7?.fileSize || 0
      );
      if (!uploadResult.success) {
        console.warn(`⚠️ Step 7 upload warning: ${uploadResult.error}`);
      }
    }

    if (revisedSteps.includes(2) && files.step2TechnicalReview) {
      const uploadResult = await uploadRevisedFile(
        supabase,
        user.id,
        submissionId,
        files.step2TechnicalReview,
        'technical_review',
        revisionData.step2?.technicalReviewFileName || 'technical_review.pdf',
        revisionData.step2?.technicalReviewFileSize || 0
      );
      if (!uploadResult.success) {
        console.warn(`⚠️ Step 2 Technical Review upload warning: ${uploadResult.error}`);
      }
    }

    // --- 4. RE-GENERATE CONSOLIDATED PDFS ---
    console.log('Re-generating consolidated PDFs...');

    const { data: updatedSubmission } = await supabase
      .from('research_submissions')
      .select()
      .eq('id', submissionId)
      .single();

    const { data: updatedAppForm } = await supabase
      .from('application_forms')
      .select()
      .eq('submission_id', submissionId)
      .single();

    const { data: updatedProtocol } = await supabase
      .from('research_protocols')
      .select()
      .eq('submission_id', submissionId)
      .single();

    const { data: updatedConsent } = await supabase
      .from('consent_forms')
      .select()
      .eq('submission_id', submissionId)
      .single();

    // ✅ BUILD pdfData with correct structure
    const pdfData = {
      step1: updatedSubmission,
      step2: updatedAppForm,
      step3: {
        formData: {
          title: updatedProtocol?.title,
          introduction: updatedProtocol?.introduction,
          background: updatedProtocol?.background,
          problemStatement: updatedProtocol?.problem_statement,
          scopeDelimitation: updatedProtocol?.scope_delimitation,
          literatureReview: updatedProtocol?.literature_review,
          methodology: updatedProtocol?.methodology,
          population: updatedProtocol?.population,
          samplingTechnique: updatedProtocol?.sampling_technique,
          researchInstrument: updatedProtocol?.research_instrument,
          statisticalTreatment: updatedProtocol?.statistical_treatment,
          ethicalConsideration: updatedProtocol?.ethical_consideration,
          references: updatedProtocol?.research_references,
        },
        researchers: updatedProtocol?.researchers,
      },
      step4: {
        ...updatedConsent?.adult_consent,
        ...updatedConsent?.minor_assent,
        consentType: updatedConsent?.consent_type,
        adultLanguage: updatedConsent?.adult_consent?.adultLanguage,
        minorLanguage: updatedConsent?.minor_assent?.minorLanguage,
        contactPerson: updatedConsent?.contact_person,
        contactNumber: updatedConsent?.contact_number,
        informedConsentFor: updatedConsent?.informed_consent_for,
      },
    };

    console.log('PDF Data structure ready');

    const appFormPdf = await generateApplicationFormPdf(pdfData);
    await overwriteGeneratedPdf(
      supabase,
      user.id,
      submissionId,
      appFormPdf,
      'application_form',
      'Application_For_Ethics_Review'
    );

    const protocolPdf = await generateResearchProtocolPdf(pdfData);
    await overwriteGeneratedPdf(
      supabase,
      user.id,
      submissionId,
      protocolPdf,
      'research_protocol',
      'Research_Protocol'
    );

    const consentPdf = await generateConsentFormPdf(pdfData);
    await overwriteGeneratedPdf(supabase, user.id, submissionId, consentPdf, 'consent_form', 'Informed_Consent_Form');

    console.log('✅ All PDFs regenerated and overwritten.');

    // --- 5. Update submission status ---
    console.log('Updating main submission status to pending...');
    const { error: finalStatusError } = await supabase
      .from('research_submissions')
      .update({
        status: 'resubmit',
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (finalStatusError) throw new Error(`Final Status Update Error: ${finalStatusError.message}`);

    revalidatePath('/researchermodule/submissions');
    revalidatePath(`/researchermodule/activity-details?id=${submissionId}`);

    return {
      success: true,
      submissionId: submissionId,
    };
  } catch (error) {
    console.error('Full Revision Submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit revision',
    };
  }
}
