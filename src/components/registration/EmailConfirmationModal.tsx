// components/registration/EmailConfirmationModal.tsx
'use client';

import { useState } from 'react';
import { Mail, X, CheckCircle, Loader2 } from 'lucide-react';

interface EmailConfirmationModalProps {
  email: string;
  onResendEmail: () => Promise<void>;
  onClose: () => void;
}

export default function EmailConfirmationModal({
  email,
  onResendEmail,
  onClose,
}: EmailConfirmationModalProps) {
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    setResending(true);
    setResendDisabled(true);
    setResendSuccess(false);

    try {
      await onResendEmail();
      setResendSuccess(true);
      setResendTimer(60);

      // Start countdown timer
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setResendDisabled(false);
      alert('Failed to resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(3, 2, 17, 0.91)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Check Your Email
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600" size={40} />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Registration Successful!
          </h4>
          <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            We've sent a confirmation email to:
          </p>
          <p className="text-sm font-semibold text-blue-600 mb-4 break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {email}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Please check your inbox and click the confirmation link to verify your account.
          </p>
          <p className="text-xs text-gray-500 italic" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            After confirming, you'll be automatically logged in to your account.
          </p>
        </div>

        {/* Resend Success Message */}
        {resendSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 text-center font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              ✓ Confirmation email sent successfully!
            </p>
          </div>
        )}

        {/* Resend Email Button */}
        <button
          onClick={handleResend}
          disabled={resendDisabled || resending}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {resending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Sending...
            </>
          ) : resendDisabled ? (
            `Resend Email (${resendTimer}s)`
          ) : (
            'Resend Confirmation Email'
          )}
        </button>

        {/* Additional Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <strong>Note:</strong> If you don't see the email:
          </p>
          <ul className="text-xs text-gray-600 space-y-1 ml-4 list-disc" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <li>Check your spam or junk folder</li>
            <li>Make sure you entered the correct email</li>
            <li>Wait a few minutes and try resending</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
