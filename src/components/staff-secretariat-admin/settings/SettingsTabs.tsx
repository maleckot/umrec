// components/staff-secretariat-admin/settings/SettingsTabs.tsx
'use client';

interface SettingsTabsProps {
  activeTab: 'general' | 'notifications' | 'security';
  onTabChange: (tab: 'general' | 'notifications' | 'security') => void;
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs = [
    { id: 'general' as const, label: 'General' },
    { id: 'notifications' as const, label: 'Notifications' }
  ];

  return (
    <div className="bg-white rounded-xl border-b border-gray-200 overflow-x-auto">
      <div className="flex min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'text-[#003366] border-[#003366]'
                : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
