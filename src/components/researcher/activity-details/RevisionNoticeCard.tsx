'use client';

import { AlertCircle } from 'lucide-react';

interface Comment {
  id: string;
  commentText: string;
  createdAt: string;
}

interface Props {
  submissionComments: Comment[];
  selectedDocument: any;
}

const RevisionNoticeCard = ({ submissionComments, selectedDocument }: Props) => {
  
  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-red-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <h3 className="text-lg font-bold text-red-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Revision Required - Comments from UMREC
        </h3>
      </div>

      <p className="text-sm text-gray-800 font-bold mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Please review the feedback below and update the documents mentioned
      </p>

      {submissionComments && submissionComments.length > 0 ? (
        <div className="space-y-3 mb-4">
          {submissionComments.map((comment) => (
            <div key={comment.id} className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {comment.commentText}
              </p>
              <p className="text-xs text-gray-600 font-bold mt-2">
                {formatCommentDate(comment.createdAt)}
              </p>
            </div>
          ))}
        </div>
      ) : selectedDocument?.revisionComment ? (
        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600 mb-4">
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {selectedDocument.revisionComment}
          </p>
        </div>
      ) : null}

      <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
        <p className="text-sm text-blue-900 font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          📝 Please address all feedback above and resubmit the required documents using the button below.
        </p>
      </div>
    </div>
  );
};

export default RevisionNoticeCard;
