// components/staff-secretariat-admin/reviewers/ReviewerAssessmentCard.tsx
'use client';

import { CheckCircle, Clock, ShieldCheck, Wrench, AlertCircle } from 'lucide-react';

interface ReviewerAssessmentCardProps {
  reviewerName: string;
  reviewerCode: string;
  status: string;
  submittedDate?: string;
  decision: string;
  ethicsReviewRecommendation: string;
  technicalSuggestions: string;
  isCurrentVersion?: boolean;
}

export default function ReviewerAssessmentCard({
  reviewerName,
  reviewerCode,
  status,
  submittedDate,
  decision,
  ethicsReviewRecommendation,
  technicalSuggestions,
  isCurrentVersion = true,
}: ReviewerAssessmentCardProps) {
  
  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'Approved with No Revision':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'Approved with Minor Revision/s':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'Major Revision/s':
        return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      case 'Resubmission Required':
        return 'bg-orange-100 text-orange-800 border-orange-500';
      case 'Disapproved':
        return 'bg-red-100 text-red-800 border-red-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'Approved with No Revision':
        return <CheckCircle size={20} className="text-green-700" />;
      case 'Approved with Minor Revision/s':
        return <CheckCircle size={20} className="text-blue-700" />;
      case 'Major Revision/s':
        return <AlertCircle size={20} className="text-yellow-700" />;
      case 'Resubmission Required':
        return <AlertCircle size={20} className="text-orange-700" />;
      case 'Disapproved':
        return <AlertCircle size={20} className="text-red-700" />;
      default:
        return <Clock size={20} className="text-gray-700" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
      {/* Header */}
<div className="bg-[#101C50] p-4 sm:p-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
    <h3 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      {isCurrentVersion ? "Reviewer's Assessment" : 'Previous Assessment'}
    </h3>
    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full w-fit">
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
<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
  {/* Decision Badge */}
  <div className="flex items-center justify-center">
    <div className={`inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 rounded-xl border-2 ${getDecisionColor(decision)}`}>
      {getDecisionIcon(decision)}
      <div className="text-center sm:text-left">
        <p className="text-xs font-semibold uppercase" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Decision
        </p>
        <p className="text-sm font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {decision}
        </p>
      </div>
    </div>
  </div>

  {/* Ethics Review Recommendation */}
  <div>
    <div className="flex items-center gap-2 mb-3">
      <ShieldCheck size={18} className="text-[#101C50] flex-shrink-0" />
      <h4 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Ethics Review Recommendation
      </h4>
    </div>
    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
      <p className="text-sm text-gray-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {ethicsReviewRecommendation}
      </p>
    </div>
  </div>

  {/* Technical Suggestions */}
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Wrench size={18} className="text-[#101C50] flex-shrink-0" />
      <h4 className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Technical Suggestions
      </h4>
    </div>
    <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
      <p className="text-sm text-gray-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {technicalSuggestions}
      </p>
    </div>
  </div>
</div>
    </div>
  );
}