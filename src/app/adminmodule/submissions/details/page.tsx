// app/adminmodule/submissions/details/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import DocumentList from '@/components/staff-secretariat-admin/submission-details/DocumentList';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import { getSubmissionDetails } from '@/app/actions/admin/getAdminSubmissionDetails';

export default function AdminSubmissionDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  const loadData = async () => {
    if (!submissionId) {
      setError('No submission ID provided');
      setLoading(false);
      return;
    }

    console.log('📱 Admin: Loading data for submission:', submissionId);
    setLoading(true);
    
    try {
      const result = await getSubmissionDetails(submissionId);
      
      console.log('📱 Admin: Received result:', result);
      
      if (!result.success) {
        setError(result.error || 'Failed to fetch submission details');
        return;
      }
      
      
      setData(result);
      setError(null);
    } catch (err) {
      console.error('📱 Admin: Error fetching submission:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log('Deleting submission:', submissionId);
    router.push('/adminmodule/submissions');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Under Verification':
        return {
          message: 'Staff is currently verifying the submitted documents.',
          bgGradient: 'from-blue-100 to-blue-200',
          border: 'border-blue-600',
          textColor: 'text-blue-900',
          dotColor: 'bg-blue-600',
        };
      case 'Under Classification':
        return {
          message: 'Secretariat is classifying this submission.',
          bgGradient: 'from-amber-100 to-amber-200',
          border: 'border-amber-600',
          textColor: 'text-amber-900',
          dotColor: 'bg-amber-600',
        };
      case 'Waiting for Reviewers':
        return {
          message: 'Staff is assigning reviewers to this submission.',
          bgGradient: 'from-orange-100 to-orange-200',
          border: 'border-orange-600',
          textColor: 'text-orange-900',
          dotColor: 'bg-orange-600',
        };
      case 'Under Review':
        return {
          message: 'This submission is currently under review by assigned reviewers.',
          bgGradient: 'from-purple-100 to-purple-200',
          border: 'border-purple-600',
          textColor: 'text-purple-900',
          dotColor: 'bg-purple-600',
        };
      case 'Under Revision':
        return {
          message: 'Researcher is revising the submission based on reviewer feedback.',
          bgGradient: 'from-pink-100 to-pink-200',
          border: 'border-pink-600',
          textColor: 'text-pink-900',
          dotColor: 'bg-pink-600',
        };
      case 'Review Complete':
        return {
          message: 'All reviews have been completed. Awaiting final decision.',
          bgGradient: 'from-green-100 to-green-200',
          border: 'border-green-600',
          textColor: 'text-green-900',
          dotColor: 'bg-green-600',
        };
      default:
        return {
          message: 'Status information not available.',
          bgGradient: 'from-gray-100 to-gray-200',
          border: 'border-gray-600',
          textColor: 'text-gray-900',
          dotColor: 'bg-gray-600',
        };
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Loading submission details...
          </span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Submission Details" activeNav="submissions">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-900 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {error || 'Failed to load submission details'}
          </p>
          <button
            onClick={() => router.push('/adminmodule/submissions')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Back to Submissions
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { submission, assignments, reviews, completionStatus, history } = data;
  const statusInfo = getStatusInfo(submission.status);

  console.log('📱 Admin Render - Consolidated URL:', submission.consolidatedDocumentUrl);

  return (
    <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Submission Details" activeNav="submissions">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push('/adminmodule/submissions')}
          className="flex items-center gap-2 text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <ArrowLeft size={20} />
          Back to Submissions
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <Trash2 size={18} />
          Delete Submission
        </button>
      </div>

      <SubmissionHeader
        title={submission.title}
        submittedBy={submission.researcher.name}
        submittedDate={submission.submittedDate}
        coAuthors={submission.coAuthors}
        submissionId={submission.submissionId}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        <div className={activeTab === 'overview' ? 'lg:col-span-2 space-y-6' : 'w-full'}>
          {activeTab === 'overview' && (
            <>
              <div className={`bg-gradient-to-r ${statusInfo.bgGradient} border-2 ${statusInfo.border} rounded-xl p-6`}>
                <div className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full ${statusInfo.dotColor} mt-1.5 flex-shrink-0 animate-pulse`}></div>
                  <div>
                    <h3 className={`text-lg font-bold ${statusInfo.textColor} mb-2`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Current Status: {submission.status}
                    </h3>
                    <p className={`text-sm ${statusInfo.textColor}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {statusInfo.message}
                    </p>
                  </div>
                </div>
              </div>

              {submission.consolidatedDocumentUrl ? (
                <ConsolidatedDocument
                  title="Consolidated Document"
                  description="All documents have been verified and consolidated."
                  consolidatedDate={submission.consolidatedDate || 'N/A'}
                  fileUrl={submission.consolidatedDocumentUrl}
                  originalDocuments={submission.documents}
                />
              ) : (
                <>
                  {submission.status !== 'Under Verification' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-yellow-900 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        ℹ️ Consolidated document not found. Showing individual documents below.
                      </p>
                    </div>
                  )}
                  <DocumentList
                    documents={submission.documents}
                    title="Documents"
                    description={submission.status === 'Under Verification' 
                      ? "Please verify all submission documents are complete and meet requirements."
                      : "Individual documents from submission."}
                  />
                </>
              )}
            </>
          )}

          {activeTab === 'reviews' && (
            <>
              {reviews.length > 0 ? (
                <ReviewsTab reviews={reviews} completionStatus={completionStatus} />
              ) : (
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    No reviews available yet. This submission has not been assigned to reviewers.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <HistoryTab events={history} />
          )}
        </div>

        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status={submission.status}
              category={submission.category}
              details={{
                submissionDate: submission.submittedDate,
                reviewersRequired: assignments.length,
                reviewersAssigned: assignments.length,
              }}
              authorInfo={{
                name: submission.researcher.name,
                organization: submission.researcher.organization,
                school: submission.researcher.school,
                college: submission.researcher.college,
                email: submission.researcher.email,
              }}
              timeline={submission.timeline}
              assignedReviewers={
                assignments.length > 0
                  ? assignments.map((a: any) => a.reviewerName)
                  : undefined
              }
              statusMessage={statusInfo.message}
            />
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Delete Submission
              </h3>
            </div>

            <p className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Are you sure you want to delete this submission?
            </p>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-bold text-red-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {submission.submissionId}
              </p>
              <p className="text-xs text-red-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {submission.title.substring(0, 50)}...
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-yellow-900 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                ⚠️ Warning: This action cannot be undone. All associated data including documents, reviews, and history will be permanently deleted.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
