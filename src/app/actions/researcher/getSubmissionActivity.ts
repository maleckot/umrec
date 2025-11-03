'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSubmissionActivity(submissionId: string, targetDocId?: string) {
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
        submissionComments: [],
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
        submissionComments: [],
        comments: []
      };
    }

    const { data: allDocuments, error: docsError } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .order('uploaded_at', { ascending: true });

    const { data: verifications } = await supabase
      .from('document_verifications')
      .select('*')
      .eq('submission_id', submissionId);

    // ✅ FETCH SUBMISSION COMMENTS (with id, comment_text, created_at)
    const { data: submissionCommentData } = await supabase
      .from('submission_comments')
      .select('id, comment_text, created_at')
      .eq('submission_id', submissionId)
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });

    let documentsWithUrls = [];
    let specificDocRevisionCount = 0;
    
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
            revisionCount: doc.revision_count || 0,
          });

          if (targetDocId) {
            const docIdStr = String(doc.id);
            if (docIdStr === targetDocId && verification?.is_approved === false) {
              specificDocRevisionCount = doc.revision_count || 0;
            }
          } else if (verification?.is_approved === false && specificDocRevisionCount === 0) {
            specificDocRevisionCount = doc.revision_count || 0;
          }
        }
      }
    }

    const rejectedDocs = verifications?.filter(v => v.is_approved === false) || [];

    // ✅ COLLECT ALL FEEDBACK (for backward compatibility)
    const allFeedback: Array<{ text: string; date: string; source: string }> = [];
    
    // Add document verification feedback
    rejectedDocs.forEach(doc => {
      if (doc.feedback_comment) {
        allFeedback.push({
          text: doc.feedback_comment,
          date: doc.verified_at || doc.created_at,
          source: 'document_verification'
        });
      }
    });
    
    // Add submission comments to feedback
    if (submissionCommentData && submissionCommentData.length > 0) {
      submissionCommentData.forEach(comment => {
        allFeedback.push({
          text: comment.comment_text,
          date: comment.created_at,
          source: 'submission_comment'
        });
      });
    }
    
    const sortedFeedback = allFeedback
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const uniqueFeedback = sortedFeedback.filter((feedback, index, self) =>
      index === self.findIndex(f => f.text.toLowerCase().trim() === feedback.text.toLowerCase().trim())
    );

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
        revisionCount: specificDocRevisionCount,
        message: uniqueFeedback[0]?.text || '',
      },
      // ✅ NEW: Submission-level comments (for all revision components)
      submissionComments: submissionCommentData?.map(c => ({
        id: `submission-${c.id}`,
        commentText: c.comment_text,
        createdAt: c.created_at,
      })) || [],
      // Keep for backward compatibility
      comments: uniqueFeedback.map((f, index) => ({
        id: `feedback-${index}`,
        commentText: f.text,
        createdAt: f.date,
      })),
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch activity',
      submission: null,
      documents: [],
      revisionInfo: null,
      submissionComments: [],
      comments: []
    };
  }
}
