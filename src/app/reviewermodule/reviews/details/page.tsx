// app/reviewermodule/reviews/details/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import StartReviewModal from '@/components/reviewer/StartReviewModal';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getReviewerEvaluations } from '@/app/actions/reviewer/getReviewerEvaluations';
import { postReviewReply } from '@/app/actions/reviewer/postReviewReply';

// Add Reply interface
interface Reply {
  id: number;
  reviewerId: number;
  name: string;
  code: string;
  date: string;
  decision: string;
  ethicsRecommendation: string;
  technicalSuggestions: string;
  replies?: Reply[]; // Nested replies
}

interface Evaluation {
  id: number;
  reviewerId: number;
  name: string;
  code: string;
  date: string;
  decision: string;
  ethicsRecommendation: string;
  technicalSuggestions: string;
  replies: Reply[];
}

export default function ReviewDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // Changed to string to support nested IDs
  const [replyText, setReplyText] = useState('');
  const [showRepliesFor, setShowRepliesFor] = useState<string[]>([]);
  const [reviewerEvaluations, setReviewerEvaluations] = useState<any[]>([]);
  const [currentReviewerId, setCurrentReviewerId] = useState<string>('');

// REPLACE the mock submissionData and submittedFiles with state:
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

// REPLACE the useEffect and loadEvaluations with this:
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
      
      // ✅ Set submission data from database
      if (result.submission) {
        setSubmissionData({
          id: result.submission.id,
          title: result.submission.title,
          category: result.submission.category,
          assignedDate: result.submission.assignedDate,
          dueDate: result.submission.dueDate || 'TBD',
          description: result.submission.description,
          status: result.submission.status
        });
      }
      
      // ✅ Set consolidated document
      if (result.consolidatedDocument) {
        setSubmittedFiles([
          {
            id: 1,
            name: result.consolidatedDocument.name,
            time: new Date(result.consolidatedDocument.uploadedAt).toLocaleDateString('en-US'),
            status: 'viewed',
            url: result.consolidatedDocument.url
          }
        ]);
      }
    } else {
      console.error('Failed to load evaluations:', result.error);
    }
  } catch (error) {
    console.error('Error loading evaluations:', error);
  } finally {
    setLoading(false);
  }
};

  const handleStartReview = () => {
    setShowModal(true);
  };

  const handleConfirmReview = () => {
    setShowModal(false);
    router.push(`/reviewermodule/review-submission?id=${id}`);
  };

  const handleReplyClick = (evaluationId: string) => {
    setReplyingTo(replyingTo === evaluationId ? null : evaluationId);
    setReplyText('');
  };

 const handlePostReply = async () => {
  if (!replyText.trim() || !replyingTo) return;

  try {
    const result = await postReviewReply(replyingTo, replyText);
    
    if (result.success && result.reply) {
      // ✅ Optimistically add reply to state without reloading
      setReviewerEvaluations(prev => prev.map(evaluation => {
        if (evaluation.id === replyingTo) {
          return {
            ...evaluation,
            replies: [
              ...(evaluation.replies || []),
              {
                id: result.reply.id,
                reviewerId: currentReviewerId,
                name: 'You', // Will show as current user
                code: 'N/A',
                date: new Date().toLocaleDateString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric'
                }),
                text: replyText,
              }
            ]
          };
        }
        return evaluation;
      }));

      // ✅ Auto-expand replies to show the new reply
      if (!showRepliesFor.includes(replyingTo)) {
        setShowRepliesFor(prev => [...prev, replyingTo]);
      }

      // Clear input
      setReplyText('');
      setReplyingTo(null);
    } else {
      alert(`Failed to post reply: ${result.error}`);
    }
  } catch (error) {
    console.error('Error posting reply:', error);
    alert('Failed to post reply');
  }
};
;

  const toggleReplies = (evaluationId: string) => {
    setShowRepliesFor(prev => 
      prev.includes(evaluationId) 
        ? prev.filter(id => id !== evaluationId)
        : [...prev, evaluationId]
    );
  };

  // Recursive component to render nested replies with connecting lines
  const RenderReply = ({ reply, parentId, depth = 0, isLast = false }: { reply: Reply; parentId: string; depth?: number; isLast?: boolean }) => {
    const replyId = `${parentId}-${reply.id}`;
    const hasNestedReplies = reply.replies && reply.replies.length > 0;
    const isMyReply = reply.reviewerId === currentReviewerId;

    return (
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300" style={{ height: isLast && !hasNestedReplies ? '24px' : '100%' }}></div>
        
        <div className="ml-8 sm:ml-10 mt-3 relative">
          {/* Horizontal connecting line */}
          <div className="absolute left-[-24px] top-4 w-6 h-0.5 bg-gray-300"></div>
          
          <div className={`rounded-lg p-3 border ${isMyReply ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
            <div className="flex gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMyReply ? 'bg-blue-600' : 'bg-[#101C50]'}`}>
                <span className="text-white font-bold text-xs" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {reply.name.split(' ')[1]?.[0] || 'R'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-xs font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {reply.name} - {reply.code}
                  </h3>
                  {isMyReply && (
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {reply.date}
                </p>

                <div className="space-y-2 mb-2">
                  <div>
                    <p className="text-xs font-semibold text-[#1a1a1a] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Ethics Review Recommendation:
                    </p>
                    <p className="text-xs text-[#2d2d2d] break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {reply.ethicsRecommendation}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1a1a1a] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Technical Suggestions:
                    </p>
                    <p className="text-xs text-[#2d2d2d] break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {reply.technicalSuggestions}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleReplyClick(replyId)}
                  className="text-xs font-semibold text-[#101C50] hover:underline"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>

          {/* Reply Input Box */}
          {replyingTo === replyId && (
            <div className="mt-3 flex gap-2">
              <div className="w-7 h-7 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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
                  placeholder="Write a reply..."
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#101C50] focus:outline-none resize-none text-xs text-[#1a1a1a]"
                  style={{ fontFamily: 'Metropolis, sans-serif', minHeight: '50px', maxHeight: '150px' }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handlePostReply}
                    className="px-3 py-1 bg-[#101C50] text-white text-xs rounded-lg hover:bg-[#0d1640] font-semibold"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 font-semibold"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {hasNestedReplies && reply.replies!.map((nestedReply, index) => (
            <RenderReply 
              key={nestedReply.id} 
              reply={nestedReply} 
              parentId={replyId}
              depth={depth + 1}
              isLast={index === reply.replies!.length - 1}
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="flex items-center justify-center pt-24 md:pt-28 lg:pt-32 pb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50] mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading review details...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/reviewermodule/reviews')}
            className="flex items-center gap-2 mb-6 text-[#101C50] hover:text-[#0d1640] transition-colors"
            style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
          >
            <ArrowLeft size={20} />
            Review Submission
          </button>

          {/* Submission Details */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-[#101C50] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Submission Details
            </h2>

            <div className="flex flex-col lg:flex-row lg:gap-20">
              <div className="lg:w-[65%] space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Description
                  </p>
                  <p className="text-base text-[#101C50] font-semibold leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submissionData.title}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Assigned Date
                  </p>
                  <p className="text-base text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submissionData.assignedDate}
                  </p>
                </div>
              </div>

              <div className="lg:w-[35%] space-y-6 mt-6 lg:mt-0">
                <div>
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Category
                  </p>
                  <p className="text-base text-[#101C50] font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submissionData.category}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Due Date
                  </p>
                  <p className="text-base text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submissionData.dueDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Description
              </p>
              <p className="text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {submissionData.description}
              </p>
            </div>
          </div>

          {/* Submitted Files */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-[#101C50] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Submitted File
            </h2>
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-[#101C50] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Submitted File
            </h2>

            <div className="space-y-3">
              {submittedFiles.map((file) => (
                <div key={file.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#101C50] truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {file.time}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`w-full sm:w-24 px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                      file.status === 'viewed' 
                        ? 'bg-[#101C50] text-white hover:bg-[#0d1640]'
                        : 'bg-[#7C1100] text-white hover:bg-[#5a0c00]'
                    }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    {file.status === 'viewed' ? 'View' : 'Review'}
                  </button>
                </div>
              ))}
            </div>
          </div>
            <div className="space-y-3">
              {submittedFiles.map((file) => (
                <div key={file.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#101C50] truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {file.time}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`w-full sm:w-24 px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                      file.status === 'viewed' 
                        ? 'bg-[#101C50] text-white hover:bg-[#0d1640]'
                        : 'bg-[#7C1100] text-white hover:bg-[#5a0c00]'
                    }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    {file.status === 'viewed' ? 'View' : 'Review'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reviewer Evaluations */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-[#101C50] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Reviewer Evaluations
            </h2>

            {reviewerEvaluations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  No Reviewer Evaluations Yet
                </h3>
                <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Reviewers haven't submitted their evaluations for this submission.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewerEvaluations.map((evaluation) => {
                  const isMyEvaluation = evaluation.reviewerId === currentReviewerId;
                  const showReplies = showRepliesFor.includes(evaluation.id);
                  const hasReplies = evaluation.replies && evaluation.replies.length > 0;
                  
                  return (
                    <div key={evaluation.id}>
                      {/* Main Evaluation */}
                      <div className={`rounded-lg p-4 ${isMyEvaluation ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'}`}>
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isMyEvaluation ? 'bg-blue-600' : 'bg-[#101C50]'}`}>
                            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {evaluation.name.split(' ')[1]?.[0] || 'R'}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-sm font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {evaluation.name} - {evaluation.code}
                              </h3>
                              {isMyEvaluation && (
                                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {evaluation.date}
                            </p>

                            <div className="mb-3">
                              <p className="text-sm font-semibold text-[#1a1a1a] mb-2 break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                Decision: {evaluation.decision}
                              </p>
                            </div>

                            <div className="space-y-2 mb-3">
                              <div>
                                <p className="text-xs font-semibold text-[#1a1a1a] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  Ethics Review Recommendation:
                                </p>
                                <p className="text-sm text-[#2d2d2d] break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  {evaluation.ethicsRecommendation}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-[#1a1a1a] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  Technical Suggestions:
                                </p>
                                <p className="text-sm text-[#2d2d2d] break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  {evaluation.technicalSuggestions}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                              <button
                                onClick={() => handleReplyClick(evaluationId)}
                                className="text-xs font-semibold text-[#101C50] hover:underline"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                              >
                                Reply
                              </button>
                              {hasReplies && (
                                <button
                                  onClick={() => toggleReplies(evaluation.id)}
                                  className="text-xs font-semibold text-[#101C50] hover:underline"
                                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                                >
                                  {showReplies ? 'Hide replies' : `View replies`}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reply Input for Main Evaluation */}
                      {replyingTo === evaluationId && (
                        <div className="ml-8 sm:ml-14 mt-3 flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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
                              placeholder="Write a reply..."
                              rows={2}
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#101C50] focus:outline-none resize-none text-sm text-[#1a1a1a]"
                              style={{ fontFamily: 'Metropolis, sans-serif', minHeight: '60px', maxHeight: '200px' }}
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={handlePostReply}
                                className="px-4 py-1.5 bg-[#101C50] text-white text-xs rounded-lg hover:bg-[#0d1640] font-semibold"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                              >
                                Reply
                              </button>
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="px-4 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 font-semibold"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies - Facebook Style - Show only when toggled */}
                      {showReplies && evaluation.replies && evaluation.replies.map((reply: any) => (
                        <div key={reply.id} className="ml-8 sm:ml-14 mt-3">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex gap-3">
                              {/* Avatar/Icon */}
                              <div className="w-8 h-8 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-xs" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  {reply.name.split(' ')[1]?.[0] || 'R'}
                                </span>
                              </div>

                              {/* Reply Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-sm font-bold text-[#101C50] truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                    {reply.name} - {reply.code}
                                  </h3>
                                </div>
                                <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  {reply.date}
                                </p>

                                <div className="space-y-2">
                                  <p className="text-sm text-[#2d2d2d] break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                    {reply.text}
                                  </p>
                                </div>
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

          {/* Start Review Button */}
          <div className="flex justify-center">
            <button
              onClick={handleStartReview}
              className="px-12 py-4 bg-[#101C50] text-white rounded-lg hover:bg-[#0d1640] transition-colors text-lg font-bold"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Start Review
            </button>
          </div>
        </div>
      </div>

      <StartReviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmReview}
        submissionTitle={submissionData.title}
      />

      <Footer />
    </div>
  );
}
