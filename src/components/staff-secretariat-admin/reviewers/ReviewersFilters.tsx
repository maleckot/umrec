// components/staff-secretariat-admin/reviewers/ReviewersFilters.tsx
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
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search reviewers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Availability Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Availability
          </label>
          <select
            value={availabilityFilter}
            onChange={(e) => onAvailabilityChange(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option value="All availability">All availability</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        {/* Review Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Review Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option value="All">All</option>
            <option value="On Track">On Track</option>
            <option value="Idle">Idle</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        {/* Active Reviews Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Active Reviews
          </label>
          <select
            value={activeReviewsFilter}
            onChange={(e) => onActiveReviewsChange(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option value="Any">Any</option>
            <option value="0">0</option>
            <option value="1-5">1-5</option>
            <option value="6-10">6-10</option>
            <option value="11+">11+</option>
          </select>
        </div>
      </div>
    </div>
  );
}
