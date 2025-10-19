// app/reviewermodule/page.tsx
'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import StartReviewModal from '@/components/reviewer/StartReviewModal';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getReviewerDashboardData } from '@/app/actions/reviewer/getReviewerDashboardData';

type TabType = 'all' | 'expedited' | 'full';

export default function ReviewerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
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

  // Filter new assignments based on active tab
  const getFilteredAssignments = () => {
    if (activeTab === 'all') {
      return allNewAssignments;
    } else if (activeTab === 'expedited') {
      return allNewAssignments.filter((a: any) => a.category?.toLowerCase() === 'expedited review');
    } else if (activeTab === 'full') {
      return allNewAssignments.filter((a: any) => a.category?.toLowerCase() === 'full review');
    }
    return allNewAssignments;
  };

  // Filter overdue reviews based on active tab
  const getFilteredOverdueReviews = () => {
    if (overdueActiveTab === 'all') {
      return allOverdueReviews;
    } else if (overdueActiveTab === 'expedited') {
      return allOverdueReviews.filter((a: any) => a.category?.toLowerCase() === 'expedited review');
    } else if (overdueActiveTab === 'full') {
      return allOverdueReviews.filter((a: any) => a.category?.toLowerCase() === 'full review');
    }
    return allOverdueReviews;
  };

  const filteredAssignments = getFilteredAssignments();
  const filteredOverdueReviews = getFilteredOverdueReviews();

  // Count assignments by category
  const expeditedCount = allNewAssignments.filter((a: any) => a.category?.toLowerCase() === 'expedited review').length;
  const fullReviewCount = allNewAssignments.filter((a: any) => a.category?.toLowerCase() === 'full review').length;

  // Count overdue reviews by category
  const overdueExpeditedCount = allOverdueReviews.filter((a: any) => a.category?.toLowerCase() === 'expedited review').length;
  const overdueFullReviewCount = allOverdueReviews.filter((a: any) => a.category?.toLowerCase() === 'full review').length;

  const handleStartReview = (assignment: any) => {
    console.log('Opening modal for:', assignment);
    setSelectedSubmission(assignment);
    setModalOpen(true);
  };

  const confirmStartReview = () => {
    console.log('Confirmed review for:', selectedSubmission);
    setModalOpen(false);
    router.push(`/reviewermodule/review-submission?id=${selectedSubmission.submissionId}`);
  };

  const getTabLabel = (tab: TabType, count: number) => {
    if (tab === 'all') return `All Submissions (${count})`;
    if (tab === 'expedited') return `Expedited (${count})`;
    return `Full Review (${count})`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="flex items-center justify-center pt-24 md:pt-28 lg:pt-32 pb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading dashboard...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Title - Responsive */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            Reviewer Dashboard
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* New Assignments */}
            <div className="bg-white rounded-2xl p-6 shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm md:text-base text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  New Assignments
                </p>
                <p className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                  {stats.newAssignments}
                </p>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#101C50] rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            {/* Overdue Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm md:text-base text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Overdue Reviews
                </p>
                <p className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                  {stats.overdueReviews}
                </p>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#101C50] rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Completed Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm md:text-base text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Completed Reviews
                </p>
                <p className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                  {stats.completedReviews}
                </p>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#101C50] rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* New Assignments Table with Tabs/Dropdown */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
              New Assignments
            </h2>

            {/* Desktop Tabs Navigation */}
            <div className="hidden md:block mb-6 border-b border-gray-200">
              <div className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 text-base font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'border-b-3 border-[#101C50] text-[#101C50]'
                      : 'border-b-3 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif', borderBottomWidth: '3px' }}
                >
                  All Submissions ({allNewAssignments.length})
                </button>
                <button
                  onClick={() => setActiveTab('expedited')}
                  className={`px-6 py-3 text-base font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'expedited'
                      ? 'border-b-3 border-blue-800 text-blue-800'
                      : 'border-b-3 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif', borderBottomWidth: '3px' }}
                >
                  Expedited ({expeditedCount})
                </button>
                <button
                  onClick={() => setActiveTab('full')}
                  className={`px-6 py-3 text-base font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'full'
                      ? 'border-b-3 border-amber-800 text-amber-800'
                      : 'border-b-3 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif', borderBottomWidth: '3px' }}
                >
                  Full Review ({fullReviewCount})
                </button>
              </div>
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden mb-6">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as TabType)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#101C50] focus:outline-none text-sm font-semibold bg-white"
                style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}
              >
                <option value="all">{getTabLabel('all', allNewAssignments.length)}</option>
                <option value="expedited">{getTabLabel('expedited', expeditedCount)}</option>
                <option value="full">{getTabLabel('full', fullReviewCount)}</option>
              </select>
            </div>

            {/* Tab Content */}
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  No assignments found in this category
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left pb-4 pr-4 w-[40%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 700 }}>
                          TITLE
                        </th>
                        <th className="text-left pb-4 pr-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 700 }}>
                          CATEGORY
                        </th>
                        <th className="text-left pb-4 pr-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 700 }}>
                          ASSIGNED DATE
                        </th>
                        <th className="text-left pb-4 pr-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 700 }}>
                          DUE DATE
                        </th>
                        <th className="text-center pb-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 700 }}>
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssignments.map((assignment: any) => (
                        <tr key={assignment.id} className="border-b border-gray-200">
                          <td className="py-4 pr-4">
                            <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {assignment.title}
                            </p>
                          </td>
                          <td className="py-4 pr-4">
                            <span 
                              className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                                assignment.category?.toLowerCase() === 'expedited review'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              {assignment.category}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {assignment.assignedDate}
                            </p>
                          </td>
                          <td className="py-4 pr-4">
                            <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {assignment.dueDate}
                            </p>
                          </td>
                          <td className="py-4 text-center">
                            <button
                              onClick={() => handleStartReview(assignment)}
                              className="px-6 py-2.5 w-[140px] bg-[#101C50] text-white text-sm rounded-full hover:bg-[#0d1640] transition-colors cursor-pointer"
                              style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                            >
                              Start Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {filteredAssignments.map((assignment: any) => (
                    <div key={assignment.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>TITLE</p>
                        <p className="text-sm text-gray-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {assignment.title}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>CATEGORY</p>
                          <span 
                            className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                              assignment.category?.toLowerCase() === 'expedited review'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                            style={{ fontFamily: 'Metropolis, sans-serif' }}
                          >
                            {assignment.category}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>ASSIGNED DATE</p>
                          <p className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {assignment.assignedDate}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>DUE DATE</p>
                        <p className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {assignment.dueDate}
                        </p>
                      </div>
                      <button
                        onClick={() => handleStartReview(assignment)}
                        className="w-full px-6 py-2.5 bg-[#101C50] text-white text-sm rounded-full hover:bg-[#0d1640] transition-colors cursor-pointer"
                        style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                      >
                        Start Review
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Overdue Reviews Table with Tabs/Dropdown */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
            <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#7C1100' }}>
              Overdue Reviews
            </h2>

            {/* Desktop Tabs Navigation */}
            <div className="hidden md:block mb-6 border-b border-gray-200">
              <div className="flex -mb-px">
                <button
                  onClick={() => setOverdueActiveTab('all')}
                  className={`px-6 py-3 text-base font-semibold transition-colors whitespace-nowrap ${
                    overdueActiveTab === 'all'
                      ? 'border-b-3 border-[#101C50] text-[#101C50]'
                      : 'border-b-3 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif', borderBottomWidth: '3px' }}
                >
                  All Submissions ({allOverdueReviews.length})
                </button>
                <button
                  onClick={() => setOverdueActiveTab('expedited')}
                  className={`px-6 py-3 text-base font-semibold transition-colors whitespace-nowrap ${
                    overdueActiveTab === 'expedited'
                      ? 'border-b-3 border-blue-800 text-blue-800'
                      : 'border-b-3 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif', borderBottomWidth: '3px' }}
                >
                  Expedited ({overdueExpeditedCount})
                </button>
                <button
                  onClick={() => setOverdueActiveTab('full')}
                  className={`px-6 py-3 text-base font-semibold transition-colors whitespace-nowrap ${
                    overdueActiveTab === 'full'
                      ? 'border-b-3 border-amber-800 text-amber-800'
                      : 'border-b-3 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif', borderBottomWidth: '3px' }}
                >
                  Full Review ({overdueFullReviewCount})
                </button>
              </div>
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden mb-6">
              <select
                value={overdueActiveTab}
                onChange={(e) => setOverdueActiveTab(e.target.value as TabType)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#7C1100] focus:outline-none text-sm font-semibold bg-white"
                style={{ fontFamily: 'Metropolis, sans-serif', color: '#7C1100' }}
              >
                <option value="all">{getTabLabel('all', allOverdueReviews.length)}</option>
                <option value="expedited">{getTabLabel('expedited', overdueExpeditedCount)}</option>
                <option value="full">{getTabLabel('full', overdueFullReviewCount)}</option>
              </select>
            </div>

            {/* Tab Content */}
            {filteredOverdueReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  No overdue reviews in this category
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left pb-4 pr-4 w-[55%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 700 }}>
                          TITLE
                        </th>
                        <th className="text-left pb-4 pr-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 700 }}>
                          CATEGORY
                        </th>
                        <th className="text-left pb-4 pr-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 700 }}>
                          DUE DATE
                        </th>
                        <th className="text-center pb-4 w-[15%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', fontWeight: 700 }}>
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOverdueReviews.map((review: any) => (
                        <tr key={review.id} className="border-b border-gray-200">
                          <td className="py-4 pr-4">
                            <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {review.title}
                            </p>
                          </td>
                          <td className="py-4 pr-4">
                            <span 
                              className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                                review.category?.toLowerCase() === 'expedited review'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              {review.category}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {review.dueDate}
                            </p>
                          </td>
                          <td className="py-4 text-center">
                            <button
                              onClick={() => handleStartReview(review)}
                              className="px-6 py-2.5 w-[140px] bg-[#7C1100] text-white text-sm rounded-full hover:bg-[#5a0c00] transition-colors cursor-pointer"
                              style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                            >
                              Start Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {filteredOverdueReviews.map((review: any) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>TITLE</p>
                        <p className="text-sm text-gray-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {review.title}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>CATEGORY</p>
                          <span 
                            className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                              review.category?.toLowerCase() === 'expedited review'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                            style={{ fontFamily: 'Metropolis, sans-serif' }}
                          >
                            {review.category}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>DUE DATE</p>
                          <p className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {review.dueDate}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartReview(review)}
                        className="w-full px-6 py-2.5 bg-[#7C1100] text-white text-sm rounded-full hover:bg-[#5a0c00] transition-colors cursor-pointer"
                        style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                      >
                        Start Review
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Start Review Modal */}
      <StartReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmStartReview}
        submissionTitle={selectedSubmission?.title || ''}
      />

      <Footer />
    </div>
  );
}
