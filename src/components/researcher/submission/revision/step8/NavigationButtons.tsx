'use client';

import { CheckCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  hasRevisions: boolean;
}

const NavigationButtons = ({ onBack, onSubmit, isSubmitting, hasRevisions }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-8 border-t-2 border-gray-200">
      <button
        type="button"
        onClick={onBack}
        disabled={isSubmitting}
        className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gray-200 text-[#071139] rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
        aria-label="Go back to previous step"
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Previous Step
        </span>
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || !hasRevisions}
        className={`w-full sm:w-auto group relative px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl transition-all duration-300 overflow-hidden order-1 sm:order-2 ${isSubmitting || !hasRevisions
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-2xl hover:scale-105'
          }`}
        style={{ fontFamily: 'Metropolis, sans-serif' }}
        aria-label="Submit revision"
      >
        {!isSubmitting && hasRevisions && (
          <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              Submit Revision
            </>
          )}
        </span>
      </button>
    </div>
  );
};

export default NavigationButtons;
