// app/staffmodule/page.tsx
'use client';

import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import AttentionCard from '@/components/AttentionCard';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const router = useRouter();

  const stats = [
    {
      label: 'Total Submissions',
      value: '124',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Pending Classification',
      value: '38',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Pending Reviews',
      value: '16',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      label: 'Active Reviewers',
      value: '86',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const recentSubmissions = [
    {
      id: 1,
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '07-24-2025',
      status: 'New Submission',
      statusColor: 'text-blue-600 bg-blue-50',
    },
    {
      id: 2,
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '08-03-2025',
      status: 'Under Classification',
      statusColor: 'text-amber-600 bg-amber-50',
    },
    {
      id: 3,
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '08-15-2025',
      status: 'New Submission',
      statusColor: 'text-blue-600 bg-blue-50',
    },
    {
      id: 4,
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '08-15-2025',
      status: 'New Submission',
      statusColor: 'text-blue-600 bg-blue-50',
    },
  ];

  const needsAttention = [
    {
      id: 1,
      count: 2,
      message: 'new submissions need document verification',
      subtext: 'These submissions need to be classified before assigning reviewers',
      action: 'Verify Submissions',
      route: '/staffmodule/submissions/verify',
    },
    {
      id: 2,
      count: 3,
      message: 'reviewers have overdue reviews',
      subtext: 'Some reviewers are late by more than 7 days',
      action: 'View Reviewers',
      route: '/staffmodule/reviewers',
    },
    {
      id: 3,
      count: 3,
      message: 'classified papers need to be assigned to reviewers',
      subtext: 'Assign reviewers to continue the review process',
      action: 'Assign Reviewers',
      route: '/staffmodule/submissions/assign',
    },
  ];

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Dashboard" activeNav="dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6 lg:mb-8">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            Recent Submissions
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            View All
          </button>
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
          DATE
        </th>
        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          STATUS
        </th>
      </tr>
    </thead>
    <tbody>
      {recentSubmissions.map((submission) => (
        <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <td className="py-4 px-4 text-left">
            <p className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {submission.title}
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
          {recentSubmissions.map((submission) => (
            <div key={submission.id} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {submission.title}
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
