'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { ArrowLeft, AlertTriangle, UserX, UserCheck, ChevronRight, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';

// --- EXACT REASONS FROM YOUR COI MODAL ---
const COI_STATEMENTS_MAP: Record<string, string> = {
  'stocks': 'I/My family have owned stocks and shares in the proponent organization(s).',
  'salary': 'I/My family have received a salary, an honorarium, compensation, concessions, and gifts from the proponent organization(s).',
  'officer': 'I/My family have served as an officer, director, advisor, trustee, consultant or active participant in the activities of the proponent organization(s).',
  'research_work': 'I/My family/my other organizations have had research work experience with the principal investigator(s).',
  'issue': 'I/My family/my other organizations have a long-standing issue against the principal investigator(s), the proponent organization(s), or the funding agency.',
  'social': 'I/My family have regular social activities, such as parties, home visits, and sports events, with the principal investigator(s).',
  'ownership_topic': 'I/my family/my other organizations have an interest in or an ownership issue against the proposed topic.',
};

// --- MOCK DATA ---
const MOCK_SUBMISSION = {
  submissionId: 'SUB-2024-001',
  title: 'Community Health Assessment in Rural Areas',
  authorName: 'Dr. Jane Doe',
  submittedAt: '2024-01-15T08:30:00Z',
  coAuthors: 'John Smith, Alice Johnson',
};

const MOCK_CONFLICT_INFO = {
  reviewerName: "Dr. Robert Wilson",
  checkedReasonIds: ['research_work', 'social'], 
  remarks: "We worked together on a project last year.", 
  date: "2024-01-20"
};

const MOCK_REVIEWERS = [
  { id: 'rev-1', name: 'Dr. Sarah Connor', specialization: 'Public Health', currentLoad: 2 },
  { id: 'rev-2', name: 'Dr. Emily Clarke', specialization: 'Epidemiology', currentLoad: 0 },
  { id: 'rev-3', name: 'Dr. Michael Chen', specialization: 'Community Medicine', currentLoad: 4 },
];

function ResolveConflictContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [selectedReviewer, setSelectedReviewer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for modal

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleReassign = async () => {
    if (!selectedReviewer) return;
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true); // Show success modal instead of alert
    }, 1000);
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

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Resolve Conflict" activeNav="submissions">
      
      {/* Back Button */}
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
        title={MOCK_SUBMISSION.title}
        submittedBy={MOCK_SUBMISSION.authorName}
        submittedDate={MOCK_SUBMISSION.submittedAt}
        coAuthors={MOCK_SUBMISSION.coAuthors}
        submissionId={MOCK_SUBMISSION.submissionId}
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
                      <p className="text-sm font-bold text-gray-900">{MOCK_CONFLICT_INFO.reviewerName}</p>
                      <p className="text-xs text-gray-500">Original Reviewer</p>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* List Checked Reasons */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Declared Reasons</p>
                      <ul className="space-y-2">
                        {MOCK_CONFLICT_INFO.checkedReasonIds.map((reasonId) => (
                          <li key={reasonId} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
                            <span className="text-red-500 font-bold mt-0.5">•</span>
                            {COI_STATEMENTS_MAP[reasonId] || reasonId}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Additional Remarks */}
                    {MOCK_CONFLICT_INFO.remarks && (
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Additional Remarks</p>
                        <p className="text-sm text-gray-600 italic border-l-2 border-red-200 pl-3">
                          "{MOCK_CONFLICT_INFO.remarks}"
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
              {MOCK_REVIEWERS.map((reviewer) => (
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
                      <p className="font-bold text-gray-900">{reviewer.name}</p>
                      <p className="text-xs text-gray-500">{reviewer.specialization} • {reviewer.currentLoad} Active Reviews</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       Available
                     </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Action Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4">Action Required</h4>
            <p className="text-sm text-gray-600 mb-6">
              Assigning a new reviewer will return the submission status to <strong>Under Review</strong> and notify the new reviewer immediately.
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

      {/* --- SUCCESS MODAL POPUP --- */}
      {showSuccessModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Re-assignment Complete!</h3>
            
            <p className="text-gray-600 mb-6 text-sm">
              The submission has been successfully re-assigned to a new reviewer. The status is now back to <span className="font-bold text-violet-600">Under Review</span>.
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
