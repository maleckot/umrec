// components/staff-secretariat-admin/admin-settings/AdminSettingsTabs.tsx
'use client';

interface AdminSettingsTabsProps {
  activeTab: 'downloadable' | 'reviewing' | 'users';
  onTabChange: (tab: 'downloadable' | 'reviewing' | 'users') => void;
}

export default function AdminSettingsTabs({ activeTab, onTabChange }: AdminSettingsTabsProps) {
  const tabs = [
    { id: 'downloadable' as const, label: 'Files', fullLabel: 'Downloadable Files' },
    { id: 'reviewing' as const, label: 'Review', fullLabel: 'Reviewing Details' },
    { id: 'users' as const, label: 'Users', fullLabel: 'User Management' }
  ];

  return (
    <div className="w-full">
      {/* Mobile: Dropdown */}
      <div className="sm:hidden">
        <select
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value as 'downloadable' | 'reviewing' | 'users')}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-semibold text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.fullLabel}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop/Tablet: Tabs */}
      <div className="hidden sm:block bg-white rounded-xl border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#003366] border-[#003366]'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {tab.fullLabel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
