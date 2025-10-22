// app/actions/reviewer/getReviewerAssignments.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewerAssignments() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get all assignments for this reviewer
    const { data: assignments, error: assignmentsError } = await supabase
      .from('reviewer_assignments')
      .select(`
        id,
        submission_id,
        assigned_at,
        due_date,
        status,
        research_submissions (
          id,
          title,
          classification_type,
          submitted_at
        )
      `)
      .eq('reviewer_id', user.id)
      .order('assigned_at', { ascending: false });

    if (assignmentsError) {
      console.error('Error fetching assignments:', assignmentsError);
      return { success: false, error: assignmentsError.message };
    }

    // Get review status for each assignment
    const submissionIds = assignments?.map(a => a.submission_id) || [];
    const { data: reviews } = await supabase
      .from('reviews')
      .select('submission_id, status, submitted_at')
      .eq('reviewer_id', user.id)
      .in('submission_id', submissionIds);

    // Create a map of review status by submission_id
    const reviewStatusMap = new Map(reviews?.map(r => [r.submission_id, r]) || []);

    // Format assignments
    const formattedAssignments = assignments?.map(assignment => {
      // ✅ Handle array from Supabase relationship
      const submission = Array.isArray(assignment.research_submissions) 
        ? assignment.research_submissions[0] 
        : assignment.research_submissions;
      
      const review = reviewStatusMap.get(assignment.submission_id);
      
      // Calculate due date if not set
      const assignedDate = new Date(assignment.assigned_at);
      const calculatedDueDate = new Date(assignedDate);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 30);
      
      const dueDate = assignment.due_date 
        ? new Date(assignment.due_date)
        : calculatedDueDate;

      // Determine status
      let status: 'Completed' | 'Overdue' | 'Pending' = 'Pending';
      const now = new Date();
      
      if (review?.status === 'submitted' || review?.submitted_at) {
        status = 'Completed';
      } else if (now > dueDate) {
        status = 'Overdue';
      }

      return {
        id: assignment.submission_id, // Use submission_id for routing
        title: submission?.title || 'Untitled Submission',
        category: submission?.classification_type || 'Full Review',
        assignedDate: new Date(assignment.assigned_at).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }),
        dueDate: dueDate.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }),
        status
      };
    }) || [];

    return {
      success: true,
      assignments: formattedAssignments,
    };

  } catch (error) {
    console.error('Error in getReviewerAssignments:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load assignments',
    };
  }
}
