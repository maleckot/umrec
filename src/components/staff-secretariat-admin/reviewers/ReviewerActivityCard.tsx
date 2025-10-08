// components/staff-secretariat-admin/reviewers/ReviewerActivityCard.tsx
'use client';

import { CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface Feedback {
  document: string;
  comment: string;
}

interface ReviewerActivityCardProps {
  reviewerName: string;
  reviewerCode: string;
  status: string;
  submittedDate?: string;
  overallAssessment: string;
  feedbacks: Feedback[];
}

export default function ReviewerActivityCard({
  reviewerName,
  reviewerCode,
  status,
  submittedDate,
  overallAssessment,
  feedbacks,
}: ReviewerActivityCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
      {/* Header */}
      <div className="bg-[#101C50] p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Reviewer's Assessment
          </h3>
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
            {status === 'Complete' ? (
              <>
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-xs font-bold text-green-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Complete
                </span>
              </>
            ) : (
              <>
                <Clock size={16} className="text-yellow-600" />
                <span className="text-xs font-bold text-yellow-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  In Progress
                </span>
              </>
            )}
          </div>
        </div>
        <p className="text-sm text-blue-100" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {reviewerName} (Code: {reviewerCode})
        </p>
        {submittedDate && (
          <p className="text-xs text-blue-200 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Submitted: {submittedDate}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Overall Assessment */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={18} className="text-[#101C50]" />
            <h4 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Overall Assessment
            </h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {overallAssessment}
            </p>
          </div>
        </div>

        {/* Document-Specific Feedback */}
        {feedbacks.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Document-Specific Feedback
            </h4>
            <div className="space-y-4">
              {feedbacks.map((feedback, index) => (
                <div key={index} className="border-l-4 border-blue-500 bg-blue-50 rounded-r-lg p-4">
                  <p className="text-xs font-bold text-blue-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    📄 {feedback.document}
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {feedback.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
