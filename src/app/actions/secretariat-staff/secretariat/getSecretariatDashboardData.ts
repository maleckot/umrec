// app/actions/getSecretariatDashboardData.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSecretariatDashboardData() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // 1. Total submissions
    const { count: totalSubmissions } = await supabase
      .from('research_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status','awaiting_classification ');

    // 2. Pending classification (new submissions not yet classified)
    // Change this query (line ~22-25)
  const { count: pendingClassification } = await supabase
    .from('research_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'awaiting_classification'); // Changed from 'new_submission'


    // 3. Active reviewers
    const { data: activeReviewersData } = await supabase
      .from('reviewer_assignments')
      .select('reviewer_id')
      .is('completed_at', null);
    
    const activeReviewers = new Set(activeReviewersData?.map(r => r.reviewer_id)).size;

    // 4. Completed classifications (all classified submissions)
      const { count: completedClassifications } = await supabase
        .from('research_submissions')
        .select('*', { count: 'exact', head: true })
        .not('classification_type', 'in', '("", null)'); // Exclude empty and null


    const { data: recentSubmissions } = await supabase
      .from('research_submissions')
      .select('id, submission_id, title, submitted_at, status')
      .eq('status', 'awaiting_classification')
      .order('submitted_at', { ascending: false })
      .limit(5);


    // 6. Pending classification list with submitter info
    const { data: pendingClassificationList } = await supabase
      .from('research_submissions')
      .select(`
        id,
        submission_id,
        title,
        submitted_at,
        profiles:user_id (full_name)
      `)
      .eq('status', 'awaiting_classification') 
      .order('submitted_at', { ascending: true })
      .limit(5);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: overdueReviews } = await supabase
      .from('reviewer_assignments')
      .select('*', { count: 'exact', head: true })
      .lte('due_date', sevenDaysAgo.toISOString())

    // Format data
    const formattedRecentSubmissions = recentSubmissions?.map(sub => ({
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
    })) || [];

    const formattedPendingClassification = pendingClassificationList?.map(sub => ({
      id: sub.id,
      submissionId: sub.submission_id,
      title: sub.title,
      submittedBy: (sub.profiles as any)?.full_name || 'Unknown',
      date: new Date(sub.submitted_at).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }),
    })) || [];

    return {
      success: true,
      stats: {
        totalSubmissions: totalSubmissions || 0,
        pendingClassification: pendingClassification || 0,
        activeReviewers: activeReviewers || 0,
        completedClassifications: completedClassifications || 0,
      },
      recentSubmissions: formattedRecentSubmissions,
      pendingClassification: formattedPendingClassification,
      attention: {
        needsClassification: pendingClassification || 0,
        overdueReviews: overdueReviews || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching secretariat dashboard data:', error);
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
