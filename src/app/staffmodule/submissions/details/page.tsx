// app/staffmodule/submissions/details/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import DocumentVerificationList from '@/components/staff-secretariat-admin/submission-details/DocumentVerificationList';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import { getSubmissionDetails } from '@/app/actions/secretariat-staff/staff/getSubmissionDetails';
import { verifySubmissionDocuments } from '@/app/actions/secretariat-staff/staff/verifySubmissionDocuments';
import { completeVerification } from '@/app/actions/completeVerification';
import { Suspense } from 'react';

interface DocumentWithVerification {
  id: string;
  name: string;
  isVerified: boolean | null;
  comment: string;
  fileUrl?: string;
  previousState?: {
    isVerified: boolean | null;
    comment: string;
  } | null;
}
function SubmissionVerificationContent() {
 const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [documents, setDocuments] = useState<DocumentWithVerification[]>([]);

  useEffect(() => {
    console.log('📍 URL submission ID:', submissionId);
    if (submissionId) {
      loadSubmissionData();
    }
  }, [submissionId]);

  const loadSubmissionData = async () => {
    if (!submissionId) return;

    setLoading(true);
    try {
      const result = await getSubmissionDetails(submissionId);

      console.log('Result:', result);

      if (result.success) {
        setSubmissionData(result.submission);

        if (result.documents && result.documents.length > 0) {
          // Filter out consolidated files
          const mappedDocs: DocumentWithVerification[] = result.documents
            .filter((doc: any) => !doc.name.toLowerCase().includes('consolidated'))
            .map((doc: any) => ({
              id: doc.id,
              name: doc.name,
              isVerified: doc.isVerified,
              comment: doc.comment || '',
              fileUrl: doc.url,
              previousState: null,
            }));

          console.log('Mapped documents with verifications:', mappedDocs);
          setDocuments(mappedDocs);
        } else {
          console.warn('No documents found');
          setDocuments([]);
        }
      } else {
        alert(result.error || 'Failed to load submission');
        router.push('/staffmodule/submissions');
      }
    } catch (error) {
      console.error('Error loading submission:', error);
      alert('Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (documentIndex: number, isApproved: boolean, comment?: string) => {
    if (!submissionId) return;

    setIsSaving(true);
    const originalDocuments = [...documents];

    try {
      const updatedDocuments = documents.map((doc, index) =>
        index === documentIndex
          ? {
            ...doc,
            isVerified: isApproved,
            comment: comment || '',
            previousState: {
              isVerified: doc.isVerified,
              comment: doc.comment,
            }
          }
          : doc
      );
      setDocuments(updatedDocuments);

      const result = await verifySubmissionDocuments(
        submissionId,
        [{
          documentId: documents[documentIndex].id,
          isApproved,
          comment: comment || '',
        }],
        undefined
      );

      if (!result.success) {
        alert(`Error: ${result.error}`);
        setDocuments(originalDocuments);
      }
    } catch (error) {
      console.error('Error saving verification:', error);
      alert('Failed to save verification');
      setDocuments(originalDocuments);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = async (documentIndex: number) => {
    if (!submissionId || !documents[documentIndex].previousState) return;

    setIsSaving(true);
    const originalDocuments = [...documents];

    try {
      const previousState = documents[documentIndex].previousState!;

      // Restore previous state
      const restoredDocuments = documents.map((doc, index) =>
        index === documentIndex
          ? {
            ...doc,
            isVerified: previousState.isVerified,
            comment: previousState.comment,
            previousState: null,
          }
          : doc
      );
      setDocuments(restoredDocuments);

      // Save to database
      const result = await verifySubmissionDocuments(
        submissionId,
        [{
          documentId: documents[documentIndex].id,
          isApproved: previousState.isVerified === true,
          comment: previousState.comment,
        }],
        undefined
      );

      if (!result.success) {
        alert(`Error undoing action: ${result.error}`);
        setDocuments(originalDocuments);
      }
    } catch (error) {
      console.error('Error undoing verification:', error);
      alert('Failed to undo action');
      setDocuments(originalDocuments);
    } finally {
      setIsSaving(false);
    }
  };

  const allVerified = documents.length > 0 && documents.every(doc => doc.isVerified === true);
  const hasRejected = documents.some(doc => doc.isVerified === false);
  const allDocumentsVerified = documents.length > 0 && documents.every(doc => doc.isVerified !== null);

  const handleMarkComplete = async () => {
    console.log('handleMarkComplete called');

    if (!allVerified || !submissionId) {
      console.log('Conditions not met - returning early');
      return;
    }

    setIsSaving(true);
    try {
      const verifications = documents.map(doc => ({
        documentId: doc.id,
        isApproved: doc.isVerified === true,
        comment: doc.comment,
      }));

      const result = await completeVerification(submissionId, verifications);

      if (result.success) {
        alert('Documents verified and consolidated PDF generated successfully!');
        router.push(`/staffmodule/submissions/waiting-classification?id=${submissionId}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to complete verification');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFullName = () => {
    if (!submissionData) return '';
    const { firstName, middleName, lastName } = submissionData.projectLeader;
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  };

  const historyEvents = [
    {
      id: 1,
      title: 'Submission Received',
      date: submissionData ? formatDate(submissionData.submittedAt) : 'N/A',
      icon: 'submission' as const,
      isCurrent: true,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading submission details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!submissionData) {
    return (
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Submission not found
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
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
        title={submissionData.title}
        submittedBy={getFullName()}
        submittedDate={formatDate(submissionData.submittedAt)}
        coAuthors={submissionData.coAuthors || 'N/A'}
        submissionId={submissionData.submissionId}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        <div className={activeTab === 'overview' ? 'lg:col-span-2' : 'w-full'}>
          {activeTab === 'overview' && (
            <>
              {documents.length > 0 ? (
                <DocumentVerificationList
                  documents={documents.map((doc, index) => ({
                    id: index,
                    name: doc.name,
                    isVerified: doc.isVerified,
                    comment: doc.comment,
                    fileUrl: doc.fileUrl,
                    previousState: doc.previousState,
                  }))}
                  onVerify={handleVerify}
                  onUndo={handleUndo}
                  isSaving={isSaving}
                />
              ) : (
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    No documents found for this submission.
                  </p>
                  <p className="text-sm text-gray-400 mt-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Documents may not have been uploaded yet.
                  </p>
                </div>
              )}
            </>
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

        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="New Submission"
              details={{
                submissionDate: formatDate(submissionData.submittedAt),
                reviewersRequired: 5,
                reviewersAssigned: 0,
              }}
              authorInfo={{
                name: getFullName(),
                organization: submissionData.organization || 'N/A',
                school: 'University of Makati',
                college: submissionData.college || 'N/A',
                email: submissionData.projectLeader.email,
              }}
              timeline={{
                submitted: formatDate(submissionData.submittedAt),
                reviewDue: 'TBD',
                decisionTarget: 'TBD',
              }}
              statusMessage={
                hasRejected
                  ? 'This submission has rejected documents and needs revision from the researcher.'
                  : allVerified
                    ? 'All documents verified. Ready to send to secretariat for classification.'
                    : documents.length === 0
                      ? 'No documents have been uploaded yet.'
                      : 'Please verify all documents.'
              }
              onAction={
                isSaving || !allDocumentsVerified || hasRejected
                  ? undefined
                  : allVerified
                    ? handleMarkComplete
                    : undefined
              }
              actionLabel={
                isSaving
                  ? 'Saving...'
                  : hasRejected || !allDocumentsVerified
                    ? undefined
                    : allVerified
                      ? 'Mark as Complete'
                      : undefined
              }
              actionType="primary"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function SubmissionVerificationPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <SubmissionVerificationContent />
    </Suspense>
  );
}
