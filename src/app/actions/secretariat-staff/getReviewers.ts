// app/actions/staff/getReviewers.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewers() {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // ✅ Allow staff, secretariat, and admin
    if (!['staff', 'secretariat', 'admin'].includes(profile?.role || '')) {
      return { success: false, error: 'Unauthorized' };
    }

    // Fetch all reviewers
    const { data: reviewers, error: reviewersError } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, college, organization, availability_status, reviewer_code')
      .eq('role', 'reviewer')
      .order('full_name', { ascending: true });

    if (reviewersError) {
      console.error('Error fetching reviewers:', reviewersError);
      return { success: false, error: reviewersError.message };
    }

    // Fetch all reviewer assignments to calculate workload
    const { data: allAssignments } = await supabase
      .from('reviewer_assignments')
      .select('id, reviewer_id, status, due_date');

    // Process reviewer data
    const processedReviewers = reviewers?.map((reviewer) => {
      const assignments = allAssignments?.filter(a => a.reviewer_id === reviewer.id) || [];
      const activeReviews = assignments.filter(a => a.status === 'pending' || a.status === 'in_progress').length;
      
      // Calculate overdue reviews
      const now = new Date();
      const overdueReviews = assignments.filter(a => {
        if (a.status === 'completed') return false;
        if (!a.due_date) return false;
        return new Date(a.due_date) < now;
      }).length;

      // Determine review status
      let reviewStatus = 'Idle';
      if (reviewer.availability_status === 'unavailable') {
        reviewStatus = 'Unavailable';
      } else if (activeReviews > 0) {
        reviewStatus = overdueReviews > 0 ? 'Overdue' : 'On Track';
      }

      // Determine availability based on active reviews
      let availability = reviewer.availability_status || 'Available';
      if (activeReviews >= 10) {
        availability = 'Busy';
      } else if (activeReviews === 0 && reviewer.availability_status !== 'unavailable') {
        availability = 'Available';
      }

      return {
        id: reviewer.id,
        code: reviewer.reviewer_code || 'N/A',
        name: reviewer.full_name,
        email: reviewer.email || 'N/A',
        phone: reviewer.phone || 'N/A',
        college: reviewer.college || 'N/A',
        availability,
        reviewStatus,
        activeReviews,
        overdueReviews,
      };
    });

    console.log('✅ Fetched', processedReviewers?.length, 'reviewers');

    return {
      success: true,
      reviewers: processedReviewers || [],
    };

  } catch (error) {
    console.error('Error in getReviewers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reviewers',
    };
  }
}
