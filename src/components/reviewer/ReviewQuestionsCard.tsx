// components/reviewer/ReviewQuestionsCard.tsx
'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface OptionType {
  label: string;
  subtext?: string;
}

interface Question {
  id: string | number;
  question: string;
  type: 'radio' | 'textarea';
  options?: (string | OptionType)[];
  showCommentOn?: string[];
  dependsOn?: { id: string | number; values: string[] };
  required?: boolean;
}

interface ReviewQuestionsCardProps {
  title: string;
  subtitle?: string;
  questions: Question[];
  onAnswersChange?: (answers: any) => void;
  isLastProtocolSection?: boolean;
  isLastICFSection?: boolean;
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
  onNext?: () => void;
  progressPercentage?: number;
}

const ReviewQuestionsCard: React.FC<ReviewQuestionsCardProps> = ({
  title,
  subtitle,
  questions,
  onAnswersChange,
  isLastProtocolSection = false,
  isLastICFSection = false,
  currentStep = 0,
  totalSteps = 1,
  onBack,
  onNext,
  progressPercentage = 0,
}) => {
  const [answers, setAnswers] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitRef = useRef(false);

  const handleRadioChange = (questionId: string | number, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (onAnswersChange) onAnswersChange(newAnswers);
  };

  const handleTextareaChange = (questionId: string | number, value: string, parentId?: string | number) => {
    const key = parentId ? `${parentId}-comment` : questionId;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (onAnswersChange) onAnswersChange(newAnswers);
  };

  const shouldShowQuestion = (question: Question) => {
    if (!question.showCommentOn && !question.dependsOn) {
      return true;
    }

    if (question.showCommentOn) {
      const parentQuestion = questions.find(q => q.type === 'radio' && questions.indexOf(q) < questions.indexOf(question));
      if (parentQuestion) {
        return question.showCommentOn.includes(answers[parentQuestion.id]);
      }
      return false;
    }

    if (question.dependsOn) {
      const dependentAnswer = answers[question.dependsOn.id];
      return question.dependsOn.values.includes(dependentAnswer);
    }

    return true;
  };

  // ✅ Handle next with debounce
  const handleNext = async () => {
    if (submitRef.current || isSubmitting) return;

    // ✅ Only validate if THIS is a summary section (last steps)
    if (isLastProtocolSection || isLastICFSection) {
      const recommendationKey = isLastProtocolSection
        ? 'protocol_recommendation'
        : 'icf_recommendation';

      // Check if recommendation exists
      if (!answers[recommendationKey]?.trim()) {
        alert('Please select a recommendation before proceeding');
        return;
      }

      // Check disapproval reasons if needed
      if (answers[recommendationKey] === 'Disapproved') {
        const reasonsKey = isLastProtocolSection
          ? 'protocol_disapproval_reasons'
          : 'icf_disapproval_reasons';

        if (!answers[reasonsKey]?.trim()) {
          alert('Please provide reasons for disapproval');
          return;
        }
      }

      // Check ethics only if NOT "Approved with no revision"
      if (answers[recommendationKey] !== 'Approved with no revision') {
        const ethicsKey = isLastProtocolSection
          ? 'protocol_ethics_recommendation'
          : 'icf_ethics_recommendation';

        if (!answers[ethicsKey]?.trim()) {
          alert('Please provide ethics review recommendation');
          return;
        }
      }
    }

    // ✅ Only set flags if ALL validations pass
    submitRef.current = true;
    setIsSubmitting(true);

    try {
      if (onNext) {
        await onNext();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      submitRef.current = false;
    }
  };


  // ✅ Handle back with debounce
  const handleBack = async () => {
    if (submitRef.current || isSubmitting) return;

    submitRef.current = true;
    setIsSubmitting(true);

    try {
      if (onBack) {
        await onBack();
      }
    } finally {
      setIsSubmitting(false);
      submitRef.current = false;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-bold mb-2" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Questions - No scrolling, expands naturally */}
      <div className="space-y-6 mb-6">
        {questions.map((question) => {
          if (!shouldShowQuestion(question)) {
            return null;
          }

          return (
            <div key={question.id}>
              {question.question && (
                <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {question.question}
                  <span className="text-red-600 ml-1">*</span>
                </p>
              )}

              {question.type === 'radio' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const label = typeof option === 'string' ? option : option.label;
                    const subtext = typeof option === 'object' && 'subtext' in option ? option.subtext : undefined;

                    return (
                      <div key={optionIndex}>
                        <label className="flex items-start cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={label}
                            checked={answers[question.id] === label}
                            onChange={() => handleRadioChange(question.id, label)}
                            className="w-5 h-5 text-[#101C50] cursor-pointer mt-0.5 flex-shrink-0"
                            disabled={isSubmitting}
                          />
                          <div className="ml-3 flex-1">
                            <span className="text-sm md:text-base text-gray-800 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {label}
                            </span>
                            {subtext && (
                              <span className="text-xs md:text-sm text-gray-600 italic block mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {subtext}
                              </span>
                            )}
                          </div>
                        </label>
                        {question.options && optionIndex < question.options.length - 1 && (
                          <hr className="my-3 border-gray-300" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {question.type === 'textarea' && (
                <div>
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleTextareaChange(question.id, e.target.value)}
                    rows={4}
                    placeholder={question.question ? "Enter your comments here..." : "Leave a comment."}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                    style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                    required={question.required}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Protocol Summary Section */}
        {isLastProtocolSection && (
          <div className="space-y-6 mt-6">
            <div>
              <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Recommendation <span className="text-red-600 ml-1">*</span>
              </p>
              <div className="space-y-3">
                {['Approved with no revision', 'Approved with minor revision', 'Major Revision', 'Disapproved'].map((option, idx, arr) => (
                  <div key={option}>
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="protocol_recommendation"
                        value={option}
                        checked={answers.protocol_recommendation === option}
                        onChange={() => handleRadioChange('protocol_recommendation', option)}
                        className="w-5 h-5 text-[#101C50] cursor-pointer mt-0.5 flex-shrink-0"
                        required
                        disabled={isSubmitting}
                      />
                      <span className="ml-3 text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {option}
                      </span>
                    </label>
                    {idx < arr.length - 1 && <hr className="my-3 border-gray-300" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Disapproval reason - only show if Disapproved */}
            {answers.protocol_recommendation === 'Disapproved' && (
              <div>
                <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Reasons for Disapproval <span className="text-red-600 ml-1">*</span>
                </p>
                <textarea
                  value={answers.protocol_disapproval_reasons || ''}
                  onChange={(e) => handleTextareaChange('protocol_disapproval_reasons', e.target.value)}
                  rows={4}
                  placeholder="Enter reasons for disapproval..."
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                  style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Ethics Review - ALWAYS show but toggle required */}
            <div>
              <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Ethics Review Recommendation
                {answers.protocol_recommendation !== 'Approved with no revision' && <span className="text-red-600 ml-1">*</span>}
              </p>
              <textarea
                value={answers.protocol_ethics_recommendation || ''}
                onChange={(e) => handleTextareaChange('protocol_ethics_recommendation', e.target.value)}
                rows={4}
                placeholder="Provide your ethics review recommendation..."
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                required={answers.protocol_recommendation !== 'Approved with no revision'}
                disabled={isSubmitting}
              />
            </div>

            {/* Technical Suggestions - ALWAYS show, always optional */}
            <div>
              <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Technical Suggestions
              </p>
              <textarea
                value={answers.protocol_technical_suggestions || ''}
                onChange={(e) => handleTextareaChange('protocol_technical_suggestions', e.target.value)}
                rows={4}
                placeholder="Provide any technical suggestions (optional)..."
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                disabled={isSubmitting}
              />
            </div>

          </div>
        )}

        {isLastICFSection && (
          <div className="space-y-6 mt-6">
            <div>
              <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Recommendation <span className="text-red-600 ml-1">*</span>
              </p>
              <div className="space-y-3">
                {['Approved with no revision', 'Approved with minor revision', 'Major Revision', 'Disapproved'].map((option, idx, arr) => (
                  <div key={option}>
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="icf_recommendation"
                        value={option}
                        checked={answers.icf_recommendation === option}
                        onChange={() => handleRadioChange('icf_recommendation', option)}
                        className="w-5 h-5 text-[#101C50] cursor-pointer mt-0.5 flex-shrink-0"
                        required
                        disabled={isSubmitting}
                      />
                      <span className="ml-3 text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {option}
                      </span>
                    </label>
                    {idx < arr.length - 1 && <hr className="my-3 border-gray-300" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Disapproval reason - only show if Disapproved */}
            {answers.icf_recommendation === 'Disapproved' && (
              <div>
                <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Reasons for Disapproval <span className="text-red-600 ml-1">*</span>
                </p>
                <textarea
                  value={answers.icf_disapproval_reasons || ''}
                  onChange={(e) => handleTextareaChange('icf_disapproval_reasons', e.target.value)}
                  rows={4}
                  placeholder="Enter reasons for disapproval..."
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                  style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Ethics Review - ALWAYS show but toggle required */}
            <div>
              <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Ethics Review Recommendation
                {answers.icf_recommendation !== 'Approved with no revision' && <span className="text-red-600 ml-1">*</span>}
              </p>
              <textarea
                value={answers.icf_ethics_recommendation || ''}
                onChange={(e) => handleTextareaChange('icf_ethics_recommendation', e.target.value)}
                rows={4}
                placeholder="Provide your ethics review recommendation..."
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                required={answers.icf_recommendation !== 'Approved with no revision'}
                disabled={isSubmitting}
              />
            </div>

            {/* Technical Suggestions - ALWAYS show, always optional */}
            <div>
              <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Technical Suggestions
              </p>
              <textarea
                value={answers.icf_technical_suggestions || ''}
                onChange={(e) => handleTextareaChange('icf_technical_suggestions', e.target.value)}
                rows={4}
                placeholder="Provide any technical suggestions (optional)..."
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons - Attached at bottom */}
      <div className="border-t-2 border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <button
            onClick={handleBack}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm sm:text-base rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            {isSubmitting ? 'Processing...' : 'Back'}
          </button>
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex-1 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white text-sm sm:text-base rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : currentStep < totalSteps - 1 ? (
              <>
                Next
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Submit Review
              </>
            )}
          </button>
        </div>

        {/* Step Info */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <span className="font-medium">
              {currentStep === 0 ? 'First Step' : currentStep === totalSteps - 1 ? 'Final Step' : `Step ${currentStep + 1}`}
            </span>
            <span className="font-semibold text-[#101C50]">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>

        {/* Helper Info */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-blue-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Review Tip
              </p>
              <p className="text-xs sm:text-sm text-blue-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {currentStep === totalSteps - 1
                  ? 'This is the final section. Review your answers before submitting.'
                  : 'Answer all questions in this section to proceed to the next step.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewQuestionsCard;
