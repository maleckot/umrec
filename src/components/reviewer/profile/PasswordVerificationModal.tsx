// components/reviewer/profile/PasswordVerificationModal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface PasswordVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  title: string;
}

export default function PasswordVerificationModal({ isOpen, onClose, onVerify, title }: PasswordVerificationModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Verify password with backend
    if (password.length < 8) {
      setError('Invalid password');
      return;
    }

    // If password is correct
    setError('');
    onVerify();
    setPassword('');
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Enter your password to continue
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#101C50] focus:outline-none text-[#101C50]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              autoFocus
            />
            {error && (
              <p className="text-red-600 text-sm mt-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {error}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#101C50] text-white rounded-lg hover:bg-[#0d1640] transition-colors font-semibold"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
