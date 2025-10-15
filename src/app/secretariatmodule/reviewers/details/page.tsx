// app/secretariatmodule/reviewers/details/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Building2, Edit2 } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReviewerStatsCards from '@/components/staff-secretariat-admin/reviewers/ReviewerStatsCards';
import ReviewerReviewsTable from '@/components/staff-secretariat-admin/reviewers/ReviewerReviewsTable';
import { getReviewerDetails } from '@/app/actions/secretariat-staff/getReviewerDetails';
import { updateReviewerCode } from '@/app/actions/secretariat-staff/updateReviewerCode';

export default function SecretariatReviewerDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewerId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [reviewerCode, setReviewerCode] = useState('');
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewerData, setReviewerData] = useState<any>(null);

  useEffect(() => {
    if (reviewerId) {
      loadReviewerDetails();
    }
  }, [reviewerId]);

  const loadReviewerDetails = async () => {
    if (!reviewerId) return;
    
    setLoading(true);
    const result = await getReviewerDetails(reviewerId);
    
    if (result.success && result.reviewer) {
      setReviewerData(result);
      setReviewerCode(result.reviewer.code);
    } else {
      console.error('Failed to load reviewer:', result.error);
    }
    setLoading(false);
  };

  const handleSaveCode = async () => {
    if (!reviewerId) return;

    const result = await updateReviewerCode(reviewerId, reviewerCode);
    
    if (result.success) {
      console.log('✅ Code updated successfully');
      setIsEditingCode(false);
      loadReviewerDetails();
    } else {
      console.error('Failed to update code:', result.error);
      alert('Failed to update reviewer code');
    }
  };

  const handleReviewClick = (reviewId: string) => {
    router.push(`/secretariatmodule/submissions/details?id=${reviewId}`);
  };

  if (loading) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
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
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
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
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
      <div className="mb-6">
        <button
          onClick={() => router.push('/secretariatmodule/reviewers')}
          className="flex items-center gap-2 text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <ArrowLeft size={20} />
          Back to Reviewers
        </button>
      </div>

      {/* Reviewer Header */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left side - Reviewer Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-white sm:w-10 sm:h-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {reviewer.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="flex-shrink-0" />
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="flex-shrink-0" />
                  <span className="break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Reviewer Code */}
          <div className="text-left lg:text-right">
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Reviewer Code
            </p>
            {isEditingCode ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={reviewerCode}
                  onChange={(e) => setReviewerCode(e.target.value)}
                  className="w-20 px-2 py-1 text-2xl sm:text-3xl font-bold text-gray-900 border-2 border-blue-500 rounded text-center"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleSaveCode}
                    className="px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 whitespace-nowrap"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setReviewerCode(reviewer.code);
                      setIsEditingCode(false);
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs sm:text-sm rounded hover:bg-gray-400 whitespace-nowrap"
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
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 size={18} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReviewerStatsCards
        availability={reviewer.availability}
        reviewStatus={reviewer.reviewStatus}
        activeReviews={reviewer.activeReviews}
      />

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-gray-600" />
          <div>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              College/Department
            </p>
            <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {reviewer.college}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
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
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
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

        <div className="p-6">
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
