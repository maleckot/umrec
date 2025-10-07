// app/staffmodule/reviewers/page.tsx
'use client';

import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SearchBar from '@/components/staff-secretariat-admin/SearchBar';
import DataTable from '@/components/staff-secretariat-admin/DataTable';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { useState } from 'react';

export default function ReviewersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const reviewersData = [
    {
      reviewer: 'Prof. Juan Dela Cruz',
      availability: 'Busy',
      reviewStatus: 'On Track',
      activeReviews: '5 (1 overdue)',
    },
    {
      reviewer: 'Prof. Maria Therese Delos Reyes',
      availability: 'Busy',
      reviewStatus: 'On Track',
      activeReviews: '15 (3 overdue)',
    },
    {
      reviewer: 'Prof. Antonio John Garcia',
      availability: 'Busy',
      reviewStatus: 'On Track',
      activeReviews: '10 (4 overdue)',
    },
  ];

  const columns = [
  {
    key: 'reviewer',
    label: 'REVIEWER',
    align: 'left' as const,
  },
  {
    key: 'availability',
    label: 'AVAILABILITY',
    align: 'center' as const,
    render: (value: string) => (
      <span className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {value}
      </span>
    ),
  },
  {
    key: 'reviewStatus',
    label: 'REVIEW STATUS',
    align: 'center' as const,
    render: (value: string) => (
      <span className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {value}
      </span>
    ),
  },
  {
    key: 'activeReviews',
    label: 'ACTIVE REVIEWS',
    align: 'center' as const,
    render: (value: string) => {
      const hasOverdue = value.includes('overdue');
      return (
        <span className={`text-sm ${hasOverdue ? 'text-red-600 font-semibold' : 'text-gray-800'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {value}
        </span>
      );
    },
  },
];

  const handleRowClick = (row: any) => {
    console.log('Reviewer clicked:', row);
    // Navigate to reviewer detail page or open modal
  };

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewers" activeNav="reviewers">
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '60vh', height: 'auto' }}>
        <SearchBar
          placeholder="Search reviewers..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="flex-1">
          <DataTable
            columns={columns}
            data={reviewersData}
            onRowClick={handleRowClick}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
          resultsText="Showing 5 results"
        />
      </div>
    </DashboardLayout>
  );
}
