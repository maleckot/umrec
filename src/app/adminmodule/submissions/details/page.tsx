// app/adminmodule/submissions/details/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import DocumentList from '@/components/staff-secretariat-admin/submission-details/DocumentList';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';

export default function AdminSubmissionDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const submissionStatus = searchParams.get('status') || 'Under Review';
  
 const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data - determine if submission is consolidated based on status
  const isConsolidated = ['Under Classification', 'Waiting for Reviewers', 'Under Review', 'Under Revision', 'Review Complete'].includes(submissionStatus);

  const individualDocuments = [
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
      status: 'In Progress' as const,
      dueDate: 'June 16, 2023',
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
      isCurrent: true,
    },
  ];

  const handleDelete = () => {
    // Call API to delete submission
    console.log('Deleting submission:', submissionId);
    // After successful deletion, redirect to submissions list
    router.push('/adminmodule/submissions');
  };

  // Replace the getStatusInfo function with this:
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'Under Verification':
      return {
        message: 'Staff is currently verifying the submitted documents.',
        bgGradient: 'from-blue-100 to-blue-200',
        border: 'border-blue-600',
        textColor: 'text-blue-900',
        dotColor: 'bg-blue-600',
      };
    case 'Under Classification':
      return {
        message: 'Secretariat is classifying this submission.',
        bgGradient: 'from-amber-100 to-amber-200',
        border: 'border-amber-600',
        textColor: 'text-amber-900',
        dotColor: 'bg-amber-600',
      };
    case 'Waiting for Reviewers':
      return {
        message: 'Staff is assigning reviewers to this submission.',
        bgGradient: 'from-orange-100 to-orange-200',
        border: 'border-orange-600',
        textColor: 'text-orange-900',
        dotColor: 'bg-orange-600',
      };
    case 'Under Review':
      return {
        message: 'This submission is currently under review by assigned reviewers.',
        bgGradient: 'from-purple-100 to-purple-200',
        border: 'border-purple-600',
        textColor: 'text-purple-900',
        dotColor: 'bg-purple-600',
      };
    case 'Under Revision':
      return {
        message: 'Researcher is revising the submission based on reviewer feedback.',
        bgGradient: 'from-pink-100 to-pink-200',
        border: 'border-pink-600',
        textColor: 'text-pink-900',
        dotColor: 'bg-pink-600',
      };
    case 'Review Complete':
      return {
        message: 'All reviews have been completed. Awaiting final decision.',
        bgGradient: 'from-green-100 to-green-200',
        border: 'border-green-600',
        textColor: 'text-green-900',
        dotColor: 'bg-green-600',
      };
    default:
      return {
        message: 'Status information not available.',
        bgGradient: 'from-gray-100 to-gray-200',
        border: 'border-gray-600',
        textColor: 'text-gray-900',
        dotColor: 'bg-gray-600',
      };
  }
};

const statusInfo = getStatusInfo(submissionStatus);


  return (
    <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Submission Details" activeNav="submissions">
      {/* Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push('/adminmodule/submissions')}
          className="flex items-center gap-2 text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <ArrowLeft size={20} />
          Back to Submissions
        </button>

        {/* Delete Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <Trash2 size={18} />
          Delete Submission
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
      
{/* Status Information Banner */}
<div className={`bg-gradient-to-r ${statusInfo.bgGradient} border-2 ${statusInfo.border} rounded-xl p-6`}>
  <div className="flex items-start gap-4">
    <div className={`w-3 h-3 rounded-full ${statusInfo.dotColor} mt-1.5 flex-shrink-0 animate-pulse`}></div>
    <div>
      <h3 className={`text-lg font-bold ${statusInfo.textColor} mb-2`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Current Status: {submissionStatus}
      </h3>
      <p className={`text-sm ${statusInfo.textColor}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {statusInfo.message}
      </p>
    </div>
  </div>
</div>

              {/* Show consolidated or individual documents based on status */}
              {isConsolidated ? (
                <ConsolidatedDocument
                  title="Consolidated Document"
                  description="All documents have been verified and consolidated."
                  consolidatedDate="May 16, 2023 • 11:23 AM"
                  fileUrl="/sample-document.pdf"
                  originalDocuments={individualDocuments}
                />
              ) : (
                <DocumentList
                  documents={individualDocuments}
                  title="Documents"
                  description="Please verify all submission documents are complete and meet requirements."
                />
              )}
            </>
          )}

          {activeTab === 'reviews' && (
            <>
              {submissionStatus === 'Under Review' || submissionStatus === 'Review Complete' || submissionStatus === 'Under Revision' ? (
                <ReviewsTab reviews={reviews} completionStatus="1/2 Reviews Complete" />
              ) : (
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    No reviews available yet. This submission has not been assigned to reviewers.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <HistoryTab events={historyEvents} />
          )}
        </div>

        {/* Sidebar - Only in overview */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status={submissionStatus}
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
              assignedReviewers={
                submissionStatus === 'Under Review' || submissionStatus === 'Review Complete' || submissionStatus === 'Under Revision'
                  ? ['Prof. Juan Dela Cruz', 'Prof. Anton John Garcia']
                  : undefined
              }
              statusMessage={statusInfo.message}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Delete Submission
              </h3>
            </div>

            <p className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Are you sure you want to delete this submission?
            </p>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-bold text-red-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {submissionId}
              </p>
              <p className="text-xs text-red-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                UMREConnect: An AI-Powered Web Application...
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-yellow-900 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                ⚠️ Warning: This action cannot be undone. All associated data including documents, reviews, and history will be permanently deleted.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
