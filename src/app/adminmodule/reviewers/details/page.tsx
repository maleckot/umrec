// app/adminmodule/reviewers/details/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Award, Building2 } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReviewerStatsCards from '@/components/admin/reviewers/ReviewerStatsCards';
import ReviewerReviewsTable from '@/components/admin/reviewers/ReviewerReviewsTable';

export default function ReviewerDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewerId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [loading, setLoading] = useState(true);
  const [reviewerData, setReviewerData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (reviewerId) {
      loadReviewerDetails();
    }
  }, [reviewerId]);

  const loadReviewerDetails = async () => {
    setLoading(true);
    // TODO: Replace with actual API call
    const mockData = {
      reviewer: {
        id: reviewerId,
        name: 'Prof. Juan Dela Cruz',
        phone: '09994455353',
        email: 'email123@umak.edu.ph',
        areasOfExpertise: 'Computer Science, Artificial Intelligence, Machine Learning',
        college: 'College of Computing and Information Sciences (CCIS)',
        availability: 'Available',
        status: 'On Track',
        activeReviews: 5
      },
      currentReviews: [
        {
          id: '1',
          title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
          dueDate: '07-24-2025',
          status: 'Under Review'
        },
        {
          id: '2',
          title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
          dueDate: '07-24-2025',
          status: 'Overdue'
        },
        {
          id: '3',
          title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
          dueDate: '07-24-2025',
          status: 'Under Review'
        },
      ],
      reviewHistory: [
        {
          id: '4',
          title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
          completedDate: '08-14-2025',
          status: 'Review Complete'
        },
        {
          id: '5',
          title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
          completedDate: '08-14-2025',
          status: 'Review Complete'
        },
        {
          id: '6',
          title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
          completedDate: '08-14-2025',
          status: 'Review Complete'
        },
      ]
    };
    
    setReviewerData(mockData);
    setLoading(false);
  };

  const handleReviewClick = (id: string) => {
    router.push(`/adminmodule/submissions/details?id=${id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: API call to delete reviewer
    console.log('Deleting reviewer:', reviewerId);
    setShowDeleteModal(false);
    router.push('/adminmodule/reviewers');
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading reviewer details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!reviewerData || !reviewerData.reviewer) {
    return (
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Reviewer not found
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const { reviewer, currentReviews, reviewHistory } = reviewerData;

  return (
    <>
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Reviewer Details" activeNav="reviewers">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => router.push('/adminmodule/reviewers')}
            className="flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Reviewers</span>
          </button>
        </div>

        {/* Reviewer Header */}
<div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-6">
  <div className="flex flex-col sm:flex-row items-start gap-4">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0">
      <User size={32} className="text-white sm:w-10 sm:h-10" />
    </div>
    <div className="flex-1 min-w-0 w-full">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {reviewer.name}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
        {/* Phone */}
        <div className="flex items-center gap-2">
          <Phone size={16} className="flex-shrink-0" />
          <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.phone}</span>
        </div>
        
        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail size={16} className="flex-shrink-0" />
          <span className="break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.email}</span>
        </div>
        
        {/* Areas of Expertise */}
        <div className="flex items-start gap-2">
          <Award size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>Areas of Expertise: </span>
            <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.areasOfExpertise}</span>
          </div>
        </div>
        
        {/* College */}
        <div className="flex items-start gap-2">
          <Building2 size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>College: </span>
            <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.college}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Stats Cards */}
        <ReviewerStatsCards
          availability={reviewer.availability}
          status={reviewer.status}
          activeReviews={reviewer.activeReviews}
        />

        {/* Reviews Section with Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max sm:min-w-0">
              <button
                onClick={() => setActiveTab('current')}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'current'
                    ? 'text-[#101C50] border-b-2 border-[#101C50] bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Current Reviews ({currentReviews.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'text-[#101C50] border-b-2 border-[#101C50] bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Review History ({reviewHistory.length})
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-4 sm:p-6">
            <ReviewerReviewsTable
              reviews={activeTab === 'current' ? currentReviews : reviewHistory}
              type={activeTab}
              onReviewClick={handleReviewClick}
            />
          </div>
        </div>

        {/* Delete Button */}
        <div className="flex justify-end">
          <button
            onClick={handleDeleteClick}
            className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-semibold flex items-center gap-2"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Reviewer
          </button>
        </div>
      </DashboardLayout>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Delete Reviewer
              </h3>
              <p className="text-sm text-gray-600 text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Are you sure you want to delete <strong>{reviewer.name}</strong>? This action cannot be undone and will permanently remove all associated data.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
