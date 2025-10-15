// components/admin/researchers/ResearcherSubmissionsTable.tsx
'use client';

interface Submission {
  id: string;
  title: string;
  submittedDate: string;
  status: string;
}

interface ResearcherSubmissionsTableProps {
  submissions: Submission[];
  onSubmissionClick: (id: string) => void;
}

export default function ResearcherSubmissionsTable({ submissions, onSubmissionClick }: ResearcherSubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-sm sm:text-base text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          No submissions found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {submission.title}
              </p>
              <p className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {submission.submittedDate}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSubmissionClick(submission.id)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#101C50] text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-[#0d1640] transition-colors whitespace-nowrap"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
}
