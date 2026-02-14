'use client';

import { ChevronDown } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  counts: { current: number; history: number; certificates: number };
}

const TabNavigation = ({ activeTab, setActiveTab, counts }: Props) => {
  return (
    <>
      {/* Mobile Tab Dropdown */}
      <div className="md:hidden p-4 border-b border-gray-100 bg-gray-50/50">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">View Section</label>
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 text-[#101C50] text-sm rounded-xl focus:ring-[#101C50] focus:border-[#101C50] block p-3 pr-10 font-bold"
          >
            <option value="current">Current Reviews ({counts.current})</option>
            <option value="history">Review History ({counts.history})</option>
            <option value="expertise">Expertise & Skills</option>
            <option value="certificates">Certificates ({counts.certificates})</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block border-b border-gray-100">
        <div className="flex">
          {['current', 'history', 'expertise', 'certificates'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-5 text-sm font-bold border-b-2 transition-all capitalize ${
                activeTab === tab
                  ? 'border-[#101C50] text-[#101C50] bg-gray-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab === 'current' ? 'Current Reviews' : tab === 'history' ? 'History' : tab} 
              {tab !== 'expertise' && (
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {(counts as any)[tab]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default TabNavigation;
