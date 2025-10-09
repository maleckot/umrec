// src/app/actions/getSecretariatDashboardData.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSecretariatDashboardData() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get all submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('research_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (submissionsError) {
      return { success: false, error: 'Failed to fetch submissions' };
    }

    // Calculate stats
    const stats = {
      totalSubmissions: submissions.length,
      pendingClassification: submissions.filter(s => s.status === 'under_classification').length,
      activeReviewers: 0, // TODO: Calculate from reviews
      completedClassifications: submissions.filter(s => s.status === 'classified' || s.status === 'under_review').length,
    };

    // Get pending classification submissions (those with consolidated PDFs)
    const pendingClassification = submissions
      .filter(s => s.status === 'under_classification')
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        submissionId: s.submission_id,
        title: s.title,
        submittedBy: `${s.project_leader_first_name} ${s.project_leader_last_name}`,
        date: new Date(s.submitted_at).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }),
        status: 'Under Classification',
        statusColor: 'text-amber-600 bg-amber-50',
      }));

    const recentSubmissions = submissions.slice(0, 4).map(s => {
      const statusMap: any = {
        'submitted': { label: 'New Submission', color: 'text-blue-600 bg-blue-50' },
        'pending_verification': { label: 'New Submission', color: 'text-blue-600 bg-blue-50' },
        'pending_review': { label: 'New Submission', color: 'text-blue-600 bg-blue-50' },
        'under_classification': { label: 'Under Classification', color: 'text-amber-600 bg-amber-50' },
        'awaiting_classification': { label: 'Under Classification', color: 'text-amber-600 bg-amber-50' },
        'classified': { label: 'Classified', color: 'text-amber-600 bg-amber-50' },
        'exempted': { label: 'Exempted', color: 'text-green-600 bg-green-50' },
        'under_review': { label: 'Under Review', color: 'text-purple-600 bg-purple-50' },
        'review_complete': { label: 'Review Complete', color: 'text-green-600 bg-green-50' },
        'approved': { label: 'Approved', color: 'text-green-600 bg-green-50' },
        'rejected': { label: 'Rejected', color: 'text-red-600 bg-red-50' },
        'needs_revision': { label: 'Needs Revision', color: 'text-red-600 bg-red-50' },
        'revision_requested': { label: 'Revision Requested', color: 'text-orange-600 bg-orange-50' },
      };
      const statusInfo = statusMap[s.status] || { label: s.status, color: 'text-gray-600 bg-gray-50' };

      return {
        id: s.id,
        title: s.title,
        submissionId: s.submission_id,
        date: new Date(s.submitted_at).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        }),
        dbStatus: s.status,  // Original database status
        classificationType: s.classification_type, // ✅ Add classification type
        status: statusInfo.label,
        statusColor: statusInfo.color,
      };
    });


    // Attention items
    const attention = {
      needsClassification: stats.pendingClassification,
      overdueReviews: 0, // TODO: Calculate
    };

    return {
      success: true,
      stats,
      recentSubmissions,
      pendingClassification,
      attention,
    };

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch data',
    };
  }
}
