// components/researcher/profile/PasswordVerificationModal.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { verifyCurrentPassword } from '@/app/actions/researcher/updatePassword';

interface PasswordVerificationModalProps {
  onVerified: () => void;
  onClose: () => void;
}

export default function PasswordVerificationModal({ onVerified, onClose }: PasswordVerificationModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await verifyCurrentPassword(password);
    
    if (result.success) {
      onVerified();
    } else {
      setError(result.error || 'Incorrect password. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Verify Your Password
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#003366] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          For security reasons, please enter your password to edit your profile information.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 border-2 border-gray-300 rounded-lg text-sm text-[#003366] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-500 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#003366] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
