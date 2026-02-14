'use client';

import { ChevronRight, Calendar } from 'lucide-react';
import { formatStatusDisplay, getStatusInfo } from '@/utils/statusUtils';

interface Props {
  submissions: any[];
  onRowClick: (item: any) => void;
}

const MobileSubmissionsList = ({ submissions, onRowClick }: Props) => {
  return (
    <div className="md:hidden space-y-4 mb-6">
      {submissions.map((submission) => {
        const statusInfo = getStatusInfo(submission.status);
        const colorName = statusInfo.dotColor.replace('bg-', '').replace('-600', '');
        const badgeClasses = `bg-${colorName}-50 text-${colorName}-700 border-${colorName}-200`;

        return (
          <div 
            key={submission.id}
            onClick={() => onRowClick(submission)}
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[#101C50] leading-snug break-words mb-1">
                    {submission.title}
                  </h3>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">
                    ID: {submission.submission_id}
                  </span>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1" />
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeClasses}`}>
                  {formatStatusDisplay(submission.status)}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2 pt-3 border-t border-gray-50 text-xs text-gray-500 font-bold">
                <Calendar size={12} />
                {new Date(submission.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MobileSubmissionsList;
