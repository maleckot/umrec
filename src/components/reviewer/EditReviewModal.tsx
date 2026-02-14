'use client';

import { AlertTriangle, AlertCircle, Edit } from 'lucide-react';

interface EditReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submissionTitle: string;
}

const EditReviewModal = ({ isOpen, onClose, onConfirm, submissionTitle }: EditReviewModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 md:p-8 animate-slideUp mx-4">
        
        {/* Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
          <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-3 text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Edit Your Review?
        </h2>
        
        <p className="text-center text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base px-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          You're about to edit your review for:
        </p>

        {/* Submission Title */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-200/50">
          <p className="text-xs sm:text-sm font-bold text-[#101C50] text-center leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {submissionTitle}
          </p>
        </div>

        {/* Warning Notice */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 border border-amber-200/50">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-amber-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Important Notice
              </p>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Editing your review will update your previous evaluation. Any changes you make will be saved and visible to other committee members.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <button
            onClick={onConfirm}
            className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white rounded-xl sm:rounded-2xl hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all font-bold text-xs sm:text-sm md:text-base shadow-lg flex items-center justify-center gap-2"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Continue to Edit
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:from-gray-300 hover:to-gray-400 transition-all font-bold text-xs sm:text-sm md:text-base shadow-md active:scale-95"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReviewModal;
