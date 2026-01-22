'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { getReviewers } from '@/app/actions/admin/reviewer/getAdminReviewers';
import { Search, Filter, ChevronRight, User, Mail, Activity, ArrowUpDown } from 'lucide-react';

export default function ReviewersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All availability');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeReviewsFilter, setActiveReviewsFilter] = useState('Any');
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Responsive Placeholder State
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search by name, email, or code...');

  const itemsPerPage = 10;

  useEffect(() => {
    loadReviewers();
  }, []);

  // Dynamic Placeholder Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // Small screens
        setSearchPlaceholder('Search name or code...');
      } else { // Desktop
        setSearchPlaceholder('Search by name, email, or code...');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadReviewers = async () => {
    setLoading(true);
    const result = await getReviewers();
    if (result.success) {
      setReviewers(result.reviewers || []);
    } else {
      console.error('Failed to load reviewers:', result.error);
      setReviewers([]);
    }
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    let filtered = [...reviewers];

    if (searchQuery) {
      filtered = filtered.filter(reviewer =>
        reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reviewer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reviewer.code && reviewer.code.includes(searchQuery))
      );
    }

    if (availabilityFilter !== 'All availability') {
      filtered = filtered.filter(reviewer => reviewer.availability === availabilityFilter);
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(reviewer => reviewer.reviewStatus === statusFilter);
    }

    if (activeReviewsFilter !== 'Any') {
      filtered = filtered.filter(reviewer => {
        const count = typeof reviewer.activeReviews === 'number' ? reviewer.activeReviews : 0;
        if (activeReviewsFilter === '0') return count === 0;
        if (activeReviewsFilter === '1-5') return count >= 1 && count <= 5;
        if (activeReviewsFilter === '6-10') return count >= 6 && count <= 10;
        if (activeReviewsFilter === '11+') return count >= 11;
        return true;
      });
    }

    return filtered;
  }, [reviewers, searchQuery, availabilityFilter, statusFilter, activeReviewsFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, availabilityFilter, statusFilter, activeReviewsFilter]);

  const handleRowClick = (reviewer: any) => {
    router.push(`/adminmodule/reviewers/details?id=${reviewer.id}`);
  };

  const resultsText = `Showing ${startIndex + 1}-${Math.min(endIndex, filteredData.length)} of ${filteredData.length} results`;

  return (
    <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Reviewers" activeNav="reviewers">
      <div className="max-w-[1600px] mx-auto w-full pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden transition-all hover:shadow-md">
          
          {/* Formal Toolbar Section */}
          <div className="border-b border-gray-100 bg-white p-5 lg:p-8">
            <div className="flex flex-col gap-6">
              {/* Responsive Search Bar */}
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 text-base bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 transition-all placeholder-gray-400 font-medium"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
                {/* Availability Filter */}
                <div className="relative group">
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Availability
                  </label>
                  <div className="relative">
                    <select
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 cursor-pointer appearance-none transition-all"
                    >
                      <option value="All availability">All Availability</option>
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                    <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="relative group">
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 cursor-pointer appearance-none transition-all"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ArrowUpDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Active Reviews Filter */}
                <div className="relative group">
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Workload
                  </label>
                  <div className="relative">
                    <select
                      value={activeReviewsFilter}
                      onChange={(e) => setActiveReviewsFilter(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 cursor-pointer appearance-none transition-all"
                    >
                      <option value="Any">Any Workload</option>
                      <option value="0">No Active Reviews</option>
                      <option value="1-5">1-5 Reviews</option>
                      <option value="6-10">6-10 Reviews</option>
                      <option value="11+">11+ Reviews</option>
                    </select>
                    <Activity size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white p-4 lg:p-8">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#101C50] mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium tracking-wide text-sm">LOADING REVIEWERS...</p>
              </div>
            ) : currentPageData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center opacity-70">
                <User className="text-gray-300 mb-4" size={48} />
                <p className="text-gray-800 text-lg font-bold mb-1">No reviewers found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm mb-6">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#101C50] text-white">
                          <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Reviewer Name</th>
                          <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Contact</th>
                          <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Availability</th>
                          <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Active Reviews</th>
                          <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Status</th>
                          <th className="py-4 px-6 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentPageData.map((reviewer) => (
                          <tr 
                            key={reviewer.id} 
                            onClick={() => handleRowClick(reviewer)}
                            className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#101C50] font-bold text-sm border border-blue-100">
                                  {reviewer.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-[#101C50]">{reviewer.name}</p>
                                  {reviewer.code && (
                                    <p className="text-xs text-gray-400 font-mono mt-0.5">{reviewer.code}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={14} className="text-gray-400" />
                                {reviewer.email}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                                reviewer.availability === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                reviewer.availability === 'Busy' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-gray-50 text-gray-600 border-gray-200'
                              }`}>
                                {reviewer.availability}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                                {reviewer.activeReviews}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                               <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${reviewer.reviewStatus === 'Active' ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${reviewer.reviewStatus === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                  <span className="text-[10px] font-bold uppercase">{reviewer.reviewStatus}</span>
                               </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 mb-6">
                    {currentPageData.map((reviewer) => (
                      <div 
                        key={reviewer.id}
                        onClick={() => handleRowClick(reviewer)}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#101C50] font-bold text-lg border border-blue-100">
                              {reviewer.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-[#101C50]">{reviewer.name}</h3>
                              {reviewer.code && (
                                <p className="text-xs text-gray-400 font-mono bg-gray-50 inline-block px-1 rounded mt-0.5">{reviewer.code}</p>
                              )}
                            </div>
                          </div>
                          <div className={`w-2.5 h-2.5 rounded-full mt-2 ${reviewer.reviewStatus === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            <span className="truncate">{reviewer.email}</span>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                             <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                                reviewer.availability === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                reviewer.availability === 'Busy' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-gray-50 text-gray-600 border-gray-200'
                              }`}>
                                {reviewer.availability}
                              </span>
                              
                              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                Active Reviews: 
                                <span className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                  {reviewer.activeReviews}
                                </span>
                              </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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
