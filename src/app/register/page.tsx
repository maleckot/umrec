// app/register/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RegistrationForm from '@/components/registration/RegistrationForm';
import SuccessModal from '@/components/registration/SuccessModal';

export default function RegisterPage() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen lg:h-screen flex overflow-hidden">
      {/* Left Side - Registration Form (Wider - 60%) */}
      <div className="w-full lg:w-[60%] bg-[#DAE0E7] overflow-y-auto">
        <div className="min-h-screen lg:h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-4xl py-6 lg:py-0">
            {/* Header */}
            <div className="mb-3 sm:mb-4 lg:mb-6">
              <h1 
                className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-[#003366] mb-1" 
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Registration Form
              </h1>
              <p 
                className="text-xs sm:text-sm text-gray-700" 
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Please fill out the following information to register
              </p>
            </div>

            {/* Registration Form */}
            <RegistrationForm onSuccess={handleRegistrationSuccess} />

            {/* Login Link */}
            <div className="mt-3 sm:mt-4 text-center mb-6 lg:mb-0">
              <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Already have an account?{' '}
                <Link href="/login" className="text-[#003366] font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Welcome Section with Background (Narrower - 40%) */}
      <div className="hidden lg:flex lg:w-[40%] relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/register.png"
            alt="Registration Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Welcome Content - Vertically and Horizontally Centered */}
        <div className="relative z-10 flex items-center justify-center w-full p-8">
          <div className="text-center max-w-md">
            {/* Logo */}
            <div className="mb-12 flex justify-center">
              <div className="w-24 h-24 xl:w-28 xl:h-28 relative">
                <Image
                  src="/img/umreclogonobg.png"
                  alt="UMREC Logo"
                  width={112}
                  height={112}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Welcome Text - Each word on new line with spacing */}
            <div className="space-y-2 xl:space-y-3">
              <h2 
                className="text-2xl xl:text-3xl font-bold text-white" 
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                WELCOME
              </h2>
              <h2 
                className="text-2xl xl:text-3xl font-bold text-white" 
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                TO
              </h2>
            </div>
            
            {/* UMREConnect with Marcellus font and glow effect */}
            <h3 
              className="text-2xl xl:text-3xl font-bold mt-3 xl:mt-4 mb-10 xl:mb-12 glow-text" 
              style={{ fontFamily: 'Marcellus, serif' }}
            >
              <span className="text-white">UMREC</span>
              <span className="text-[#F7D117] glow-gold">onnect</span>
            </h3>

            <p 
              className="text-sm xl:text-base text-gray-200 italic leading-relaxed" 
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Your Gateway To Ethical Excellence Starts Here With A Simple Registration.
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}

      {/* CSS for glow effect */}
      <style jsx>{`
        .glow-text {
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 0.3),
            0 0 20px rgba(255, 255, 255, 0.2);
        }
        
        .glow-gold {
          text-shadow: 
            0 0 10px rgba(247, 209, 23, 0.5),
            0 0 20px rgba(247, 209, 23, 0.3),
            0 0 30px rgba(247, 209, 23, 0.2),
            0 0 40px rgba(247, 209, 23, 0.1);
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(247, 209, 23, 0.5),
              0 0 20px rgba(247, 209, 23, 0.3),
              0 0 30px rgba(247, 209, 23, 0.2),
              0 0 40px rgba(247, 209, 23, 0.1);
          }
          50% {
            text-shadow: 
              0 0 15px rgba(247, 209, 23, 0.7),
              0 0 30px rgba(247, 209, 23, 0.5),
              0 0 45px rgba(247, 209, 23, 0.3),
              0 0 60px rgba(247, 209, 23, 0.2);
          }
        }
      `}</style>
    </div>
  );
}
