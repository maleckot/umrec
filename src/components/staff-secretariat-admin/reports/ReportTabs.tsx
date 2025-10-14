// components/staff-secretariat-admin/reports/ReportTabs.tsx
'use client';

interface ReportTabsProps {
  activeTab: 'system' | 'submission';
  onTabChange: (tab: 'system' | 'submission') => void;
}

export default function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  const tabs = [
    { id: 'system' as const, label: 'System Usage' },
    { id: 'submission' as const, label: 'Submission Statistics' }
  ];

  return (
    <div className="bg-white rounded-t-xl border-b border-gray-200 mb-6 overflow-x-auto">
      <div className="flex min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-white bg-[#003366]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
