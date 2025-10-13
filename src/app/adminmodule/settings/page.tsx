// app/adminmodule/settings/page.tsx
'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import AdminSettingsTabs from '@/components/staff-secretariat-admin/admin-settings/AdminSettingsTabs';
import DownloadableFiles from '@/components/staff-secretariat-admin/admin-settings/DownloadableFiles';
import ReviewingDetails from '@/components/staff-secretariat-admin/admin-settings/ReviewingDetails';
import UserManagement from '@/components/staff-secretariat-admin/admin-settings/UserManagement';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'downloadable' | 'reviewing' | 'users'>('downloadable');

  return (
    <DashboardLayout 
      role="admin" 
      roleTitle="Admin" 
      pageTitle="Settings" 
      activeNav="settings"
    >
      <div className="w-full min-w-0 max-w-full">
        <div className="space-y-6">
          <AdminSettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="w-full min-w-0">
            {activeTab === 'downloadable' && <DownloadableFiles />}
            {activeTab === 'reviewing' && <ReviewingDetails />}
            {activeTab === 'users' && <UserManagement />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
