// app/actions/admin/getAdminDashboardData.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getAdminDashboardData() {
  try {
    const supabase = await createClient();

    // Verify user is admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log('❌ Not authenticated');
      return { success: false, error: 'Not authenticated' };
    }

    console.log('✅ User authenticated:', user.id);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log('👤 User role:', profile?.role);

    if (profile?.role !== 'admin') {
      console.log('❌ User is not admin');
      return { success: false, error: 'Unauthorized' };
    }

    // Fetch total submissions with status breakdown
    const { data: allSubmissions } = await supabase
      .from('research_submissions')
      .select('status, created_at');

    console.log('📊 Total submissions:', allSubmissions?.length);

    const totalSubmissions = allSubmissions?.length || 0;
    const pendingReview = allSubmissions?.filter(s => 
      ['new_submission', 'awaiting_classification', 'pending_verification'].includes(s.status)
    ).length || 0;
    const underReview = allSubmissions?.filter(s => 
      ['under_review', 'classified'].includes(s.status)
    ).length || 0;
    const completed = allSubmissions?.filter(s => 
      ['reviewed', 'approved', 'completed'].includes(s.status)
    ).length || 0;

    // Fetch active users count
    const { data: researchers } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'researcher');

    const { data: reviewers } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'reviewer')
      .order('full_name', { ascending: true });

    console.log('👥 Reviewers found:', reviewers?.length);

    const { data: staff } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['staff', 'secretariat', 'admin']);

    const totalUsers = (researchers?.length || 0) + (reviewers?.length || 0) + (staff?.length || 0);

    // Fetch recent submissions (last 5)
    const { data: recentSubmissions, error: submissionsError } = await supabase
      .from('research_submissions')
      .select(`
        id,
        submission_id,
        title,
        status,
        submitted_at,
        classification_type
      `)
      .order('submitted_at', { ascending: false })
      .limit(5);

    if (submissionsError) {
      console.error('❌ Error fetching submissions:', submissionsError);
    }

    // ✅ MANUAL APPROACH - Fetch reviewers and assignments separately
    console.log('📋 Fetching reviewer assignments...');
    
    const { data: allAssignments, error: assignmentsError } = await supabase
      .from('reviewer_assignments')
      .select('id, reviewer_id, status, due_date');

    console.log('📊 Total assignments:', allAssignments?.length);
    console.log('❌ Assignments error:', assignmentsError);

    // ✅ Process reviewer workload by manually joining
    const processedReviewerWorkload = reviewers?.map(reviewer => {
      // Find assignments for this reviewer
      const assignments = allAssignments?.filter(a => a.reviewer_id === reviewer.id) || [];
      
      const assigned = assignments.length;
      const completed = assignments.filter(a => a.status === 'completed').length;
      const pending = assignments.filter(a => a.status === 'pending').length;
      
      const now = new Date();
      const overdue = assignments.filter(a => {
        if (a.status === 'completed') return false;
        if (!a.due_date) return false;
        return new Date(a.due_date) < now;
      }).length;

      console.log(`👤 ${reviewer.full_name}: ${assigned} assigned, ${completed} completed, ${pending} pending, ${overdue} overdue`);

      return {
        id: reviewer.id,
        reviewer: reviewer.full_name || 'Unknown Reviewer',        
        assigned,
        completed,
        pending,
        overdue,
      };
    }) || [];

    console.log('📊 Processed reviewer count:', processedReviewerWorkload.length);

    const result = {
      success: true,
      stats: {
        totalSubmissions,
        pendingReview,
        underReview,
        completed,
        totalUsers,
        researchers: researchers?.length || 0,
        reviewers: reviewers?.length || 0,
        staff: staff?.length || 0,
      },
      recentSubmissions: recentSubmissions || [],
      reviewerWorkload: processedReviewerWorkload,
    };

    console.log('✅ Returning dashboard data with', processedReviewerWorkload.length, 'reviewers');

    return result;

  } catch (error) {
    console.error('❌ Error fetching admin dashboard data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
    };
  }
}
