// app/staffmodule/reviewers/submission-details/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, History } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewerAssessmentCard from '@/components/staff-secretariat-admin/reviewers/ReviewerAssessmentCard';
import RevisionHistoryCard from '@/components/staff-secretariat-admin/reviewers/RevisionHistoryCard';
import { Suspense } from 'react';

function ReviewerSubmissionDetailsContent() {
const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('submissionId');
  const reviewerId = searchParams.get('reviewerId');

  const [showRevisionHistory, setShowRevisionHistory] = useState(false);

  // Mock reviewer data
  const reviewerData = {
    id: reviewerId,
    name: 'Prof. Juan Dela Cruz',
    code: '201',
  };

  // Mock submission data
  const originalDocuments = [
    'Application Form Ethics Review.pdf',
    'Research Protocol.pdf',
    'Informed Consent Form.pdf',
    'Validated Research Instrument.pdf',
    'Endorsement Letter.pdf',
    'Proposal defense certification/evaluation.pdf',
  ];

  // Current reviewer's assessment
  const currentAssessment = {
    status: 'Complete',
    submittedDate: 'May 25, 2023 • 3:30 PM',
    decision: 'Approved with Minor Revision/s', // Options: 'Approved with No Revision', 'Approved with Minor Revision/s', 'Major Revision/s', 'Resubmission Required', 'Disapproved'
    ethicsReviewRecommendation: 'The research demonstrates strong ethical foundations with clear informed consent procedures and data protection measures. The study design respects participant autonomy and minimizes potential harm. However, minor clarifications are needed regarding the data storage timeline and the process for handling participant withdrawal requests.',
    technicalSuggestions: 'Consider adding a more detailed timeline for each research phase in the protocol. The sampling methodology could benefit from additional justification for the sample size calculation. It would also be helpful to include contingency plans for potential challenges in participant recruitment.',
  };

  // Revision history (if there are previous submissions)
  const revisionHistory = [
    {
      id: 1,
      versionNumber: 1,
      submittedDate: 'April 10, 2023',
      reviewedDate: 'April 20, 2023',
      decision: 'Major Revision/s',
      ethicsReviewRecommendation: 'The initial submission showed promise but required significant revisions to the informed consent process. The risk mitigation strategies needed more detail, and the data handling procedures required clarification.',
      technicalSuggestions: 'Revise the research instrument to include validated scales. Expand the methodology section with more specific details about the research protocol. Include a clearer explanation of how participant anonymity will be maintained.',
    },
    {
      id: 2,
      versionNumber: 2,
      submittedDate: 'May 15, 2023',
      reviewedDate: 'May 25, 2023',
      decision: 'Approved with Minor Revision/s',
      ethicsReviewRecommendation: currentAssessment.ethicsReviewRecommendation,
      technicalSuggestions: currentAssessment.technicalSuggestions,
    },
  ];

  const hasRevisionHistory = revisionHistory.length > 1;

  return (
  <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewer Activity" activeNav="reviewers">
    {/* Back Button */}
    <div className="mb-4 sm:mb-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Back to Reviewer Details</span>
        <span className="sm:hidden">Back</span>
      </button>
    </div>

    {/* Reviewer Info Banner */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <p className="text-xs sm:text-sm text-blue-700 font-semibold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Viewing Activity For:
          </p>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-900 break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {reviewerData.name} (Code: {reviewerData.code})
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {hasRevisionHistory && (
            <button
              onClick={() => setShowRevisionHistory(!showRevisionHistory)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-blue-500 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-xs sm:text-sm"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <History size={16} className="sm:w-5 sm:h-5" />
              <span className="font-semibold whitespace-nowrap">
                {showRevisionHistory ? 'Hide' : 'Show'} Revision History
              </span>
            </button>
          )}
          <div className={`px-3 sm:px-4 py-2 rounded-lg text-center ${
            currentAssessment.status === 'Complete' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <p className="text-xs sm:text-sm font-bold whitespace-nowrap" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Review Status: {currentAssessment.status}
            </p>
          </div>
        </div>
      </div>
    </div>

    <SubmissionHeader
      title="UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms"
      submittedBy="Juan Dela Cruz"
      submittedDate="July 24, 2025"
      coAuthors="Jeon Wonwoo, Choi Seungcheol, and Lee Dokyeom"
      submissionId={submissionId || 'SUB-2025-001'}
    />

    {/* Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Consolidated Document */}
        <ConsolidatedDocument
          title="Consolidated Document"
          description="This is the document reviewed by the selected reviewer."
          consolidatedDate="May 16, 2023 • 11:23 AM"
          fileUrl="/sample-document.pdf"
          originalDocuments={originalDocuments}
        />

        {/* Current Assessment */}
        <ReviewerAssessmentCard
          reviewerName={reviewerData.name}
          reviewerCode={reviewerData.code}
          status={currentAssessment.status}
          submittedDate={currentAssessment.submittedDate}
          decision={currentAssessment.decision}
          ethicsReviewRecommendation={currentAssessment.ethicsReviewRecommendation}
          technicalSuggestions={currentAssessment.technicalSuggestions}
          isCurrentVersion={true}
        />

        {/* Revision History */}
        {showRevisionHistory && hasRevisionHistory && (
          <RevisionHistoryCard
            revisionHistory={revisionHistory}
            reviewerName={reviewerData.name}
          />
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <SubmissionSidebar
          status="Under Review"
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
          statusMessage="Viewing individual reviewer activity and feedback."
        />
      </div>
    </div>
  </DashboardLayout>
);
}
export default function ReviewerSubmissionDetailsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewer Activity" activeNav="reviewers">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <ReviewerSubmissionDetailsContent />
    </Suspense>
  );
}