// app/staffmodule/submissions/details/assign/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import DocumentList from '@/components/staff-secretariat-admin/submission-details/DocumentList';
import ReviewerAssignment from '@/components/staff-secretariat-admin/submission-details/ReviewerAssignment';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';

export default function AssignReviewersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');

  const documents = [
    'Application Form Ethics Review.pdf',
    'Research Protocol.pdf',
    'Informed Consent Form.pdf',
    'Validated Research Instrument.pdf',
    'Endorsement Letter.pdf',
    'Proposal defense certification/evaluation.pdf',
  ];

  // ✅ FIXED: Changed id from number to string
  const reviewers = [
    { id: '1', name: 'Prof. Juan Dela Cruz - 201', availability: 'Available' },
    { id: '2', name: 'Prof. Juan Dela Cruz - 201', availability: 'Available' },
    { id: '3', name: 'Prof. Juan Dela Cruz - 201', availability: 'Available' },
    { id: '4', name: 'Prof. Maria Santos - 202', availability: 'Busy' },
    { id: '5', name: 'Prof. Antonio Garcia - 203', availability: 'Available' },
  ];

  // ✅ FIXED: Changed parameter type from number[] to string[]
  const handleAssign = (selectedReviewers: string[]) => {
    console.log('Assigned reviewers:', selectedReviewers);
    // Navigate to next step or show success
  };

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
    },
    {
      id: 3,
      title: 'Classification',
      date: 'May 21, 2023 • 1:43 PM',
      icon: 'classification' as const,
      isCurrent: true,
    },
  ];

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
      <div className="mb-4">
        <button
          onClick={() => router.push('/staffmodule/submissions')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          ← Back to Submissions
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <DocumentList
                documents={documents}
                title="Documents"
                description="Please ensure the research paper is thoroughly classified before assigning it to a reviewer."
              />
              
              {/* <ReviewerAssignment
                category="Expedited"
                reviewers={reviewers}
                maxReviewers={3}
                onAssign={handleAssign}
              /> */}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                No reviews available yet. Assign reviewers to start the review process.
              </p>
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryTab events={historyEvents} />
          )}
        </div>

        {/* Sidebar */}
        <div>
          <SubmissionSidebar
            status="Under Review"
            category="Expedited"
            details={{
              submissionDate: 'July 24, 2025',
              reviewersRequired: 5,
              reviewersAssigned: 5,
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
            statusMessage="This submission has been verified and classified, and is now under review."
            assignedReviewers={[
              'Prof. Juan Dela Cruz',
              'Prof. Juan Dela Cruz',
              'Prof. Juan Dela Cruz',
              'Prof. Juan Dela Cruz',
            ]}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
