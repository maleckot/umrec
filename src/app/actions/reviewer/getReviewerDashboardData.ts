// src/app/actions/getReviewerDashboardData.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewerDashboardData() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    console.log('Reviewer user ID:', user.id); 

    // Get reviewer assignments (submissions assigned to this reviewer)
    const { data: assignments, error: assignmentsError } = await supabase
      .from('reviewer_assignments')
      .select(`
        id,
        assigned_at,
        due_date,
        status,
        submission:research_submissions (
          id,
          submission_id,
          title,
          classification_type
        )
      `)
      .eq('reviewer_id', user.id)
      .order('assigned_at', { ascending: false });

    console.log('Assignments query result:', { assignments, error: assignmentsError });  

    if (assignmentsError) {
      console.error('Error fetching assignments:', assignmentsError);
      return { success: false, error: 'Failed to fetch assignments' };
    }

    console.log('Raw assignments:', assignments);  

    // Separate into new and overdue
    const now = new Date();
    const newAssignments = (assignments || [])
      .filter(a => {
        const submission = Array.isArray(a.submission) ? a.submission[0] : a.submission;
        const isValid = submission && a.status === 'pending' && new Date(a.due_date) >= now;
        console.log('Assignment filter:', { a, submission, isValid }); 
        return isValid;
      })
      .map(a => {
        const submission = Array.isArray(a.submission) ? a.submission[0] : a.submission;
        return {
          id: a.id,
          submissionId: submission.id,
          title: submission.title,
          category: submission.classification_type,
          assignedDate: new Date(a.assigned_at).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }),
          dueDate: new Date(a.due_date).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }),
        };
      });

    console.log('Formatted new assignments:', newAssignments);  
    const overdueReviews = (assignments || [])
      .filter(a => {
        const submission = Array.isArray(a.submission) ? a.submission[0] : a.submission;
        return submission && a.status === 'pending' && new Date(a.due_date) < now;
      })
      .map(a => {
        const submission = Array.isArray(a.submission) ? a.submission[0] : a.submission;
        return {
          id: a.id,
          submissionId: submission.id,
          title: submission.title,
          category: submission.classification_type,
          dueDate: new Date(a.due_date).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }),
        };
      });

    // Calculate stats
    const completedCount = (assignments || []).filter(a => a.status === 'review_complete').length;

    return {
      success: true,
      stats: {
        newAssignments: newAssignments.length,
        overdueReviews: overdueReviews.length,
        completedReviews: completedCount,
      },
      newAssignments,
      overdueReviews,
    };

  } catch (error) {
    console.error('Error fetching reviewer dashboard data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch data',
    };
  }
}
