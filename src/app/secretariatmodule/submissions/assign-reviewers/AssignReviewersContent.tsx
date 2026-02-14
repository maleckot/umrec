'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import ReviewerAssignment from '@/components/staff-secretariat-admin/submission-details/ReviewerAssignment';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import ClassificationSummary from '@/components/secretariat/assign-reviewers/ClassificationSummary';
import PastReviewersBanner from '@/components/secretariat/assign-reviewers/PastReviewersBanner';
import AssignSuccessModal from '@/components/secretariat/assign-reviewers/AssignSuccessModal';

import { getClassificationDetails } from '@/app/actions/secretariat-staff/getClassificationDetails';
import { getReviewers } from '@/app/actions/secretariat-staff/secretariat/getReviewers';
import { assignReviewers } from '@/app/actions/secretariat-staff/secretariat/assignReviewers';
import { getPastReviewers } from '@/app/actions/secretariat-staff/secretariat/getPastReviewers';

export default function AssignReviewersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [pastReviewers, setPastReviewers] = useState<any[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [reviewDueDate, setReviewDueDate] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [assignedCount, setAssignedCount] = useState(0);

  // --- Logic Helpers ---
  const getSuggestedDueDate = (classificationType: string) => {
    const today = new Date();
    let daysToAdd = 14; 
    switch (classificationType) {
      case 'Exempted': daysToAdd = 0; break;
      case 'Expedited': daysToAdd = 14; break;
      case 'Full Review': daysToAdd = 30; break;
    }
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    return dueDate.toISOString().split('T')[0];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getFullName = () => {
    if (!data?.submission) return '';
    const { firstName, middleName, lastName } = data.submission.projectLeader;
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  };

  // --- Data Loading ---
  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  const loadData = async () => {
    if (!submissionId) return;
    setLoading(true);
    try {
      // 1. Fetch all required data in parallel
      const [submissionResult, reviewersResult, pastReviewersResult] = await Promise.all([
        getClassificationDetails(submissionId),
        getReviewers(),
        getPastReviewers(submissionId)
      ]);

      // 2. Set Submission Data
      if (submissionResult.success) {
        setData(submissionResult);
        const suggestedDate = getSuggestedDueDate(submissionResult.submission?.classificationType || 'Expedited');
        setReviewDueDate(suggestedDate);
      } else {
        alert(submissionResult.error || 'Failed to load submission');
        router.push('/secretariatmodule/submissions');
        return;
      }

      // 3. Set Reviewers List
      let allReviewers: any[] = [];
      if (reviewersResult.success) {
        allReviewers = reviewersResult.reviewers || [];
        setReviewers(allReviewers);
      }

      // 4. Handle Past Reviewers (Updated Logic)
      if (pastReviewersResult.success) {
        const pastIds = pastReviewersResult.pastReviewerIds || [];
        setSelectedReviewers(pastIds);

        // Filter full reviewer objects from the main list using the IDs
        if (allReviewers.length > 0 && pastIds.length > 0) {
          const pastReviewerDetails = allReviewers.filter(r => pastIds.includes(r.id));
          setPastReviewers(pastReviewerDetails);
        }
      }

    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleAssign = async (selectedReviewerIds: string[]) => {
    if (!reviewDueDate && category !== 'Exempted') {
      alert('Please select a review due date');
      return;
    }
    try {
      const result = await assignReviewers(submissionId!, selectedReviewerIds, reviewDueDate);
      if (result.success) {
        const total = (result.updated || 0) + (result.inserted || 0);
        setAssignedCount(total);
        setShowSuccessModal(true);
      } else {
        alert(result.error || 'Failed to assign reviewers');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to assign reviewers');
    }
  };

  // --- Derived State ---
  const category = data?.submission?.classificationType || 'Expedited';
  
  const getMaxReviewers = () => {
    switch (category) {
      case 'Exempted': return 0;
      case 'Expedited': return 3;
      case 'Full Review': return reviewers.length;
      default: return 3;
    }
  };

  const historyEvents = data ? [
    {
      id: 1, title: 'Submission Received', date: formatDate(data.submission.submittedAt), icon: 'submission' as const,
    },
    {
      id: 2, title: 'Document Verification Complete', date: data.consolidatedDocument ? formatDate(data.consolidatedDocument.uploadedAt) : 'N/A', icon: 'verification' as const, description: 'All documents verified and consolidated into one file',
    },
    {
      id: 3, title: `Classification - ${category}`, date: data.submission.classifiedAt ? formatDate(data.submission.classifiedAt) : 'N/A', icon: 'classification' as const, isCurrent: true,
    },
  ] : [];

  if (loading) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data?.submission) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
        <div className="text-center py-12 text-gray-600">Submission not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
      <AssignSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => {
            setShowSuccessModal(false);
            router.push(`/secretariatmodule/submissions/under-review?id=${submissionId}`);
        }} 
        reviewerCount={assignedCount} 
      />

      <div className="mb-6">
        <button
          onClick={() => router.push('/secretariatmodule/submissions')}
          className="flex items-center gap-2 text-base font-bold text-[#101C50] hover:text-blue-900 transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <ArrowLeft size={20} /> Back to Submissions
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

      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        
        {/* Main Content Column */}
        <div className={activeTab === 'overview' ? 'lg:col-span-2 space-y-6' : 'w-full'}>
          {activeTab === 'overview' && (
            <>
              <ClassificationSummary category={category} />

              {pastReviewers.length > 0 && (
                <PastReviewersBanner reviewers={pastReviewers} />
              )}

              {data.consolidatedDocument ? (
                <ConsolidatedDocument
                  title="Consolidated Document"
                  description="Please ensure the research paper is thoroughly reviewed before assigning it to reviewers."
                  consolidatedDate={formatDate(data.consolidatedDocument.uploadedAt)}
                  fileUrl={data.consolidatedDocument.url}
                  originalDocuments={data.originalDocuments.map((doc: any) => doc.name)}
                />
              ) : (
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-gray-500 font-medium">Consolidated document not available</p>
                </div>
              )}

              <ReviewerAssignment
                category={category as any}
                reviewers={reviewers}
                maxReviewers={getMaxReviewers()}
                reviewDueDate={reviewDueDate}
                onDueDateChange={setReviewDueDate}
                onAssign={handleAssign}
                preSelectedReviewers={selectedReviewers}
              />
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <p className="text-gray-500 font-medium">No reviews available yet. Assign reviewers to start the review process.</p>
            </div>
          )}

          {activeTab === 'history' && <HistoryTab events={historyEvents} />}
        </div>

        {/* Sidebar Column */}
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
                reviewDue: reviewDueDate ? formatDate(reviewDueDate) : 'TBD',
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
