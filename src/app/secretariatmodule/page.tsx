// app/secretariatmodule/page.tsx
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import StatCard from '@/components/staff-secretariat-admin/StatCard';
import AttentionCard from '@/components/staff-secretariat-admin/AttentionCard';
import { useRouter } from 'next/navigation';
import { getSecretariatDashboardData } from '@/app/actions/secretariat-staff/secretariat/getSecretariatDashboardData';

export default function SecretariatDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const result = await getSecretariatDashboardData();
      if (result.success) {
        setDashboardData(result);
      } else {
        console.error('Failed to load dashboard data:', result.error);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionClick = (submission: any) => {
      if (submission.status === 'Under Classification') {
        router.push(`/secretariatmodule/submissions/details?id=${submission.id}`);
      } 
      else if (submission.status === 'Classified') {
        router.push(`/secretariatmodule/submissions/assign-reviewers?id=${submission.id}`);
      } 
      else if (submission.status === 'Under Review') {
        router.push(`/secretariatmodule/submissions/under-review?id=${submission.id}`);
      } 
      else if (submission.status === 'Approved') {
        router.push(`/secretariatmodule/submissions/review-complete?id=${submission.id}`);
      } 
      else {
        router.push(`/secretariatmodule/submissions/details?id=${submission.id}`);
      }
  };

  const stats = [
    {
      label: 'Total Submissions',
      value: loading ? '...' : (dashboardData?.stats.totalSubmissions || 0).toString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Pending Classification',
      value: loading ? '...' : (dashboardData?.stats.pendingClassification || 0).toString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Active Reviewers',
      value: loading ? '...' : (dashboardData?.stats.activeReviewers || 0).toString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: 'Completed Classifications',
      value: loading ? '...' : (dashboardData?.stats.completedClassifications || 0).toString(),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const recentSubmissions = dashboardData?.recentSubmissions || [];
  const pendingClassification = dashboardData?.pendingClassification || [];

  const needsAttention = [
    {
      id: 1,
      count: dashboardData?.attention.needsClassification || 0,
      message: 'new submissions need document classification',
      subtext: 'These submissions need to be classified before assigning reviewers',
      action: 'Classify Submissions',
      route: '/secretariatmodule/submissions',
    },
    {
      id: 2,
      count: dashboardData?.attention.overdueReviews || 0,
      message: 'reviewers have overdue reviews',
      subtext: 'Some reviewers are late by more than 7 days',
      action: 'View Reviewers',
      route: '/secretariatmodule/reviewers',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Dashboard" activeNav="dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading dashboard data...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Dashboard" activeNav="dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Pending Classification Table */}
      {pendingClassification.length > 0 && (
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h2 className="text-lg lg:text-xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                Pending Classification
              </h2>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Submissions ready for classification
              </p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    TITLE
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    SUBMITTED BY
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    DATE
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingClassification.map((submission: any) => (
                  <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-left">
                      <p className="text-sm text-gray-800 truncate max-w-md" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submission.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        ID: {submission.submissionId}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submission.submittedBy}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submission.date}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => router.push(`/secretariatmodule/submissions/details?id=${submission.id}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        Classify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {pendingClassification.map((submission: any) => (
              <div key={submission.id} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {submission.title}
                </p>
                <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  ID: {submission.submissionId}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      By: {submission.submittedBy}
                    </p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {submission.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/secretariatmodule/submissions/details?id=${submission.id}`)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Classify
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6 lg:mb-8">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            Recent Submissions
          </h2>
          <button
            onClick={() => router.push('/secretariatmodule/submissions')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            View All
          </button>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        No papers to classify yet           
          </p>
          </div>
        ) : (
          <>
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
                  {recentSubmissions.map((submission: any) => (
                    <tr
                      key={submission.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleSubmissionClick(submission)}
                    >
                      <td className="py-4 px-4 text-left">
                        <p className="text-sm text-gray-800 truncate max-w-md" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {submission.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          ID: {submission.submissionId}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {submission.date}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${submission.statusColor}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {submission.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {recentSubmissions.map((submission: any) => (
                <div
                  key={submission.id}
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSubmissionClick(submission)}
                >
                  <p className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submission.title}
                  </p>
                  <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    ID: {submission.submissionId}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {submission.date}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${submission.statusColor}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {submission.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Needs Attention */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
          Needs Attention
        </h2>

        <div className="space-y-4">
          {needsAttention.map((item) => (
            <AttentionCard
              key={item.id}
              count={item.count}
              message={item.message}
              subtext={item.subtext}
              action={item.action}
              onActionClick={() => router.push(item.route)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
