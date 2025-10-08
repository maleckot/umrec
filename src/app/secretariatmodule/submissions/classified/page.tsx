// app/secretariatmodule/submissions/classified/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';

export default function SecretariatClassifiedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const category = searchParams.get('category') || 'Expedited';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');

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
      title: `Classification - ${category}`,
      date: 'May 21, 2023 • 1:43 PM',
      icon: 'classification' as const,
      isCurrent: true,
      description: `Submission classified as ${category} by secretariat`,
    },
  ];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Exempted':
        return 'from-blue-50 to-indigo-50 border-blue-500';
      case 'Expedited':
        return 'from-yellow-50 to-amber-50 border-yellow-500';
      case 'Full Review':
        return 'from-red-50 to-rose-50 border-red-500';
      default:
        return 'from-gray-50 to-gray-100 border-gray-500';
    }
  };

  const getCategoryTextColor = (cat: string) => {
    switch (cat) {
      case 'Exempted':
        return 'text-blue-900';
      case 'Expedited':
        return 'text-yellow-900';
      case 'Full Review':
        return 'text-red-900';
      default:
        return 'text-gray-900';
    }
  };

  const getCategoryIconColor = (cat: string) => {
    switch (cat) {
      case 'Exempted':
        return 'text-blue-600';
      case 'Expedited':
        return 'text-yellow-600';
      case 'Full Review':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
              {/* Classification Summary */}
              <div className={`bg-gradient-to-r ${getCategoryColor(category)} border-2 rounded-xl p-6`}>
                <div className="flex items-start gap-4">
                  <CheckCircle size={32} className={`${getCategoryIconColor(category)} flex-shrink-0 mt-1`} />
                  <div>
                    <h3 className={`text-xl font-bold ${getCategoryTextColor(category)} mb-2`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Classification Summary
                    </h3>
                    <p className={`text-lg font-bold ${getCategoryTextColor(category)} mb-2`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Review Category: {category}
                    </p>
                    <p className={`text-sm ${getCategoryTextColor(category)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {category === 'Exempted' && 'This submission has been marked as Exempted from review. No reviewers will be assigned to this submission.'}
                      {category === 'Expedited' && 'This submission has been marked as Expedited from review. The staff will now assign reviewers to this submission.'}
                      {category === 'Full Review' && 'This submission has been marked as Full Review from review. The staff will now assign reviewers to this submission.'}
                    </p>
                  </div>
                </div>
              </div>

              <ConsolidatedDocument
                title="Documents"
                description="This submission has been classified and is ready for the next step."
                consolidatedDate="May 16, 2023 • 11:23 AM"
                fileUrl="/sample-document.pdf"
                originalDocuments={originalDocuments}
              />
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                No reviews available yet. Waiting for staff to assign reviewers.
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
              status="Classified"
              category={category}
              details={{
                submissionDate: 'July 24, 2025',
                reviewersRequired: category === 'Exempted' ? 0 : category === 'Expedited' ? 3 : 5,
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
              statusMessage={`This submission has been classified as ${category}. ${category === 'Exempted' ? 'No reviewers needed.' : 'Waiting for staff to assign reviewers.'}`}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
