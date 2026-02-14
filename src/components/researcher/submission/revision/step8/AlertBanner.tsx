'use client';

import { AlertCircle } from 'lucide-react';

const AlertBanner = () => {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Review Your Revisions
          </h4>
          <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Please carefully review all revised sections below. Only the sections you modified will be shown. You can click "Edit" on any section to make additional changes before final submission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
