// app/adminmodule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import { getAdminDashboardData } from '@/app/actions/admin/getAdminDashboardData';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const result = await getAdminDashboardData();
    if (result.success) {
      setDashboardData(result);
    }
    setLoading(false);
  };

  // ✅ Handle submission click with conditional routing
  const handleSubmissionClick = (submission: any) => {

  router.push(`/adminmodule/submissions/details?id=${submission.id}`);

  };

  function formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'new_submission': 'New Submission',
      'pending_review': 'Review Pending',
      'awaiting_classification': 'Under Classification',
      'under_review': 'Under Review',
      'classified': 'Classified',
      'review_complete': 'Review Complete',
      'reviewed': 'Reviewed',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'needs_revision': 'Needs Revision',
      'revision_requested': 'Revision Requested',
      'pending_verification': 'Pending Verification',
      'completed': 'Completed',
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
      'reviewed': 'bg-green-50 text-green-600',
      'approved': 'bg-green-50 text-green-600',
      'rejected': 'bg-red-50 text-red-600',
      'needs_revision': 'bg-red-50 text-red-600',
      'revision_requested': 'bg-orange-50 text-orange-600',
      'pending_verification': 'bg-indigo-50 text-indigo-600',
      'completed': 'bg-emerald-50 text-emerald-600',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-600';
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Admin Dashboard" activeNav="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Admin Dashboard" activeNav="dashboard">
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Failed to load dashboard data
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, recentSubmissions, reviewerWorkload } = dashboardData;

  return (
    <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Admin Dashboard" activeNav="dashboard">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Total Submissions Card */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Total Submissions
            </h3>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-4xl font-bold mb-4" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            {stats.totalSubmissions}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Pending Review
              </span>
              <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stats.pendingReview}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Under Review
              </span>
              <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stats.underReview}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Completed
              </span>
              <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stats.completed}
              </span>
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Active Users
            </h3>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold mb-4" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            {stats.totalUsers}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Researchers
              </span>
              <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stats.researchers}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Reviewers
              </span>
              <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stats.reviewers}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Staff/Officers
              </span>
              <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stats.staff}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6 lg:mb-8">
        <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
          Recent Submissions
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  TITLE
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  DATE
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    No recent submissions
                  </td>
                </tr>
              ) : (
                recentSubmissions.map((submission: any) => (
                  <tr
                    key={submission.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleSubmissionClick(submission)}
                  >
                    <td className="py-4 px-4 text-left">
                      <p className="text-sm text-gray-800 truncate max-w-md" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submission.title}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {formatDate(submission.submitted_at)}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {formatStatus(submission.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {recentSubmissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              No recent submissions
            </p>
          ) : (
            recentSubmissions.map((submission: any) => (
              <div
                key={submission.id}
                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSubmissionClick(submission)}
              >
                <p className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {submission.title}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {formatDate(submission.submitted_at)}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {formatStatus(submission.status)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reviewer Workload */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
          Reviewer Workload
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  REVIEWER
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  ASSIGNED
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  COMPLETED
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  PENDING
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  OVERDUE
                </th>
              </tr>
            </thead>
            <tbody>
              {reviewerWorkload.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    No reviewers found
                  </td>
                </tr>
              ) : (
                reviewerWorkload.map((reviewer: any) => (
                  <tr key={reviewer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-left">
                      <p className="text-sm text-gray-800 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {reviewer.reviewer}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {reviewer.assigned}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {reviewer.completed}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {reviewer.pending}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className={`text-sm font-semibold ${reviewer.overdue > 0 ? 'text-red-600' : 'text-gray-600'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {reviewer.overdue}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {reviewerWorkload.length === 0 ? (
            <p className="text-center text-gray-500 py-8" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              No reviewers found
            </p>
          ) : (
            reviewerWorkload.map((reviewer: any) => (
              <div key={reviewer.id} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {reviewer.reviewer}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Assigned:</span>
                    <span className="font-semibold text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.assigned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Completed:</span>
                    <span className="font-semibold text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Pending:</span>
                    <span className="font-semibold text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Overdue:</span>
                    <span className={`font-semibold ${reviewer.overdue > 0 ? 'text-red-600' : 'text-gray-800'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.overdue}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
