// app/staffmodule/submissions/assign-reviewers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import ReviewerAssignment from '@/components/staff-secretariat-admin/submission-details/ReviewerAssignment';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import { getClassificationDetails } from '@/app/actions/getClassificationDetails';
import { getReviewers } from '@/app/actions/getReviewers';
import { assignReviewers } from '@/app/actions/assignReviewers'; 

export default function AssignReviewersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');

  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  const loadData = async () => {
    if (!submissionId) return;

    setLoading(true);
    try {
      // Load submission details
      const submissionResult = await getClassificationDetails(submissionId);
      
      // Load reviewers from database
      const reviewersResult = await getReviewers();

      if (submissionResult.success) {
        setData(submissionResult);
      } else {
        alert(submissionResult.error || 'Failed to load submission');
        router.push('/staffmodule/submissions');
        return;
      }

      if (reviewersResult.success) {
        setReviewers(reviewersResult.reviewers || []);
      } else {
        console.error('Failed to load reviewers:', reviewersResult.error);
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFullName = () => {
    if (!data?.submission) return '';
    const { firstName, middleName, lastName } = data.submission.projectLeader;
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  };

  // Get classification from database
  const category = data?.submission?.classificationType || 'Expedited';

  // Get max reviewers based on category
  const getMaxReviewers = () => {
    switch (category) {
      case 'Exempted':
        return 0;
      case 'Expedited':
        return 3;
      case 'Full Review':
        return 5;
      default:
        return 3;
    }
  };

const handleAssign = async (selectedReviewers: string[]) => {
  console.log('Assigning reviewers:', selectedReviewers);
  
  try {
    const result = await assignReviewers(submissionId!, selectedReviewers);
    
    if (result.success) {
      alert(`Successfully assigned ${result.assignmentCount} reviewers!`);
      router.push(`/staffmodule/submissions/under-review?id=${submissionId}`);
    } else {
      alert(result.error || 'Failed to assign reviewers');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to assign reviewers');
  }
};

  const historyEvents = data ? [
    {
      id: 1,
      title: 'Submission Received',
      date: formatDate(data.submission.submittedAt),
      icon: 'submission' as const,
    },
    {
      id: 2,
      title: 'Document Verification Complete',
      date: data.consolidatedDocument ? formatDate(data.consolidatedDocument.uploadedAt) : 'N/A',
      icon: 'verification' as const,
      description: 'All documents verified and consolidated into one file',
    },
    {
      id: 3,
      title: `Classification - ${category}`,
      date: data.submission.classifiedAt ? formatDate(data.submission.classifiedAt) : 'N/A',
      icon: 'classification' as const,
      isCurrent: true,
    },
  ] : [];

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

  if (!data?.submission) {
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
        title={data.submission.title}
        submittedBy={getFullName()}
        submittedDate={formatDate(data.submission.submittedAt)}
        coAuthors={data.submission.coAuthors || 'N/A'}
        submissionId={data.submission.submissionId}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conditional Grid - Full width for reviews/history */}
      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        {/* Main Content */}
        <div className={activeTab === 'overview' ? 'lg:col-span-2 space-y-6' : 'w-full'}>
          {activeTab === 'overview' && (
            <>
              {data.consolidatedDocument ? (
                <ConsolidatedDocument
                  title="Consolidated Document"
                  description="Please ensure the research paper is thoroughly classified before assigning it to a reviewer."
                  consolidatedDate={formatDate(data.consolidatedDocument.uploadedAt)}
                  fileUrl={data.consolidatedDocument.url}
                  originalDocuments={data.originalDocuments.map((doc: any) => doc.name)}
                />
              ) : (
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Consolidated document not available
                  </p>
                </div>
              )}
              
              <ReviewerAssignment
                category={category as any}
                reviewers={reviewers}
                maxReviewers={getMaxReviewers()}
                onAssign={handleAssign}
              />
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                No reviews available yet. Assign reviewers to start the review process.
              </p>
            </div>
          )}

          {activeTab === 'history' && <HistoryTab events={historyEvents} />}
        </div>

        {/* Sidebar - Only show in overview tab */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Classified"
              category={category}
              details={{
                submissionDate: formatDate(data.submission.submittedAt),
                reviewersRequired: getMaxReviewers(),
                reviewersAssigned: 0,
              }}
              authorInfo={{
                name: getFullName(),
                organization: data.submission.organization || 'N/A',
                school: 'University of Makati',
                college: data.submission.college || 'N/A',
                email: data.submission.projectLeader.email,
              }}
              timeline={{
                submitted: formatDate(data.submission.submittedAt),
                reviewDue: 'TBD',
                decisionTarget: 'TBD',
              }}
              statusMessage="This submission has been verified, consolidated, and classified. Ready for reviewer assignment."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
