'use client';

import { ChevronRight, FileText } from 'lucide-react';
import { formatStatusDisplay, getStatusInfo } from '@/utils/statusUtils';

interface Props {
  submissions: any[];
  onRowClick: (item: any) => void;
}

const SubmissionsTable = ({ submissions, onRowClick }: Props) => {
  // Helper to construct the class string from statusInfo
  const getStatusClasses = (status: string) => {
    const info = getStatusInfo(status);
    // Map bgGradient to a solid bg for the badge to match the design (or keep gradient if preferred)
    // Here I'm adapting the utils to the badge style
    // Extracting color family from border/text to build the badge style
    const baseColor = info.textColor.replace('text-', '').replace('-900', '');
    return `bg-${baseColor}-50 text-${baseColor}-700 border-${baseColor}-200`;
  };

  return (
    <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm mb-6">
      <table className="w-full">
        <thead>
          <tr className="bg-[#101C50] text-white">
            <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Submission Details</th>
            <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider w-56">Date Submitted</th>
            <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider w-48">Status</th>
            <th className="py-4 px-6 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {submissions.map((submission) => {
             const statusInfo = getStatusInfo(submission.status);
             // Construct badge classes based on the util's dotColor (e.g., bg-blue-600 -> blue)
             const colorName = statusInfo.dotColor.replace('bg-', '').replace('-600', '');
             const badgeClasses = `bg-${colorName}-50 text-${colorName}-700 border-${colorName}-200`;

             return (
              <tr 
                key={submission.id}
                onClick={() => onRowClick(submission)}
                className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 items-center justify-center text-[#101C50]">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#101C50] leading-snug hover:text-blue-700 transition-colors mb-0.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submission.title}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          ID: {submission.submission_id}
                        </span>
                        {submission.author_name && (
                          <>
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs text-gray-500 font-bold">
                              {submission.author_name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {new Date(submission.submitted_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5 font-medium">
                      {new Date(submission.submitted_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeClasses} shadow-sm whitespace-nowrap`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${statusInfo.dotColor}`}></span>
                    {formatStatusDisplay(submission.status)}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;
