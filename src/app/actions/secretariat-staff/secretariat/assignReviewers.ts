// src/app/actions/assignReviewers.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function assignReviewers(
  submissionId: string,
  reviewerIds: string[]
) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Calculate due date (e.g., 14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create reviewer assignments
    const assignments = reviewerIds.map(reviewerId => ({
      submission_id: submissionId,
      reviewer_id: reviewerId,
      assigned_at: new Date().toISOString(),
      due_date: dueDate.toISOString(),
      status: 'pending',
    }));

    const { error: assignError } = await supabase
      .from('reviewer_assignments')
      .insert(assignments);

    if (assignError) {
      console.error('Error assigning reviewers:', assignError);
      return { success: false, error: 'Failed to assign reviewers' };
    }

    // Update submission status to 'under_review'
    const { error: updateError } = await supabase
      .from('research_submissions')
      .update({ status: 'under_review' })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Error updating submission:', updateError);
      return { success: false, error: 'Failed to update submission status' };
    }

    return { 
      success: true,
      assignmentCount: reviewerIds.length 
    };

  } catch (error) {
    console.error('Error assigning reviewers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to assign reviewers',
    };
  }
}
