// components/admin/researchers/ResearchersFilters.tsx
'use client';

import { Search } from 'lucide-react';

interface ResearchersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  organizationFilter: string;
  onOrganizationChange: (value: string) => void;
  progressFilter: string;
  onProgressChange: (value: string) => void;
  collegeFilter: string;
  onCollegeChange: (value: string) => void;
}

export default function ResearchersFilters({
  searchQuery,
  onSearchChange,
  organizationFilter,
  onOrganizationChange,
  progressFilter,
  onProgressChange,
  collegeFilter,
  onCollegeChange,
}: ResearchersFiltersProps) {
  return (
    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Search reviewers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Organization Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Organization
          </label>
          <select
            value={organizationFilter}
            onChange={(e) => onOrganizationChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option>All organization</option>
            <option>Internal</option>
            <option>External</option>
          </select>
        </div>

        {/* Progress Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Progress
          </label>
          <select
            value={progressFilter}
            onChange={(e) => onProgressChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option>All Progress</option>
            <option>New Submission</option>
            <option>Under Review</option>
            <option>Revision</option>
            <option>Completed</option>
          </select>
        </div>

        {/* College Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            College
          </label>
          <select
            value={collegeFilter}
            onChange={(e) => onCollegeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option>Any</option>
            <option>CCIS</option>
            <option>CTHM</option>
            <option>CAD</option>
            <option>CBA</option>
            <option>CEA</option>
          </select>
        </div>
      </div>
    </div>
  );
}
