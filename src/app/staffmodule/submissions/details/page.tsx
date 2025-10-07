// app/staffmodule/submissions/details/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import DocumentVerificationList from '@/components/staff-secretariat-admin/submission-details/DocumentVerificationList';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';

interface Document {
  id: number;
  name: string;
  isVerified: boolean | null;
  comment: string;
  fileUrl?: string;
}

export default function SubmissionVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [documents, setDocuments] = useState<Document[]>([
    { 
      id: 1, 
      name: 'Application Form Ethics Review', 
      isVerified: null, 
      comment: '',
      fileUrl: '/sample-document.pdf'
    },
    { 
      id: 2, 
      name: 'Research Protocol', 
      isVerified: null, 
      comment: '',
      fileUrl: '/sample-document.pdf'
    },
    { 
      id: 3, 
      name: 'Informed Consent Form', 
      isVerified: null, 
      comment: '',
      fileUrl: '/sample-document.pdf'
    },
    { 
      id: 4, 
      name: 'Validated Research Instrument.pdf', 
      isVerified: null, 
      comment: '',
      fileUrl: '/sample-document.pdf'
    },
    { 
      id: 5, 
      name: 'Endorsement Letter.pdf', 
      isVerified: null, 
      comment: '',
      fileUrl: '/sample-document.pdf'
    },
    { 
      id: 6, 
      name: 'Proposal defense certification/evaluation.pdf', 
      isVerified: null, 
      comment: '',
      fileUrl: '/sample-document.pdf'
    },
  ]);

  const handleVerify = (documentId: number, isApproved: boolean, comment?: string) => {
    setDocuments(documents.map(doc =>
      doc.id === documentId
        ? { ...doc, isVerified: isApproved, comment: comment || '' }
        : doc
    ));
  };

  const allVerified = documents.every(doc => doc.isVerified === true);
  const hasRejected = documents.some(doc => doc.isVerified === false);

  const handleMarkComplete = () => {
    if (allVerified) {
      router.push(`/staffmodule/submissions/waiting-classification?id=${submissionId}`);
    }
  };

  const handleMarkIncomplete = () => {
    if (hasRejected) {
      router.push(`/staffmodule/submissions/waiting-revision?id=${submissionId}`);
    }
  };

  const historyEvents = [
    {
      id: 1,
      title: 'Submission Received',
      date: 'May 15, 2023 • 09:45 AM',
      icon: 'submission' as const,
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
        <div className={activeTab === 'overview' ? 'lg:col-span-2' : 'w-full'}>
          {activeTab === 'overview' && (
            <DocumentVerificationList
              documents={documents}
              onVerify={handleVerify}
            />
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                No reviews available yet. Documents must be verified and classified first.
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
              status="New Submission"
              details={{
                submissionDate: 'July 24, 2025',
                reviewersRequired: 5,
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
              statusMessage={
                hasRejected
                  ? 'This submission needs document revision from the researcher.'
                  : allVerified
                  ? 'All documents verified. Ready to send to secretariat for classification.'
                  : undefined
              }
              onAction={
                allVerified && !hasRejected
                  ? handleMarkComplete
                  : hasRejected
                  ? handleMarkIncomplete
                  : undefined
              }
              actionLabel={
                allVerified && !hasRejected
                  ? 'Mark as Complete'
                  : hasRejected
                  ? 'Mark as Incomplete'
                  : undefined
              }
              actionType={hasRejected ? 'secondary' : 'primary'}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
