// app/secretariatmodule/submissions/approved/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, FileCheck, Eye, Send, FileText } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';

export default function SecretariatApprovedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [isReleasing, setIsReleasing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string } | null>(null);

  const originalDocuments = [
    'Application Form Ethics Review.pdf',
    'Research Protocol.pdf',
    'Informed Consent Form.pdf',
    'Validated Research Instrument.pdf',
    'Endorsement Letter.pdf',
    'Proposal defense certification/evaluation.pdf',
  ];

  const approvalDocuments = [
    {
      id: 1,
      title: 'Certificate of Approval of Ethical Review',
      description: 'Official certificate confirming ethical approval',
      url: '/sample-certificate.pdf',
      icon: FileText,
    },
    {
      id: 2,
      title: 'Form 0011 - Approval Notice',
      description: 'Formal approval notice document',
      url: '/sample-form-0011.pdf',
      icon: FileText,
    },
    {
      id: 3,
      title: 'Form 0012 - Research Ethics Clearance',
      description: 'Ethics clearance documentation',
      url: '/sample-form-0012.pdf',
      icon: FileText,
    },
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
      title: 'All Reviews Completed',
      date: 'May 28, 2023 • 3:30 PM',
      icon: 'complete' as const,
      description: 'All reviewers have completed their assessments',
    },
    {
      id: 7,
      title: 'Approved for Certificate Release',
      date: 'May 29, 2023 • 10:00 AM',
      icon: 'complete' as const,
      isCurrent: true,
      description: 'Submission approved and documents generated',
    },
  ];

  const handleViewDocument = (name: string, url: string) => {
    setSelectedDocument({ name, url });
    setIsModalOpen(true);
  };

  const handleReleaseDocuments = async () => {
    setIsReleasing(true);
    // Simulate releasing documents to researcher
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsReleasing(false);
    alert('Documents released to researcher successfully!');
    // Redirect to review-complete after release
    router.push(`/secretariatmodule/submissions/review-complete?id=${submissionId}`);
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
              {/* Approval Notice */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <FileCheck size={32} className="text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Ready for Certificate Release
                    </h3>
                    <p className="text-sm text-blue-800 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      All reviews have been completed and approval documents have been generated. Review the documents below and release them to the researcher.
                    </p>
                  </div>
                </div>
              </div>

              {/* Approval Documents Card */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Approval Documents
                </h3>
                
                <div className="space-y-3 mb-6">
                  {approvalDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <doc.icon size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {doc.title}
                          </h4>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {doc.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDocument(doc.title, doc.url)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </div>
                  ))}
                </div>

                {/* Release Button */}
                <button
                  onClick={handleReleaseDocuments}
                  disabled={isReleasing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <Send size={20} />
                  {isReleasing ? 'Releasing Documents...' : 'Release Documents to Researcher'}
                </button>

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-xs text-yellow-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <strong>Note:</strong> Once released, the documents will be sent to the researcher and the submission status will be updated to "Review Complete".
                  </p>
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
              status="Approved"
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
              statusMessage="Review documents and release approval certificate and forms to researcher."
            />
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {isModalOpen && selectedDocument && (
        <DocumentViewerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          documentName={selectedDocument.name}
          documentUrl={selectedDocument.url}
        />
      )}
    </DashboardLayout>
  );
}
