// app/actions/researcher/getSubmissionActivity.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSubmissionActivity(submissionId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { 
        success: false, 
        error: 'User not authenticated',
        submission: null,
        documents: [],
        revisionInfo: null,
        comments: []
      };
    }

    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('user_id', user.id)
      .single();

    if (submissionError || !submission) {
      return { 
        success: false, 
        error: 'Submission not found',
        submission: null,
        documents: [],
        revisionInfo: null,
        comments: []
      };
    }

    // Fetch ALL documents
    const { data: allDocuments, error: docsError } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .order('uploaded_at', { ascending: true });

    const { data: verifications } = await supabase
      .from('document_verifications')
      .select('*')
      .eq('submission_id', submissionId);

    // Fetch comments (anonymous for researchers)
    const { data: commentsData } = await supabase
      .from('submission_comments')
      .select('id, comment_text, created_at')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false });

    let documentsWithUrls = [];
    
    if (allDocuments && allDocuments.length > 0) {
      for (const doc of allDocuments) {
        const verification = verifications?.find(v => v.document_id === doc.id);

        const { data: urlData } = await supabase.storage
          .from('research-documents')
          .createSignedUrl(doc.file_url, 3600);

        if (urlData?.signedUrl) {
          documentsWithUrls.push({
            id: doc.id,
            fileName: doc.file_name,
            fileType: doc.document_type,
            fileUrl: urlData.signedUrl,
            fileSize: doc.file_size,
            uploadedAt: doc.uploaded_at,
            isApproved: verification?.is_approved ?? null,
            needsRevision: verification?.is_approved === false,
            revisionComment: verification?.feedback_comment || null,
          });
        }
      }
    }

    const rejectedDocs = verifications?.filter(v => v.is_approved === false) || [];
    const revisionCount = rejectedDocs.length;

    const rejectedVerification = rejectedDocs[0];
    const revisionMessage = rejectedVerification?.feedback_comment || submission.verification_feedback || '';

    return {
      success: true,
      submission: {
        id: submission.id,
        submissionId: submission.submission_id,
        title: submission.title,
        status: submission.status,
        submittedAt: submission.submitted_at,
      },
      documents: documentsWithUrls,
      revisionInfo: {
        needsRevision: submission.status === 'needs_revision',
        revisionCount: revisionCount,
        message: revisionMessage, 
      },
      comments: commentsData?.map(c => ({
        id: c.id,
        commentText: c.comment_text,
        createdAt: c.created_at,
      })) || [],
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch activity',
      submission: null,
      documents: [],
      revisionInfo: null,
      comments: []
    };
  }
}
