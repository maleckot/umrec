// app/actions/admin/getReviewers.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewers() {
  try {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated', reviewers: [] };

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (adminProfile?.role !== 'admin') return { success: false, error: 'Unauthorized', reviewers: [] };

    // Get all reviewers
    const { data: reviewers } = await supabase
      .from('profiles')
      .select('id, full_name, email, availability_status, college, expertise_areas')
      .eq('role', 'reviewer')
      .order('full_name', { ascending: true });

    // For each reviewer, get assignments (to compute active/overdue)
    const reviewersWithStats = await Promise.all(
      (reviewers || []).map(async (reviewer) => {
        const { data: assignments } = await supabase
          .from('reviewer_assignments')
          .select('id, status, due_date')
          .eq('reviewer_id', reviewer.id);

        const now = new Date();
        const notCompleted = (assignments || []).filter(a => a.status !== 'completed');
        const activeReviews = notCompleted.length;
        const overdue = (assignments || []).filter(a => a.status !== 'completed' && a.due_date && new Date(a.due_date) < now).length;

        let reviewStatus = 'Idle';
        if (reviewer.availability_status === 'unavailable') reviewStatus = 'Unavailable';
        else if (overdue > 0) reviewStatus = 'Overdue';
        else if (activeReviews > 0) reviewStatus = 'On Track';

        return {
          id: reviewer.id,
          name: reviewer.full_name,
          availability: reviewer.availability_status === 'available' ? 'Available' : reviewer.availability_status === 'unavailable' ? 'Unavailable' : 'Busy',
          reviewStatus,
          activeReviews: overdue > 0 ? `${activeReviews} (${overdue} overdue)` : activeReviews,
          college: reviewer.college || 'N/A',
          expertiseAreas: reviewer.expertise_areas || [],
          email: reviewer.email,
        };
      })
    );

    return { success: true, reviewers: reviewersWithStats };
  } catch (e) {
    return { success: false, error: 'Failed to fetch reviewers', reviewers: [] };
  }
}
