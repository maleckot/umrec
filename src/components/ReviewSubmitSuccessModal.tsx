// components/ReviewSubmitSuccessModal.tsx
'use client';

import { CheckCircle } from 'lucide-react';

interface ReviewSubmitSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionTitle: string;
  isRevisionRequested?: boolean;
}

const ReviewSubmitSuccessModal: React.FC<ReviewSubmitSuccessModalProps> = ({
  isOpen,
  onClose,
  submissionTitle,
  isRevisionRequested = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        {/* Icon */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-[#101C50] rounded-full opacity-10"></div>
          <CheckCircle size={48} className="text-[#101C50] relative z-10" strokeWidth={2} />
        </div>

        {/* Content */}
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
          {isRevisionRequested ? 'Review Submitted - Revision Requested' : 'Review Completed'}
        </h2>

        <p className="text-sm md:text-base text-gray-700 text-center mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Your review for <span className="font-semibold">"{submissionTitle}"</span> has been successfully submitted.
        </p>

        {isRevisionRequested && (
          <p className="text-sm md:text-base text-gray-700 text-center mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            The submission has been marked for revision and will be returned to the researcher.
          </p>
        )}

        {!isRevisionRequested && (
          <p className="text-sm md:text-base text-gray-700 text-center mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            The submission has been approved and will proceed to the next stage.
          </p>
        )}

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#101C50] text-white rounded-full hover:bg-[#0d1640] transition-colors cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
          >
            Return to Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitSuccessModal;
