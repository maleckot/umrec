// app/adminmodule/researchers/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ResearchersTable from '@/components/admin/researchers/ResearchersTable';
import ResearchersFilters from '@/components/admin/researchers/ResearchersFilters';
import Pagination from '@/components/staff-secretariat-admin/Pagination';

export default function ResearchersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('All organization');
  const [progressFilter, setProgressFilter] = useState('All Progress');
  const [collegeFilter, setCollegeFilter] = useState('Any');
  const [currentPage, setCurrentPage] = useState(1);
  const [researchers, setResearchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  // Mock data - replace with API call
  useEffect(() => {
    loadResearchers();
  }, []);

  const loadResearchers = async () => {
    setLoading(true);
    // TODO: Replace with actual API call
    const mockData = [
      {
        id: '1',
        name: 'Jeon Wonwoo',
        organization: 'External',
        progress: 'New Submission',
        college: 'CCIS'
      },
      {
        id: '2',
        name: 'Choi Seungcheol',
        organization: 'Internal',
        progress: 'Under Review',
        college: 'CTHM'
      },
      {
        id: '3',
        name: 'Lee Seokmin',
        organization: 'External',
        progress: 'Revision',
        college: 'CAD'
      },
      {
        id: '4',
        name: 'Jennie Kim',
        organization: 'External',
        progress: 'Completed',
        college: 'CCIS'
      },
      {
        id: '5',
        name: 'Joshua Hong',
        organization: 'Internal',
        progress: 'Completed',
        college: 'CTHM'
      },
    ];
    
    setResearchers(mockData);
    setLoading(false);
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...researchers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(researcher =>
        researcher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        researcher.college.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Organization filter
    if (organizationFilter !== 'All organization') {
      filtered = filtered.filter(researcher => researcher.organization === organizationFilter);
    }

    // Progress filter - Updated to include "All Progress"
    if (progressFilter !== 'All Progress') {
      filtered = filtered.filter(researcher => researcher.progress === progressFilter);
    }

    // College filter
    if (collegeFilter !== 'Any') {
      filtered = filtered.filter(researcher => researcher.college === collegeFilter);
    }

    return filtered;
  }, [researchers, searchQuery, organizationFilter, progressFilter, collegeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, organizationFilter, progressFilter, collegeFilter]);

  const handleRowClick = (researcher: any) => {
    router.push(`/adminmodule/researchers/details?id=${researcher.id}`);
  };

  const resultsText = `Showing ${currentPageData.length} results`;

  if (loading) {
    return (
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Researchers" activeNav="researchers">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading researchers...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Researchers" activeNav="researchers">
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100">
        <ResearchersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          organizationFilter={organizationFilter}
          onOrganizationChange={setOrganizationFilter}
          progressFilter={progressFilter}
          onProgressChange={setProgressFilter}
          collegeFilter={collegeFilter}
          onCollegeChange={setCollegeFilter}
        />

        <ResearchersTable
          researchers={currentPageData}
          onRowClick={handleRowClick}
        />

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 order-2 sm:order-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {resultsText}
          </p>
          <div className="order-1 sm:order-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              resultsText=""
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
