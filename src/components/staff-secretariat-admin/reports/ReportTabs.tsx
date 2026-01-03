'use client';

import { PieChart, Activity, ChevronDown } from 'lucide-react';

interface ReportTabsProps {
  activeTab: 'system' | 'submission';
  onTabChange: (tab: 'system' | 'submission') => void;
}

export default function ReportTabs({ activeTab, onTabChange }: ReportTabsProps) {
  const tabs = [
    { id: 'submission' as const, label: 'Submission Statistics', icon: PieChart },
    { id: 'system' as const, label: 'System Usage', icon: Activity }
  ];

  return (
    <div className="w-full">
      {/* 
        Mobile View: Dropdown Selection 
        Visible only on small screens (md:hidden)
      */}
      <div className="md:hidden py-4">
        <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2 block">
          Select Report View
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {activeTab === 'submission' ? (
              <PieChart size={18} className="text-[#101C50]" />
            ) : (
              <Activity size={18} className="text-[#101C50]" />
            )}
          </div>
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value as 'system' | 'submission')}
            className="w-full appearance-none bg-white border border-gray-200 text-[#101C50] text-sm rounded-xl focus:ring-2 focus:ring-[#101C50]/20 focus:border-[#101C50] block p-3 pl-10 pr-10 font-bold shadow-sm transition-all cursor-pointer"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* 
        Desktop View: Horizontal Tabs
        Visible only on medium screens and up (hidden md:block)
      */}
      <div className="hidden md:block w-full overflow-x-auto no-scrollbar">
        <div className="flex min-w-max gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'border-[#101C50] text-[#101C50]'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-50 text-[#101C50]' : 'bg-transparent group-hover:bg-gray-100'
                }`}>
                  <Icon size={18} />
                </div>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
