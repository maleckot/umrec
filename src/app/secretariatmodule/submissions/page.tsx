// app/secretariatmodule/submissions/page.tsx
'use client';

import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SearchBar from '@/components/staff-secretariat-admin/SearchBar';
import DataTable from '@/components/staff-secretariat-admin/DataTable';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllSubmissions } from '@/app/actions/secretariat-staff/getAllSubmissions';

export default function SecretariatSubmissionsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'Newest' | 'Oldest' | 'A-Z' | 'Z-A'>('Newest');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    loadSubmissions();
  }, [currentPage, searchQuery, sortBy, statusFilter, startDate, endDate]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const result = await getAllSubmissions({
        page: currentPage,
        limit: itemsPerPage,
        searchQuery,
        sortBy,
        statusFilter: statusFilter === 'All Statuses' ? undefined : statusFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (result.success) {
        setSubmissions(result.data || []);
        setTotalCount(result.total || 0);
      } else {
        console.error('Failed to load submissions:', result.error);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  function formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'new_submission': 'New Submission',
      'pending_review': 'Review Pending',
      'awaiting_classification': 'Under Classification',
      'under_review': 'Under Review',
      'classified': 'Classified',
      'review_complete': 'Review Complete',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'needs_revision': 'Needs Revision',
      'revision_requested': 'Revision Requested',
    };
    return statusMap[status] || status;
  }

  function getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'new_submission': 'bg-blue-50 text-blue-600',
      'pending_review': 'bg-blue-50 text-blue-600',
      'awaiting_classification': 'bg-amber-50 text-amber-600',
      'under_review': 'bg-purple-50 text-purple-600',
      'classified': 'bg-amber-50 text-amber-600',
      'review_complete': 'bg-green-50 text-green-600',
      'approved': 'bg-green-50 text-green-600',
      'rejected': 'bg-red-50 text-red-600',
      'needs_revision': 'bg-red-50 text-red-600',
      'revision_requested': 'bg-orange-50 text-orange-600',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-600';
  }

  const columns = [
    {
      key: 'title',
      label: 'TITLE',
      align: 'left' as const,
      render: (value: string, row: any) => (
        <div>
          <p className="text-sm text-gray-800 truncate max-w-md" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {value}
          </p>
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            ID: {row.submission_id}
          </p>
        </div>
      ),
    },
    {
      key: 'submitted_at',
      label: 'DATE',
      align: 'center' as const,
      render: (value: string) => (
        <span className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {new Date(value).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      align: 'center' as const,
      render: (value: string) => (
        <span 
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`} 
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {formatStatus(value)}
        </span>
      ),
    },
  ];


  const handleRowClick = (submission: any) => {
      if (submission.status === 'awaiting_classification') {
      router.push(`/secretariatmodule/submissions/details?id=${submission.id}`);
    } 
    else if (submission.status === 'classified') {
      router.push(`/secretariatmodule/submissions/classified?id=${submission.id}`);
    } 
    else if (submission.status === 'under_review') {
      router.push(`/secretariatmodule/submissions/under-review?id=${submission.id}`);
    } 
    else if (submission.status === 'approved') {
      router.push(`/secretariatmodule/submissions/review-complete?id=${submission.id}`);
    } 
    else {
      router.push(`/secretariatmodule/submissions/details?id=${submission.id}`);
    }
  };
  const resultsText = `Showing ${startIndex + 1}-${endIndex} of ${totalCount} results`;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy, startDate, endDate]);

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submissions" activeNav="submissions">
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '60vh' }}>
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
              onChange={(e) => setSortBy(e.target.value as 'Newest' | 'Oldest' | 'A-Z' | 'Z-A')}
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
              <option value="new_submission">New Submission</option>
              <option value="awaiting_classification">Under Classification</option>
              <option value="under_review">Under Review</option>
              <option value="review_complete">Review Complete</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="needs_revision">Needs Revision</option>
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

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Loading submissions...
              </p>
            </div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12">
              <svg 
                className="w-16 h-16 text-gray-300 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <p className="text-gray-500 text-lg mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                No submissions found
              </p>
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {searchQuery || statusFilter !== 'All Statuses' 
                  ? 'Try adjusting your filters' 
                  : 'No submissions have been submitted yet'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-x-auto -mx-3 sm:mx-0">
              <div className="min-w-full inline-block align-middle">
                <DataTable
                  columns={columns}
                  data={submissions}
                  onRowClick={handleRowClick}
                />
              </div>
            </div>

            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                resultsText={resultsText}
              />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
