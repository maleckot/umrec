'use client';

import { Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ isOpen, onClose, onConfirm }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-scaleIn">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-center text-[#101C50] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>Delete Item?</h3>
            <p className="text-center text-gray-500 mb-6">Are you sure you want to delete this announcement?</p>
            <div className="flex flex-col gap-3">
                <button 
                    onClick={onConfirm}
                    className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                >
                    Yes, Delete
                </button>
                <button 
                    onClick={onClose}
                    className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
  );
};

export default DeleteModal;
