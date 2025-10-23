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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(3, 2, 17, 0.91)' }}>
      <div className="relative w-full max-w-md mx-4">
        {/* Animated border glow */}
        <div className="relative rounded-2xl p-1 overflow-hidden">
          <div className="absolute inset-0 rounded-2xl animate-spin-medium pointer-events-none" style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #3B82F6 280deg, #60A5FA 320deg, #3B82F6 360deg)',
            filter: 'blur(15px)'
          }}></div>

          <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
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
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-90"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Success Icon - Enhanced */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/30 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="text-green-600" size={40} />
                </div>
              </div>
            </div>

            {/* Instructions - Enhanced */}
            <div className="text-center mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Registration Successful!
              </h4>
              <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                We've sent a confirmation email to:
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
                <p className="text-sm font-semibold text-blue-700 break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {email}
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Please check your inbox and click the confirmation link to verify your account.
              </p>
              <p className="text-xs text-gray-500 italic" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                After confirming, you'll be automatically logged in to your account.
              </p>
            </div>

            {/* Resend Success Message */}
            {resendSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl backdrop-blur-sm animate-fade-in">
                <p className="text-sm text-green-700 text-center font-semibold flex items-center justify-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Confirmation email sent successfully!
                </p>
              </div>
            )}

            {/* Resend Email Button - Enhanced */}
            <button
              onClick={handleResend}
              disabled={resendDisabled || resending}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4 hover:scale-[1.02] shadow-lg relative overflow-hidden group"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <span className="relative z-10 flex items-center gap-2">
                {resending ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : resendDisabled ? (
                  `Resend Email (${resendTimer}s)`
                ) : (
                  <>
                    <Mail size={20} />
                    Resend Confirmation Email
                  </>
                )}
              </span>
            </button>

            {/* Additional Info - Enhanced */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 shadow-inner">
              <p className="text-xs text-gray-700 mb-2 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Note:
                </span> If you don't see the email:
              </p>
              <ul className="text-xs text-gray-600 space-y-1.5 ml-4 list-disc" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email</li>
                <li>Wait a few minutes and try resending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-medium {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-spin-medium {
          animation: spin-medium 8s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
