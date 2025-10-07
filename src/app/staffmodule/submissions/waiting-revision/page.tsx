// app/staffmodule/submissions/waiting-revision/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';

export default function WaitingRevisionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');

  // Documents with rejection feedback
  const documentsWithFeedback = [
    { name: 'Application Form Ethics Review', status: 'Rejected', feedback: 'The form is incomplete. Please ensure all required fields are filled.' },
    { name: 'Research Protocol', status: 'Approved', feedback: null },
    { name: 'Informed Consent Form', status: 'Rejected', feedback: 'Please update the consent form with the latest institutional requirements.' },
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
      title: 'Document Verification - Incomplete',
      date: 'May 16, 2023 • 11:23 AM',
      icon: 'verification' as const,
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
            <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
              <div className="bg-[#101C50] p-4 lg:p-6">
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Document Feedback
                </h3>
              </div>
              
              <div className="p-4 lg:p-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    This submission has been marked as incomplete and is awaiting revision from the researcher.
                  </p>
                </div>

                <div className="space-y-3">
                  {documentsWithFeedback.map((doc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className={`p-3 ${doc.status === 'Rejected' ? 'bg-red-50' : 'bg-green-50'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {doc.name}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            doc.status === 'Rejected' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                          }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {doc.status}
                          </span>
                        </div>
                        {/* Darker feedback text */}
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

        {/* Sidebar - Only show in overview tab */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Under Revision"
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
                reviewDue: 'August 5, 2025',
                decisionTarget: 'August 10, 2025',
              }}
              statusMessage="This submission has been waiting for revision from the researcher."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
