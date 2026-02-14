'use client';

import { CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reviewerCount: number;
}

const AssignSuccessModal = ({ isOpen, onClose, reviewerCount }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h3 className="text-xl font-bold text-[#101C50] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Reviewers Assigned Successfully!
          </h3>

          <p className="text-gray-600 mb-6 font-medium">
            Successfully assigned <span className="font-bold text-green-600">{reviewerCount}</span> {reviewerCount === 1 ? 'reviewer' : 'reviewers'}!
          </p>
          
          <p className="text-sm text-gray-500 mb-8">
             Email notifications have been sent to all assigned reviewers.
          </p>

          <button
            onClick={onClose}
            className="w-full px-6 py-3.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold shadow-md"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignSuccessModal;
