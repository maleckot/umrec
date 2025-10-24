// components/reviewer/ReviewQuestionsCard.tsx
'use client';

import { useState } from 'react';

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
}

const ReviewQuestionsCard: React.FC<ReviewQuestionsCardProps> = ({
  title,
  subtitle,
  questions,
  onAnswersChange,
  isLastProtocolSection = false,
  isLastICFSection = false,
}) => {
  const [answers, setAnswers] = useState<any>({});

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

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      <h3 className="text-lg md:text-xl font-bold mb-2" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
        {title}
      </h3>

      {subtitle && (
        <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {subtitle}
        </p>
      )}

      <div className="space-y-6">
        {questions.map((question, index) => {
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
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* ✅ Protocol Summary Section - ORIGINAL DESIGN */}
        {isLastProtocolSection && (
          <div className="space-y-6 mt-6">
            {/* Recommendation Radio Buttons - styled like regular questions */}
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

            {/* Disapproval Reasons */}
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
                />
              </div>
            )}

            {/* Ethics Review Recommendation */}
            <div>
              <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Ethics Review Recommendation <span className="text-red-600 ml-1">*</span>
              </p>
              <textarea
                value={answers.protocol_ethics_recommendation || ''}
                onChange={(e) => handleTextareaChange('protocol_ethics_recommendation', e.target.value)}
                rows={4}
                placeholder="Provide your ethics review recommendation..."
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                required
              />
            </div>

            {/* Technical Suggestions */}
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
              />
            </div>
          </div>
        )}

        {/* ✅ ICF Summary Section - ORIGINAL DESIGN */}
        {isLastICFSection && (
          <div className="space-y-6 mt-6">
            {/* Same structure as Protocol above, but with icf_ prefix */}
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
                />
              </div>
            )}

            <div>
              <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Ethics Review Recommendation <span className="text-red-600 ml-1">*</span>
              </p>
              <textarea
                value={answers.icf_ethics_recommendation || ''}
                onChange={(e) => handleTextareaChange('icf_ethics_recommendation', e.target.value)}
                rows={4}
                placeholder="Provide your ethics review recommendation..."
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                required
              />
            </div>

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
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReviewQuestionsCard;
