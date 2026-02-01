// app/reviewermodule/reviews/details/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import StartReviewModal from '@/components/reviewer/StartReviewModal';
import ConflictOfInterestModal from '@/components/reviewer/ConflictOfInterestModal';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';
import { ArrowLeft, MessageCircle, FileText, Calendar, Tag, AlertCircle, Edit, AlertTriangle } from 'lucide-react';
import { getReviewerEvaluations } from '@/app/actions/reviewer/getReviewerEvaluations';
import { postReviewReply } from '@/app/actions/reviewer/postReviewReply';
// Add this import to your existing imports
import { submitConflictOfInterest } from '@/app/actions/reviewer/submitConflictOfInterest';

interface Reply {
  id: number;
  reviewerId: string;
  name: string;
  code: string;
  date: string;
  decision: string;
  ethicsRecommendation: string;
  technicalSuggestions: string;
  text?: string;
  replies?: Reply[];
}

interface Evaluation {
  id: number;
  reviewerId: string;
  name: string;
  code: string;
  date: string;
  decision: string;
  ethicsRecommendation: string;
  technicalSuggestions: string;
  replies: Reply[];
}

// Edit Review Confirmation Modal Component
function EditReviewModal({ isOpen, onClose, onConfirm, submissionTitle }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submissionTitle: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 md:p-8 animate-slideUp mx-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
          <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-3 text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Edit Your Review?
        </h2>
        <p className="text-center text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base px-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          You're about to edit your review for:
        </p>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-200/50">
          <p className="text-xs sm:text-sm font-bold text-[#101C50] text-center leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {submissionTitle}
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 border border-amber-200/50">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-amber-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Important Notice
              </p>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Editing your review will update your previous evaluation. Any changes you make will be saved and visible to other committee members.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3">
          <button
            onClick={onConfirm}
            className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white rounded-xl sm:rounded-2xl hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all font-bold text-xs sm:text-sm md:text-base shadow-lg flex items-center justify-center gap-2"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Continue to Edit
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:from-gray-300 hover:to-gray-400 transition-all font-bold text-xs sm:text-sm md:text-base shadow-md active:scale-95"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  // ✅ State Variables
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [coiOpen, setCoiOpen] = useState(false); // ✅ Fixes 'setCoiOpen' error
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showRepliesFor, setShowRepliesFor] = useState<string[]>([]);
  const [reviewerEvaluations, setReviewerEvaluations] = useState<any[]>([]);
  const [currentReviewerId, setCurrentReviewerId] = useState<string>('');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [assignmentStatus, setAssignmentStatus] = useState<string>('pending');
  const [selectedDocument, setSelectedDocument] = useState<{ name: string, url: string } | null>(null);

  const [submissionData, setSubmissionData] = useState({
    id: id,
    title: 'Loading...',
    category: '',
    assignedDate: '',
    dueDate: '',
    description: '',
    status: 'Pending'
  });
  const [submittedFiles, setSubmittedFiles] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      loadEvaluations();
    }
  }, [id]);

  const loadEvaluations = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await getReviewerEvaluations(id);

      if (result.success) {
        setReviewerEvaluations(result.evaluations || []);
        setCurrentReviewerId(result.currentReviewerId || '');
        setAssignmentStatus(result.assignmentStatus || 'pending');

        if (result.submission) {
          setSubmissionData({
            id: result.submission.id,
            title: result.submission.title,
            category: result.submission.category,
            assignedDate: result.submission.assignedDate,
            dueDate: result.submission.dueDate || 'TBD',
            description: result.submission.description,
            status: result.submission.status?.toLowerCase() || 'pending'
          });
        }

        if (result.consolidatedDocument) {
          setSubmittedFiles([
            {
              id: 1,
              name: result.consolidatedDocument.name,
              displayTitle: result.consolidatedDocument.displayTitle,
              time: new Date(result.consolidatedDocument.uploadedAt).toLocaleDateString('en-US'),
              status: 'viewed',
              url: result.consolidatedDocument.url
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = () => setShowModal(true);
  
  const handleConfirmReview = () => {
    setShowModal(false);
    // ✅ Updated path based on your latest snippet
    router.push(`/reviewermodule/review-submission?id=${id}`);
  };

  const handleEditReview = () => setShowEditModal(true);
  
  const handleConfirmEditReview = () => {
    setShowEditModal(false);
    // ✅ Updated path based on your latest snippet
    router.push(`/reviewermodule/review-submission?id=${id}&edit=true`);
  };

  const handleReplyClick = (evaluationId: string) => {
    setReplyingTo(replyingTo === evaluationId ? null : evaluationId);
    setReplyText('');
  };

  const toggleReplies = (evaluationId: string) => {
    setShowRepliesFor(prev =>
      prev.includes(evaluationId)
        ? prev.filter(id => id !== evaluationId)
        : [...prev, evaluationId]
    );
  };

  const handlePostReply = async () => {
    if (!replyText.trim() || !replyingTo) return;

    try {
      const result = await postReviewReply(replyingTo, replyText);

      if (result.success && result.reply) {
        setReviewerEvaluations(prev => prev.map(evaluation => {
          if (String(evaluation.id) === replyingTo) {
            return {
              ...evaluation,
              replies: [
                ...(evaluation.replies || []),
                {
                  id: result.reply.id,
                  reviewerId: currentReviewerId,
                  name: 'You',
                  code: 'N/A',
                  date: new Date().toLocaleDateString('en-US'),
                  text: replyText,
                }
              ]
            };
          }
          return evaluation;
        }));
        setReplyText('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

const handleSubmitCOI = async (payload: any) => {
    try {
      console.log('Processing COI Payload...');

      // 1. Convert Base64 Signature to File object for upload
      const res = await fetch(payload.signatureImage);
      const blob = await res.blob();
      const file = new File([blob], "signature.png", { type: "image/png" });
      
      const signatureFormData = new FormData();
      signatureFormData.append('file', file);

      // 2. Map Modal Answers to Server Action Interface
      const formData = {
        submissionId: submissionData.id as string,
        hasStockOwnership: payload.answers.stocks === 'yes',
        hasReceivedCompensation: payload.answers.salary === 'yes',
        hasOfficialRole: payload.answers.officer === 'yes',
        hasPriorWorkExperience: payload.answers.research_work === 'yes',
        hasStandingIssue: payload.answers.issue === 'yes',
        hasSocialRelationship: payload.answers.social === 'yes',
        hasOwnershipInterest: payload.answers.ownership_topic === 'yes',
        protocolCode: payload.protocolCode,
        remarks: payload.remarks,
        printedName: payload.signatureName
      };

      // 3. Call Server Action
      const result = await submitConflictOfInterest(formData, signatureFormData);

      if (result.success) {
        // Refresh local data to update UI (hide buttons, show status)
        loadEvaluations();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('COI Logic Error:', error);
      return { success: false, error: 'Failed to process submission.' };
    }
  };

  const currentUserReview = reviewerEvaluations.find(
    (evaluation) => String(evaluation.reviewerId) === currentReviewerId
  );

  if (loading) return <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pb-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/reviewermodule')}
            className="flex items-center gap-2.5 mb-8 px-5 py-3 bg-white/80 backdrop-blur-sm text-[#101C50] hover:bg-white rounded-2xl transition-all shadow-md font-bold"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <ArrowLeft size={20} />
            Back to Reviews
          </button>

          {/* Submission Details Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl mb-8 border border-gray-100/50">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#101C50] mb-6">Submission Details</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-blue-50/50 to-transparent rounded-2xl p-5 border border-blue-100/50">
                  <div className="flex items-start gap-3 mb-2">
                    <FileText className="w-5 h-5 text-[#101C50] mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wider">Research Title</p>
                      <p className="text-base sm:text-lg text-[#101C50] font-bold leading-relaxed">{submissionData.title}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#101C50]" />
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Assigned Date</p>
                    </div>
                    <p className="text-base text-[#101C50] font-semibold">{submissionData.assignedDate}</p>
                  </div>
                  <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-[#7C1100]" />
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Due Date</p>
                    </div>
                    <p className="text-base text-[#7C1100] font-bold">{submissionData.dueDate}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-gradient-to-br from-amber-50/50 to-transparent rounded-2xl p-5 border border-amber-100/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-amber-700" />
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Review Category</p>
                  </div>
                  <span className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 border border-amber-200">
                    {submissionData.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t-2 border-gray-100">
              <p className="text-xs text-gray-600 mb-3 font-bold uppercase tracking-wider">Research Description</p>
              <p className="text-base text-gray-700 leading-relaxed">{submissionData.description}</p>
            </div>
          </div>

           {/* Submitted Files Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl mb-8 border border-gray-100/50">
            <div className="flex items-center mb-6">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Submitted Documents
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full mt-2"></div>
              </div>
            </div>

            <div className="space-y-4">
              {submittedFiles.map((file) => (
                <div key={file.id} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl border border-gray-200/50 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#101C50] to-[#1a2d70] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                          <path d="M14 2v6h6" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-bold text-[#101C50] mb-1 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {file.displayTitle || 'Consolidated Application - ' + submissionData.title}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <Calendar className="w-3.5 h-3.5" />
                          Uploaded: {file.time}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (file.url) {
                          setSelectedDocument({ name: file.displayTitle || file.name, url: file.url });
                          setViewerOpen(true);
                        } else {
                          alert('Document URL not available');
                        }
                      }}
                      className="w-full sm:w-32 px-6 py-3 rounded-2xl text-sm font-bold transition-all bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white hover:shadow-lg hover:scale-105 transform"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      View File
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Reviewer Evaluations Card - ✅ EXACT DESIGN RESTORED */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl mb-8 border border-gray-100/50">
            <div className="flex items-center mb-8">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Reviewer Evaluations
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full mt-2"></div>
              </div>
            </div>

            {reviewerEvaluations.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <MessageCircle className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  No Evaluations Yet
                </h3>
                <p className="text-gray-500 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Reviewers haven't submitted their evaluations for this submission.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {reviewerEvaluations.map((evaluation, index) => {
                  const evaluationId = String(evaluation.id);
                  const isMyEvaluation = String(evaluation.reviewerId) === currentReviewerId;
                  const showReplies = showRepliesFor.includes(evaluationId);
                  const hasReplies = evaluation.replies && evaluation.replies.length > 0;

                  return (
                    <div key={evaluation.id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className={`rounded-2xl p-5 sm:p-6 border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${isMyEvaluation
                          ? 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-300/60'
                          : 'bg-white border-gray-200/60'
                        }`}>
                        <div className="flex gap-4">
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${isMyEvaluation
                              ? 'bg-gradient-to-br from-blue-600 to-blue-700'
                              : 'bg-gradient-to-br from-[#101C50] to-[#1a2d70]'
                            }`}>
                            <span className="text-white font-bold text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {evaluation.name.split(' ')[1]?.[0] || 'R'}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-base sm:text-lg font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {evaluation.name}
                              </h3>
                              <span className="text-xs sm:text-sm text-gray-600 font-semibold px-2.5 py-1 bg-gray-200 rounded-full" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {evaluation.code}
                              </span>
                              {isMyEvaluation && (
                                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full font-bold shadow-md" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  Your Review
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mb-4 flex items-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              <Calendar className="w-4 h-4" />
                              {evaluation.date}
                            </p>

                            <div className="mb-4 p-4 bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-xl border border-amber-200/50">
                              <p className="text-sm sm:text-base font-bold text-amber-900 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                <Tag className="w-4 h-4" />
                                Decision: {evaluation.decision}
                              </p>
                            </div>

                            <div className="space-y-4 mb-5">
                              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/50">
                                <p className="text-xs sm:text-sm font-bold text-[#101C50] mb-2 uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  Ethics Review Recommendation
                                </p>
                                <p className="text-sm sm:text-base text-gray-800 leading-relaxed break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  {evaluation.ethicsRecommendation}
                                </p>
                              </div>
                              <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200/50">
                                <p className="text-xs sm:text-sm font-bold text-[#101C50] mb-2 uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  Technical Suggestions
                                </p>
                                <p className="text-sm sm:text-base text-gray-800 leading-relaxed break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  {evaluation.technicalSuggestions}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-5 pt-3 border-t border-gray-200/60 flex-wrap">
                              <button
                                onClick={() => handleReplyClick(evaluationId)}
                                className="text-xs sm:text-sm font-bold text-[#101C50] hover:text-blue-600 transition-colors flex items-center gap-2 group"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                              >
                                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Reply
                              </button>
                              {hasReplies && (
                                <button
                                  onClick={() => toggleReplies(evaluationId)}
                                  className="text-xs sm:text-sm font-bold text-[#101C50] hover:text-blue-600 transition-colors flex items-center gap-2"
                                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                                >
                                  {showReplies ? 'Hide' : 'View'} {evaluation.replies.length} {evaluation.replies.length === 1 ? 'reply' : 'replies'}
                                </button>
                              )}
                              {/* Edit Button - Only show for current user's review */}
                              {isMyEvaluation && (
                                <button
                                  onClick={handleEditReview}
                                  className="text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-900 transition-colors flex items-center gap-2 group"
                                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                                >
                                  <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  Edit Review
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {replyingTo === evaluationId && (
                        <div className="ml-10 sm:ml-16 mt-4 flex gap-3 sm:gap-4 animate-fadeIn">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#101C50] to-[#1a2d70] flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              You
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <textarea
                              value={replyText}
                              onChange={(e) => {
                                setReplyText(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                              }}
                              placeholder="Write a thoughtful reply..."
                              rows={2}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/10 focus:outline-none resize-none text-sm sm:text-base text-gray-800 shadow-sm transition-all"
                              style={{ fontFamily: 'Metropolis, sans-serif', minHeight: '80px', maxHeight: '200px' }}
                            />
                            <div className="flex gap-2 sm:gap-3 mt-3">
                              <button
                                onClick={handlePostReply}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white text-xs sm:text-sm rounded-xl hover:shadow-lg transform hover:scale-105 transition-all font-bold"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                              >
                                Post Reply
                              </button>
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 text-xs sm:text-sm rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {showReplies && evaluation.replies && evaluation.replies.map((reply: any) => (
                        <div key={reply.id} className="ml-10 sm:ml-16 mt-4">
                          <div className="bg-white rounded-2xl p-5 border-2 border-gray-200/60 shadow-md hover:shadow-lg transition-all">
                            <div className="flex gap-3 sm:gap-4">
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#101C50] to-[#1a2d70] flex items-center justify-center flex-shrink-0 shadow-md">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  {reply.name.split(' ')[1]?.[0] || 'R'}
                                </span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-sm sm:text-base font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                    {reply.name}
                                  </h3>
                                  <span className="text-xs text-gray-600 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                    {reply.code}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  <Calendar className="w-3.5 h-3.5" />
                                  {reply.date}
                                </p>

                                <p className="text-sm sm:text-base text-gray-800 leading-relaxed break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  {reply.text}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 py-8">
            {/* ✅ If status is pending OR no review, show "Start Review" AND "Conflict of Interest" */}
            {assignmentStatus === 'pending' || !currentUserReview ? (
              <>
                <button
                  onClick={handleStartReview}
                  className="px-12 sm:px-16 py-4 sm:py-5 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all text-base sm:text-lg font-bold shadow-xl"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Start Review
                </button>

                <button
                  onClick={() => setCoiOpen(true)}
                  className="px-12 sm:px-16 py-4 sm:py-5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all text-base sm:text-lg font-bold shadow-xl flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <AlertTriangle className="w-5 h-5" />
                  Conflict of Interest
                </button>
              </>
            ) : (
              <button
                onClick={handleEditReview}
                className="px-12 sm:px-16 py-4 sm:py-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all text-base sm:text-lg font-bold shadow-xl flex items-center justify-center gap-3"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
                Edit Your Review
              </button>
            )}
          </div>

        </div>
      </div>

      <Footer />

      {/* ✅ Modals */}
      <StartReviewModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleConfirmReview} submissionTitle={submissionData.title} />
      <EditReviewModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onConfirm={handleConfirmEditReview} submissionTitle={submissionData.title} />
      <ConflictOfInterestModal isOpen={coiOpen} onClose={() => setCoiOpen(false)} protocolCode={String(submissionData.id ?? id ?? '')} submissionTitle={submissionData.title} onSubmit={handleSubmitCOI} />
      {selectedDocument && <DocumentViewerModal isOpen={viewerOpen} onClose={() => setViewerOpen(false)} documentName={selectedDocument.name} documentUrl={selectedDocument.url} />}
    </div>
  );
}

export default function ReviewDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div></div>}>
      <ReviewDetailContent />
    </Suspense>
  );
}
