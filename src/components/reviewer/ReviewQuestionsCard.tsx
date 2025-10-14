// components/reviewer/ReviewQuestionsCard.tsx
'use client';

import { useState } from 'react';

interface OptionType {
  label: string;
  subtext?: string;
}

interface Question {
  id: string | number;  // ✅ Accept both string and number
  question: string;
  type: 'radio' | 'textarea';
  options?: (string | OptionType)[];
  showCommentOn?: string[];  // Old pattern
  dependsOn?: { id: string | number; values: string[] };  // New pattern
  required?: boolean;
}

interface ReviewQuestionsCardProps {
  title: string;
  subtitle?: string;  // ✅ Add subtitle support
  questions: Question[];
  onAnswersChange?: (answers: any) => void;
}

const ReviewQuestionsCard: React.FC<ReviewQuestionsCardProps> = ({
  title,
  subtitle,
  questions,
  onAnswersChange,
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

  // ✅ Updated to handle both showCommentOn and dependsOn patterns
  const shouldShowQuestion = (question: Question) => {
    // If no dependency, always show
    if (!question.showCommentOn && !question.dependsOn) {
      return true;
    }

    // Old pattern: showCommentOn with parent question
    if (question.showCommentOn) {
      const parentQuestion = questions.find(q => q.type === 'radio' && questions.indexOf(q) < questions.indexOf(question));
      if (parentQuestion) {
        return question.showCommentOn.includes(answers[parentQuestion.id]);
      }
      return false;
    }

    // New pattern: dependsOn
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
          // Skip questions that depend on other answers and shouldn't be shown yet
          if (!shouldShowQuestion(question)) {
            return null;
          }

          return (
            <div key={question.id}>
              {/* Question Text */}
              {question.question && (
                <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {question.question}
                  {question.required && <span className="text-red-600 ml-1">*</span>}
                </p>
              )}

              {/* Radio Options */}
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

              {/* Textarea */}
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
      </div>
    </div>
  );
};

export default ReviewQuestionsCard;
