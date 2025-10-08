// app/secretariatmodule/reviewers/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReviewersTable from '@/components/staff-secretariat-admin/reviewers/ReviewersTable';
import ReviewersFilters from '@/components/staff-secretariat-admin/reviewers/ReviewersFilters';
import Pagination from '@/components/staff-secretariat-admin/Pagination';

export default function SecretariatReviewersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All availability');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeReviewsFilter, setActiveReviewsFilter] = useState('Any');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Sample reviewers data (same as staff)
  const allReviewersData = [
    {
      id: 1,
      code: '201',
      name: 'Prof. Juan Dela Cruz',
      email: 'email123@umak.edu.ph',
      phone: '09994455353',
      college: 'College of Computing and Information Sciences',
      availability: 'Available',
      reviewStatus: 'On Track',
      activeReviews: 5,
      overdueReviews: 0,
    },
    {
      id: 2,
      code: '201',
      name: 'Prof. Maria Therese Delos Reyes',
      email: 'maria.reyes@umak.edu.ph',
      phone: '09171234567',
      college: 'College of Science',
      availability: 'Busy',
      reviewStatus: 'On Track',
      activeReviews: 15,
      overdueReviews: 0,
    },
    {
      id: 3,
      code: '201',
      name: 'Prof. Antonio John Garcia',
      email: 'antonio.garcia@umak.edu.ph',
      phone: '09181234567',
      college: 'College of Engineering',
      availability: 'Busy',
      reviewStatus: 'On Track',
      activeReviews: 10,
      overdueReviews: 4,
    },
    {
      id: 4,
      code: '201',
      name: 'Prof. Juan Dela Cruz',
      email: 'juan2@umak.edu.ph',
      phone: '09191234567',
      college: 'College of Business Administration',
      availability: 'Available',
      reviewStatus: 'Idle',
      activeReviews: 0,
      overdueReviews: 0,
    },
    {
      id: 5,
      code: '201',
      name: 'Prof. Maria Therese Delos Reyes',
      email: 'maria2@umak.edu.ph',
      phone: '09201234567',
      college: 'College of Education',
      availability: 'Unavailable',
      reviewStatus: 'Unavailable',
      activeReviews: 0,
      overdueReviews: 0,
    },
    ...Array.from({ length: 45 }, (_, i) => ({
      id: i + 6,
      code: '201',
      name: `Prof. Reviewer ${i + 6}`,
      email: `reviewer${i + 6}@umak.edu.ph`,
      phone: `0920123${String(i + 6).padStart(4, '0')}`,
      college: ['College of Computing and Information Sciences', 'College of Science', 'College of Engineering', 'College of Business Administration'][i % 4],
      availability: ['Available', 'Busy', 'Unavailable'][i % 3],
      reviewStatus: ['On Track', 'Idle', 'Unavailable'][i % 3],
      activeReviews: i % 10,
      overdueReviews: i % 5,
    })),
  ];

  const filteredData = useMemo(() => {
    let filtered = [...allReviewersData];

    if (searchQuery) {
      filtered = filtered.filter(reviewer =>
        reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reviewer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reviewer.code.includes(searchQuery)
      );
    }

    if (availabilityFilter !== 'All availability') {
      filtered = filtered.filter(reviewer => reviewer.availability === availabilityFilter);
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(reviewer => reviewer.reviewStatus === statusFilter);
    }

    if (activeReviewsFilter !== 'Any') {
      if (activeReviewsFilter === '0') {
        filtered = filtered.filter(reviewer => reviewer.activeReviews === 0);
      } else if (activeReviewsFilter === '1-5') {
        filtered = filtered.filter(reviewer => reviewer.activeReviews >= 1 && reviewer.activeReviews <= 5);
      } else if (activeReviewsFilter === '6-10') {
        filtered = filtered.filter(reviewer => reviewer.activeReviews >= 6 && reviewer.activeReviews <= 10);
      } else if (activeReviewsFilter === '11+') {
        filtered = filtered.filter(reviewer => reviewer.activeReviews >= 11);
      }
    }

    return filtered;
  }, [searchQuery, availabilityFilter, statusFilter, activeReviewsFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, availabilityFilter, statusFilter, activeReviewsFilter]);

  // FIX #1: Changed from staffmodule to secretariatmodule
  const handleRowClick = (reviewer: any) => {
    router.push(`/secretariatmodule/reviewers/details?id=${reviewer.id}`);
  };

  const resultsText = `Showing ${currentPageData.length} results`;

  return (
    // FIX #2: Changed role from "staff" to "secretariat" and roleTitle from "Staff" to "Secretariat"
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewers" activeNav="reviewers">
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100">
        <ReviewersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          availabilityFilter={availabilityFilter}
          onAvailabilityChange={setAvailabilityFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          activeReviewsFilter={activeReviewsFilter}
          onActiveReviewsChange={setActiveReviewsFilter}
        />

        <ReviewersTable
          reviewers={currentPageData}
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
