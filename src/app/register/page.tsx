// app/register/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RegistrationForm from '@/components/registration/RegistrationForm';
import EmailVerificationModal from '@/components/registration/EmailVerificationModal';

export default function RegisterPage() {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleRegistrationSuccess = (email: string, id: string) => {
    setUserEmail(email);
    setShowVerificationModal(true);
  };

  return (
    <div className="min-h-screen lg:h-screen flex overflow-hidden">
      {/* Left Side - Registration Form (Wider - 60%) - Enhanced */}
      <div className="w-full lg:w-[60%] bg-gradient-to-br from-[#DAE0E7] via-[#E8EEF3] to-[#DAE0E7] overflow-y-auto relative">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #003366 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>

        <div className="relative min-h-screen lg:h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-4xl py-6 lg:py-0 animate-fade-in-up">
            {/* Header - Enhanced */}
            <div className="mb-4 sm:mb-5 lg:mb-7 text-center lg:text-left">
              <h1 
                className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#003366] mb-2 relative inline-block" 
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Registration Form
                <div className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-[#003366] to-[#F0E847]"></div>
              </h1>
              <p 
                className="text-xs sm:text-sm text-gray-700 mt-3" 
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Please fill out the following information to register
              </p>
            </div>

            {/* Registration Form */}
            <RegistrationForm onSuccess={handleRegistrationSuccess} />

            {/* Login Link - Enhanced */}
            <div className="mt-4 sm:mt-5 text-center mb-6 lg:mb-0">
              <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-[#003366] font-bold hover:text-[#F0E847] transition-colors duration-300 relative group inline-flex items-center gap-1"
                >
                  Login here
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F0E847] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Welcome Section with Enhanced Background (Narrower - 40%) */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/register.png"
            alt="Registration Background"
            fill
            className="object-cover"
            priority
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#071139]/80 via-[#050C2D]/70 to-[#071139]/80"></div>
        </div>
        
        {/* Animated rotating border accent */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-30">
          <div className="absolute inset-0 animate-spin-slow" style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #F0E847 280deg, #F0E847 320deg, transparent 360deg)',
            filter: 'blur(40px)'
          }}></div>
        </div>
        
        {/* Welcome Content - Enhanced */}
        <div className="relative z-10 flex items-center justify-center w-full p-8 xl:p-12">
          <div className="text-center max-w-md">
            {/* Logo with enhanced animation */}
            <div className="mb-10 xl:mb-12 flex justify-center">
              <div className="relative">
                {/* Multiple glow rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F0E847]/30 to-[#D3CC50]/30 blur-2xl animate-pulse-slow"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F0E847]/20 to-transparent blur-xl animate-pulse-medium"></div>
                
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-5 xl:p-6 border-2 border-[#F0E847]/30 hover:scale-110 hover:rotate-12 transition-all duration-500 shadow-2xl">
                  <Image
                    src="/img/umreclogonobg.png"
                    alt="UMREC Logo"
                    width={112}
                    height={112}
                    className="w-20 h-20 xl:w-24 xl:h-24 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Welcome Text - Enhanced with animations */}
            <div className="space-y-2 xl:space-y-3 mb-4 xl:mb-5">
              <h2 
                className="text-2xl xl:text-3xl font-bold text-white animate-slide-down drop-shadow-lg" 
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                WELCOME
              </h2>
              <h2 
                className="text-2xl xl:text-3xl font-bold text-white animate-slide-down drop-shadow-lg" 
                style={{ 
                  fontFamily: 'Metropolis, sans-serif',
                  animationDelay: '0.1s'
                }}
              >
                TO
              </h2>
            </div>
            
            {/* UMREConnect with enhanced glow effect */}
            <h3 
              className="text-3xl xl:text-4xl font-bold mb-8 xl:mb-10 animate-slide-down" 
              style={{ 
                fontFamily: 'Marcellus, serif',
                animationDelay: '0.2s'
              }}
            >
              <span className="text-white drop-shadow-glow">UMRE</span>
              <span className="glow-gold-enhanced">Connect</span>
            </h3>

            <p 
              className="text-sm xl:text-base text-gray-200 italic leading-relaxed backdrop-blur-sm bg-white/5 px-6 py-4 rounded-xl border border-white/10 animate-fade-in" 
              style={{ 
                fontFamily: 'Metropolis, sans-serif',
                animationDelay: '0.3s'
              }}
            >
              Your Gateway To Ethical Excellence Starts Here With A Simple Registration.
            </p>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <EmailVerificationModal
          email={userEmail}
          onClose={() => setShowVerificationModal(false)}
        />
      )}

      {/* Enhanced CSS for glow effects and animations */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-medium {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out both;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out both;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-medium {
          animation: pulse-medium 3s ease-in-out infinite;
        }

        .drop-shadow-glow {
          filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
        }
        
        .glow-gold-enhanced {
          color: #F0E847;
          text-shadow: 
            0 0 10px rgba(240, 232, 71, 0.8),
            0 0 20px rgba(240, 232, 71, 0.6),
            0 0 30px rgba(240, 232, 71, 0.4),
            0 0 40px rgba(240, 232, 71, 0.2);
          animation: glow-pulse-enhanced 2.5s ease-in-out infinite;
        }
        
        @keyframes glow-pulse-enhanced {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(240, 232, 71, 0.8),
              0 0 20px rgba(240, 232, 71, 0.6),
              0 0 30px rgba(240, 232, 71, 0.4),
              0 0 40px rgba(240, 232, 71, 0.2);
          }
          50% {
            text-shadow: 
              0 0 15px rgba(240, 232, 71, 1),
              0 0 30px rgba(240, 232, 71, 0.8),
              0 0 45px rgba(240, 232, 71, 0.6),
              0 0 60px rgba(240, 232, 71, 0.4);
          }
        }
      `}</style>
    </div>
  );
}
