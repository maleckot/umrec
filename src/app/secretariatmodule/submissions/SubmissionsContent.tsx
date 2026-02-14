'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import SubmissionsToolbar from '@/components/secretariat/submissions/SubmissionsToolbar';
import SubmissionsTable from '@/components/secretariat/submissions/SubmissionsTable';
import MobileSubmissionsList from '@/components/secretariat/submissions/MobileSubmissionsList';
import { getSecretariatSubmissions } from '@/app/actions/secretariat-staff/secretariat/getSecretariatSubmissions';

export default function SubmissionsContent() {
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
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search submissions...');

  const itemsPerPage = 10;

  useEffect(() => {
    loadSubmissions();
  }, [currentPage, searchQuery, sortBy, statusFilter, startDate, endDate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSearchPlaceholder('Search title or ID...');
      else setSearchPlaceholder('Search submissions by title, ID, or author...');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const result = await getSecretariatSubmissions({
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
      } else console.error('Failed to load submissions:', result.error);
    } catch (error) { console.error('Error loading submissions:', error); }
    finally { setLoading(false); }
  };

  const handleRowClick = (submission: any) => {
    const statusRoutes: { [key: string]: string } = {
      'awaiting_classification': `/secretariatmodule/submissions/details?id=${submission.id}`,
      'classified': `/secretariatmodule/submissions/assign-reviewers?id=${submission.id}`,
      'pending': `/secretariatmodule/submissions/assign-reviewers?id=${submission.id}`,
      'conflict_of_interest': `/secretariatmodule/submissions/resolve-conflict?id=${submission.id}`,
      'needs_revision': `/secretariatmodule/submissions/under-revision?id=${submission.id}`,
      'under_review': `/secretariatmodule/submissions/under-review?id=${submission.id}`,
      'approved': `/secretariatmodule/submissions/review-complete?id=${submission.id}`,
      'review_complete': `/secretariatmodule/submissions/review-complete?id=${submission.id}`,
    };
    router.push(statusRoutes[submission.status] || `/secretariatmodule/submissions/details?id=${submission.id}`);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);
  const resultsText = `Showing ${startIndex + 1}-${endIndex} of ${totalCount} results`;

  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, sortBy, startDate, endDate]);

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submissions" activeNav="submissions">
      <div className="max-w-[1600px] mx-auto w-full pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden transition-all hover:shadow-md">
          
          <SubmissionsToolbar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder={searchPlaceholder}
            sortBy={sortBy}
            setSortBy={setSortBy}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />

          <div className="flex-1 bg-white p-4 lg:p-8">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#101C50] mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium tracking-wide text-sm">LOADING DATA...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center opacity-70">
                <Search className="text-gray-300 mb-4" size={48} />
                <p className="text-[#101C50] text-lg font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>No submissions found</p>
                <p className="text-gray-500 text-sm font-medium">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <SubmissionsTable submissions={submissions} onRowClick={handleRowClick} />
                  <MobileSubmissionsList submissions={submissions} onRowClick={handleRowClick} />
                  
                  <div className="mt-auto border-t border-gray-100 pt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      resultsText={resultsText}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
