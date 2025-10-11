// src/app/actions/getStaffDashboardData.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getStaffDashboardData() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // 1. Get total submissions count
    const { count: totalSubmissions } = await supabase
      .from('research_submissions')
      .select('*', { count: 'exact', head: true });

    // 2. Get pending classification count
    const { count: pendingClassification } = await supabase
      .from('research_submissions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['awaiting_classification', 'pending_review']);

    // 3. Get under review count
    const { count: underReview } = await supabase
      .from('research_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'under_review');

    // 4. Get active reviewers count
    const { count: activeReviewers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'reviewer');

    // 5. Get recent submissions
    const { data: recentSubmissions, error: submissionsError } = await supabase
      .from('research_submissions')
      .select('id, submission_id, title, submitted_at, status')
      .order('submitted_at', { ascending: false })
      .limit(10);

    if (submissionsError) throw submissionsError;

    // 6. Get submissions needing verification
    const { count: needsVerification } = await supabase
      .from('research_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new_submission');

    // 7. Get classified submissions needing reviewer assignment
    const { count: needsAssignment } = await supabase
      .from('research_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'classified');

    // 8. Get overdue reviews - DEBUG VERSION
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // First, check if we can read the table AT ALL
    const { data: testData, error: testError } = await supabase
      .from('reviewer_assignments')
      .select('*')
      .limit(1);

    console.log('🟢 Can read reviewer_assignments?', { 
      hasData: !!testData, 
      error: testError?.message 
    });

    // Now try the count query for reviews overdue by MORE than 7 days
    const { count: overdueCount, error: countError } = await supabase
      .from('reviewer_assignments')
      .select('*', { count: 'exact', head: true })
      .lte('due_date', sevenDaysAgo.toISOString())  // ✅ due_date <= 7 days ago

    console.log('🔴 Overdue (>7 days) query result:', { 
      count: overdueCount, 
      sevenDaysAgo: sevenDaysAgo.toISOString(),
      error: countError?.message 
    });


    return {
      success: true,
      stats: {
        totalSubmissions: totalSubmissions || 0,
        pendingClassification: pendingClassification || 0,
        underReview: underReview || 0,
        activeReviewers: activeReviewers || 0,
      },
      recentSubmissions: (recentSubmissions || []).map(sub => ({
        id: sub.id,
        submissionId: sub.submission_id,
        title: sub.title,
        date: new Date(sub.submitted_at).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }),
        status: formatStatus(sub.status),
        statusColor: getStatusColor(sub.status),
      })),
      attention: {
        needsVerification: needsVerification || 0,
        overdueReviews: overdueCount || 0,  
        needsAssignment: needsAssignment || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching staff dashboard data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
    };
  }
}

function formatStatus(status: string): string {
  const statusMap: { [key: string]: string } = {
    'new_submission': 'New Submission',
    'pending_review': 'Review Pending',
    'awaiting_classification': 'Under Classification',
    'under_review': 'Under Review',
    'classified': 'Classified',
    'review_complete': 'Review Complete',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'needs_revision': 'Needs Revision',
    'revision_requested': 'Revision Requested',
  };
  return statusMap[status] || status;
}

function getStatusColor(status: string): string {
  const colorMap: { [key: string]: string } = {
    'new_submission': 'bg-blue-50 text-blue-600',
    'pending_review': 'bg-blue-50 text-blue-600',
    'awaiting_classification': 'bg-amber-50 text-amber-600',
    'under_review': 'bg-purple-50 text-purple-600',
    'classified': 'bg-amber-50 text-amber-600',
    'review_complete': 'bg-green-50 text-green-600',
    'approved': 'bg-green-50 text-green-600',
    'rejected': 'bg-red-50 text-red-600',
    'needs_revision': 'bg-red-50 text-red-600',
    'revision_requested': 'bg-orange-50 text-orange-600',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-600';
}
