'use client';

import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SearchBar from '@/components/staff-secretariat-admin/SearchBar';
import DataTable from '@/components/staff-secretariat-admin/DataTable';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { useState, useEffect } from 'react';
import { Calendar, Filter, ArrowUpDown, Search, ChevronRight, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSecretariatSubmissions } from '@/app/actions/secretariat-staff/secretariat/getSecretariatSubmissions';

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
  
  // Responsive Placeholder State
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search submissions...');

  const itemsPerPage = 10;

  useEffect(() => {
    loadSubmissions();
  }, [currentPage, searchQuery, sortBy, statusFilter, startDate, endDate]);

  // Dynamic Placeholder Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // Small screens
        setSearchPlaceholder('Search title or ID...');
      } else { // Desktop
        setSearchPlaceholder('Search submissions by title, ID, or author...');
      }
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
      'resubmit': 'Resubmit',
    };
    return statusMap[status] || status;
  }

  function getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'new_submission': 'bg-blue-50 text-blue-700 border-blue-200',
      'pending_review': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'awaiting_classification': 'bg-amber-50 text-amber-700 border-amber-200',
      'under_review': 'bg-violet-50 text-violet-700 border-violet-200',
      'classified': 'bg-teal-50 text-teal-700 border-teal-200',
      'review_complete': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'approved': 'bg-green-50 text-green-700 border-green-200',
      'rejected': 'bg-rose-50 text-rose-700 border-rose-200',
      'needs_revision': 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colorMap[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  }

  const handleRowClick = (submission: any) => {
    if (submission.status === 'awaiting_classification') router.push(`/secretariatmodule/submissions/details?id=${submission.id}`);
    else if (submission.status === 'classified') router.push(`/secretariatmodule/submissions/assign-reviewers?id=${submission.id}`);
    else if (submission.status === 'pending') router.push(`/secretariatmodule/submissions/assign-reviewers?id=${submission.id}`);
     else if (submission.status === 'conflict_of_interest') router.push(`/secretariatmodule/submissions/resolve-conflict?id=${submission.id}`);
    else if (submission.status === 'needs_revision') router.push(`/secretariatmodule/submissions/under-revision?id=${submission.id}`);
    else if (submission.status === 'under_review') router.push(`/secretariatmodule/submissions/under-review?id=${submission.id}`);
    else if (submission.status === 'approved' || submission.status === 'review_complete') router.push(`/secretariatmodule/submissions/review-complete?id=${submission.id}`);
    else router.push(`/secretariatmodule/submissions/details?id=${submission.id}`);
  };

  const resultsText = `Showing ${startIndex + 1}-${endIndex} of ${totalCount} results`;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy, startDate, endDate]);

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submissions" activeNav="submissions">
      <div className="max-w-[1600px] mx-auto w-full pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden transition-all hover:shadow-md">
          
          {/* Enhanced Toolbar */}
          <div className="border-b border-gray-100 bg-white p-5 lg:p-8">
            <div className="flex flex-col gap-6">
              
              {/* Responsive Search Bar */}
              <div className="w-full relative">
                <SearchBar
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                
                {/* Sort Filter */}
                <div className="relative group">
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Sort Order
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full h-12 pl-4 pr-10 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 cursor-pointer appearance-none transition-all"
                    >
                      <option value="Newest">Newest First</option>
                      <option value="Oldest">Oldest First</option>
                      <option value="A-Z">Title (A-Z)</option>
                      <option value="Z-A">Title (Z-A)</option>
                    </select>
                    <ArrowUpDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="relative group">
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Filter Status
                  </label>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 cursor-pointer appearance-none transition-all"
                    >
                      <option value="All Statuses">All Statuses</option>
                      <option value="awaiting_classification">Under Classification</option>
                      <option value="under_review">Under Review</option>
                      <option value="review_complete">Review Complete</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="needs_revision">Needs Revision</option>
                      <option value="conflict_of_interest">Conflict of Interest</option>
                    </select>
                    <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date Inputs */}
                <div className="relative group">
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Start Date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      onFocus={(e) => (e.target.type = 'date')}
                      onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                      className="w-full h-12 pl-4 pr-10 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 transition-all placeholder-gray-400"
                    />
                    <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    To
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="End Date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onFocus={(e) => (e.target.type = 'date')}
                      onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                      className="w-full h-12 pl-4 pr-10 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 transition-all placeholder-gray-400"
                    />
                    <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 bg-white p-4 lg:p-8">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#101C50] mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium tracking-wide text-sm">LOADING DATA...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center opacity-70">
                <Search className="text-gray-300 mb-4" size={48} />
                <p className="text-gray-800 text-lg font-bold mb-1">No submissions found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div>
                  {/* Desktop: Elegant List View Table */}
                  <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm mb-6">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#101C50] text-white">
                          <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Submission Details</th>
                          {/* Expanded Date Column Width */}
                          <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider w-56">Date Submitted</th>
                          <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider w-48">Status</th>
                          <th className="py-4 px-6 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {submissions.map((submission) => (
                          <tr 
                            key={submission.id}
                            onClick={() => handleRowClick(submission)}
                            className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-start gap-4">
                                <div className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 items-center justify-center text-[#101C50]">
                                  <FileText size={20} />
                                </div>
                                <div>
                                  {/* Title: Reduced to text-sm (14px) */}
                                  <p className="text-sm font-bold text-[#101C50] leading-snug hover:text-blue-700 transition-colors mb-0.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                    {submission.title}
                                  </p>
                                  <div className="flex items-center gap-3">
                                    {/* ID: Increased to text-xs (12px) for better readability */}
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                      ID: {submission.submission_id}
                                    </span>
                                    {submission.author_name && (
                                      <>
                                        <span className="text-xs text-gray-300">•</span>
                                        <span className="text-xs text-gray-500 font-medium">
                                          {submission.author_name}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric',
                                  })}
                                </span>
                                <span className="text-xs text-gray-400 mt-0.5">
                                  {new Date(submission.submitted_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span 
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(submission.status)} shadow-sm whitespace-nowrap`} 
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${getStatusColor(submission.status).replace('bg-', 'bg-current text-').split(' ')[0]}`}></span>
                                {formatStatus(submission.status)}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: Clean Cards */}
                  <div className="md:hidden space-y-4 mb-6">
                    {submissions.map((submission) => (
                      <div 
                        key={submission.id}
                        onClick={() => handleRowClick(submission)}
                        className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                {/* Mobile Title: text-sm */}
                                <h3 className="text-sm font-bold text-[#101C50] leading-snug break-words mb-1">
                                  {submission.title}
                                </h3>
                                {/* Mobile ID: text-xs */}
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block">
                                  ID: {submission.submission_id}
                                </span>
                            </div>
                            <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1" />
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span 
                              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(submission.status)}`} 
                            >
                              {formatStatus(submission.status)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-50 text-xs text-gray-500 font-medium">
                            <Calendar size={12} />
                            {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="mt-auto border-t border-gray-100 pt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    resultsText={resultsText}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
