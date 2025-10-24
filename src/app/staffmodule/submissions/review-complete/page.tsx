'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import ReviewsTab from '@/components/staff-secretariat-admin/submission-details/ReviewsTab';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import { getReviewCompleteDetails } from '@/app/actions/secretariat-staff/getReviewCompleteSubmission';
import { Suspense } from 'react';

function ReviewCompleteContent() {
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
      const result = await getReviewCompleteDetails(submissionId!);
      if (result.success) {
        console.log('Loaded data:', result); // ✅ Debug log
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

  // ✅ Safe access to researcher data with fallbacks
  const researcherName = submission?.researcher?.fullName || 'Unknown Researcher';
  const researcherEmail = submission?.researcher?.email || 'N/A';
  const researcherOrg = submission?.researcher?.organization || 'N/A';
  const researcherSchool = submission?.researcher?.school || 'N/A';
  const researchercollege = submission?.researcher?.college || 'N/A';
  // Original documents list
  const originalDocsList = originalDocuments?.map((doc: any) => doc.name) || [
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
      description: `${reviewsRequired} reviewers assigned: ${assignedReviewers?.join(', ') || 'None'}`,
    },
    {
      id: 5,
      title: 'Under Review',
      date: 'Processing',
      icon: 'review' as const,
    },
    {
      id: 6,
      title: 'Review Complete',
      date: reviews && reviews.length > 0 ? reviews[reviews.length - 1]?.completedDate : 'Recently',
      icon: 'complete' as const,
      isCurrent: true,
      description: 'All reviewers have completed their assessments',
    },
  ];

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
      {/* Better Back Button */}
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
        submittedBy={researcherName}
        submittedDate={submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
        coAuthors={submission?.coAuthors || 'None'}
        submissionId={submission?.trackingNumber || 'N/A'}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conditional Grid */}
      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        {/* Main Content */}
        <div className={activeTab === 'overview' ? 'lg:col-span-2 space-y-6' : 'w-full'}>
          {activeTab === 'overview' && (
            <>
              {/* Completion Notice */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle size={32} className="text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Review Complete
                    </h3>
                    <p className="text-sm text-green-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      All reviewers have completed their assessments. This submission is now ready for final decision by the UMREC board.
                    </p>
                  </div>
                </div>
              </div>

              <ConsolidatedDocument
                title="Consolidated Document"
                description="All reviews have been completed. You can view the final assessments in the Reviews tab."
                consolidatedDate={consolidatedDocument?.uploadedAt || submission?.submittedAt || 'N/A'}
                fileUrl={consolidatedDocument?.url || '/sample-document.pdf'}
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

        {/* Sidebar - Only in overview */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Review Complete"
              category={submission?.classificationType || 'Pending'}
              details={{
                submissionDate: submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
                reviewersRequired: reviewsRequired || 0,
                reviewersAssigned: reviewsRequired || 0,
              }}
              authorInfo={{
                name: researcherName,
                organization: researcherOrg,
                school: researcherSchool,
                college: researchercollege,
                email: researcherEmail,
              }}
              timeline={{
                submitted: submission?.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
                reviewDue: 'TBD',
                decisionTarget: 'TBD',
              }}
              assignedReviewers={assignedReviewers || []}
              statusMessage="All reviews have been completed. Awaiting final decision from UMREC board."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default function ReviewCompletePage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Loading..." activeNav="submissions">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <ReviewCompleteContent />
    </Suspense>
  );
}