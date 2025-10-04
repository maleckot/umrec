// components/StartReviewModal.tsx
'use client';

import { Clock } from 'lucide-react';

interface StartReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submissionTitle: string;
}

const StartReviewModal: React.FC<StartReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  submissionTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        {/* Icon */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-[#101C50] rounded-full opacity-10"></div>
          <Clock size={48} className="text-[#101C50] relative z-10" strokeWidth={2} />
        </div>

        {/* Content */}
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
          Start Review
        </h2>

        <p className="text-sm md:text-base text-gray-700 text-center mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          You are about to start reviewing:
        </p>

        <p className="text-sm md:text-base font-semibold text-[#101C50] text-center mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          "{submissionTitle}"
        </p>

        <p className="text-sm md:text-base text-gray-700 text-center mb-8" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Once you begin, this submission will be assigned to you. Do you want to continue?
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-3 bg-[#101C50] text-white rounded-full hover:bg-[#0d1640] transition-colors cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartReviewModal;
