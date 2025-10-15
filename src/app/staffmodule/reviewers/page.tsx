// app/staffmodule/reviewers/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReviewersTable from '@/components/staff-secretariat-admin/reviewers/ReviewersTable';
import ReviewersFilters from '@/components/staff-secretariat-admin/reviewers/ReviewersFilters';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { getReviewers } from '@/app/actions/secretariat-staff/getReviewers';

export default function ReviewersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All availability');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeReviewsFilter, setActiveReviewsFilter] = useState('Any');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  // Load reviewers from database
  useEffect(() => {
    loadReviewers();
  }, []);

  const loadReviewers = async () => {
    setLoading(true);
    const result = await getReviewers();
    if (result.success) {
      setReviewers(result.reviewers || []);
    } else {
      console.error('Failed to load reviewers:', result.error);
    }
    setLoading(false);
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...reviewers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(reviewer =>
        reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reviewer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reviewer.code.includes(searchQuery)
      );
    }

    // Availability filter
    if (availabilityFilter !== 'All availability') {
      filtered = filtered.filter(reviewer => reviewer.availability === availabilityFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(reviewer => reviewer.reviewStatus === statusFilter);
    }

    // Active reviews filter
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
    router.push(`/staffmodule/reviewers/details?id=${reviewer.id}`);
  };

  const resultsText = `Showing ${currentPageData.length} results`;

  if (loading) {
    return (
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewers" activeNav="reviewers">
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
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewers" activeNav="reviewers">
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
