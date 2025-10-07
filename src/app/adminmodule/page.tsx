// app/adminmodule/page.tsx
'use client';

import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const totalSubmissionsStats = [
    { label: 'Pending Review', value: 42, color: 'text-gray-600' },
    { label: 'Under Review', value: 38, color: 'text-gray-600' },
    { label: 'Completed', value: 44, color: 'text-gray-600' },
  ];

  const activeUsersStats = [
    { label: 'Researchers', value: 156, color: 'text-gray-600' },
    { label: 'Reviewers', value: 78, color: 'text-gray-600' },
    { label: 'Staff/Officers', value: 53, color: 'text-gray-600' },
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
    {
      id: 5,
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '08-15-2025',
      status: 'New Submission',
      statusColor: 'text-blue-600 bg-blue-50',
    },
  ];

  const reviewerWorkload = [
    {
      id: 1,
      reviewer: 'Prof. Juan Dela Cruz',
      assigned: 6,
      completed: 3,
      pending: 3,
      overdue: 0,
    },
    {
      id: 2,
      reviewer: 'Prof. Emmanuel Castro Garcia',
      assigned: 7,
      completed: 4,
      pending: 3,
      overdue: 0,
    },
    {
      id: 3,
      reviewer: 'Prof. Josh Maleck Maniego',
      assigned: 8,
      completed: 5,
      pending: 3,
      overdue: 1,
    },
    {
      id: 4,
      reviewer: 'Prof. Christian Delos Santos',
      assigned: 9,
      completed: 6,
      pending: 3,
      overdue: 0,
    },
  ];

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
            124
          </p>
          <div className="space-y-2">
            {totalSubmissionsStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {stat.label}
                </span>
                <span className={`text-sm font-semibold ${stat.color}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {stat.value}
                </span>
              </div>
            ))}
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
            287
          </p>
          <div className="space-y-2">
            {activeUsersStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {stat.label}
                </span>
                <span className={`text-sm font-semibold ${stat.color}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {stat.value}
                </span>
              </div>
            ))}
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
              {recentSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
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
              {reviewerWorkload.map((reviewer) => (
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {reviewerWorkload.map((reviewer) => (
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
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
