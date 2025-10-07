// app/staffmodule/submissions/assign/page.tsx
'use client';

import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SearchBar from '@/components/staff-secretariat-admin/SearchBar';
import DataTable from '@/components/staff-secretariat-admin/DataTable';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { useState } from 'react';

export default function AssignSubmissionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const submissionsData = [
    {
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '07-24-2025',
      status: 'Unassigned',
    },
    {
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '08-03-2025',
      status: 'Unassigned',
    },
    {
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '08-15-2025',
      status: 'Unassigned',
    },
    {
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '08-15-2025',
      status: 'Unassigned',
    },
    {
      title: 'UMREConnect: An AI-Powered Web Application for Document Management...',
      date: '07-24-2025',
      status: 'Unassigned',
    },
  ];

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
      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {value}
      </span>
    ),
  },
];

  const handleRowClick = (row: any) => {
    console.log('Submission clicked:', row);
    // Navigate to reviewer assignment page
  };

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submissions" activeNav="submissions">
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '60vh', height: 'auto' }}>
        <SearchBar
          placeholder="Search submissions..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="flex-1">
          <DataTable
            columns={columns}
            data={submissionsData}
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
