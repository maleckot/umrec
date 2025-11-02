// src/app/actions/lib/pdfDocumentManager.ts
'use server';

import { createClient } from '@/utils/supabase/server';

interface PdfGenerationOptions {
  submissionId: string;
  documentType: 'application_form' | 'research_protocol' | 'consent_form';
  pdfData: any;
  generatePdfFn: (data: any) => Promise<{ success: boolean; pdfData?: string; error?: string }>;
  filePrefix: string;
}

/**
 * ✅ REUSABLE PDF GENERATION & DOCUMENT MANAGEMENT
 * Handles:
 * - PDF generation with title from submission
 * - Old PDF deletion
 * - New PDF upload
 * - Document record management
 * ❌ NO VERIFICATION RESET (let caller handle this)
 */
export async function regeneratePdfWithTitle(options: PdfGenerationOptions) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { submissionId, documentType, pdfData, generatePdfFn, filePrefix } = options;

    console.log(`🔄 Regenerating ${documentType} PDF...`);

    // ✅ FETCH CURRENT TITLE FROM SUBMISSION
    const { data: submission } = await supabase
      .from('research_submissions')
      .select('title')
      .eq('id', submissionId)
      .single();

    if (!submission?.title) {
      console.warn(`⚠️ No title found for submission ${submissionId}`);
    }

    // ✅ INJECT TITLE INTO PDF DATA
    const pdfDataWithTitle = {
      ...pdfData,
      title: submission?.title
    };

    // ✅ GENERATE PDF
    const pdfResult = await generatePdfFn(pdfDataWithTitle);

    if (!pdfResult.success || !pdfResult.pdfData) {
      console.warn(`⚠️ PDF generation failed:`, pdfResult.error);
      return { success: false, error: pdfResult.error };
    }

    // ✅ GET EXISTING DOCUMENT RECORD
    const { data: existingDoc } = await supabase
      .from('uploaded_documents')
      .select('id, file_url')
      .eq('submission_id', submissionId)
      .eq('document_type', documentType)
      .single();

    let documentId: string;

    if (!existingDoc) {
      // ✅ CREATE NEW DOCUMENT ENTRY
      const { data: newDoc, error: docError } = await supabase
        .from('uploaded_documents')
        .insert({
          submission_id: submissionId,
          document_type: documentType,
          file_name: `${filePrefix}_${submissionId}.pdf`,
          file_url: `${submissionId}/${filePrefix}.pdf`,
          file_size: 0,
          uploaded_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (docError) throw docError;
      documentId = newDoc.id;
      console.log(`✅ ${documentType} document entry created`);
    } else {
      documentId = existingDoc.id;

      // ✅ DELETE OLD PDF FROM STORAGE
      if (existingDoc.file_url) {
        try {
          await supabase.storage
            .from('research-documents')
            .remove([existingDoc.file_url]);
          console.log(`✅ Deleted old ${documentType} PDF`);
        } catch (err) {
          console.warn(`⚠️ Could not delete old PDF:`, err);
        }
      }
    }

    // ✅ UPLOAD NEW PDF
    const base64Data = pdfResult.pdfData.includes('base64,')
      ? pdfResult.pdfData.split(',')[1]
      : pdfResult.pdfData;

    const pdfBuffer = Buffer.from(base64Data, 'base64');
    const timestamp = Date.now();
    const pdfPath = `${user.id}/${filePrefix}_${submissionId}_${timestamp}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('research-documents')
      .upload(pdfPath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.warn(`⚠️ PDF upload error:`, uploadError);
      return { success: false, error: uploadError.message };
    }

    // ✅ UPDATE DOCUMENT RECORD
    const { error: updateDocError } = await supabase
      .from('uploaded_documents')
      .update({
        file_name: `${filePrefix}_${submissionId}.pdf`,
        file_size: pdfBuffer.length,
        file_url: pdfPath,
        uploaded_at: new Date().toISOString()
      })
      .eq('id', documentId);

    if (updateDocError) {
      console.warn(`⚠️ Document update error:`, updateDocError);
    } else {
      console.log(`✅ ${documentType} PDF uploaded and linked`);
    }

    // ❌ REMOVED: No verification reset here!

    return { success: true, documentId, pdfPath };

  } catch (error) {
    console.error(`❌ PDF regeneration error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF generation failed'
    };
  }
}

/**
 * ✅ UPDATE SUBMISSION TITLE IN ALL RELATED TABLES
 */
export async function updateSubmissionTitle(
  supabase: any,
  submissionId: string,
  title: string
) {
  try {
    const updates = [];

    // Update research_submissions
    updates.push(
      supabase
        .from('research_submissions')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', submissionId)
    );

    // Update research_protocols
    updates.push(
      supabase
        .from('research_protocols')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('submission_id', submissionId)
    );

    // Execute all updates
    const results = await Promise.all(updates);

    const hasError = results.some(r => r.error);
    if (hasError) {
      console.warn(`⚠️ Some title updates failed`);
    } else {
      console.log(`✅ Title updated in all tables`);
    }

    return { success: !hasError };
  } catch (error) {
    console.error(`❌ Title update error:`, error);
    return { success: false };
  }
}
