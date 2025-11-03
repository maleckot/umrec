// app/staffmodule/reviewers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SearchBar from '@/components/staff-secretariat-admin/SearchBar';
import DataTable from '@/components/staff-secretariat-admin/DataTable';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { getReviewers } from '@/app/actions/secretariat-staff/getReviewers';

interface ReviewerRow {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  availability: string;
  reviewStatus: string;
  activeReviews: number;
  overdueReviews: number;
}

const ITEMS_PER_PAGE = 10;

export default function ReviewersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [allReviewers, setAllReviewers] = useState<ReviewerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all reviewers on mount
  useEffect(() => {
    const loadReviewers = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getReviewers();
        if (result.success) {
          setAllReviewers(result.reviewers || []);  // ✅ Add || [] here
        } else {
          setError(result.error || 'Failed to fetch reviewers');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReviewers();
  }, []);


  // Filter reviewers based on search query
  const filteredReviewers = allReviewers.filter(reviewer =>
    reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reviewer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reviewer.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate filtered results
  const totalPages = Math.ceil(filteredReviewers.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReviewers = filteredReviewers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const columns = [
    {
      key: 'name',
      label: 'REVIEWER',
      align: 'left' as const,
    },
    {
      key: 'availability',
      label: 'AVAILABILITY',
      align: 'center' as const,
      render: (value: string) => {
        const colorClass = value === 'Available'
          ? 'text-green-600'
          : value === 'Busy'
            ? 'text-orange-600'
            : 'text-red-600';
        return (
          <span className={`text-sm font-medium ${colorClass}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'reviewStatus',
      label: 'REVIEW STATUS',
      align: 'center' as const,
      render: (value: string) => {
        const colorClass = value === 'Overdue'
          ? 'text-red-600 font-semibold'
          : value === 'On Track'
            ? 'text-green-600'
            : 'text-gray-600';
        return (
          <span className={`text-sm ${colorClass}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'activeReviews',
      label: 'ACTIVE REVIEWS',
      align: 'center' as const,
      render: (value: number, row: ReviewerRow) => {
        const hasOverdue = row.overdueReviews > 0;
        const displayText = hasOverdue
          ? `${value} (${row.overdueReviews} overdue)`
          : `${value}`;
        return (
          <span
            className={`text-sm ${hasOverdue ? 'text-red-600 font-semibold' : 'text-gray-800'}`}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {displayText}
          </span>
        );
      },
    },
  ];

  const handleRowClick = (row: ReviewerRow) => {
    console.log('Reviewer clicked:', row);
    // Navigate to reviewer detail page
    router.push(`/staffmodule/reviewers/details?id=${row.id}`);
  };

  const resultsText = filteredReviewers.length === 0
    ? 'No reviewers found'
    : `Showing ${startIdx + 1}-${Math.min(startIdx + ITEMS_PER_PAGE, filteredReviewers.length)} of ${filteredReviewers.length} results`;

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewers" activeNav="reviewers">
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '60vh', height: 'auto' }}>
        <SearchBar
          placeholder="Search by name, email, or code..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="flex-1">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading reviewers...</span>
            </div>
          ) : paginatedReviewers.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-gray-500">No reviewers found</span>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={paginatedReviewers}
              onRowClick={handleRowClick}
            />
          )}
        </div>

        {!loading && filteredReviewers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            resultsText={resultsText}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
