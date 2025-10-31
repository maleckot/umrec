'use server';

import { createClient } from '@/utils/supabase/server';
import { generateResearchProtocolPdf } from '@/app/actions/generatePdfFromDatabase';

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

export async function saveStep3Data({
  submissionId,
  formData,
  researchers
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

    // ✅ PROCESS SIGNATURES FIRST - Create researchersWithPaths for DB storage
    console.log('📝 Processing researcher signatures...');

    const researchersWithPaths = await Promise.all(
      researchers.map(async (researcher: any, index: number) => {
        let signaturePath = null;
        let signatureBase64 = researcher.signatureBase64 || null;

        // ✅ Handle new uploads (File objects or base64)
        if (researcher.signature instanceof File) {
          try {
            const buffer = await researcher.signature.arrayBuffer();
            signaturePath = `${user.id}/signatures/researcher-${index + 1}-${Date.now()}.png`;

            await supabase.storage
              .from('research-documents')
              .upload(signaturePath, buffer, {
                contentType: 'image/png',
                upsert: false
              });

            console.log(`✅ Uploaded signature for ${researcher.name}`);
          } catch (error) {
            console.error('Error uploading signature:', error);
          }
        } else if (researcher.signatureBase64 && typeof researcher.signatureBase64 === 'string') {
          // ✅ Handle base64 signatures
          try {
            const base64Data = researcher.signatureBase64.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            signaturePath = `${user.id}/signatures/researcher-${index + 1}-${Date.now()}.png`;

            await supabase.storage
              .from('research-documents')
              .upload(signaturePath, buffer, {
                contentType: 'image/png',
                upsert: false
              });

            console.log(`✅ Uploaded base64 signature for ${researcher.name}`);
          } catch (error) {
            console.error('Error processing base64 signature:', error);
          }
        } else if (researcher.signature && typeof researcher.signature === 'string' && !researcher.signature.startsWith('http')) {
          // ✅ Keep existing path (not a signed URL)
          signaturePath = researcher.signature;
        } else if (researcher.signature && typeof researcher.signature === 'string' && researcher.signature.startsWith('http')) {
          // ✅ It's already a signed URL - extract the path if possible, otherwise keep base64
          signatureBase64 = researcher.signatureBase64 || null;
        }

        return {
          id: researcher.id,
          name: researcher.name,
          signaturePath: signaturePath,
          signatureBase64: signatureBase64
          // ❌ DO NOT include signature field here
        };
      })
    );

    // ✅ UPDATE research_protocols with PATHS (permanent data)
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
        researchers: researchersWithPaths,  // ✅ PATHS - permanent!
        updated_at: new Date().toISOString()
      })
      .eq('submission_id', submissionId);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      throw updateError;
    }

    console.log('✅ Step 3 data saved successfully');

    // ✅ Track uploaded images in uploaded_documents table
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
        submission_id: submissionId,
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
      }
    }

    // ✅ Get submission info
    const { data: submission } = await supabase
      .from('research_submissions')
      .select('id, user_id, title')
      .eq('id', submissionId)
      .single();

    if (submission) {
      const { data: existingDoc } = await supabase
        .from('uploaded_documents')
        .select('id')
        .eq('submission_id', submissionId)
        .eq('document_type', 'research_protocol')
        .single();

      let documentId: string;

      if (!existingDoc) {
        const { data: newDoc, error: docError } = await supabase
          .from('uploaded_documents')
          .insert({
            submission_id: submissionId,
            document_type: 'research_protocol',
            file_name: `Research_Protocol_${submission.title}.pdf`,
            file_url: `research-protocols/${submissionId}/protocol.pdf`,
            file_size: 0,
            uploaded_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (docError) throw docError;
        documentId = newDoc.id;
        console.log('✅ Research protocol document entry created');
      } else {
        documentId = existingDoc.id;
      }

      const { data: existingVerification } = await supabase
        .from('document_verifications')
        .select('id')
        .eq('document_id', documentId)
        .single();

      if (existingVerification) {
        await supabase
          .from('document_verifications')
          .update({
            is_approved: null,
            feedback_comment: null,
            verified_at: null
          })
          .eq('id', existingVerification.id);

        console.log('✅ Document verification reset for re-review');
      } else {
        await supabase
          .from('document_verifications')
          .insert({
            document_id: documentId,
            submission_id: submissionId,
            is_approved: null,
            feedback_comment: null,
            verified_at: null
          });
      }
    }

    // ✅ Update submission status
    await supabase
      .from('research_submissions')
      .update({
        status: 'Resubmit',
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    console.log('✅ Submission status updated to Resubmit');

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
          signature: signatureUrl  // ✅ For PDF only
        };
      })
    );

    // ✅ GENERATE PDF WITH SIGNED URLs
    console.log('🔄 Starting PDF generation...');

    try {
      const pdfFormData = {
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
            title: formData.title
          },
          researchers: researchersWithSignedUrls  // ✅ WITH SIGNED URLS!
        },
        step4: {}
      };

      console.log('📸 Image check BEFORE PDF call:');
      console.log('Has intro URLs?', introductionResult.htmlContent.includes('http'));
      console.log('Sample intro:', introductionResult.htmlContent.substring(0, 500));

      console.log('📋 Calling generateResearchProtocolPdf...');
      const pdfResult = await generateResearchProtocolPdf(pdfFormData);

      console.log('📄 PDF result:', { success: pdfResult.success, hasData: !!pdfResult.pdfData });

      if (pdfResult.success && pdfResult.pdfData) {
        const base64Data = pdfResult.pdfData.includes('base64,')
          ? pdfResult.pdfData.split(',')[1]
          : pdfResult.pdfData;

        const pdfBuffer = Buffer.from(base64Data, 'base64');
        const timestamp = Date.now();
        const pdfPath = `${user.id}/research_protocol_${submissionId}_${timestamp}.pdf`;

        const { error: uploadError } = await supabase.storage
          .from('research-documents')
          .upload(pdfPath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: false
          });

        if (!uploadError) {
          console.log('✅ PDF uploaded successfully');

          const { data: existingDoc } = await supabase
            .from('uploaded_documents')
            .select('id')
            .eq('submission_id', submissionId)
            .eq('document_type', 'research_protocol')
            .single();

          if (existingDoc) {
            await supabase
              .from('uploaded_documents')
              .update({
                file_name: `Research_Protocol_${submissionId}.pdf`,
                file_size: pdfBuffer.length,
                file_url: pdfPath,
                uploaded_at: new Date().toISOString()
              })
              .eq('id', existingDoc.id);

            console.log('✅ Document record updated with PDF');
          }
        }
      }
    } catch (pdfError) {
      console.error('❌ PDF generation error:', pdfError);
    }

    return { success: true };

  } catch (error) {
    console.error('❌ Save error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}
