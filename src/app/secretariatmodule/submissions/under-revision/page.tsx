// app/secretariatmodule/submissions/under-revision/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import { getWaitingRevisionDetails } from '@/app/actions/secretariat-staff/getWaitingRevisionDetails'; // ✅ REUSE
import { Suspense } from 'react';

function UnderRevisionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // ✅ Fetch data on mount
  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getWaitingRevisionDetails(submissionId!); // ✅ REUSE THE SAME ACTION
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
      <DashboardLayout
        role="secretariat"
        roleTitle="Secretariat"
        pageTitle="Loading..."
        activeNav="submissions"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout
        role="secretariat"
        roleTitle="Secretariat"
        pageTitle="Not Found"
        activeNav="submissions"
      >
        <p className="text-center py-12">Submission not found</p>
      </DashboardLayout>
    );
  }

  const { submission, documentsWithFeedback, revisionInfo, comments } = data;

  // Build revision requests from documents
  const revisionRequests = documentsWithFeedback
    ?.filter((doc: any) => doc.status === 'Rejected')
    .map((doc: any, index: number) => ({
      id: index + 1,
      document: doc.name,
      reviewer: 'Document Review', // Generic since we don't have reviewer info
      comment: doc.feedback || 'Revision required',
      dateRequested: new Date(doc.uploadedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    })) || [];

  const historyEvents = [
    {
      id: 1,
      title: 'Submission Received',
      date: submission?.submittedAt
        ? new Date(submission.submittedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        : 'N/A',
      icon: 'submission' as const,
    },
    {
      id: 2,
      title: 'All Reviews Completed',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      icon: 'complete' as const,
    },
    {
      id: 3,
      title: 'Revision Required',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      icon: 'revision' as const,
      isCurrent: true,
      description: `${revisionInfo?.rejectedCount} document(s) need revision`,
    },
  ];

  return (
    <DashboardLayout
      role="secretariat"
      roleTitle="Secretariat"
      pageTitle="Submission Details"
      activeNav="submissions"
    >
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/secretariatmodule/submissions')}
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
        submittedDate={
          submission?.submittedAt
            ? new Date(submission.submittedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : 'N/A'
        }
        coAuthors={submission?.coAuthors || 'None'}
        submissionId={submission?.trackingNumber || 'N/A'}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conditional Grid */}
      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        {/* Main Content */}
        <div className={activeTab === 'overview' ? 'lg:col-span-2 space-y-6' : 'w-full'}>
          {activeTab === 'overview' && (
            <>
              {/* Revision Notice */}
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-500 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle size={32} className="text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-red-900 mb-2"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      Revisions Required
                    </h3>
                    <p
                      className="text-sm text-red-800 mb-4"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      Reviewers have completed their assessments and requested revisions to specific
                      documents. The researcher has been notified and is currently working on the
                      revisions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Feedback Card */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
                <div className="bg-[#101C50] p-4 lg:p-6">
                  <h3
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Document Status ({documentsWithFeedback?.length || 0})
                  </h3>
                </div>

                <div className="p-4 lg:p-6">
                  <div className="space-y-3">
                    {documentsWithFeedback?.map((doc: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                          className={`p-3 ${
                            doc.status === 'Rejected'
                              ? 'bg-red-50'
                              : doc.status === 'Approved'
                                ? 'bg-green-50'
                                : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="text-sm font-medium text-gray-800"
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              {doc.name}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                doc.status === 'Rejected'
                                  ? 'bg-red-600 text-white'
                                  : doc.status === 'Approved'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-600 text-white'
                              }`}
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              {doc.status}
                            </span>
                          </div>
                          {doc.feedback && (
                            <div className="mt-2 p-2 bg-white rounded border border-red-200">
                              <p
                                className="text-xs text-red-800 font-medium"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                              >
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
                      <h4
                        className="font-bold text-gray-800 mb-3"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        Staff Comments
                      </h4>
                      <div className="space-y-3">
                        {comments.map((comment: any) => (
                          <div key={comment.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p
                              className="text-sm text-gray-800"
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              {comment.commentText}
                            </p>
                            <p
                              className="text-xs text-gray-500 mt-2"
                              style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                              — {comment.staffName} •{' '}
                              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <p
                className="text-gray-500"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Reviews will be available after document re-verification.
              </p>
            </div>
          )}

          {activeTab === 'history' && <HistoryTab events={historyEvents} />}
        </div>

        {/* Sidebar - Only in overview */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Under Revision"
              details={{
                submissionDate:
                  submission?.submittedAt
                    ? new Date(submission.submittedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A',
                reviewersRequired: revisionInfo?.reviewersRequired || 0,
                reviewersAssigned: revisionInfo?.reviewersAssigned || 0,
              }}
              authorInfo={{
                name: submission?.researcher?.fullName || 'Unknown',
                organization: submission?.researcher?.organization || 'N/A',
                school: submission?.researcher?.school || 'N/A',
                college: submission?.researcher?.college || 'N/A',
                email: submission?.researcher?.email || 'N/A',
              }}
              timeline={{
                submitted:
                  submission?.submittedAt
                    ? new Date(submission.submittedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A',
                reviewDue: 'Pending Revision',
                decisionTarget: 'Pending Revision',
              }}
              statusMessage="Awaiting revised documents from researcher. Once submitted, staff will need to verify before sending back for review."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function SecretariatUnderRevisionPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout
          role="secretariat"
          roleTitle="Secretariat"
          pageTitle="Loading..."
          activeNav="submissions"
        >
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      }
    >
      <UnderRevisionContent />
    </Suspense>
  );
}
