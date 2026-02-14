'use client';

import { useState } from 'react';
import { MessageCircle, Calendar, Tag, Edit, Trash2, Check, X, Save } from 'lucide-react';

interface Props {
  evaluations: any[];
  currentReviewerId: string;
  showRepliesFor: string[];
  toggleReplies: (id: string) => void;
  replyingTo: string | null;
  handleReplyClick: (id: string) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  handlePostReply: () => void;
  setReplyingTo: (id: string | null) => void;
  handleEditReview: () => void;
  onEditReply: (replyId: number, newText: string) => void;
  onDeleteReply: (replyId: number) => void;
}

const EvaluationsList = ({ 
  evaluations, 
  currentReviewerId, 
  showRepliesFor, 
  toggleReplies, 
  replyingTo, 
  handleReplyClick, 
  replyText, 
  setReplyText, 
  handlePostReply, 
  setReplyingTo,
  handleEditReview,
  onEditReply,
  onDeleteReply
}: Props) => {
  
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const startEditing = (replyId: number, currentText: string) => {
    setEditingReplyId(replyId);
    setEditText(currentText);
  };

  const cancelEditing = () => {
    setEditingReplyId(null);
    setEditText('');
  };

  const saveEditing = (replyId: number) => {
    onEditReply(replyId, editText);
    setEditingReplyId(null);
    setEditText('');
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl mb-8 border border-gray-100/50">
      <div className="flex items-center mb-8">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Reviewer Evaluations
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full mt-2"></div>
        </div>
      </div>

      {evaluations.length === 0 ? (
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
          {evaluations.map((evaluation, index) => {
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

                {showReplies && evaluation.replies && evaluation.replies.map((reply: any) => {
                  const isMyReply = String(reply.reviewerId) === currentReviewerId;
                  const isEditing = editingReplyId === reply.id;

                  return (
                    <div key={reply.id} className="ml-10 sm:ml-16 mt-4">
                      <div className={`bg-white rounded-2xl p-5 border-2 shadow-md hover:shadow-lg transition-all ${
                          isMyReply ? 'border-blue-200/60' : 'border-gray-200/60'
                        }`}>
                        <div className="flex gap-3 sm:gap-4">
                          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                              isMyReply ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-[#101C50] to-[#1a2d70]'
                            }`}>
                            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {reply.name.split(' ')[1]?.[0] || 'R'}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-sm sm:text-base font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {isMyReply ? 'You' : reply.name}
                              </h3>
                              <span className="text-xs text-gray-600 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {reply.code}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              <Calendar className="w-3.5 h-3.5" />
                              {reply.date}
                            </p>

                            {isEditing ? (
                              <div className="animate-fadeIn">
                                <textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-sm text-gray-800 mb-2 shadow-sm"
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveEditing(reply.id)}
                                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 flex items-center gap-1 shadow-sm"
                                  >
                                    <Save className="w-3 h-3" /> Save
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-300 flex items-center gap-1 shadow-sm"
                                  >
                                    <X className="w-3 h-3" /> Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="group relative">
                                <p className="text-sm sm:text-base text-gray-800 leading-relaxed break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                  {reply.text}
                                </p>
                                
                                {isMyReply && (
                                  <div className="mt-3 flex gap-4 border-t border-gray-100 pt-2">
                                    <button 
                                      onClick={() => startEditing(reply.id, reply.text)}
                                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                                    >
                                      <Edit className="w-3 h-3" /> Edit
                                    </button>
                                    <button 
                                      onClick={() => onDeleteReply(reply.id)}
                                      className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EvaluationsList;
