// app/secretariatmodule/submissions/review-complete/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';

export default function SecretariatReviewCompletePage() {
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
      ],
    },
    {
      id: 2,
      reviewerName: 'Prof. Anton John Garcia',
      status: 'Complete' as const,
      completedDate: 'May 28, 2023',
      overallAssessment: 'The research methodology is sound and the ethical considerations have been thoroughly addressed.',
      feedbacks: [],
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
      title: 'Review Complete',
      date: 'May 28, 2023 • 3:30 PM',
      icon: 'complete' as const,
      isCurrent: true,
      description: 'All reviewers have completed their assessments',
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
              {/* Completion Notice */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle size={32} className="text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Review Complete
                    </h3>
                    <p className="text-sm text-green-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      All reviewers have completed their assessments. This submission is now ready for final decision by the UMREC board.
                    </p>
                  </div>
                </div>
              </div>

              <ConsolidatedDocument
                title="Consolidated Document"
                description="All reviews have been completed. You can view the final assessments in the Reviews tab."
                consolidatedDate="May 16, 2023 • 11:23 AM"
                fileUrl="/sample-document.pdf"
                originalDocuments={originalDocuments}
              />
            </>
          )}

          {activeTab === 'reviews' && (
            <ReviewsTab reviews={reviews} completionStatus="2/2 Reviews Complete" />
          )}

          {activeTab === 'history' && (
            <HistoryTab events={historyEvents} />
          )}
        </div>

        {/* Sidebar - Only in overview */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Review Complete"
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
              statusMessage="All reviews have been completed. Awaiting final decision from UMREC board."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
