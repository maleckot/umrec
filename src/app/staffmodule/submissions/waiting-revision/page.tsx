'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import { getWaitingRevisionDetails } from '@/app/actions/secretariat-staff/getWaitingRevisionDetails';
import { Suspense } from 'react';

function WaitingRevisionContent() {
const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getWaitingRevisionDetails(submissionId!);
      if (result.success) {
        setData(result);
      } else {
        console.error('Failed to load:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Loading..." activeNav="submissions">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Not Found" activeNav="submissions">
        <p className="text-center py-12">Submission not found</p>
      </DashboardLayout>
    );
  }

  const { submission, documentsWithFeedback, revisionInfo, comments } = data;

  const historyEvents = [
    {
      id: 1,
      title: 'Submission Received',
      date: submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
      icon: 'submission' as const,
    },
    {
      id: 2,
      title: 'Document Verification - Incomplete',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      icon: 'verification' as const,
      isCurrent: true,
      description: `${revisionInfo?.rejectedCount} document(s) need revision`,
    },
  ];

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/staffmodule/submissions')}
          className="flex items-center gap-2 text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <ArrowLeft size={20} />
          Back to Submissions
        </button>
      </div>

      <SubmissionHeader
        title={submission?.title || 'Untitled'}
        submittedBy={submission?.researcher?.fullName || 'Unknown'}
        submittedDate={submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
        coAuthors={submission?.coAuthors || 'None'}
        submissionId={submission?.trackingNumber || 'N/A'}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conditional Grid */}
      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        {/* Main Content */}
        <div className={activeTab === 'overview' ? 'lg:col-span-2' : 'w-full'}>
          {activeTab === 'overview' && (
            <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
              <div className="bg-[#101C50] p-4 lg:p-6">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Document Feedback
                </h3>
              </div>

              <div className="p-4 lg:p-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    This submission has been marked as incomplete and is awaiting revision from the researcher.
                    {revisionInfo?.rejectedCount > 0 && (
                      <strong className="block mt-1">{revisionInfo.rejectedCount} document(s) need revision</strong>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  {documentsWithFeedback?.map((doc: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className={`p-3 ${doc.status === 'Rejected' ? 'bg-red-50' :
                          doc.status === 'Approved' ? 'bg-green-50' : 'bg-gray-50'
                        }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {doc.name}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doc.status === 'Rejected' ? 'bg-red-600 text-white' :
                              doc.status === 'Approved' ? 'bg-green-600 text-white' :
                                'bg-gray-600 text-white'
                            }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {doc.status}
                          </span>
                        </div>
                        {doc.feedback && (
                          <div className="mt-2 p-2 bg-white rounded border border-red-200">
                            <p className="text-xs text-red-800 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              <span className="font-semibold">Feedback:</span> {doc.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Staff Comments Section */}
                {comments && comments.length > 0 && (
                  <div className="mt-6 border-t pt-6">
                    <h4 className="font-bold text-gray-800 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Staff Comments
                    </h4>
                    <div className="space-y-3">
                      {comments.map((comment: any) => (
                        <div key={comment.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {comment.commentText}
                          </p>
                          <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            — {comment.staffName} • {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                No reviews available. Documents must be revised and re-verified first.
              </p>
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryTab events={historyEvents} />
          )}
        </div>

        {/* Sidebar */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Under Revision"
              details={{
                submissionDate: submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
                reviewersRequired: revisionInfo?.reviewersRequired || 0, // ✅ Use from revisionInfo
                reviewersAssigned: revisionInfo?.reviewersAssigned || 0, // ✅ Use from revisionInfo
              }}
              authorInfo={{
                name: submission?.researcher?.fullName || 'Unknown',
                organization: submission?.researcher?.organization || 'N/A',
                school: submission?.researcher?.school || 'N/A',
                college: submission?.researcher?.college || 'N/A',
                email: submission?.researcher?.email || 'N/A',
              }}
              timeline={{
                submitted: submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
                reviewDue: 'Pending Revision',
                decisionTarget: 'Pending Revision',
              }}
              statusMessage="This submission is waiting for revision from the researcher."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default function WaitingRevisionPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Loading..." activeNav="submissions">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <WaitingRevisionContent />
    </Suspense>
  );
}
