// components/reviewer/profile/EmailVerificationModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Mail, Loader2 } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  title: string;
  email: string;
  onResendCode?: () => Promise<void>;
}

export default function EmailVerificationModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  title,
  email,
  onResendCode 
}: EmailVerificationModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Start resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [resendTimer]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    
    if (pastedData.every(char => /^\d$/.test(char))) {
      const newCode = [...code];
      pastedData.forEach((char, index) => {
        if (index < 6) {
          newCode[index] = char;
        }
      });
      setCode(newCode);
      
      // Focus the next empty input or the last one
      const nextEmptyIndex = newCode.findIndex(c => !c);
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // For frontend testing, accept any 6-digit code
      // In production, this would verify with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate verification - always succeed for testing
      onVerify();
      setCode(['', '', '', '', '', '']);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (onResendCode) {
      setResendDisabled(true);
      setResendTimer(60);
      setError('');
      
      try {
        await onResendCode();
      } catch (err) {
        setError('Failed to resend code. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setCode(['', '', '', '', '', '']);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {title}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            We've sent a 6-digit verification code to:
          </p>
          <p className="text-sm font-semibold text-[#101C50] mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {email}
          </p>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Please enter the code below to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex gap-2 justify-center mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#101C50] focus:outline-none transition-colors text-gray-900 bg-white"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {error}
                </p>
              </div>
            )}

            {/* Resend Code */}
            {onResendCode && (
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendDisabled || loading}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {resendDisabled ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || code.some(d => !d)}
              className="flex-1 px-6 py-3 bg-[#101C50] text-white rounded-lg hover:bg-[#0d1640] transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
