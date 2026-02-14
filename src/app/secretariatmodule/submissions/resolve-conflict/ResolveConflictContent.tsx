'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import ConflictAlertCard from '@/components/secretariat/resolve-conflict/ConflictAlertCard';
import ReviewerSelectionList from '@/components/secretariat/resolve-conflict/ReviewerSelectionList';
import ActionPanel from '@/components/secretariat/resolve-conflict/ActionPanel';
import SuccessModal from '@/components/secretariat/resolve-conflict/SuccessModal';
import { createClient } from '@/utils/supabase/client';

export default function ResolveConflictContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [conflictInfo, setConflictInfo] = useState<any>(null);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!submissionId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // --- 1. Fetch Submission Data ---
        const { data: subData, error: subError } = await supabase
          .from('research_submissions')
          .select('*')
          .eq('id', submissionId)
          .single();

        if (subError) throw subError;

        // --- 2. Fetch Author Name Manually ---
        let authorName = 'Unknown Author';
        if (subData.user_id) {
          const { data: authorProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', subData.user_id)
            .single();
          if (authorProfile) authorName = authorProfile.full_name;
        }

        setSubmission({
          submissionId: subData.id,
          title: subData.title,
          authorName: authorName,
          submittedAt: subData.created_at,
          coAuthors: subData.co_authors || 'None',
        });

        // --- 3. Fetch COI Forms ---
        const { data: allCoiForms, error: coiError } = await supabase
          .from('conflict_of_interest_forms')
          .select('*')
          .eq('submission_id', submissionId);

        if (coiError) throw coiError;

        // Find the form with ANY true boolean
        const conflictForm = allCoiForms?.find(form => 
          form.has_stock_ownership ||
          form.has_received_compensation ||
          form.has_official_role ||
          form.has_prior_work_experience ||
          form.has_standing_issue ||
          form.has_social_relationship ||
          form.has_ownership_interest
        );

        let excludedReviewerIds: string[] = [];

        // Add the conflicting reviewer to exclusion list
        if (conflictForm) {
          excludedReviewerIds.push(conflictForm.reviewer_id);

          const activeReasons = [];
          if (conflictForm.has_stock_ownership) activeReasons.push('stocks');
          if (conflictForm.has_received_compensation) activeReasons.push('salary');
          if (conflictForm.has_official_role) activeReasons.push('officer');
          if (conflictForm.has_prior_work_experience) activeReasons.push('research_work');
          if (conflictForm.has_standing_issue) activeReasons.push('issue');
          if (conflictForm.has_social_relationship) activeReasons.push('social');
          if (conflictForm.has_ownership_interest) activeReasons.push('ownership_topic');

          // Fetch Conflicted Reviewer Name
          let reviewerName = 'Unknown Reviewer';
          const { data: revProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', conflictForm.reviewer_id)
            .single();
          if (revProfile) reviewerName = revProfile.full_name;

          setConflictInfo({
            reviewerName: reviewerName,
            checkedReasonIds: activeReasons, 
            remarks: conflictForm.remarks,
            date: new Date(conflictForm.created_at).toLocaleDateString(),
            originalReviewerId: conflictForm.reviewer_id
          });
        }

        // --- 4. Fetch CURRENT Assignments to prevent duplicates ---
        const { data: existingAssignments } = await supabase
          .from('reviewer_assignments')
          .select('reviewer_id')
          .eq('submission_id', submissionId);

        if (existingAssignments) {
          const currentIds = existingAssignments.map((a: any) => a.reviewer_id);
          excludedReviewerIds = [...excludedReviewerIds, ...currentIds];
        }

        // --- 5. Fetch Available Reviewers ---
        let query = supabase
          .from('profiles')
          .select('id, full_name, expertise_areas') 
          .eq('role', 'reviewer'); 
        
        if (excludedReviewerIds.length > 0) {
          query = query.not('id', 'in', `(${excludedReviewerIds.join(',')})`);
        }

        const { data: reviewersData, error: revError } = await query;
        if (revError) throw revError;

        setReviewers(reviewersData || []);

      } catch (error: any) {
        console.error("Error fetching data:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [submissionId]);

  const handleReassign = async () => {
    if (!selectedReviewer || !submissionId) return;
    setIsSubmitting(true);

    try {
      // 1. Create Assignment
      const { error: assignmentError } = await supabase
        .from('reviewer_assignments')
        .insert({
          submission_id: submissionId,
          reviewer_id: selectedReviewer,
          status: 'pending',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (assignmentError) throw assignmentError;

      // 2. Update Submission Status
      const { error: updateError } = await supabase
        .from('research_submissions')
        .update({ 
          status: 'under_review', 
          assigned_reviewers_count: 1 
        })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error reassigning:", error);
      alert("Failed to reassign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push('/secretariatmodule/submissions');
  };

  if (loading) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Resolve Conflict" activeNav="submissions">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!submission || !conflictInfo) {
    return (
       <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Resolve Conflict" activeNav="submissions">
          <div className="p-8 text-center text-gray-500 mt-10">
             <AlertTriangle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
             <h3 className="text-xl font-bold text-gray-700">No Conflict Found</h3>
             <p className="max-w-md mx-auto mt-2">
               We found the submission, but no Conflict of Interest form with declared issues was found.
             </p>
             <button 
               onClick={() => router.back()} 
               className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
             >
               Go Back
             </button>
           </div>
       </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Resolve Conflict" activeNav="submissions">
      
      <div className="mb-6">
        <button
          onClick={() => router.push('/secretariatmodule/submissions')}
          className="flex items-center gap-2 text-[#101C50] font-bold hover:text-blue-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Submissions
        </button>
      </div>

      <SubmissionHeader
        title={submission.title}
        submittedBy={submission.authorName}
        submittedDate={submission.submittedAt}
        coAuthors={submission.coAuthors}
        submissionId={submission.submissionId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Conflict Alert Card */}
          <ConflictAlertCard conflictInfo={conflictInfo} />

          {/* New Reviewer Selection */}
          <ReviewerSelectionList 
            reviewers={reviewers} 
            selectedReviewer={selectedReviewer} 
            onSelect={setSelectedReviewer} 
          />
        </div>

        {/* Right Column: Action Panel */}
        <div className="lg:col-span-1">
          <ActionPanel 
            onReassign={handleReassign} 
            isSubmitting={isSubmitting} 
            isDisabled={!selectedReviewer} 
          />
        </div>

      </div>

      {showSuccessModal && createPortal(
        <SuccessModal onClose={handleModalClose} />,
        document.body
      )}

    </DashboardLayout>
  );
}
