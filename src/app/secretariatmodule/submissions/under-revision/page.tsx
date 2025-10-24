// app/secretariatmodule/submissions/under-revision/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, AlertCircle, FileX, MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import { Suspense } from 'react';

function UnderRevisionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');

  const originalDocuments = [
    'Application Form Ethics Review.pdf',
    'Research Protocol.pdf',
    'Informed Consent Form.pdf',
    'Validated Research Instrument.pdf',
    'Endorsement Letter.pdf',
    'Proposal defense certification/evaluation.pdf',
  ];

  const reviews = [
    {
      id: 1,
      reviewerName: 'Prof. Juan Dela Cruz',
      status: 'Complete' as const,
      completedDate: 'May 25, 2023',
      overallAssessment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      feedbacks: [
        {
          document: 'Research Protocol',
          comment: 'It is essential that [Specific Section/Issue Name] be addressed and revised accordingly',
        },
        {
          document: 'Informed Consent Form',
          comment: 'Please clarify the participant withdrawal process and update Section 3.2',
        },
      ],
    },
    {
      id: 2,
      reviewerName: 'Prof. Anton John Garcia',
      status: 'Complete' as const,
      completedDate: 'May 28, 2023',
      overallAssessment: 'The research methodology requires significant improvements before approval can be granted.',
      feedbacks: [
        {
          document: 'Research Protocol',
          comment: 'The data collection methods need to be revised to ensure participant confidentiality',
        },
      ],
    },
  ];

  const revisionRequests = [
    {
      id: 1,
      document: 'Research Protocol',
      reviewer: 'Prof. Juan Dela Cruz',
      comment: 'It is essential that [Specific Section/Issue Name] be addressed and revised accordingly',
      dateRequested: 'May 25, 2023',
    },
    {
      id: 2,
      document: 'Informed Consent Form',
      reviewer: 'Prof. Juan Dela Cruz',
      comment: 'Please clarify the participant withdrawal process and update Section 3.2',
      dateRequested: 'May 25, 2023',
    },
    {
      id: 3,
      document: 'Research Protocol',
      reviewer: 'Prof. Anton John Garcia',
      comment: 'The data collection methods need to be revised to ensure participant confidentiality',
      dateRequested: 'May 28, 2023',
    },
  ];

  const historyEvents = [
    {
      id: 1,
      title: 'Submission Received',
      date: 'May 15, 2023 • 09:45 AM',
      icon: 'submission' as const,
    },
    {
      id: 2,
      title: 'Document Verification Complete',
      date: 'May 16, 2023 • 11:23 AM',
      icon: 'verification' as const,
      description: 'All documents verified and consolidated by staff',
    },
    {
      id: 3,
      title: 'Classification - Expedited',
      date: 'May 21, 2023 • 1:43 PM',
      icon: 'classification' as const,
      description: 'Classified as Expedited by secretariat',
    },
    {
      id: 4,
      title: 'Reviewers Assigned',
      date: 'May 22, 2023 • 10:15 AM',
      icon: 'assignment' as const,
      description: '2 reviewers assigned by staff',
    },
    {
      id: 5,
      title: 'Under Review',
      date: 'May 22, 2023 • 10:16 AM',
      icon: 'review' as const,
    },
    {
      id: 6,
      title: 'All Reviews Completed',
      date: 'May 28, 2023 • 3:30 PM',
      icon: 'complete' as const,
      description: 'All reviewers have completed their assessments',
    },
    {
      id: 7,
      title: 'Revision Required',
      date: 'May 29, 2023 • 9:00 AM',
      icon: 'revision' as const,
      isCurrent: true,
      description: 'Reviewers requested revisions to 3 documents',
    },
  ];
 return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
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
        title="UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms"
        submittedBy="Juan Dela Cruz"
        submittedDate="July 24, 2025"
        coAuthors="Jeon Wonwoo, Choi Seungcheol, and Lee Dokyeom"
        submissionId="SUB-2025-001"
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
                    <h3 className="text-xl font-bold text-red-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Revisions Required
                    </h3>
                    <p className="text-sm text-red-800 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Reviewers have completed their assessments and requested revisions to specific documents. The researcher has been notified and is currently working on the revisions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Revision Requests Card */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileX size={24} className="text-red-600" />
                  <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Revision Requests ({revisionRequests.length})
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {revisionRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {request.document}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Requested by <strong>{request.reviewer}</strong> on {request.dateRequested}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MessageSquare size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {request.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <strong>Note:</strong> The researcher has been notified of these revision requests and will resubmit the updated documents. Once resubmitted, the documents will need to be re-verified by staff before being sent back for review.
                  </p>
                </div>
              </div>

              <ConsolidatedDocument
                title="Consolidated Document"
                description="The submission is currently under revision. Reviewers have completed their assessments and requested changes."
                consolidatedDate="May 16, 2023 • 11:23 AM"
                fileUrl="/sample-document.pdf"
                originalDocuments={originalDocuments}
              />
            </>
          )}

          {activeTab === 'reviews' && (
            <ReviewsTab reviews={reviews} completionStatus="2/2 Reviews Complete - Revisions Requested" />
          )}

          {activeTab === 'history' && (
            <HistoryTab events={historyEvents} />
          )}
        </div>

        {/* Sidebar - Only in overview */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Under Revision"
              category="Expedited"
              details={{
                submissionDate: 'July 24, 2025',
                reviewersRequired: 2,
                reviewersAssigned: 2,
              }}
              authorInfo={{
                name: 'Juan Dela Cruz',
                organization: 'Internal (UMAK)',
                school: 'University of Makati',
                college: 'College of Computing and Information Sciences',
                email: 'jdelacruz.st2342@umak.edu.ph',
              }}
              timeline={{
                submitted: 'July 24, 2025',
                reviewDue: 'August 5, 2025',
                decisionTarget: 'August 10, 2025',
              }}
              assignedReviewers={[
                'Prof. Juan Dela Cruz',
                'Prof. Anton John Garcia',
              ]}
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
    <Suspense fallback={
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <UnderRevisionContent />
    </Suspense>
  );
}