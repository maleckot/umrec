// components/staff-secretariat-admin/reports/SystemUsageReport.tsx
'use client';

import StatCard from './StatCard';
import UsageLineChart from './UsageLineChart';
import UserRoleTable from './UserRoleTable';

interface SystemUsageReportProps {
  dateRange: string;
}

export default function SystemUsageReport({ dateRange }: SystemUsageReportProps) {
  const stats = {
    totalUsers: 1245,
    activeSessions: 87,
    avgSessionDuration: '18m 42s',
    submissionViews: 28429
  };

  const userRoleData = [
    { role: 'Researchers', activeUsers: 542, avgTime: '22m 15s' },
    { role: 'Reviewers', activeUsers: 128, avgTime: '45m 33s' },
    { role: 'Staff', activeUsers: 78, avgTime: '1h 12m' },
    { role: 'Officers', activeUsers: 24, avgTime: '38m 51s' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards with Color Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          bgColor="bg-[#C9E4F5]"
          textColor="text-[#003366]"
        />
        <StatCard
          label="Active Sessions"
          value={stats.activeSessions}
          bgColor="bg-[#87CEEB]"
          textColor="text-[#003366]"
        />
        <StatCard
          label="Avg. Session Duration"
          value={stats.avgSessionDuration}
          bgColor="bg-[#F7D117]"
          textColor="text-[#003366]"
          isTime
        />
        <StatCard
          label="Submission Views"
          value={stats.submissionViews}
          bgColor="bg-[#E0C8A0]"
          textColor="text-[#003366]"
        />
      </div>

      {/* Usage Chart */}
      <UsageLineChart />

      {/* User Role Table */}
      <UserRoleTable users={userRoleData} />
    </div>
  );
}
