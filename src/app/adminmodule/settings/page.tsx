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
      <div className="max-w-[1600px] mx-auto w-full pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[80vh]">
          
          {/* Header & Tabs Section */}
          <div className="border-b border-gray-100 bg-white">
            <div className="p-6 lg:p-8 pb-0">
               <h1 className="text-2xl font-bold text-[#101C50] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  System Settings
               </h1>
               <AdminSettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8 bg-gray-50/30">
            <div className="animate-in fade-in duration-300">
              {activeTab === 'downloadable' && <DownloadableFiles />}
              {activeTab === 'reviewing' && <ReviewingDetails />}
              {activeTab === 'users' && <UserManagement />}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
