// app/reviewermodule/page.tsx
'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getReviewerDashboardData } from '@/app/actions/reviewer/getReviewerDashboardData';

type TabType = 'all' | 'expedited' | 'full';

export default function ReviewerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [overdueActiveTab, setOverdueActiveTab] = useState<TabType>('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const result = await getReviewerDashboardData();
      if (result.success) {
        setDashboardData(result);
      } else {
        console.error('Failed to load dashboard data:', result.error);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    newAssignments: dashboardData?.stats.newAssignments || 0,
    overdueReviews: dashboardData?.stats.overdueReviews || 0,
    completedReviews: dashboardData?.stats.completedReviews || 0,
  };

  const allNewAssignments = dashboardData?.newAssignments || [];
  const allOverdueReviews = dashboardData?.overdueReviews || [];

  const getFilteredAssignments = () => {
    if (activeTab === 'all') {
      return allNewAssignments;
    } else if (activeTab === 'expedited') {
      return allNewAssignments.filter((a: any) => a.category?.toLowerCase() === 'expedited');
    } else if (activeTab === 'full') {
      return allNewAssignments.filter((a: any) => a.category?.toLowerCase() === 'full review');
    }
    return allNewAssignments;
  };

  const getFilteredOverdueReviews = () => {
    if (overdueActiveTab === 'all') {
      return allOverdueReviews;
    } else if (overdueActiveTab === 'expedited') {
      return allOverdueReviews.filter((a: any) => a.category?.toLowerCase() === 'expedited');
    } else if (overdueActiveTab === 'full') {
      return allOverdueReviews.filter((a: any) => a.category?.toLowerCase() === 'full review');
    }
    return allOverdueReviews;
  };

  const filteredAssignments = getFilteredAssignments();
  const filteredOverdueReviews = getFilteredOverdueReviews();

  const expeditedCount = allNewAssignments.filter((a: any) => a.category?.toLowerCase() === 'expedited').length;
  const fullReviewCount = allNewAssignments.filter((a: any) => a.category?.toLowerCase() === 'full review').length;

  const overdueExpeditedCount = allOverdueReviews.filter((a: any) => a.category?.toLowerCase() === 'expedited').length;
  const overdueFullReviewCount = allOverdueReviews.filter((a: any) => a.category?.toLowerCase() === 'full review').length;

  const handleViewSubmission = (assignment: any) => {
    router.push(`/reviewermodule/reviews/details?id=${assignment.submissionId}`);
  };

  const getTabLabel = (tab: TabType, count: number) => {
    if (tab === 'all') return `All Submissions (${count})`;
    if (tab === 'expedited') return `Expedited (${count})`;
    return `Full Review (${count})`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="flex items-center justify-center pt-24 md:pt-28 lg:pt-32 pb-8">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#101C50]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#101C50] border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-700 text-lg font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading dashboard...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pb-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Title with Elegant Animation */}
          <div className="mb-8 sm:mb-10 animate-fadeIn">
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#101C50] via-[#1a2d70] to-[#101C50] bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Reviewer Dashboard
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full"></div>
          </div>

          {/* Stats Cards with Modern Shadow and Hover Effects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-10 sm:mb-12">
            {/* New Assignments Card */}
            <div className="group bg-white rounded-3xl p-6 sm:p-7 md:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-2 sm:mb-3 font-medium uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    New Assignments
                  </p>
                  <p className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-br from-[#101C50] to-[#288cfa] bg-clip-text text-transparent" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {stats.newAssignments}
                  </p>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#101C50] to-[#1a2d70] rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Overdue Reviews Card */}
            <div className="group bg-white rounded-3xl p-6 sm:p-7 md:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-2 sm:mb-3 font-medium uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Overdue Reviews
                  </p>
                  <p className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-br from-[#7C1100] to-[#b91900] bg-clip-text text-transparent" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {stats.overdueReviews}
                  </p>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#7C1100] to-[#5a0c00] rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completed Reviews Card */}
            <div className="group bg-white rounded-3xl p-6 sm:p-7 md:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100/50 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-2 sm:mb-3 font-medium uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Completed Reviews
                  </p>
                  <p className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-br from-[#2d7a3e] to-[#1e5c2e] bg-clip-text text-transparent" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {stats.completedReviews}
                  </p>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#2d7a3e] to-[#1e5c2e] rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* New Assignments Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-7 md:p-10 shadow-xl mb-10 sm:mb-12 border border-gray-100/50">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  New Assignments
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full mt-2"></div>
              </div>
            </div>

            {/* Desktop Tabs with Modern Design */}
            <div className="hidden md:block mb-8">
              <div className="flex gap-3 p-2 bg-gray-50/80 rounded-2xl">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 px-6 py-4 text-sm lg:text-base font-bold rounded-xl transition-all duration-300 ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-[#101C50] hover:bg-white/50'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  All Submissions ({allNewAssignments.length})
                </button>
                <button
                  onClick={() => setActiveTab('expedited')}
                  className={`flex-1 px-6 py-4 text-sm lg:text-base font-bold rounded-xl transition-all duration-300 ${
                    activeTab === 'expedited'
                      ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-blue-800 hover:bg-white/50'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Expedited ({expeditedCount})
                </button>
                <button
                  onClick={() => setActiveTab('full')}
                  className={`flex-1 px-6 py-4 text-sm lg:text-base font-bold rounded-xl transition-all duration-300 ${
                    activeTab === 'full'
                      ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-amber-800 hover:bg-white/50'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Full Review ({fullReviewCount})
                </button>
              </div>
            </div>

            {/* Mobile Dropdown with Enhanced Style */}
            <div className="md:hidden mb-6 sm:mb-8">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as TabType)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/10 focus:outline-none text-sm font-bold bg-white shadow-md transition-all"
                style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}
              >
                <option value="all">{getTabLabel('all', allNewAssignments.length)}</option>
                <option value="expedited">{getTabLabel('expedited', expeditedCount)}</option>
                <option value="full">{getTabLabel('full', fullReviewCount)}</option>
              </select>
            </div>

            {/* Content Area */}
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-base sm:text-lg font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  No assignments found in this category
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table with Enhanced Design */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left pb-5 pr-4 w-[40%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>
                          TITLE
                        </th>
                        <th className="text-left pb-5 pr-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>
                          CATEGORY
                        </th>
                        <th className="text-left pb-5 pr-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>
                          ASSIGNED DATE
                        </th>
                        <th className="text-left pb-5 pr-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>
                          DUE DATE
                        </th>
                        <th className="text-center pb-5 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssignments.map((assignment: any, index: number) => (
                        <tr 
                          key={assignment.id} 
                          className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent transition-all duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="py-5 pr-4">
                            <p className="text-sm lg:text-base text-gray-800 font-medium leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {assignment.title}
                            </p>
                          </td>
                          <td className="py-5 pr-4">
                            <span 
                              className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                                assignment.category?.toLowerCase() === 'expedited review'
                                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-200'
                              }`}
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              {assignment.category}
                            </span>
                          </td>
                          <td className="py-5 pr-4">
                            <p className="text-sm lg:text-base text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {assignment.assignedDate}
                            </p>
                          </td>
                          <td className="py-5 pr-4">
                            <p className="text-sm lg:text-base text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {assignment.dueDate}
                            </p>
                          </td>
                          <td className="py-5 text-center">
                            <button
                              onClick={() => handleViewSubmission(assignment)}
                              className="px-7 py-3 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white text-sm font-bold rounded-full hover:shadow-xl hover:scale-105 transform transition-all duration-300"
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View with Enhanced Design */}
                <div className="md:hidden space-y-4 sm:space-y-5">
                  {filteredAssignments.map((assignment: any, index: number) => (
                    <div 
                      key={assignment.id} 
                      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>Title</p>
                          <p className="text-sm sm:text-base text-gray-900 font-bold leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {assignment.title}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>Category</p>
                            <span 
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                                assignment.category?.toLowerCase() === 'expedited review'
                                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800'
                                  : 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800'
                              }`}
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              {assignment.category}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>Assigned</p>
                            <p className="text-sm text-gray-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {assignment.assignedDate}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>Due Date</p>
                          <p className="text-sm text-gray-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {assignment.dueDate}
                          </p>
                        </div>
                        <button
                          onClick={() => handleViewSubmission(assignment)}
                          className="w-full px-6 py-3.5 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white text-sm font-bold rounded-full hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                          style={{ fontFamily: 'Metropolis, sans-serif' }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Overdue Reviews Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-7 md:p-10 shadow-xl border border-red-100/50">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#7C1100]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Overdue Reviews
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-[#7C1100] to-[#b91900] rounded-full mt-2"></div>
              </div>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:block mb-8">
              <div className="flex gap-3 p-2 bg-red-50/50 rounded-2xl">
                <button
                  onClick={() => setOverdueActiveTab('all')}
                  className={`flex-1 px-6 py-4 text-sm lg:text-base font-bold rounded-xl transition-all duration-300 ${
                    overdueActiveTab === 'all'
                      ? 'bg-gradient-to-r from-[#7C1100] to-[#5a0c00] text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-[#7C1100] hover:bg-white/50'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  All Submissions ({allOverdueReviews.length})
                </button>
                <button
                  onClick={() => setOverdueActiveTab('expedited')}
                  className={`flex-1 px-6 py-4 text-sm lg:text-base font-bold rounded-xl transition-all duration-300 ${
                    overdueActiveTab === 'expedited'
                      ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-blue-800 hover:bg-white/50'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Expedited ({overdueExpeditedCount})
                </button>
                <button
                  onClick={() => setOverdueActiveTab('full')}
                  className={`flex-1 px-6 py-4 text-sm lg:text-base font-bold rounded-xl transition-all duration-300 ${
                    overdueActiveTab === 'full'
                      ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-amber-800 hover:bg-white/50'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Full Review ({overdueFullReviewCount})
                </button>
              </div>
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden mb-6 sm:mb-8">
              <select
                value={overdueActiveTab}
                onChange={(e) => setOverdueActiveTab(e.target.value as TabType)}
                className="w-full px-5 py-4 border-2 border-red-200 rounded-2xl focus:border-[#7C1100] focus:ring-4 focus:ring-[#7C1100]/10 focus:outline-none text-sm font-bold bg-white shadow-md transition-all"
                style={{ fontFamily: 'Metropolis, sans-serif', color: '#7C1100' }}
              >
                <option value="all">{getTabLabel('all', allOverdueReviews.length)}</option>
                <option value="expedited">{getTabLabel('expedited', overdueExpeditedCount)}</option>
                <option value="full">{getTabLabel('full', overdueFullReviewCount)}</option>
              </select>
            </div>

            {/* Content Area */}
            {filteredOverdueReviews.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-base sm:text-lg font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  No overdue reviews in this category
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left pb-5 pr-4 w-[55%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>
                          TITLE
                        </th>
                        <th className="text-left pb-5 pr-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>
                          CATEGORY
                        </th>
                        <th className="text-left pb-5 pr-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>
                          DUE DATE
                        </th>
                        <th className="text-center pb-5 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px' }}>
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOverdueReviews.map((review: any, index: number) => (
                        <tr 
                          key={review.id} 
                          className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-red-50/30 hover:to-transparent transition-all duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="py-5 pr-4">
                            <p className="text-sm lg:text-base text-gray-800 font-medium leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {review.title}
                            </p>
                          </td>
                          <td className="py-5 pr-4">
                            <span 
                              className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                                review.category?.toLowerCase() === 'expedited review'
                                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-200'
                              }`}
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              {review.category}
                            </span>
                          </td>
                          <td className="py-5 pr-4">
                            <p className="text-sm lg:text-base text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {review.dueDate}
                            </p>
                          </td>
                          <td className="py-5 text-center">
                            <button
                              onClick={() => handleViewSubmission(review)}
                              className="px-7 py-3 bg-gradient-to-r from-[#7C1100] to-[#5a0c00] text-white text-sm font-bold rounded-full hover:shadow-xl hover:scale-105 transform transition-all duration-300"
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 sm:space-y-5">
                  {filteredOverdueReviews.map((review: any, index: number) => (
                    <div 
                      key={review.id} 
                      className="bg-gradient-to-br from-red-50/30 to-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl border border-red-100 transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>Title</p>
                          <p className="text-sm sm:text-base text-gray-900 font-bold leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {review.title}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>Category</p>
                            <span 
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                                review.category?.toLowerCase() === 'expedited review'
                                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800'
                                  : 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800'
                              }`}
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              {review.category}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>Due Date</p>
                            <p className="text-sm text-gray-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {review.dueDate}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewSubmission(review)}
                          className="w-full px-6 py-3.5 bg-gradient-to-r from-[#7C1100] to-[#5a0c00] text-white text-sm font-bold rounded-full hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                          style={{ fontFamily: 'Metropolis, sans-serif' }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
