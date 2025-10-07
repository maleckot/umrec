// components/staff-secretariat-admin/submission-details/TabNavigation.tsx
interface TabNavigationProps {
  activeTab: 'overview' | 'reviews' | 'history';
  onTabChange: (tab: 'overview' | 'reviews' | 'history') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as any)}
          className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
            activeTab === tab.id
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
          )}
        </button>
      ))}
    </div>
  );
}
