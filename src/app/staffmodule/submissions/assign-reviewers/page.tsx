// app/staffmodule/submissions/assign-reviewers/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import DocumentList from '@/components/staff-secretariat-admin/submission-details/DocumentList';
import ReviewerAssignment from '@/components/staff-secretariat-admin/submission-details/ReviewerAssignment';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';

export default function AssignReviewersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const category = searchParams.get('category') || 'Expedited'; // Get from backend
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');

  const documents = [
    'Application Form Ethics Review.pdf',
    'Research Protocol.pdf',
    'Informed Consent Form.pdf',
    'Validated Research Instrument.pdf',
    'Endorsement Letter.pdf',
    'Proposal defense certification/evaluation.pdf',
  ];

  const reviewers = [
    { id: 1, name: 'Prof. Juan Dela Cruz - 201', availability: 'Available' },
    { id: 2, name: 'Prof. Maria Santos - 202', availability: 'Busy' },
    { id: 3, name: 'Prof. Antonio Garcia - 203', availability: 'Available' },
    { id: 4, name: 'Prof. Emily Johnson - 204', availability: 'Available' },
    { id: 5, name: 'Prof. Michael Chen - 205', availability: 'Available' },
  ];

  // Get max reviewers based on category (from backend settings)
  const getMaxReviewers = () => {
    switch (category) {
      case 'Exempted':
        return 0;
      case 'Expedited':
        return 3;
      case 'Full Review':
        return 5;
      default:
        return 3;
    }
  };

  const handleAssign = (selectedReviewers: number[]) => {
    // Update backend with assigned reviewers
    console.log('Assigned reviewers:', selectedReviewers);
    router.push(`/staffmodule/submissions/under-review?id=${submissionId}`);
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
      {/* Better Back Button with Icon */}
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
        title="UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms"
        submittedBy="Juan Dela Cruz"
        submittedDate="July 24, 2025"
        coAuthors="Jeon Wonwoo, Choi Seungcheol, and Lee Dokyeom"
        submissionId="SUB-2025-001"
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conditional Grid - Full width for reviews/history */}
      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        {/* Main Content */}
        <div className={activeTab === 'overview' ? 'lg:col-span-2 space-y-6' : 'w-full'}>
          {activeTab === 'overview' && (
            <>
              <DocumentList
                documents={documents}
                title="Documents"
                description="Please ensure the research paper is thoroughly classified before assigning it to a reviewer."
              />
              
              <ReviewerAssignment
                category={category as any}
                reviewers={reviewers}
                maxReviewers={getMaxReviewers()}
                onAssign={handleAssign}
              />
            </>
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

        {/* Sidebar - Only show in overview tab */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Classified"
              category={category}
              details={{
                submissionDate: 'July 24, 2025',
                reviewersRequired: getMaxReviewers(),
                reviewersAssigned: 0,
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
              statusMessage="This submission has been verified and classified, and is ready for reviewer assignment."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
