'use server';

import { createClient } from '@/utils/supabase/server';
import { sendReviewerNotification } from './sendReviewerNotification';

export async function assignReviewers(
  submissionId: string,
  reviewerIds: string[],
  dueDate?: string
) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get submission details
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('title, submission_id')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return { success: false, error: 'Submission not found' };
    }

    // Calculate due date if not provided
    const reviewDueDate = dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    // Assign reviewers
    const assignments = reviewerIds.map(reviewerId => ({
      submission_id: submissionId,
      reviewer_id: reviewerId,
      assigned_at: new Date().toISOString(),
      due_date: reviewDueDate,
      status: 'pending',
    }));

    const { error: assignError } = await supabase
      .from('reviewer_assignments')
      .insert(assignments);

    if (assignError) {
      console.error('Assignment error:', assignError);
      return { success: false, error: 'Failed to assign reviewers' };
    }

    // Update submission status
    const { error: updateError } = await supabase
      .from('research_submissions')
      .update({ status: 'under_review' })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Status update error:', updateError);
      return { success: false, error: 'Failed to update submission status' };
    }

    // Get reviewer details and send emails
    const { data: reviewers, error: reviewersError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', reviewerIds);

    if (!reviewersError && reviewers) {
      // Send email to each reviewer
      for (const reviewer of reviewers) {
        try {
          await sendReviewerNotification(
            reviewer.email,
            reviewer.full_name || 'Reviewer',
            submission.title,
            submission.submission_id,
            reviewDueDate
          );
        } catch (emailError) {
          console.error(`Failed to send email to ${reviewer.email}:`, emailError);
          // Continue even if email fails - assignment is still successful
        }
      }
    }

    return {
      success: true,
      assignmentCount: reviewerIds.length,
      message: 'Reviewers assigned and notified successfully',
    };
  } catch (error) {
    console.error('Assign reviewers error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign reviewers',
    };
  }
}
