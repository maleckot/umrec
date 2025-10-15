// components/admin/reviewers/ReviewersFilters.tsx
'use client';

import { Search } from 'lucide-react';

interface ReviewersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  availabilityFilter: string;
  onAvailabilityChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  activeReviewsFilter: string;
  onActiveReviewsChange: (value: string) => void;
}

export default function ReviewersFilters({
  searchQuery,
  onSearchChange,
  availabilityFilter,
  onAvailabilityChange,
  statusFilter,
  onStatusChange,
  activeReviewsFilter,
  onActiveReviewsChange,
}: ReviewersFiltersProps) {
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
        {/* Availability Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Availability
          </label>
          <select
            value={availabilityFilter}
            onChange={(e) => onAvailabilityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option>All availability</option>
            <option>Available</option>
            <option>Busy</option>
            <option>Unavailable</option>
          </select>
        </div>

        {/* Review Status Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Review Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option>All Status</option>
            <option>On Track</option>
            <option>Idle</option>
            <option>Unavailable</option>
          </select>
        </div>

        {/* Active Reviews Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Active Reviews
          </label>
          <select
            value={activeReviewsFilter}
            onChange={(e) => onActiveReviewsChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option>Any</option>
            <option>0</option>
            <option>5</option>
            <option>10</option>
            <option>15</option>
          </select>
        </div>
      </div>
    </div>
  );
}
