'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewerEvaluations(submissionId: string) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get submission details directly
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError) {
      console.error('Error fetching submission:', submissionError);
      return { success: false, error: 'Submission not found' };
    }

    // Get consolidated document
    const { data: consolidatedDoc } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('document_type', 'consolidated_application')
      .single();

    // ✅ Generate signed URL for the consolidated document
    let signedUrl = null;
    if (consolidatedDoc?.file_url) {
      const { data: urlData } = await supabase.storage
        .from('research-documents')
        .createSignedUrl(consolidatedDoc.file_url, 3600); // 1 hour expiry
      signedUrl = urlData?.signedUrl;
    }

    // Get all reviews for this submission
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('submission_id', submissionId)
      .order('submitted_at', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return { success: false, error: reviewsError.message };
    }

    // Get reviewer profiles for all reviews
    const reviewerIds = reviews?.map(r => r.reviewer_id) || [];
    const { data: reviewers } = await supabase
      .from('profiles')
      .select('id, full_name, reviewer_code')
      .in('id', reviewerIds);

    // Create a map of reviewer info
    const reviewerMap = new Map(reviewers?.map(r => [r.id, r]) || []);

    // Get all review IDs to fetch replies
    const reviewIds = reviews?.map(r => r.id) || [];

    // Fetch all replies for these reviews
    const { data: allReplies } = await supabase
      .from('review_replies')
      .select('*')
      .in('review_id', reviewIds)
      .order('created_at', { ascending: true });

    // Get reviewer profiles for reply authors
    const replyReviewerIds = allReplies?.map(r => r.reviewer_id) || [];
    const { data: replyReviewers } = await supabase
      .from('profiles')
      .select('id, full_name, reviewer_code')
      .in('id', replyReviewerIds);

    // Create a map for reply reviewers
    const replyReviewerMap = new Map(replyReviewers?.map(r => [r.id, r]) || []);

    // Group replies by review_id
    const repliesByReview: { [key: string]: any[] } = {};
    allReplies?.forEach(reply => {
      if (!repliesByReview[reply.review_id]) {
        repliesByReview[reply.review_id] = [];
      }
      const replyReviewer = replyReviewerMap.get(reply.reviewer_id);
      repliesByReview[reply.review_id].push({
        id: reply.id,
        reviewerId: reply.reviewer_id,
        name: replyReviewer?.full_name || 'Reviewer',
        code: replyReviewer?.reviewer_code || 'N/A',
        date: new Date(reply.created_at).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric'
        }),
        text: reply.reply_text,
      });
    });

    // Format the evaluations for display with replies
    const evaluations = reviews?.map(review => {
      const reviewer = reviewerMap.get(review.reviewer_id);
      return {
        id: review.id,
        reviewerId: review.reviewer_id,
        name: reviewer?.full_name || 'Reviewer',
        code: reviewer?.reviewer_code || 'N/A',
        date: review.submitted_at ? new Date(review.submitted_at).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric'
        }) : 'N/A',
        decision: review.recommendation || 'Pending',
        ethicsRecommendation: review.ethics_recommendation || 'No recommendation provided',
        technicalSuggestions: review.technical_suggestions || 'No suggestions provided',
        status: review.status || 'draft',
        replies: repliesByReview[review.id] || []
      };
    }) || [];

    // Get assignment info for due date
    const { data: assignment } = await supabase
      .from('reviewer_assignments')
      .select('assigned_at')
      .eq('submission_id', submissionId)
      .eq('reviewer_id', user.id)
      .maybeSingle();

    // Calculate due date
    const assignedDate = assignment?.assigned_at 
      ? new Date(assignment.assigned_at) 
      : new Date(submission.submitted_at);
    const dueDate = new Date(assignedDate);
    dueDate.setDate(dueDate.getDate() + 30);

    return {
      success: true,
      evaluations,
      currentReviewerId: user.id,
      submission: {
        id: submission.id,
        title: submission.title,
        description: submission.description || 'No description provided',
        category: submission.classification_category || 'Full Review',
        assignedDate: assignedDate.toLocaleDateString('en-US'),
        submittedDate: new Date(submission.submitted_at).toLocaleDateString('en-US'),
        dueDate: dueDate.toLocaleDateString('en-US'),
        status: submission.status,
      },
      consolidatedDocument: consolidatedDoc ? {
        name: consolidatedDoc.file_name,
        url: signedUrl, // ✅ Return signed URL instead of file path
        uploadedAt: consolidatedDoc.uploaded_at
      } : null
    };

  } catch (error) {
    console.error('Error in getReviewerEvaluations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load evaluations',
    };
  }
}
