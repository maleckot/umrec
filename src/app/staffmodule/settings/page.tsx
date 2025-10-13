// app/staffmodule/settings/page.tsx
'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SettingsTabs from '@/components/staff-secretariat-admin/settings/SettingsTabs';
import SystemSettings from '@/components/staff-secretariat-admin/settings/SystemSettings';
import NotificationSettings from '@/components/staff-secretariat-admin/settings/NotificationSettings';
import ReminderSettings from '@/components/staff-secretariat-admin/settings/ReminderSettings';

export default function StaffSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security'>('general');

  return (
    <DashboardLayout 
      role="staff" 
      roleTitle="Staff" 
      pageTitle="Settings" 
      activeNav="settings"
    >
      <div className="space-y-6">
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'general' && (
          <div className="space-y-6">
            <SystemSettings />
            <ReminderSettings />
          </div>
        )}

        {activeTab === 'notifications' && (
          <NotificationSettings />
        )}
      </div>
    </DashboardLayout>
  );
}
