// app/secretariatmodule/submissions/page.tsx
'use client';

import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SearchBar from '@/components/staff-secretariat-admin/SearchBar';
import DataTable from '@/components/staff-secretariat-admin/DataTable';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function SecretariatSubmissionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const submissionsData = [
    {
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '07-24-2025',
      status: 'Under Classification',
    },
    {
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '08-03-2025',
      status: 'Unassigned',
    },
    {
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '08-15-2025',
      status: 'Under Review',
    },
    {
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '08-15-2025',
      status: 'Review Complete',
    },
  ];

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

  const handleRowClick = (row: any) => {
    console.log('Submission clicked:', row);
    // Navigate to submission detail page
  };

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submissions" activeNav="submissions">
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

          {/* Status Filter Dropdown */}
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
              <option value="Under Classification">Under Classification</option>
              <option value="Under Review">Under Review</option>
              <option value="Review Complete">Review Complete</option>
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>
          {/* Date Range - Start Date */}
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
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = 'text';
                }}
                className="w-full px-3 sm:px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Calendar className="text-gray-400" size={16} />
              </div>
            </div>
          </div>


               {/* Date Range - End Date */}
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
      onBlur={(e) => {
        if (!e.target.value) e.target.type = 'text';
      }}
      className="w-full px-3 sm:px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      style={{ fontFamily: 'Metropolis, sans-serif' }}
    />
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <Calendar className="text-gray-400" size={16} />
    </div>
  </div>
</div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-full inline-block align-middle">
            <DataTable
              columns={columns}
              data={submissionsData}
              onRowClick={handleRowClick}
            />
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
            resultsText="Showing 4 results"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
