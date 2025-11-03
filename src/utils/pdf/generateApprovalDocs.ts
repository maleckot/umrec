// utils/pdf/generateApprovalDocs.ts (corrected)
import { createClient } from '@/utils/supabase/server';
import { generateCertificatePDF } from './generateCertificate';
import { generateForm0011PDF } from './generateForm0011';
import { generateForm0012PDF } from './generateForm0012';

export async function generateApprovalDocuments(submissionId: string) {
  const supabase = await createClient();

  try {
    console.log('📄 Starting document generation for:', submissionId);

    // 1. Get submission data
// Line 16-27: Change this part ONLY
const { data: submission, error: submissionError } = await supabase
  .from('research_submissions')
  .select(`
    *,
    profiles (
      full_name,
      email,
      organization,
      school,
      college
    )
  `)
  .eq('id', submissionId)
  .single();

// Add error logging BEFORE the check
if (submissionError) {
  console.error('❌ Submission query error:', submissionError);
  throw submissionError;
}


// Line 34-41: Just get reviews WITHOUT profiles join
const { data: reviews, error: reviewsError } = await supabase
  .from('reviews')
  .select(`
    *,
    protocol_answers,
    consent_answers
  `)
  .eq('submission_id', submissionId);

if (reviewsError) {
  console.error('❌ Reviews query error:', reviewsError);
}



if (reviewsError) {
  console.error('❌ Reviews query error:', reviewsError);
}


    // 3. Generate the 3 PDFs
    const certificatePdf = await generateCertificatePDF(submission);
    const form0011Pdf = await generateForm0011PDF(submission, reviews || []); 
    const form0012Pdf = await generateForm0012PDF(submission, reviews || []); 

    // 4. Upload to Supabase Storage
    const uploadPromises = [
      {
        pdf: certificatePdf,
        path: `${submissionId}/certificate-of-approval.pdf`, 
        type: 'certificate_of_approval',
        fileName: 'Certificate of Approval.pdf'
      },
      {
        pdf: form0011Pdf,
        path: `${submissionId}/form-0011-protocol-reviewer.pdf`, 
        type: 'form_0011',
        fileName: 'Form 0011 - Protocol Reviewer Worksheet.pdf'
      },
      {
        pdf: form0012Pdf,
        path: `${submissionId}/form-0012-icf-checklist.pdf`, 
        type: 'form_0012',
        fileName: 'Form 0012 - Informed Consent Checklist.pdf'
      }
    ];

    for (const { pdf, path, type, fileName } of uploadPromises) {
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(path, pdf, {
          contentType: 'application/pdf', // ✅ PDF content type
          upsert: true
        });

      if (uploadError) {
        console.error(`Failed to upload ${type}:`, uploadError);
        throw uploadError;
      }

      // Save record in uploaded_documents table
      const { error: dbError } = await supabase
        .from('uploaded_documents')
        .insert({
          submission_id: submissionId,
          document_type: type,
          file_name: fileName, // ✅ .pdf filename
          file_url: path,
          uploaded_at: new Date().toISOString()
        });

      if (dbError) {
        console.error(`Failed to save ${type} record:`, dbError);
      }
    }

    console.log('✅ All approval documents generated and uploaded as PDFs');
    return { success: true };

  } catch (error) {
    console.error('❌ Error generating approval documents:', error);
    throw error;
  }
}
