// app/staffmodule/reports/page.tsx
'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReportTabs from '@/components/staff-secretariat-admin/reports/ReportTabs';
import ReportHeader from '@/components/staff-secretariat-admin/reports/ReportHeader';
import SubmissionStatisticsReport from '@/components/staff-secretariat-admin/reports/SubmissionStatisticsReport';
import SystemUsageReport from '@/components/staff-secretariat-admin/reports/SystemUsageReport';

export default function StaffReportsPage() {
  const [activeTab, setActiveTab] = useState<'system' | 'submission'>('submission');
  const [dateRange, setDateRange] = useState('Last Month');

  return (
    <DashboardLayout 
      role="staff" 
      roleTitle="Staff" 
      pageTitle="Reports" 
      activeNav="reports"
    >
      <ReportHeader 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <ReportTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'system' && (
        <SystemUsageReport dateRange={dateRange} />
      )}

      {activeTab === 'submission' && (
        <SubmissionStatisticsReport dateRange={dateRange} />
      )}
    </DashboardLayout>
  );
}
