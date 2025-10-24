// app/staffmodule/submissions/under-review/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import { getUnderReviewDetails } from '@/app/actions/secretariat-staff/getUnderReviewSubmission';
import { Suspense } from 'react';

function UnderReviewContent() {
 const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getUnderReviewDetails(submissionId!);
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

  const originalDocsList = originalDocuments?.map((doc: any) => doc.name) || [];

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
      date: consolidatedDocument?.uploadedAt ? new Date(consolidatedDocument.uploadedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Processing',
      icon: 'verification' as const,
      description: 'All documents verified and consolidated into one file',
    },
    {
      id: 3,
      title: `Classification - ${submission?.classificationType || 'Pending'}`,
      date: 'Processing',
      icon: 'classification' as const,
    },
    {
      id: 4,
      title: 'Reviewers Assigned',
      date: 'Processing',
      icon: 'assignment' as const,
      description: `${reviewsRequired} reviewers assigned`,
    },
    {
      id: 5,
      title: 'Under Review',
      date: 'In Progress',
      icon: 'review' as const,
      isCurrent: true,
    },
  ];

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
        title={submission?.title || 'Untitled Submission'}
        submittedBy={submission?.researcher?.fullName || 'Unknown'}
        submittedDate={submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
        coAuthors={submission?.coAuthors || 'None'}
        submissionId={submission?.trackingNumber || 'N/A'}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        <div className={activeTab === 'overview' ? 'lg:col-span-2' : 'w-full'}>
          {activeTab === 'overview' && (
            <ConsolidatedDocument
              title="Consolidated Document"
              description="This submission is currently under review. Please wait for reviewers to complete their assessments."
              consolidatedDate={consolidatedDocument?.uploadedAt || submission?.submittedAt || 'N/A'}
              fileUrl={consolidatedDocument?.url || '/sample-document.pdf'}
              originalDocuments={originalDocsList}
            />
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
              status="Under Review"
              category={submission?.classificationType || 'Pending'}
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
                reviewDue: 'TBD',
                decisionTarget: 'TBD',
              }}
              assignedReviewers={assignedReviewers || []}
              statusMessage="This submission has been verified, consolidated, and classified. Now under review by assigned reviewers."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default function UnderReviewPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Loading..." activeNav="submissions">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <UnderReviewContent />
    </Suspense>
  );
}