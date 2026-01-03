'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReportTabs from '@/components/staff-secretariat-admin/reports/ReportTabs';
import ReportHeader from '@/components/staff-secretariat-admin/reports/ReportHeader';
import SubmissionStatisticsReport from '@/components/staff-secretariat-admin/reports/SubmissionStatisticsReport';
import SystemUsageReport from '@/components/staff-secretariat-admin/reports/SystemUsageReport';

export default function SecretariatReportsPage() {
  const [activeTab, setActiveTab] = useState<'system' | 'submission'>('submission');
  const [dateRange, setDateRange] = useState('Last Month');

  return (
    <DashboardLayout 
      role="secretariat" 
      roleTitle="Secretariat" 
      pageTitle="Reports" 
      activeNav="reports"
    >
      <div className="max-w-[1600px] mx-auto w-full pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[80vh]">
          
          {/* Header Section */}
          <div className="p-6 lg:p-8 border-b border-gray-100">
            <ReportHeader 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>

          {/* Tabs Section */}
          <div className="px-6 lg:px-8 border-b border-gray-100 bg-gray-50/30">
            <ReportTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8 bg-gray-50/30">
            <div className="animate-in fade-in duration-300">
              {activeTab === 'system' && (
                <SystemUsageReport dateRange={dateRange} />
              )}

              {activeTab === 'submission' && (
                <SubmissionStatisticsReport dateRange={dateRange} />
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
