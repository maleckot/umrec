// components/staff-secretariat-admin/submission-details/SubmissionHeader.tsx
import { ReactNode } from 'react';

interface SubmissionHeaderProps {
  title: string;
  submittedBy: string;
  submittedDate: string;
  coAuthors: string;
  submissionId: string;
}

export default function SubmissionHeader({
  title,
  submittedBy,
  submittedDate,
  coAuthors,
  submissionId,
}: SubmissionHeaderProps) {
  return (
    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-xl lg:text-2xl font-bold pr-4" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
          {title}
        </h1>
        <span className="text-sm text-gray-500 whitespace-nowrap" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          ID: {submissionId}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Submitted by: <span className="font-semibold">{submittedBy}</span> on {submittedDate}
      </p>
      <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Co-Authors: {coAuthors}
      </p>
    </div>
  );
}
