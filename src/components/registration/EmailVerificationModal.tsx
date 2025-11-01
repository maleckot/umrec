// components/registration/EmailVerificationModal.tsx
'use client';

import { Mail, X, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface EmailVerificationModalProps {
  email: string;
  onClose: () => void;
}

export default function EmailVerificationModal({
  email,
  onClose,
}: EmailVerificationModalProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGotIt = () => {
    setIsRedirecting(true);
    onClose();
    // Give it a moment to close the modal, then redirect
    setTimeout(() => {
      router.push('/login');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(3, 2, 17, 0.91)' }}>
      <div className="relative w-full max-w-md mx-4">
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
                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Verify Your Email
                </h3>
              </div>
              <button
                onClick={handleGotIt}
                disabled={isRedirecting}
                className="p-2 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400/30 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="text-green-600" size={40} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Check Your Email
              </h4>
              <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                We've sent a verification link to:
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
                <p className="text-sm font-semibold text-blue-700 break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {email}
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Click the link in the email to confirm your account. Then you can log in!
              </p>
            </div>

            {/* Got it Button */}
            <button
              onClick={handleGotIt}
              disabled={isRedirecting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {isRedirecting ? 'Taking you to login...' : 'Got it! Take me to Login'}
            </button>

            {/* Help Text */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 mt-4 shadow-inner">
              <p className="text-xs text-gray-700 mb-2 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                📝 After confirming your email, you'll be able to log in with your credentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
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
