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
  <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-6">
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
    <div className="flex-1 min-w-0">
      <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {title}
      </h1>
    </div>
    <div className="flex-shrink-0">
      <p className="text-xs sm:text-sm font-semibold text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        ID: {submissionId}
      </p>
    </div>
  </div>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
    <div>
      <span className="font-semibold">Submitted by:</span> {submittedBy}
    </div>
    <div>
      <span className="font-semibold">Date:</span> {submittedDate}
    </div>
    {coAuthors && (
      <div className="sm:col-span-2 lg:col-span-1">
        <span className="font-semibold">Co-authors:</span> {coAuthors}
      </div>
    )}
  </div>
</div>
  );
}
