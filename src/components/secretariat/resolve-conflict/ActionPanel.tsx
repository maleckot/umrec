'use client';

import { ChevronRight } from 'lucide-react';

interface Props {
  onReassign: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

const ActionPanel = ({ onReassign, isSubmitting, isDisabled }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6 shadow-sm">
      <h4 className="font-bold text-[#101C50] mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>Action Required</h4>
      <p className="text-sm text-gray-600 mb-6 font-medium">
        Assigning a new reviewer will update the submission assignments and notify the new reviewer.
      </p>

      <button
        onClick={onReassign}
        disabled={isDisabled || isSubmitting}
        className="w-full py-3 px-4 bg-[#101C50] text-white rounded-xl font-bold hover:bg-[#0A1235] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md active:scale-95"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Assigning...
          </>
        ) : (
          <>
            Confirm Re-assignment
            <ChevronRight size={16} />
          </>
        )}
      </button>
    </div>
  );
};

export default ActionPanel;
