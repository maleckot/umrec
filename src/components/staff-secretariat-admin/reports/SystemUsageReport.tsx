// components/staff-secretariat-admin/reports/SystemUsageReport.tsx
'use client';

import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import UsageLineChart from './UsageLineChart';
import UserRoleTable from './UserRoleTable';
import { getSystemUsageData } from '@/app/actions/getReportsData';

interface SystemUsageReportProps {
  dateRange: string;
}

export default function SystemUsageReport({ dateRange }: SystemUsageReportProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadSystemUsageData();
  }, [dateRange]);

  const loadSystemUsageData = async () => {
    setLoading(true);
    const result = await getSystemUsageData(dateRange);
    
    if (result.success) {
      setData(result);
    } else {
      console.error('Failed to load system usage:', result.error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Loading system usage data...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          No data available
        </p>
      </div>
    );
  }

  const { stats, userRoleData, dailyActivity } = data;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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
      <UsageLineChart data={dailyActivity} />

      {/* User Role Table */}
      <UserRoleTable users={userRoleData} />
    </div>
  );
}
