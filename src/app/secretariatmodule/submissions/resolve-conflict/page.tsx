'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { ArrowLeft, AlertTriangle, UserX, UserCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import { createClient } from '@/utils/supabase/client';

const COI_STATEMENTS_MAP: Record<string, string> = {
  'stocks': 'I/My family have owned stocks and shares in the proponent organization(s).',
  'salary': 'I/My family have received a salary, an honorarium, compensation, concessions, and gifts from the proponent organization(s).',
  'officer': 'I/My family have served as an officer, director, advisor, trustee, consultant or active participant in the activities of the proponent organization(s).',
  'research_work': 'I/My family/my other organizations have had research work experience with the principal investigator(s).',
  'issue': 'I/My family/my other organizations have a long-standing issue against the principal investigator(s), the proponent organization(s), or the funding agency.',
  'social': 'I/My family have regular social activities, such as parties, home visits, and sports events, with the principal investigator(s).',
  'ownership_topic': 'I/my family/my other organizations have an interest in or an ownership issue against the proposed topic.',
};

function ResolveConflictContent() {
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
        // ✅ We check who is ALREADY assigned to this submission ID
        const { data: existingAssignments } = await supabase
          .from('reviewer_assignments')
          .select('reviewer_id')
          .eq('submission_id', submissionId);

        if (existingAssignments) {
          const currentIds = existingAssignments.map((a: any) => a.reviewer_id);
          // Add them to the exclusion list
          excludedReviewerIds = [...excludedReviewerIds, ...currentIds];
        }

        // --- 5. Fetch Available Reviewers ---
        let query = supabase
          .from('profiles')
          .select('id, full_name, expertise_areas') 
          .eq('role', 'reviewer'); 
        
        // ✅ Filter out: Conflicting Reviewer AND Already Assigned Reviewers
        if (excludedReviewerIds.length > 0) {
          // Format for Supabase .not('id', 'in', '(id1,id2)')
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
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
                className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Go Back
              </button>
           </div>
        </DashboardLayout>
     )
  }

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Resolve Conflict" activeNav="submissions">
      
      <div className="mb-6">
        <button
          onClick={() => router.push('/secretariatmodule/submissions')}
          className="flex items-center gap-2 text-blue-700 font-semibold hover:text-blue-900 transition-colors"
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
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm text-red-600 flex-shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Conflict of Interest Reported</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  A reviewer has declined this submission. Please review the declared conflicts below.
                </p>
                
                <div className="bg-white rounded-lg border border-red-100 overflow-hidden">
                  <div className="bg-red-50/50 p-3 border-b border-red-100 flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-full border border-red-100">
                      <UserX size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{conflictInfo.reviewerName}</p>
                      <p className="text-xs text-gray-500">Original Reviewer • Declared on {conflictInfo.date}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* List Checked Reasons */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Declared Reasons</p>
                      <ul className="space-y-2">
                        {conflictInfo.checkedReasonIds.length > 0 ? (
                          conflictInfo.checkedReasonIds.map((reasonId: string) => (
                            <li key={reasonId} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
                              <span className="text-red-500 font-bold mt-0.5">•</span>
                              {COI_STATEMENTS_MAP[reasonId] || reasonId}
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray-500 italic">No specific checkboxes selected.</li>
                        )}
                      </ul>
                    </div>

                    {/* Additional Remarks */}
                    {conflictInfo.remarks && (
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Additional Remarks</p>
                        <p className="text-sm text-gray-600 italic border-l-2 border-red-200 pl-3">
                          "{conflictInfo.remarks}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Reviewer Selection */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#101C50] mb-6 flex items-center gap-2">
              <UserCheck size={20} />
              Select Replacement Reviewer
            </h3>

            <div className="space-y-3">
              {reviewers.length === 0 ? (
                 <p className="text-gray-500 italic p-4 text-center">No eligible reviewers found (others may already be assigned).</p>
              ) : (
                  reviewers.map((reviewer) => (
                    <label 
                      key={reviewer.id} 
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedReviewer === reviewer.id 
                          ? 'border-blue-600 bg-blue-50/50' 
                          : 'border-gray-100 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name="reviewer"
                          className="w-5 h-5 text-blue-600 accent-blue-600"
                          checked={selectedReviewer === reviewer.id}
                          onChange={() => setSelectedReviewer(reviewer.id)}
                        />
                        <div>
                          <p className="font-bold text-gray-900">{reviewer.full_name}</p>
                          <p className="text-xs text-gray-500">
                            {reviewer.expertise_areas && reviewer.expertise_areas.length > 0 
                              ? reviewer.expertise_areas.join(', ') 
                              : 'General Reviewer'} 
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                      </div>
                    </label>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Action Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4">Action Required</h4>
            <p className="text-sm text-gray-600 mb-6">
              Assigning a new reviewer will update the submission assignments and notify the new reviewer.
            </p>

            <button
              onClick={handleReassign}
              disabled={!selectedReviewer || isSubmitting}
              className="w-full py-3 px-4 bg-[#101C50] text-white rounded-xl font-semibold hover:bg-[#0A1235] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Assigning...
                </>
              ) : (
                <>
                  Confirm Re-assignment
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {showSuccessModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Re-assignment Complete!</h3>
            
            <p className="text-gray-600 mb-6 text-sm">
              The submission has been successfully re-assigned to a new reviewer.
            </p>
            
            <button
              onClick={handleModalClose}
              className="w-full py-3 bg-[#101C50] text-white rounded-xl font-bold hover:bg-[#0A1235] transition-colors"
            >
              Return to Submissions
            </button>
          </div>
        </div>,
        document.body
      )}

    </DashboardLayout>
  );
}

export default function ResolveConflictPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResolveConflictContent />
    </Suspense>
  );
}