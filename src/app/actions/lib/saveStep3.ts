// src/app/actions/lib/saveStep3.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { generateApplicationFormPdf } from '@/app/actions/generatePdfFromDatabase';
import { generateResearchProtocolPdf } from '@/app/actions/generatePdfFromDatabase';
import { generateConsentFormPdf } from '@/app/actions/generatePdfFromDatabase';
import { regeneratePdfWithTitle } from './pdfDocumentManager';

async function extractAndUploadImages(
  htmlContent: string,
  userId: string,
  supabase: any,
  sectionName: string
) {
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
          upsert: false,
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
          fileSize: buffer.length,
        });

        console.log(`✅ Uploaded ${sectionName} image ${i + 1}: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error uploading ${sectionName} image:`, error);
    }
  }

  return { htmlContent: updatedHtml, uploadedImages };
}

export async function saveStep3Data({
  submissionId,
  formData,
  researchers,
}: {
  submissionId: string;
  formData: any;
  researchers: any[];
}) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('📝 Saving Step 3 data...');

    // ✅ EXTRACT AND UPLOAD IMAGES FOR ALL SECTIONS
    console.log('📸 Extracting and uploading embedded images...');

    const introductionResult = await extractAndUploadImages(
      formData.introduction || '',
      user.id,
      supabase,
      'introduction'
    );

    const backgroundResult = await extractAndUploadImages(
      formData.background || '',
      user.id,
      supabase,
      'background'
    );

    const problemStatementResult = await extractAndUploadImages(
      formData.problemStatement || '',
      user.id,
      supabase,
      'problem_statement'
    );

    const scopeDelimitationResult = await extractAndUploadImages(
      formData.scopeDelimitation || '',
      user.id,
      supabase,
      'scope_delimitation'
    );

    const literatureReviewResult = await extractAndUploadImages(
      formData.literatureReview || '',
      user.id,
      supabase,
      'literature_review'
    );

    const methodologyResult = await extractAndUploadImages(
      formData.methodology || '',
      user.id,
      supabase,
      'methodology'
    );

    const populationResult = await extractAndUploadImages(
      formData.population || '',
      user.id,
      supabase,
      'population'
    );

    const samplingTechniqueResult = await extractAndUploadImages(
      formData.samplingTechnique || '',
      user.id,
      supabase,
      'sampling_technique'
    );

    const researchInstrumentResult = await extractAndUploadImages(
      formData.researchInstrument || '',
      user.id,
      supabase,
      'research_instrument'
    );

    const statisticalTreatmentResult = await extractAndUploadImages(
      formData.statisticalTreatment || '',
      user.id,
      supabase,
      'statistical_treatment'
    );

    const ethicalConsiderationResult = await extractAndUploadImages(
      formData.ethicalConsideration || '',
      user.id,
      supabase,
      'ethical_consideration'
    );

    const referencesResult = await extractAndUploadImages(
      formData.references || '',
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

    // ✅ PROCESS SIGNATURES
    console.log('📝 Processing researcher signatures...');

    const researchersWithPaths = await Promise.all(
      researchers.map(async (researcher: any, index: number) => {
        let signaturePath = null;
        let signatureBase64 = researcher.signatureBase64 || null;

        if (researcher.signature instanceof File) {
          try {
            const buffer = await researcher.signature.arrayBuffer();
            signaturePath = `${user.id}/signatures/researcher-${index + 1}-${Date.now()}.png`;

            await supabase.storage
              .from('research-documents')
              .upload(signaturePath, buffer, {
                contentType: 'image/png',
                upsert: false,
              });

            console.log(`✅ Uploaded signature for ${researcher.name}`);
          } catch (error) {
            console.error('Error uploading signature:', error);
          }
        } else if (
          researcher.signatureBase64 &&
          typeof researcher.signatureBase64 === 'string'
        ) {
          try {
            const base64Data = researcher.signatureBase64.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            signaturePath = `${user.id}/signatures/researcher-${index + 1}-${Date.now()}.png`;

            await supabase.storage
              .from('research-documents')
              .upload(signaturePath, buffer, {
                contentType: 'image/png',
                upsert: false,
              });

            console.log(`✅ Uploaded base64 signature for ${researcher.name}`);
          } catch (error) {
            console.error('Error processing base64 signature:', error);
          }
        } else if (
          researcher.signature &&
          typeof researcher.signature === 'string' &&
          !researcher.signature.startsWith('http')
        ) {
          signaturePath = researcher.signature;
        } else if (
          researcher.signature &&
          typeof researcher.signature === 'string' &&
          researcher.signature.startsWith('http')
        ) {
          signatureBase64 = researcher.signatureBase64 || null;
        }

        return {
          id: researcher.id,
          name: researcher.name,
          signaturePath: signaturePath,
          signatureBase64: signatureBase64,
        };
      })
    );

    // ✅ UPDATE research_protocols
    const { error: updateError } = await supabase
      .from('research_protocols')
      .update({
        title: formData.title,
        introduction: introductionResult.htmlContent,
        background: backgroundResult.htmlContent,
        problem_statement: problemStatementResult.htmlContent,
        scope_delimitation: scopeDelimitationResult.htmlContent,
        literature_review: literatureReviewResult.htmlContent,
        methodology: methodologyResult.htmlContent,
        population: populationResult.htmlContent,
        sampling_technique: samplingTechniqueResult.htmlContent,
        research_instrument: researchInstrumentResult.htmlContent,
        ethical_consideration: ethicalConsiderationResult.htmlContent,
        statistical_treatment: statisticalTreatmentResult.htmlContent,
        research_references: referencesResult.htmlContent,
        researchers: researchersWithPaths,
        updated_at: new Date().toISOString(),
      })
      .eq('submission_id', submissionId);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      throw updateError;
    }

    console.log('✅ Step 3 data saved successfully');

    // ✅ Track uploaded images
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
      ...referencesResult.uploadedImages,
    ];

    if (allUploadedImages.length > 0) {
      const imageDocuments = allUploadedImages.map((img) => ({
        submission_id: submissionId,
        document_type: `protocol_image_${img.section}`,
        file_name: `${img.section}-image-${img.imageNumber}.${img.filePath
          .split('.')
          .pop()}`,
        file_size: img.fileSize,
        file_url: img.filePath,
      }));

      const { error: imageDocsError } = await supabase
        .from('uploaded_documents')
        .insert(imageDocuments);

      if (!imageDocsError) {
        console.log(
          `✅ Tracked ${allUploadedImages.length} images in uploaded_documents table`
        );
      }
    }

    // ✅ Update submission title
    await supabase
      .from('research_submissions')
      .update({
        title: formData.title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    console.log('✅ Submission title updated');

    // ✅ CREATE SIGNED URLs FOR PDF
    console.log('🔄 Creating signed URLs for PDF...');

    const researchersWithSignedUrls = await Promise.all(
      researchersWithPaths.map(async (r: any) => {
        let signatureUrl = null;

        if (r.signaturePath) {
          try {
            const { data: urlData } = await supabase.storage
              .from('research-documents')
              .createSignedUrl(r.signaturePath, 3600);
            signatureUrl = urlData?.signedUrl || null;
          } catch (err) {
            console.error('Error creating signed URL:', err);
            signatureUrl = r.signatureBase64 || null;
          }
        }

        return {
          id: r.id,
          name: r.name,
          signaturePath: r.signaturePath,
          signatureBase64: r.signatureBase64,
          signature: signatureUrl,
        };
      })
    );

    // ✅ FETCH SUBMISSION AND PROTOCOL FOR ALL 3 PDFs
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
          introduction: introductionResult.htmlContent,
          background: backgroundResult.htmlContent,
          problemStatement: problemStatementResult.htmlContent,
          scopeDelimitation: scopeDelimitationResult.htmlContent,
          literatureReview: literatureReviewResult.htmlContent,
          methodology: methodologyResult.htmlContent,
          population: populationResult.htmlContent,
          samplingTechnique: samplingTechniqueResult.htmlContent,
          researchInstrument: researchInstrumentResult.htmlContent,
          ethicalConsideration: ethicalConsiderationResult.htmlContent,
          statisticalTreatment: statisticalTreatmentResult.htmlContent,
          references: referencesResult.htmlContent,
          title: submission?.title,
        },
        researchers: researchersWithSignedUrls,
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

    // ✅ RESET VERIFICATION ONLY FOR RESEARCH_PROTOCOL
    console.log('🔄 Resetting research_protocol verification...');

    const { data: protocolDoc } = await supabase
      .from('uploaded_documents')
      .select('id, revision_count') // ✅ ADD revision_count HERE
      .eq('submission_id', submissionId)
      .eq('document_type', 'research_protocol')
      .single();

   if (protocolDoc) {
  console.log(`📝 Found protocol doc: ${protocolDoc.id}, current revision: ${protocolDoc.revision_count}`);
  
  const currentRevisionCount = protocolDoc.revision_count || 0;
  
  const { error: incrementError } = await supabase
    .from('uploaded_documents')
    .update({
      revision_count: currentRevisionCount + 1,
    })
    .eq('id', protocolDoc.id);

  if (incrementError) {
    console.error('❌ Error incrementing revision count:', incrementError);
  } else {
    console.log(`✅ Research protocol revision count incremented to ${currentRevisionCount + 1}`);
  }


      const { data: existingVerif } = await supabase
        .from('document_verifications')
        .select('id')
        .eq('document_id', protocolDoc.id)
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

        console.log('✅ Research protocol verification cleared');
      } else {
        await supabase
          .from('document_verifications')
          .insert({
            document_id: protocolDoc.id,
            submission_id: submissionId,
            is_approved: null,
            feedback_comment: null,
            verified_at: null,
          });

        console.log('✅ New research protocol verification created');
      }
    }

// ✅ CHECK STATUS: If all document verifications are null/approved → "pending", else → "needs_revision"
    console.log('🔍 Checking document verification status...');

    const { data: allDocs } = await supabase
      .from('uploaded_documents')
      .select('id')
      .eq('submission_id', submissionId);

    if (allDocs && allDocs.length > 0) {
      const { data: allVerifications } = await supabase
        .from('document_verifications')
        .select('is_approved')
        .eq('submission_id', submissionId);

      const allAreNullOrApproved =
        !allVerifications ||
        allVerifications.every((v) => v.is_approved === null || v.is_approved === true);

      const newStatus = allAreNullOrApproved ? 'pending' : 'needs_revision';

      console.log(
        `📊 Status update: ${newStatus} (${allAreNullOrApproved ? 'All verifications null/approved' : 'Some verifications exist'})`
      );

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

      // ✅ CONDITIONAL: Mark comments resolved ONLY if all verifications pass
      if (allAreNullOrApproved) {
        console.log('✅ All verifications passed. Marking submission comments as resolved...');

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
      } else {
        console.log(
          '⚠️ Some verifications are still pending. Comments remain unresolved for next revision cycle.'
        );
      }
    }

    console.log('✅ Step 3 saved successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Save error:', error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}
