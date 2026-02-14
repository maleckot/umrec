'use client';

import { AlertTriangle, Edit } from 'lucide-react';

interface Props {
  assignmentStatus: string;
  hasReview: boolean;
  onStartReview: () => void;
  onCOI: () => void;
  onEditReview: () => void;
}

const ActionButtons = ({ assignmentStatus, hasReview, onStartReview, onCOI, onEditReview }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 py-8">
      {assignmentStatus === 'pending' || !hasReview ? (
        <>
          <button
            onClick={onStartReview}
            className="px-12 sm:px-16 py-4 sm:py-5 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all text-base sm:text-lg font-bold shadow-xl"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Start Review
          </button>

          <button
            onClick={onCOI}
            className="px-12 sm:px-16 py-4 sm:py-5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all text-base sm:text-lg font-bold shadow-xl flex items-center justify-center gap-2"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <AlertTriangle className="w-5 h-5" />
            Conflict of Interest
          </button>
        </>
      ) : (
        <button
          onClick={onEditReview}
          className="px-12 sm:px-16 py-4 sm:py-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all text-base sm:text-lg font-bold shadow-xl flex items-center justify-center gap-3"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
          Edit Your Review
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
