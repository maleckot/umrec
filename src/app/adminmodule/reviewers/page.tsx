// app/adminmodule/reviewers/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReviewersTable from '@/components/admin/reviewers/ReviewersTable';
import ReviewersFilters from '@/components/admin/reviewers/ReviewersFilters';
import Pagination from '@/components/staff-secretariat-admin/Pagination';

export default function ReviewersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All availability');
  const [statusFilter, setStatusFilter] = useState('All Status'); // Changed default
  const [activeReviewsFilter, setActiveReviewsFilter] = useState('Any');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  // Mock data - replace with API call
  useEffect(() => {
    loadReviewers();
  }, []);

  const loadReviewers = async () => {
    setLoading(true);
    // TODO: Replace with actual API call
    const mockData = [
      {
        id: '1',
        name: 'Prof. Juan Dela Cruz',
        availability: 'Available',
        reviewStatus: 'On Track',
        activeReviews: 5
      },
      {
        id: '2',
        name: 'Prof. Maria Therese Delos Reyes',
        availability: 'Busy',
        reviewStatus: 'On Track',
        activeReviews: 15
      },
      {
        id: '3',
        name: 'Prof. Antonio John Garcia',
        availability: 'Busy',
        reviewStatus: 'On Track',
        activeReviews: '10 (4 overdue)'
      },
      {
        id: '4',
        name: 'Prof. Juan Dela Cruz',
        availability: 'Available',
        reviewStatus: 'Idle',
        activeReviews: 0
      },
      {
        id: '5',
        name: 'Prof. Maria Therese Delos Reyes',
        availability: 'Unavailable',
        reviewStatus: 'Unavailable',
        activeReviews: 0
      },
    ];
    
    setReviewers(mockData);
    setLoading(false);
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...reviewers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(reviewer =>
        reviewer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Availability filter
    if (availabilityFilter !== 'All availability') {
      filtered = filtered.filter(reviewer => reviewer.availability === availabilityFilter);
    }

    // Status filter - Updated to include "All Status"
    if (statusFilter !== 'All Status') {
      filtered = filtered.filter(reviewer => reviewer.reviewStatus === statusFilter);
    }

    // Active Reviews filter
    if (activeReviewsFilter !== 'Any') {
      filtered = filtered.filter(reviewer => {
        const count = typeof reviewer.activeReviews === 'number' ? reviewer.activeReviews : 0;
        return count.toString() === activeReviewsFilter;
      });
    }

    return filtered;
  }, [reviewers, searchQuery, availabilityFilter, statusFilter, activeReviewsFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, availabilityFilter, statusFilter, activeReviewsFilter]);

  const handleRowClick = (reviewer: any) => {
    router.push(`/adminmodule/reviewers/details?id=${reviewer.id}`);
  };

  const resultsText = `Showing ${currentPageData.length} results`;

  if (loading) {
    return (
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Reviewers" activeNav="reviewers">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading reviewers...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Reviewers" activeNav="reviewers">
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
