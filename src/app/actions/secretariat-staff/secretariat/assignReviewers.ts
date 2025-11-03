'use server';

import { createClient } from '@/utils/supabase/server';
import { sendReviewerNotification } from './sendReviewerNotification';
import { revalidatePath } from 'next/cache';

export async function assignReviewers(
  submissionId: string,
  reviewerIds: string[],
  dueDate?: string
) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('title, submission_id')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return { success: false, error: 'Submission not found' };
    }

    const reviewDueDate = dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    // ✅ Get existing assignments (ANY status: pending or review_complete)
    const { data: existingAssignments } = await supabase
      .from('reviewer_assignments')
      .select('reviewer_id, id')
      .eq('submission_id', submissionId);

    const existingReviewerMap = new Map(
      existingAssignments?.map(a => [a.reviewer_id, a.id]) || []
    );

    const toUpdate: string[] = [];
    const toInsert: string[] = [];

    for (const reviewerId of reviewerIds) {
      if (existingReviewerMap.has(reviewerId)) {
        toUpdate.push(reviewerId); // Already assigned - just reset to pending
      } else {
        toInsert.push(reviewerId); // New reviewer
      }
    }

    // ✅ UPDATE existing assignments to pending (whether pending or review_complete)
    if (toUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from('reviewer_assignments')
        .update({
          status: 'pending', // Reset to pending so they can re-review
          due_date: reviewDueDate,
          assigned_at: new Date().toISOString(),
        })
        .eq('submission_id', submissionId)
        .in('reviewer_id', toUpdate);

      if (updateError) {
        console.error('Update error:', updateError);
        return { success: false, error: 'Failed to update reviewer assignments' };
      }
    }

    // ✅ INSERT new assignments
    if (toInsert.length > 0) {
      const newAssignments = toInsert.map(reviewerId => ({
        submission_id: submissionId,
        reviewer_id: reviewerId,
        assigned_at: new Date().toISOString(),
        due_date: reviewDueDate,
        status: 'pending',
      }));

      const { error: insertError } = await supabase
        .from('reviewer_assignments')
        .insert(newAssignments);

      if (insertError) {
        console.error('Insert error:', insertError);
        return { success: false, error: 'Failed to insert new reviewer assignments' };
      }
    }

    // Update submission status
    const { error: updateError } = await supabase
      .from('research_submissions')
      .update({
        status: 'under_review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Status update error:', updateError);
      return { success: false, error: 'Failed to update submission status' };
    }

    // Send emails only to new reviewers
    if (toInsert.length > 0) {
      const { data: reviewers } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', toInsert);

      if (reviewers) {
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
          }
        }
      }
    }

    revalidatePath(`/secretariatmodule/submissions/${submissionId}`);
    revalidatePath('/secretariatmodule/submissions');

    return {
      success: true,
      updated: toUpdate.length,
      inserted: toInsert.length,
      message: `Reviewers assigned: ${toUpdate.length} reset to pending, ${toInsert.length} newly assigned`,
    };
  } catch (error) {
    console.error('Assign reviewers error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign reviewers',
    };
  }
}
