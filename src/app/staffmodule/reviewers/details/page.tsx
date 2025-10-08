// app/staffmodule/reviewers/details/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Building2, Edit2 } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReviewerStatsCards from '@/components/staff-secretariat-admin/reviewers/ReviewerStatsCards';
import ReviewerReviewsTable from '@/components/staff-secretariat-admin/reviewers/ReviewerReviewsTable';

export default function ReviewerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const reviewerId = params.id;

  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [reviewerCode, setReviewerCode] = useState('201');
  const [isEditingCode, setIsEditingCode] = useState(false);

  // Mock reviewer data
  const reviewer = {
    id: reviewerId,
    name: 'Prof. Juan Dela Cruz',
    email: 'email123@umak.edu.ph',
    phone: '09994455353',
    college: 'College of Computing and Information Sciences',
    code: reviewerCode,
    availability: 'Available',
    reviewStatus: 'On Track',
    activeReviews: 5,
  };

  // Current reviews data
  const currentReviews = [
    {
      id: 'SUB-2025-001',
      title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
      dueDate: '07-24-2025',
      status: 'Under Review',
    },
    {
      id: 'SUB-2025-002',
      title: 'Impact of Social Media on Mental Health Research Study',
      dueDate: '07-20-2025',
      status: 'Overdue',
    },
    {
      id: 'SUB-2025-003',
      title: 'Climate Change Adaptation Strategies Analysis',
      dueDate: '07-28-2025',
      status: 'Under Review',
    },
  ];

  // Review history data
  const reviewHistory = [
    {
      id: 'SUB-2024-045',
      title: 'Machine Learning in Healthcare Applications',
      completedDate: '08-14-2025',
      status: 'Review Complete',
    },
    {
      id: 'SUB-2024-046',
      title: 'Blockchain Technology in Supply Chain Management',
      completedDate: '08-10-2025',
      status: 'Review Complete',
    },
    {
      id: 'SUB-2024-047',
      title: 'IoT-Based Smart Home Energy Management',
      completedDate: '07-30-2025',
      status: 'Review Complete',
    },
  ];

  const handleSaveCode = () => {
    // Save code to backend
    console.log('Saving code:', reviewerCode);
    setIsEditingCode(false);
  };

  const handleReviewClick = (reviewId: string) => {
    // Navigate to submission details with reviewer context
    router.push(`/staffmodule/reviewers/submission-details?submissionId=${reviewId}&reviewerId=${reviewerId}`);
  };

  return (
  <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewer Details" activeNav="reviewers">
    {/* Back Button */}
    <div className="mb-4 sm:mb-6">
      <button
        onClick={() => router.push('/staffmodule/reviewers')}
        className="flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Back to Reviewers</span>
        <span className="sm:hidden">Back</span>
      </button>
    </div>

    {/* Reviewer Header */}
    <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left side - Reviewer Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0">
            <User size={24} className="text-white sm:w-8 sm:h-8" />
          </div>
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {reviewer.name}
            </h1>
            <div className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={14} className="flex-shrink-0 sm:w-4 sm:h-4" />
                <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="flex-shrink-0 sm:w-4 sm:h-4" />
                <span className="break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Reviewer Code */}
        <div className="text-left lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Reviewer Code
          </p>
          {isEditingCode ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <input
                type="text"
                value={reviewerCode}
                onChange={(e) => setReviewerCode(e.target.value)}
                className="w-full sm:w-20 px-2 py-1 text-2xl sm:text-3xl font-bold text-gray-900 border-2 border-blue-500 rounded text-center"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveCode}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 whitespace-nowrap"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setReviewerCode(reviewer.code);
                    setIsEditingCode(false);
                  }}
                  className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-300 text-gray-700 text-xs sm:text-sm rounded hover:bg-gray-400 whitespace-nowrap"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {reviewerCode}
              </p>
              <button
                onClick={() => setIsEditingCode(true)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 size={16} className="text-gray-600 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Stats Cards */}
    <ReviewerStatsCards
      availability={reviewer.availability}
      reviewStatus={reviewer.reviewStatus}
      activeReviews={reviewer.activeReviews}
    />

    {/* College Information */}
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 mb-4 sm:mb-6">
      <div className="flex items-center gap-3">
        <Building2 size={18} className="text-gray-600 flex-shrink-0 sm:w-5 sm:h-5" />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            College/Department
          </p>
          <p className="text-xs sm:text-sm font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {reviewer.college}
          </p>
        </div>
      </div>
    </div>

    {/* Reviews Section */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
            Current Reviews
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
            Review History
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        <ReviewerReviewsTable
          reviews={activeTab === 'current' ? currentReviews : reviewHistory}
          type={activeTab}
          onReviewClick={handleReviewClick}
        />
      </div>
    </div>
  </DashboardLayout>
);
}
