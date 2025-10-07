// components/SubmissionsTable.tsx
'use client';

import SearchBar from '@/components/staff-secretariat-admin/SearchBar';
import DataTable from '@/components/staff-secretariat-admin/DataTable';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface SubmissionsTableProps {
  data: any[];
  onRowClick?: (row: any) => void;
}

export default function SubmissionsTable({ data, onRowClick }: SubmissionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New Submission':
        return 'text-blue-600 bg-blue-50';
      case 'Under Classification':
        return 'text-amber-600 bg-amber-50';
      case 'Under Review':
        return 'text-purple-600 bg-purple-50';
      case 'Review Complete':
        return 'text-green-600 bg-green-50';
      case 'Unassigned':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'TITLE',
      align: 'left' as const,
    },
    {
      key: 'date',
      label: 'DATE',
      align: 'center' as const,
      render: (value: string) => (
        <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      align: 'center' as const,
      render: (value: string) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '60vh' }}>
      {/* Search Bar */}
      <SearchBar
        placeholder="Search submissions..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Sort Dropdown */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Sort
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="New Submission">New Submission</option>
            <option value="Under Classification">Under Classification</option>
            <option value="Under Review">Under Review</option>
            <option value="Review Complete">Review Complete</option>
            <option value="Unassigned">Unassigned</option>
          </select>
        </div>

        {/* Date Range - Start */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Date Range
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="dd / mm / yyyy"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Date Range - End */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            to
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="dd / mm / yyyy"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <DataTable
            columns={columns}
            data={data}
            onRowClick={onRowClick}
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
          resultsText={`Showing 1 to ${data.length} of ${data.length} results`}
        />
      </div>
    </div>
  );
}
