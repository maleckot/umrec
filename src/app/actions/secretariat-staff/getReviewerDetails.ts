 ///app/actions/staff/getReviewerDetails.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewerDetails(reviewerId: string) {
  try {
    const supabase = await createClient();

    // Verify user is staff/secretariat/admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // ✅ Allow staff, secretariat, and admin
    if (!['staff', 'secretariat', 'admin'].includes(profile?.role || '')) {
      return { success: false, error: 'Unauthorized' };
    }
    // Fetch reviewer profile
    const { data: reviewer, error: reviewerError } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, college, reviewer_code, availability_status')
      .eq('id', reviewerId)
      .eq('role', 'reviewer')
      .single();

    if (reviewerError) {
      console.error('Error fetching reviewer:', reviewerError);
      return { success: false, error: reviewerError.message };
    }

    // ✅ Fetch assignments WITHOUT nested query
    const { data: assignments } = await supabase
      .from('reviewer_assignments')
      .select('id, submission_id, status, due_date, assigned_at')
      .eq('reviewer_id', reviewerId)
      .order('assigned_at', { ascending: false });

    // ✅ Get all submission IDs
    const submissionIds = assignments?.map(a => a.submission_id).filter(Boolean) || [];

    // ✅ Fetch submissions separately
    const { data: submissions } = await supabase
      .from('research_submissions')
      .select('id, submission_id, title, status')
      .in('id', submissionIds);

    // ✅ Manually join the data
    const assignmentsWithSubmissions = assignments?.map(assignment => {
      const submission = submissions?.find(s => s.id === assignment.submission_id);
      return {
        ...assignment,
        research_submission: submission, // ✅ Single object
      };
    }) || [];

    // Separate current and completed reviews
    const currentReviews = assignmentsWithSubmissions.filter(a => 
      a.status === 'pending' || a.status === 'in_progress'
    );

    const reviewHistory = assignmentsWithSubmissions.filter(a => 
      a.status === 'completed'
    );

    // Calculate stats
    const activeReviews = currentReviews.length;
    const now = new Date();
    const overdueReviews = currentReviews.filter(a => {
      if (!a.due_date) return false;
      return new Date(a.due_date) < now;
    }).length;

    let reviewStatus = 'Idle';
    if (reviewer.availability_status === 'unavailable') {
      reviewStatus = 'Unavailable';
    } else if (activeReviews > 0) {
      reviewStatus = overdueReviews > 0 ? 'Overdue' : 'On Track';
    }

    console.log('✅ Fetched reviewer details for:', reviewer.full_name);

    return {
      success: true,
      reviewer: {
        id: reviewer.id,
        name: reviewer.full_name,
        email: reviewer.email || 'N/A',
        phone: reviewer.phone || 'N/A',
        college: reviewer.college || 'N/A',
        code: reviewer.reviewer_code || 'N/A',
        availability: reviewer.availability_status || 'Available',
        reviewStatus,
        activeReviews,
        overdueReviews,
      },
      currentReviews: currentReviews.map(a => ({
        id: a.research_submission?.id || 'N/A', // ✅ Direct access
        title: a.research_submission?.title || 'Untitled', // ✅ Direct access
        dueDate: a.due_date ? new Date(a.due_date).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }) : 'N/A',
        status: a.due_date && new Date(a.due_date) < now ? 'Overdue' : 'Under Review',
      })),
      reviewHistory: reviewHistory.map(a => ({
        id: a.research_submission?.id || 'N/A', // ✅ Direct access
        title: a.research_submission?.title || 'Untitled', // ✅ Direct access
        completedDate: a.due_date ? new Date(a.due_date).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }) : 'N/A',
        status: 'Review Complete',
      })),
    };

  } catch (error) {
    console.error('Error in getReviewerDetails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reviewer details',
    };
  }
}
