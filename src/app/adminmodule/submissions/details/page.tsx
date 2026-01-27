'use client';

import { useState, useEffect, Suspense } from 'react';
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
import { deleteSubmission } from '@/app/actions/admin/deleteSubmission';
import { getStatusInfo, formatStatusDisplay } from '@/utils/statusUtils';

function AdminSubmissionDetailsContent() {
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

    setLoading(true);
    try {
      const result = await getSubmissionDetails(submissionId);
      if (!result.success) {
        setError(result.error || 'Failed to fetch submission details');
        return;
      }
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching submission:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!submissionId) return;

    try {
      const result = await deleteSubmission(submissionId);
      if (result.success) {
        alert('Submission deleted successfully!');
        router.push('/adminmodule/submissions');
      } else {
        alert(`Failed to delete: ${result.error}`);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('An error occurred while deleting the submission');
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#101C50]" />
          <span className="mt-3 text-gray-600 font-medium text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Loading submission details...
          </span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Submission Details" activeNav="submissions">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto mt-10">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-red-900 font-semibold mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {error || 'Failed to load submission details'}
          </p>
          <button
            onClick={() => router.push('/adminmodule/submissions')}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold shadow-sm"
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
  const displayStatus = formatStatusDisplay(submission.status);

  return (
    <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Submission Details" activeNav="submissions">
      <div className="max-w-[1600px] mx-auto w-full pb-8">
        
        {/* Responsive Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => router.push('/adminmodule/submissions')}
            className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#101C50] hover:text-blue-700 transition-colors w-fit"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <ArrowLeft size={20} />
            <span>Back to Submissions</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors text-sm font-bold w-full sm:w-auto"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <Trash2 size={18} />
            Delete Submission
          </button>
        </div>

        {/* Submission Header Info */}
        <div className="mb-6">
          <SubmissionHeader
            title={submission.title}
            submittedBy={submission.researcher.name}
            submittedDate={submission.submittedDate}
            coAuthors={submission.coAuthors}
            submissionId={submission.submissionId}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* 
            FIX APPLIED HERE:
            Added 'min-w-0' to the main content column. 
            This prevents flex/grid children (like long filenames) from pushing the layout width out.
        */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Column */}
          <div className={`${activeTab === 'overview' ? 'xl:col-span-2' : 'xl:col-span-3'} space-y-6 min-w-0`}>
            
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status Card */}
                <div className={`bg-gradient-to-r ${statusInfo.bgGradient} border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full ${statusInfo.dotColor} mt-2 flex-shrink-0 animate-pulse`}></div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-lg sm:text-xl font-bold ${statusInfo.textColor} mb-2`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Current Status: {displayStatus}
                      </h3>
                      <p className={`text-sm sm:text-base ${statusInfo.textColor} opacity-90 leading-relaxed`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {statusInfo.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="min-w-0">
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
                      {!displayStatus.includes('Verification') && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-900 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Consolidated document not found. Showing individual documents below.
                          </p>
                        </div>
                      )}
                      <DocumentList
                        documents={submission.documents}
                        title="Documents"
                        description={displayStatus.includes('Verification')
                          ? 'Please verify all submission documents are complete and meet requirements.'
                          : 'Individual documents from submission.'}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {reviews.length > 0 ? (
                  <ReviewsTab reviews={reviews} completionStatus={completionStatus} />
                ) : (
                  <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm">
                    <p className="text-gray-500 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      No reviews available yet. This submission has not been assigned to reviewers.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <HistoryTab events={history} />
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          {activeTab === 'overview' && (
            <div className="xl:col-span-1 min-w-0">
              <div className="sticky top-6">
                <SubmissionSidebar
                  status={displayStatus}
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
            </div>
          )}
        </div>
      </div>

      {/* Responsive Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Delete Submission
              </h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Are you sure you want to delete this submission? This action cannot be undone.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Target Submission</p>
              <p className="text-sm font-bold text-gray-900 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {submission.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-mono">ID: {submission.submissionId}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-white text-gray-700 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
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

export default function AdminSubmissionDetailsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Submission Details" activeNav="submissions">
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#101C50]" />
          </div>
        </DashboardLayout>
      }
    >
      <AdminSubmissionDetailsContent />
    </Suspense>
  );
}
