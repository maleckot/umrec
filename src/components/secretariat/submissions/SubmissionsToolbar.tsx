'use client';

import { Calendar, Filter, ArrowUpDown } from 'lucide-react';
import SearchBar from '@/components/staff-secretariat-admin/SearchBar';

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchPlaceholder: string;
  sortBy: any;
  setSortBy: (val: any) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
}

const SubmissionsToolbar = ({
  searchQuery, setSearchQuery, searchPlaceholder, sortBy, setSortBy, 
  statusFilter, setStatusFilter, startDate, setStartDate, endDate, setEndDate 
}: Props) => {
  return (
    <div className="border-b border-gray-100 bg-white p-5 lg:p-8">
      <div className="flex flex-col gap-6">
        
        <div className="w-full relative">
          <SearchBar
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
          
          <div className="relative group">
            <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>Sort Order</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-12 pl-4 pr-10 text-sm font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-[#101C50] cursor-pointer appearance-none transition-all"
              >
                <option value="Newest">Newest First</option>
                <option value="Oldest">Oldest First</option>
                <option value="A-Z">Title (A-Z)</option>
                <option value="Z-A">Title (Z-A)</option>
              </select>
              <ArrowUpDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="relative group">
            <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>Filter Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 pl-4 pr-10 text-sm font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-[#101C50] cursor-pointer appearance-none transition-all"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="awaiting_classification">Under Classification</option>
                <option value="under_review">Under Review</option>
                <option value="review_complete">Review Complete</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs_revision">Needs Revision</option>
                <option value="conflict_of_interest">Conflict of Interest</option>
              </select>
              <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="relative group">
            <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>From</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                className="w-full h-12 pl-4 pr-10 text-sm font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-[#101C50] transition-all placeholder-gray-400"
              />
              <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="relative group">
            <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>To</label>
            <div className="relative">
              <input
                type="text"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                className="w-full h-12 pl-4 pr-10 text-sm font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-[#101C50] transition-all placeholder-gray-400"
              />
              <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubmissionsToolbar;
