// components/registration/SuccessModal.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SuccessModalProps {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  const router = useRouter();

  const handleProceedToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(2, 6, 30, 0.8)' }}>
      <div className="relative w-full max-w-md sm:max-w-lg">
        {/* Animated Border Container */}
        <div className="relative rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 overflow-hidden">
          {/* Animated light beam - 120 degrees */}
          <div 
            className="absolute inset-0 rounded-2xl sm:rounded-3xl animate-spin-slow" 
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #B0A942 280deg, #D3CC50 320deg, #B0A942 360deg)',
              filter: 'blur(20px)'
            }}
          />
          
          {/* Enhanced glow effect */}
          <div 
            className="absolute inset-0 rounded-2xl sm:rounded-3xl" 
            style={{
              boxShadow: '0 0 40px rgba(211, 204, 80, 0.4), inset 0 0 20px rgba(211, 204, 80, 0.2), 0 0 60px rgba(211, 204, 80, 0.6), inset 0 0 30px rgba(211, 204, 80, 0.3)'
            }}
          />

          {/* Modal Content */}
          <div className="relative bg-[#071139] rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 text-center">
            {/* Logo */}
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
                <Image
                  src="/img/umreclogonobg.png"
                  alt="UMREC Logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Success Message */}
            <h2 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3" 
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Registration Complete.
            </h2>
            <p 
              className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-8 sm:mb-10" 
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Proceed to Login
            </p>

            {/* OK Button */}
            <div className="flex justify-center">
              <button
                onClick={handleProceedToLogin}
                className="px-12 sm:px-16 md:px-20 py-2.5 sm:py-3 md:py-3.5 bg-[#D3CC50] text-[#071139] rounded-full font-bold text-base sm:text-lg md:text-xl hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
