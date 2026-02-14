'use client';

import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const FilterBar = ({ searchQuery, setSearchQuery, filterStatus, setFilterStatus }: FilterBarProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-xl mb-8 border border-gray-100/50">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        
        {/* Search Input */}
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#101C50] transition-colors" />
          <input
            type="text"
            placeholder="Search by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/10 focus:outline-none text-[#101C50] text-sm sm:text-base transition-all shadow-sm"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative group sm:w-64">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#101C50] transition-colors pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/10 focus:outline-none text-[#101C50] font-semibold text-sm sm:text-base cursor-pointer appearance-none bg-white transition-all shadow-sm"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option>All Submissions</option>
            <option>Completed</option>
            <option>Overdue</option>
            <option>Pending</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {(searchQuery || filterStatus !== 'All Submissions') && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Active filters:
          </span>
          {searchQuery && (
            <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:bg-blue-200 rounded-full p-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filterStatus !== 'All Submissions' && (
            <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Status: {filterStatus}
              <button onClick={() => setFilterStatus('All Submissions')} className="hover:bg-amber-200 rounded-full p-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
