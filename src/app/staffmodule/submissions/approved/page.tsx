// app/staffmodule/submissions/approved/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, FileCheck, Eye, Send, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';
import { getApprovedDetails } from '@/app/actions/secretariat-staff/staff/getApprovedDetails';
import { releaseApprovalDocuments } from '@/app/actions/secretariat-staff/staff/releaseApprovalDocuments';
import { Suspense } from 'react';

// Confirmation Modal Component
function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Confirm Release
          </h3>
          
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Are you sure you want to release the approval documents to the researcher?
          </p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success Modal Component
function SuccessModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Success!
          </h3>
          
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Documents and certificates released to researcher successfully!
          </p>
          
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function StaffApprovedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [isReleasing, setIsReleasing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getApprovedDetails(submissionId!);
      if (result.success) {
        setData(result);
      } else {
        console.error('Failed to load:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (name: string, url: string) => {
    setSelectedDocument({ name, url });
    setIsModalOpen(true);
  };

  const handleReleaseDocuments = async () => {
    setIsReleasing(true);
    
    try {
      const result = await releaseApprovalDocuments(submissionId!);
      
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        alert(`Failed to release documents: ${result.error}`);
      }
    } catch (error) {
      console.error('Error releasing documents:', error);
      alert('An error occurred while releasing documents');
    } finally {
      setIsReleasing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push('/staffmodule/submissions');
  };

  if (loading) {
    return (
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Loading..." activeNav="submissions">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Not Found" activeNav="submissions">
        <p className="text-center py-12">Submission not found</p>
      </DashboardLayout>
    );
  }

  const { submission, consolidatedDocument, originalDocuments, reviews, assignedReviewers, reviewsComplete, reviewsRequired } = data;

  const approvalDocuments = data.approvalDocuments?.map((doc: any) => ({
    ...doc,
    icon: FileText,
  })) || [];

  const historyEvents = [
    {
      id: 1,
      title: 'Submission Received',
      date: submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
      icon: 'submission' as const,
    },
    {
      id: 2,
      title: 'Document Verification Complete',
      date: consolidatedDocument?.uploadedAt ? new Date(consolidatedDocument.uploadedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
      icon: 'verification' as const,
      description: 'All documents verified and consolidated by staff',
    },
    {
      id: 3,
      title: `Classification - ${submission?.classificationType || 'Full Review'}`,
      date: 'Completed',
      icon: 'classification' as const,
      description: 'Classified by secretariat',
    },
    {
      id: 4,
      title: 'Reviewers Assigned',
      date: 'Completed',
      icon: 'assignment' as const,
      description: `${reviewsRequired} reviewers assigned by staff`,
    },
    {
      id: 5,
      title: 'All Reviews Completed',
      date: 'Completed',
      icon: 'complete' as const,
      description: 'All reviewers have completed their assessments',
    },
    {
      id: 6,
      title: 'Approved for Certificate Release',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      icon: 'complete' as const,
      isCurrent: true,
      description: 'Submission approved and documents generated',
    },
  ];

  const originalDocsList = originalDocuments?.map((doc: any) => doc.name) || [];

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
      {/* Modals */}
      <ConfirmationModal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleReleaseDocuments}
      />
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleSuccessClose}
      />

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
        title={submission?.title || 'Untitled Submission'}
        submittedBy={submission?.researcher?.fullName || 'Unknown'}
        submittedDate={submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
        coAuthors={submission?.coAuthors || 'None'}
        submissionId={submission?.trackingNumber || 'N/A'}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
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

              {/* Approval Documents */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Approval Documents
                </h3>
                
                <div className="space-y-3 mb-6">
                  {approvalDocuments.map((doc: any) => (
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

                <button
                  onClick={() => setShowConfirmModal(true)}
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

              {/* Consolidated Document */}
              <ConsolidatedDocument
                title="Consolidated Document"
                description="All reviews have been completed. You can view the final assessments in the Reviews tab."
                consolidatedDate={consolidatedDocument?.uploadedAt || submission?.submittedAt || 'N/A'}
                fileUrl={consolidatedDocument?.url || ''}
                originalDocuments={originalDocsList}
              />
            </>
          )}

          {activeTab === 'reviews' && (
            <ReviewsTab reviews={reviews || []} completionStatus={`${reviewsComplete}/${reviewsRequired} Reviews Complete`} />
          )}

          {activeTab === 'history' && (
            <HistoryTab events={historyEvents} />
          )}
        </div>

        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Approved"
              category={submission?.classificationType || 'Full Review'}
              details={{
                submissionDate: submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
                reviewersRequired: reviewsRequired || 0,
                reviewersAssigned: reviewsRequired || 0,
              }}
              authorInfo={{
                name: submission?.researcher?.fullName || 'Unknown',
                organization: submission?.researcher?.organization || 'N/A',
                school: submission?.researcher?.school || 'N/A',
                college: submission?.researcher?.college || 'N/A',
                email: submission?.researcher?.email || 'N/A',
              }}
              timeline={{
                submitted: submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
                reviewDue: 'Completed',
                decisionTarget: 'Completed',
              }}
              assignedReviewers={assignedReviewers || []}
              statusMessage="Review documents and release approval certificate and forms to researcher."
            />
          </div>
        )}
      </div>

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

export default function StaffApprovedPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Loading..." activeNav="submissions">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <StaffApprovedContent />
    </Suspense>
  );
}
