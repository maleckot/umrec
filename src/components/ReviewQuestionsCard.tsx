// components/ReviewQuestionsCard.tsx
'use client';

import { useState } from 'react';

interface OptionType {
  label: string;
  subtext?: string;
}

interface Question {
  id: number;
  question: string;
  type: 'radio' | 'textarea';
  options?: (string | OptionType)[];
  showCommentOn?: string[];
  subtext?: string;
}

interface ReviewQuestionsCardProps {
  title: string;
  questions: Question[];
  onAnswersChange?: (answers: any) => void;
}

const ReviewQuestionsCard: React.FC<ReviewQuestionsCardProps> = ({
  title,
  questions,
  onAnswersChange,
}) => {
  const [answers, setAnswers] = useState<any>({});

  const handleRadioChange = (questionId: number, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (onAnswersChange) onAnswersChange(newAnswers);
  };

  const handleTextareaChange = (questionId: number, value: string, parentId?: number) => {
    const key = parentId ? `${parentId}-comment` : questionId;
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (onAnswersChange) onAnswersChange(newAnswers);
  };

  const shouldShowComment = (question: Question, parentQuestion?: Question) => {
    if (!question.showCommentOn || !parentQuestion) return false;
    return question.showCommentOn.includes(answers[parentQuestion.id]);
  };

  // Group questions: main questions and their related textareas
  const groupedQuestions: Array<{
    mainQuestion: Question;
    commentQuestion?: Question;
  }> = [];

  let i = 0;
  while (i < questions.length) {
    const currentQuestion = questions[i];
    const nextQuestion = questions[i + 1];

    if (currentQuestion.type === 'radio' && nextQuestion?.type === 'textarea') {
      groupedQuestions.push({
        mainQuestion: currentQuestion,
        commentQuestion: nextQuestion,
      });
      i += 2;
    } else {
      groupedQuestions.push({
        mainQuestion: currentQuestion,
      });
      i += 1;
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      <h3 className="text-lg md:text-xl font-bold mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
        {title}
      </h3>

      <div className="space-y-6">
        {groupedQuestions.map((group, index) => (
          <div key={index}>
            {/* Main Question */}
            {group.mainQuestion.question && (
              <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {group.mainQuestion.question}
              </p>
            )}

            {/* Radio Options */}
            {group.mainQuestion.type === 'radio' && group.mainQuestion.options && (
              <div className="space-y-3">
                {group.mainQuestion.options.map((option, optionIndex) => {
                  // Handle both string and object options
                  const label = typeof option === 'string' ? option : option.label;
                  const subtext = typeof option === 'object' && 'subtext' in option ? option.subtext : undefined;

                  return (
                    <div key={optionIndex}>
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${group.mainQuestion.id}`}
                          value={label}
                          checked={answers[group.mainQuestion.id] === label}
                          onChange={() => handleRadioChange(group.mainQuestion.id, label)}
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
                      {/* Show separator line except for last option */}
                      {group.mainQuestion.options && optionIndex < group.mainQuestion.options.length - 1 && (
                        <hr className="my-3 border-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Conditional Comment Textarea */}
            {group.commentQuestion && shouldShowComment(group.commentQuestion, group.mainQuestion) && (
              <div className="mt-4">
                {group.commentQuestion.question && (
                  <p className="text-sm md:text-base text-[#101C50] mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {group.commentQuestion.question}
                  </p>
                )}
                <textarea
                  value={answers[`${group.mainQuestion.id}-comment`] || ''}
                  onChange={(e) => handleTextareaChange(group.commentQuestion!.id, e.target.value, group.mainQuestion.id)}
                  rows={4}
                  placeholder="Leave a comment."
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                  style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                />
              </div>
            )}

            {/* Standalone Textarea (always visible) */}
            {!group.commentQuestion && group.mainQuestion.type === 'textarea' && (
              <div>
                <textarea
                  value={answers[group.mainQuestion.id] || ''}
                  onChange={(e) => handleTextareaChange(group.mainQuestion.id, e.target.value)}
                  rows={4}
                  placeholder="Leave a comment."
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] resize-none text-gray-800"
                  style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#E8EAF6' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewQuestionsCard;
