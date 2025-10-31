// app/secretariatmodule/submissions/assign-reviewers/page.tsx
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
import { getClassificationDetails } from '@/app/actions/secretariat-staff/getClassificationDetails';
import { getReviewers } from '@/app/actions/secretariat-staff/secretariat/getReviewers';
import { assignReviewers } from '@/app/actions/secretariat-staff/secretariat/assignReviewers';
import { Suspense } from 'react';

// Success Modal Component
function SuccessModal({ 
  isOpen, 
  onClose, 
  reviewerCount 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  reviewerCount: number;
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
            Reviewers Assigned Successfully!
          </h3>
          
          <p className="text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Successfully assigned <span className="font-bold text-green-600">{reviewerCount}</span> {reviewerCount === 1 ? 'reviewer' : 'reviewers'}!
          </p>
          
          <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Email notifications have been sent to all assigned reviewers.
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

function AssignReviewersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [reviewDueDate, setReviewDueDate] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [assignedCount, setAssignedCount] = useState(0);

  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  // Calculate suggested due date based on classification type
  const getSuggestedDueDate = (classificationType: string) => {
    const today = new Date();
    let daysToAdd = 14; // Default 2 weeks
    
    switch (classificationType) {
      case 'Exempted':
        daysToAdd = 0; // No review needed
        break;
      case 'Expedited':
        daysToAdd = 14; // 2 weeks
        break;
      case 'Full Review':
        daysToAdd = 30; // 30 days
        break;
    }
    
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    
    // Format as YYYY-MM-DD for input type="date"
    return dueDate.toISOString().split('T')[0];
  };

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
        
        // Set suggested due date based on classification
        const suggestedDate = getSuggestedDueDate(
          submissionResult.submission?.classificationType || 'Expedited'
        );
        setReviewDueDate(suggestedDate);
      } else {
        alert(submissionResult.error || 'Failed to load submission');
        router.push('/secretariatmodule/submissions');
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

  // Helper functions for category styling
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

  const handleAssign = async (selectedReviewers: string[]) => {
    console.log('Assigning reviewers:', selectedReviewers);
    console.log('Review due date:', reviewDueDate);
    
    // Validate due date
    if (!reviewDueDate && category !== 'Exempted') {
      alert('Please select a review due date');
      return;
    }
    
    try {
      const result = await assignReviewers(submissionId!, selectedReviewers, reviewDueDate);
      
      if (result.success) {
        setAssignedCount(result.assignmentCount || selectedReviewers.length);
        setShowSuccessModal(true);
      } else {
        alert(result.error || 'Failed to assign reviewers');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to assign reviewers');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push(`/secretariatmodule/submissions/under-review?id=${submissionId}`);
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
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
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
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Submission not found
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleSuccessModalClose} 
        reviewerCount={assignedCount}
      />

      {/* Better Back Button */}
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
                      {category === 'Expedited' && 'This submission has been marked as Expedited review. Please assign the required reviewers to proceed with the review process.'}
                      {category === 'Full Review' && 'This submission has been marked as Full Review. Please assign the required reviewers to proceed with the comprehensive review process.'}
                    </p>
                  </div>
                </div>
              </div>

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
                  <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Consolidated document not available
                  </p>
                </div>
              )}
              
              <ReviewerAssignment
                category={category as any}
                reviewers={reviewers}
                maxReviewers={getMaxReviewers()}
                reviewDueDate={reviewDueDate}
                onDueDateChange={setReviewDueDate}
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

export default function AssignReviewersPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <AssignReviewersContent />
    </Suspense>
  );
}
