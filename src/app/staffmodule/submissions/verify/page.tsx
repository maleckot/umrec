// app/staffmodule/submissions/verify/page.tsx
'use client';

import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SearchBar from '@/components/staff-secretariat-admin/SearchBar';
import DataTable from '@/components/staff-secretariat-admin/DataTable';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getNewSubmissions } from '@/app/actions/secretariat-staff/staff/getNewSubmissions';

export default function VerifySubmissionsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadSubmissions();
  }, [currentPage, searchQuery]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const result = await getNewSubmissions({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        searchQuery,
      });

      if (result.success) {
        setSubmissions(result.data || []);
        setTotalPages(Math.ceil((result.total || 0) / ITEMS_PER_PAGE));
      } else {
        console.error('Failed to load submissions:', result.error);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

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
          className="inline-block px-3 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50" 
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          New Submission
        </span>
      ),
    },
  ];

  // ✅ Same click handler as staff dashboard
  const handleRowClick = (submission: any) => {
    router.push(`/staffmodule/submissions/details?id=${submission.id}`);
  };

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Verify Submissions" activeNav="submissions">
      <div 
        className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 flex flex-col" 
        style={{ minHeight: '60vh', height: 'auto' }}
      >
        <SearchBar
          placeholder="Search submissions..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

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
                No new submissions to verify
              </p>
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {searchQuery ? 'Try adjusting your search' : 'All submissions have been processed'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <DataTable
                columns={columns}
                data={submissions}
                onRowClick={handleRowClick}
              />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              resultsText={`Showing ${submissions.length} of ${submissions.length * totalPages} results`}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
