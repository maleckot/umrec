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

  return (
    <div className="border-b border-gray-200">
      {/* Mobile Dropdown - Enhanced */}
      <div className="md:hidden px-4 sm:px-6 py-4">
        <select
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value as 'personal' | 'account' | 'submission')}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-[#071139] font-bold focus:outline-none focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 bg-white shadow-sm transition-all duration-300"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs - Enhanced */}
      <div className="hidden md:flex min-w-max px-4 sm:px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base font-bold transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-[#071139]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#071139] to-[#F7D117] rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
