'use server';

import { createClient } from '@/utils/supabase/server';
import { PDFDocument } from 'pdf-lib';
import { rgb } from 'pdf-lib';

export async function generateConsolidatedFromDatabase(submissionId: string) {
  try {
    const supabase = await createClient();

    // Get submission for user_id (for folder path)
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('user_id, title')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return { success: false, error: 'Submission not found' };
    }
    const userId = submission.user_id;
    if (!userId) {
      return { success: false, error: 'User ID not found for this submission' };
    }

    // Get all uploaded PDFs for this submission
    const { data: documents } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId);

    // Map document types to file URLs
    const fileMap: Record<string, string> = {};
    for (const doc of documents || []) {
      if (doc.document_type && doc.file_url) {
        fileMap[doc.document_type] = doc.file_url;
      }
    }

    // List the order you want to merge (adjust as needed)
    const mergeOrder = [
      'application_form',
      'research_protocol',
      'consent_form',
      'research_instrument',
      'proposal_defense',
      'endorsement_letter'
    ];

    // Download and load all PDFs in order
    const pdfDocs: PDFDocument[] = [];
    for (const type of mergeOrder) {
      const fileUrl = fileMap[type];
      if (!fileUrl) continue;
      const { data: fileData } = await supabase.storage
        .from('research-documents')
        .download(fileUrl);
      if (fileData) {
        const arrayBuffer = await fileData.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        pdfDocs.push(pdfDoc);
      }
    }

    // Merge all PDFs
    const consolidatedDoc = await PDFDocument.create();
    for (const pdfDoc of pdfDocs) {
      const copiedPages = await consolidatedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach(page => consolidatedDoc.addPage(page));
    }

    // Add page numbers
    const pages = consolidatedDoc.getPages();
    pages.forEach((page, index) => {
      page.drawText(`Page ${index + 1} of ${pages.length}`, {
        x: 265,
        y: 20,
        size: 9,
        color: rgb(0.5, 0.5, 0.5), 
      });
    });

    const pdfBytes = await consolidatedDoc.save();
    const pdfBase64 = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
    const fileName = `UMREC_Consolidated_${submission.title?.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;

    // Upload to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('research-documents')
      .upload(`${userId}/${fileName}`, Buffer.from(pdfBytes), {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: 'Failed to upload PDF' };
    }

    // Save document reference
    const { error: insertError } = await supabase.from('uploaded_documents').insert({
      submission_id: submissionId,
      file_name: fileName,
      file_url: uploadData.path,
      document_type: 'consolidated_application',
      file_size: pdfBytes.length,
    });

    if (insertError) {
      return { success: false, error: 'Failed to save document reference' };
    }

    return { success: true, pdfUrl: uploadData.path };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed' };
  }
}
