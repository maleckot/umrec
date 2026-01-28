'use client';

import { ChevronDown } from 'lucide-react';

interface AdminSettingsTabsProps {
  activeTab: 'downloadable' | 'reviewing' | 'users' | 'homepage'; // Added 'homepage'
  onTabChange: (tab: 'downloadable' | 'reviewing' | 'users' | 'homepage') => void;
}

export default function AdminSettingsTabs({ activeTab, onTabChange }: AdminSettingsTabsProps) {
  const tabs = [
    { id: 'homepage' as const, label: 'Homepage', fullLabel: 'Homepage Content' }, // New Tab
    { id: 'downloadable' as const, label: 'Files', fullLabel: 'Downloadable Files' },
    { id: 'reviewing' as const, label: 'Review', fullLabel: 'Reviewing Details' },
    { id: 'users' as const, label: 'Users', fullLabel: 'User Management' }
  ];

  return (
    <div className="w-full">
      {/* Mobile: Dropdown */}
      <div className="sm:hidden mb-6">
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value as any)}
            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#101C50] focus:border-[#101C50] block p-3 pr-10 font-bold shadow-sm"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.fullLabel}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Desktop/Tablet: Tabs */}
      <div className="hidden sm:flex border-b border-gray-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-[#101C50]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {tab.fullLabel}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#101C50] rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
