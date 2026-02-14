'use client';

import { Trash2, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 sm:p-8 animate-slideUp mx-4 border border-gray-100">
        
        {/* Icon */}
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>

        {/* Text */}
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Delete Reply?
        </h2>
        
        <p className="text-center text-gray-600 mb-8 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Are you sure you want to delete this reply? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full px-6 py-3.5 bg-red-600 text-white rounded-2xl hover:bg-red-700 hover:shadow-lg transform active:scale-95 transition-all font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <Trash2 className="w-4 h-4" />
            Yes, Delete it
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3.5 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all font-bold text-sm sm:text-base active:scale-95"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
