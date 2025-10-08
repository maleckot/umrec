// app/secretariatmodule/submissions/details/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import ClassificationPanel from '@/components/staff-secretariat-admin/submission-details/ClassificationPanel';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';

export default function SecretariatSubmissionDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');

  // Original documents that were consolidated
  const originalDocuments = [
    'Application Form Ethics Review.pdf',
    'Research Protocol.pdf',
    'Informed Consent Form.pdf',
    'Validated Research Instrument.pdf',
    'Endorsement Letter.pdf',
    'Proposal defense certification/evaluation.pdf',
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
      title: 'Under Classification',
      date: 'May 16, 2023 • 11:25 AM',
      icon: 'classification' as const,
      isCurrent: true,
      description: 'Waiting for secretariat to classify the submission',
    },
  ];

  const handleClassificationSave = (category: 'Exempted' | 'Expedited' | 'Full Review') => {
    // Save classification to backend
    console.log('Classification saved:', category);
    
    // Navigate based on category
    if (category === 'Exempted') {
      router.push(`/secretariatmodule/submissions/exempted?id=${submissionId}`);
    } else {
      router.push(`/secretariatmodule/submissions/classified?id=${submissionId}&category=${category}`);
    }
  };

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
              <ConsolidatedDocument
                title="Documents"
                description="Please ensure the research paper is thoroughly classified before assigning it to a reviewer."
                consolidatedDate="May 16, 2023 • 11:23 AM"
                fileUrl="/sample-document.pdf"
                originalDocuments={originalDocuments}
              />

              <ClassificationPanel
                systemSuggestedCategory="Expedited"
                onSave={handleClassificationSave}
              />
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                No reviews available yet. Please classify the submission first.
              </p>
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryTab events={historyEvents} />
          )}
        </div>

        {/* Sidebar - Only in overview */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Under Classification"
              details={{
                submissionDate: 'July 24, 2025',
                reviewersRequired: 0,
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
                reviewDue: 'TBD',
                decisionTarget: 'TBD',
              }}
              statusMessage="This submission has been verified and consolidated. Awaiting classification."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
