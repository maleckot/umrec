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
  return (
    <div className="bg-gray-100 rounded-xl p-4 lg:p-6 border border-gray-200 space-y-4">
      {/* Status */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Status
        </h4>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {status}
          </span>
        </div>
        {category && (
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-600"></span>
            <span className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Classification: {category}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Details
        </h4>
        <div className="space-y-1 text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="flex justify-between">
            <span>Submission Date:</span>
            <span className="font-semibold text-gray-800">{details.submissionDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Reviewers Required:</span>
            <span className="font-semibold text-gray-800">{details.reviewersRequired}</span>
          </div>
          <div className="flex justify-between">
            <span>Reviewers Assigned:</span>
            <span className="font-semibold text-gray-800">{details.reviewersAssigned}</span>
          </div>
        </div>
      </div>

      {/* Assigned Reviewers */}
      {assignedReviewers && assignedReviewers.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Assigned Reviewers
          </h4>
          <div className="bg-white border border-gray-300 rounded-lg p-3 space-y-2">
            {assignedReviewers.map((reviewer, index) => (
              <p key={index} className="text-xs text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {reviewer}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Author Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Author Information
        </h4>
        <div className="space-y-1 text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="flex justify-between gap-2">
            <span>Name:</span>
            <span className="font-semibold text-gray-800 text-right">{authorInfo.name}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>Organization:</span>
            <span className="font-semibold text-gray-800 text-right">{authorInfo.organization}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>School:</span>
            <span className="font-semibold text-gray-800 text-right">{authorInfo.school}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span>College:</span>
            <span className="font-semibold text-gray-800 text-right break-words">{authorInfo.college}</span>
          </div>
          {/* Fixed Email - Now in same row */}
          <div className="flex justify-between gap-2">
            <span className="whitespace-nowrap">Email:</span>
            <span className="font-semibold text-gray-800 text-right break-all">{authorInfo.email}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Timeline
        </h4>
        <div className="space-y-1 text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="flex justify-between">
            <span>Submitted:</span>
            <span className="font-semibold text-gray-800">{timeline.submitted}</span>
          </div>
          <div className="flex justify-between">
            <span>Review Due:</span>
            <span className="font-semibold text-gray-800">{timeline.reviewDue}</span>
          </div>
          <div className="flex justify-between">
            <span>Decision Target:</span>
            <span className="font-semibold text-gray-800">{timeline.decisionTarget}</span>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className="bg-[#101C50] text-white rounded-lg p-3">
          <p className="text-xs italic text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {statusMessage}
          </p>
        </div>
      )}

      {/* Action Button */}
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className={`w-full py-2 text-sm font-semibold rounded-lg transition-colors ${
            actionType === 'primary'
              ? 'bg-[#101C50] text-white hover:opacity-90'
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
