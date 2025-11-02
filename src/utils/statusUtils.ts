// utils/statusUtils.ts
interface StatusInfo {
  message: string;
  bgGradient: string;
  border: string;
  textColor: string;
  dotColor: string;
}

export function formatStatusDisplay(status: string): string {
  const statusMap: { [key: string]: string } = {
    'pending': 'Under Verification',
    'verified': 'Under Classification',
    'classified': 'Waiting for Reviewers',
    'under_review': 'Under Review',
    'revision': 'Under Revision',
    'review_completed': 'Review Complete',
    'approved': 'Approved',  // ✅ ADD THIS
    'new_submission': 'Under Verification',
    'pending_review': 'Under Review',
    'awaiting_classification': 'Under Classification',
    'review_complete': 'Review Complete',
    'needs_revision': 'Under Revision',
    'revision_requested': 'Under Revision',
  };
  return statusMap[status] || status;
}

export function getStatusInfo(status: string): StatusInfo {
  const normalizedStatus = formatStatusDisplay(status);

  switch (normalizedStatus) {
    case 'Under Verification':
      return {
        message: 'Staff is currently verifying the submitted documents.',
        bgGradient: 'from-blue-100 to-blue-200',
        border: 'border-blue-600',
        textColor: 'text-blue-900',
        dotColor: 'bg-blue-600',
      };
    case 'Under Classification':
      return {
        message: 'Secretariat is classifying this submission.',
        bgGradient: 'from-amber-100 to-amber-200',
        border: 'border-amber-600',
        textColor: 'text-amber-900',
        dotColor: 'bg-amber-600',
      };
    case 'Waiting for Reviewers':
      return {
        message: 'Staff is assigning reviewers to this submission.',
        bgGradient: 'from-orange-100 to-orange-200',
        border: 'border-orange-600',
        textColor: 'text-orange-900',
        dotColor: 'bg-orange-600',
      };
    case 'Under Review':
      return {
        message: 'This submission is currently under review by assigned reviewers.',
        bgGradient: 'from-purple-100 to-purple-200',
        border: 'border-purple-600',
        textColor: 'text-purple-900',
        dotColor: 'bg-purple-600',
      };
    case 'Under Revision':
      return {
        message: 'Researcher is revising the submission based on reviewer feedback.',
        bgGradient: 'from-pink-100 to-pink-200',
        border: 'border-pink-600',
        textColor: 'text-pink-900',
        dotColor: 'bg-pink-600',
      };
    case 'Review Complete':
      return {
        message: 'All reviews have been completed. Awaiting final decision.',
        bgGradient: 'from-green-100 to-green-200',
        border: 'border-green-600',
        textColor: 'text-green-900',
        dotColor: 'bg-green-600',
      };
    case 'Approved':  // ✅ ADD THIS CASE
      return {
        message: 'This submission has been approved and is ready for publication.',
        bgGradient: 'from-emerald-100 to-emerald-200',
        border: 'border-emerald-600',
        textColor: 'text-emerald-900',
        dotColor: 'bg-emerald-600',
      };
    default:
      return {
        message: 'Status information not available.',
        bgGradient: 'from-gray-100 to-gray-200',
        border: 'border-gray-600',
        textColor: 'text-gray-900',
        dotColor: 'bg-gray-600',
      };
  }
}
