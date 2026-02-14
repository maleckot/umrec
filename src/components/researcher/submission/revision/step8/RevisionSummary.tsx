'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';

interface RevisionSummaryProps {
  revisedCount: number;
}

const RevisionSummary = ({ revisedCount }: RevisionSummaryProps) => {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-500 rounded-r-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Revision Summary
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" strokeWidth={2} />
          <span className="text-xs sm:text-sm text-[#071139] font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {revisedCount} section(s) revised
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" strokeWidth={2} />
          <span className="text-xs sm:text-sm text-[#071139] font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Ready for re-review
          </span>
        </div>
      </div>
    </div>
  );
};

export default RevisionSummary;
