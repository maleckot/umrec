// app/reviewermodule/page.tsx
'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import StartReviewModal from '@/components/reviewer/StartReviewModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewerDashboard() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  // Sample data - replace with actual data from API
  const stats = {
    newAssignments: 2,
    overdueReviews: 1,
    completedReviews: 24,
  };

  const newAssignments = [
    {
      id: 1,
      title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
      category: 'Expedited',
      assignedDate: '08-03-2025',
      dueDate: '08-27-2025',
    },
    {
      id: 2,
      title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
      category: 'Full Review',
      assignedDate: '08-23-2025',
      dueDate: '09-02-2025',
    },
  ];

  const overdueReviews = [
    {
      id: 3,
      title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
      category: 'Expedited',
      dueDate: '08-27-2025',
    },
    {
      id: 4,
      title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
      category: 'Full Review',
      dueDate: '09-02-2025',
    },
  ];

  const handleStartReview = (assignment: any) => {
    console.log('Opening modal for:', assignment);
    setSelectedSubmission(assignment);
    setModalOpen(true);
  };

  const confirmStartReview = () => {
    console.log('Confirmed review for:', selectedSubmission);
    setModalOpen(false);
    // Navigate to review submission page
    router.push(`/reviewermodule/review-submission?id=${selectedSubmission.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
      <NavbarRoles role="reviewer" />

      <div className="flex-grow py-8 px-6 md:px-12 lg:px-20 mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            Reviewer Dashboard
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* New Assignments */}
            <div className="bg-white rounded-2xl p-6 border-2 border-[#101C50] flex items-center justify-between">
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
            <div className="bg-white rounded-2xl p-6 border-2 border-[#101C50] flex items-center justify-between">
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
            <div className="bg-white rounded-2xl p-6 border-2 border-[#101C50] flex items-center justify-between">
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

          {/* New Assignments Table */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#101C50] mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
              New Assignments
            </h2>

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
                  {newAssignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b border-gray-200">
                      <td className="py-4 pr-4">
                        <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {assignment.title}
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {assignment.category}
                        </p>
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
              {newAssignments.map((assignment) => (
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
                      <p className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {assignment.category}
                      </p>
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
          </div>

          {/* Overdue Reviews Table */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#101C50]">
            <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#7C1100' }}>
              Overdue Reviews
            </h2>

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
                  {overdueReviews.map((review) => (
                    <tr key={review.id} className="border-b border-gray-200">
                      <td className="py-4 pr-4">
                        <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {review.title}
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {review.category}
                        </p>
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
              {overdueReviews.map((review) => (
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
                      <p className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {review.category}
                      </p>
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
