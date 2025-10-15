// components/researcher/profile/ProfileTabs.tsx
'use client';

interface ProfileTabsProps {
  activeTab: 'personal' | 'account' | 'submission';
  onTabChange: (tab: 'personal' | 'account' | 'submission') => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    { id: 'personal' as const, label: 'Personal Information' },
    { id: 'account' as const, label: 'Account Details' },
    { id: 'submission' as const, label: 'My Submission' }
  ];

  const getTabLabel = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    return tab ? tab.label : '';
  };

  return (
    <div className="border-b border-gray-200">
      {/* Mobile Dropdown */}
      <div className="md:hidden px-4 sm:px-6 py-3">
        <select
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value as 'personal' | 'account' | 'submission')}
          className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 text-[#003366] font-semibold focus:outline-none focus:border-[#003366] bg-white"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex min-w-max px-4 sm:px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'text-[#003366] border-[#003366]'
                : 'text-gray-600 border-transparent hover:text-gray-900'
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
