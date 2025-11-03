// app/actions/getSubmissionForReview.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSubmissionForReview(submissionId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get submission with assignment details
    const { data: assignment, error: assignmentError } = await supabase
      .from('reviewer_assignments')
      .select(`
        *,
        research_submissions (*)
      `)
      .eq('submission_id', submissionId)
      .eq('reviewer_id', user.id)
      .single();

    if (assignmentError || !assignment) {
      return { success: false, error: 'Submission not found or not assigned to you' };
    }

    const submission = (assignment as any).research_submissions;

    const { data: consolidatedDoc, error: docError } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('document_type', 'consolidated_review')
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .single();

    let pdfUrl = null;
    let pdfFilename = 'Research Document.pdf';

    if (consolidatedDoc && !docError) {
      const { data: urlData } = await supabase.storage
        .from('research-documents')
        .createSignedUrl(consolidatedDoc.file_url, 3600); // 1 hour expiry

      if (urlData?.signedUrl) {
        pdfUrl = urlData.signedUrl;
        pdfFilename = consolidatedDoc.file_name;
      }
    }

    if (!pdfUrl && submission.pdf_url) {
      // If pdf_url is a storage path, create signed URL
      if (submission.pdf_url.includes('research-documents/')) {
        const { data: urlData } = await supabase.storage
          .from('research-documents')
          .createSignedUrl(submission.pdf_url, 3600);
        
        if (urlData?.signedUrl) {
          pdfUrl = urlData.signedUrl;
          pdfFilename = submission.pdf_filename || 'Original Submission.pdf';
        }
      } else {
        // If it's already a public URL
        pdfUrl = submission.pdf_url;
        pdfFilename = submission.pdf_filename || 'Original Submission.pdf';
      }
    }

    // Format the data
    const formattedData = {
      id: submission.id,
      submission_id: submission.submission_id,
      title: submission.title,
      classification_type: submission.classification_type,
      research_description: submission.research_description,
      
      pdf_url: pdfUrl,
      pdf_filename: pdfFilename,
      
      dateSubmitted: new Date(submission.submitted_at).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }),
      dueDate: new Date(assignment.due_date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }),
    };

    return {
      success: true,
      data: formattedData,
    };

  } catch (error) {
    console.error('Error fetching submission for review:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch submission',
    };
  }
}
