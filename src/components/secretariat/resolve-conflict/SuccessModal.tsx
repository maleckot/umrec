'use client';

import { CheckCircle2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const SuccessModal = ({ onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        
        <h3 className="text-xl font-bold text-[#101C50] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Re-assignment Complete!
        </h3>
        
        <p className="text-gray-600 mb-6 text-sm font-medium">
          The submission has been successfully re-assigned to a new reviewer.
        </p>
        
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#101C50] text-white rounded-xl font-bold hover:bg-[#0A1235] transition-colors shadow-md"
        >
          Return to Submissions
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
