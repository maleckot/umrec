// components/staff-secretariat-admin/submission-details/SubmissionSidebar.tsx
interface SubmissionSidebarProps {
  status: string;
  category?: string;
  details: {
    submissionDate: string;
    reviewersRequired: number;
    reviewersAssigned: number;
  };
  authorInfo: {
    name: string;
    organization: string;
    school: string;
    college: string;
    email: string;
  };
  timeline: {
    submitted: string;
    reviewDue: string;
    decisionTarget: string;
  };
  assignedReviewers?: string[];
  statusMessage?: string;
  onAction?: () => void;
  actionLabel?: string;
  actionType?: 'primary' | 'secondary';
}

export default function SubmissionSidebar({
  status,
  category,
  details,
  authorInfo,
  timeline,
  assignedReviewers,
  statusMessage,
  onAction,
  actionLabel,
  actionType = 'primary',
}: SubmissionSidebarProps) {
  // Check if status is "Review Complete"
  const isReviewComplete = status === 'Review Complete';

  return (
    <div className="bg-gray-100 rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 space-y-3 sm:space-y-4 lg:sticky lg:top-6">
      {/* Status */}
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Status
        </h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
            <span className="text-xs sm:text-sm font-semibold text-gray-800 break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {status}
            </span>
          </div>
          {category && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0"></span>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Classification: {category}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Details
        </h4>
        <div className="space-y-1.5 text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0">Submission Date:</span>
            <span className="font-semibold text-gray-800 text-right">{details.submissionDate}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0">Reviewers Required:</span>
            <span className="font-semibold text-gray-800 text-right">{details.reviewersRequired}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0">Reviewers Assigned:</span>
            <span className="font-semibold text-gray-800 text-right">{details.reviewersAssigned}</span>
          </div>
        </div>
      </div>

      {/* Assigned Reviewers */}
      {assignedReviewers && assignedReviewers.length > 0 && (
        <div>
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Assigned Reviewers
          </h4>
          <div className="bg-white border border-gray-300 rounded-lg p-2 sm:p-3 space-y-1.5 sm:space-y-2">
            {assignedReviewers.map((reviewer, index) => (
              <p key={index} className="text-xs text-gray-800 break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {reviewer}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Author Information */}
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Author Information
        </h4>
        <div className="space-y-1.5 text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0">Name:</span>
            <span className="font-semibold text-gray-800 text-right break-words">{authorInfo.name}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0">Organization:</span>
            <span className="font-semibold text-gray-800 text-right break-words">{authorInfo.organization}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0">School:</span>
            <span className="font-semibold text-gray-800 text-right break-words">{authorInfo.school}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0">College:</span>
            <span className="font-semibold text-gray-800 text-right break-words">{authorInfo.college}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0 whitespace-nowrap">Email:</span>
            <span className="font-semibold text-gray-800 text-right break-all">{authorInfo.email}</span>
          </div>
        </div>
      </div>

      {/* Timeline - Conditional Labels */}
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Timeline
        </h4>
        <div className="space-y-1.5 text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0">Submitted:</span>
            <span className="font-semibold text-gray-800 text-right">{timeline.submitted}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0">
              {isReviewComplete ? 'Started Reviewing:' : 'Review Due:'}
            </span>
            <span className="font-semibold text-gray-800 text-right">{timeline.reviewDue}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="flex-shrink-0">
              {isReviewComplete ? 'Completed Date:' : 'Decision Target:'}
            </span>
            <span className="font-semibold text-gray-800 text-right">{timeline.decisionTarget}</span>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className="bg-[#101C50] text-white rounded-lg p-2.5 sm:p-3">
          <p className="text-xs italic text-center leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {statusMessage}
          </p>
        </div>
      )}

      {/* Action Button - GREEN COLOR */}
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className={`w-full py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
            actionType === 'primary'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
