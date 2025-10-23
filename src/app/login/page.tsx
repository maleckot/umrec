'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setMessage('✅ Email verified! You can now log in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      console.log('Login data:', data);
      console.log('User ID:', data.user.id);
      console.log('Session:', data.session);

      await new Promise(resolve => setTimeout(resolve, 500));

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session after login:', session);

      const authenticatedSupabase = createClient();
      await authenticatedSupabase.auth.setSession(data.session!);

      const { data: profile, error: profileError } = await authenticatedSupabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      console.log('Profile result:', profile, profileError);

      if (profileError || !profile) {
        setError('Failed to fetch user role: ' + (profileError?.message || 'Profile not found'));
        setLoading(false);
        return;
      }

      switch (profile.role) {
        case 'admin':
          router.push('/adminmodule');
          break;
        case 'staff':
          router.push('/staffmodule');
          break;
        case 'researcher':
          router.push('/researchermodule');
          break;
        case 'reviewer':
          router.push('/reviewermodule');
          break;
        case 'secretariat':
          router.push('/secretariatmodule');
          break;
        default:
          router.push('/dashboard');
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/img/login.png"
          alt="Login Background"
          fill
          style={{
            objectFit: 'cover',
          }}
          priority
          sizes="100vw"
        />
        {/* Elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-[#071139]/50 to-black/60"></div>
      </div>

      {/* Animated floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

    {/* Login Container - Enhanced Glassmorphism */}
<div className="relative z-10 w-full max-w-xl sm:max-w-2xl mx-auto animate-fade-in-up">
  <div className="relative rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 overflow-hidden">
    {/* Animated rotating border glow - 120 degrees - ONLY OUTSIDE */}
    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl animate-spin-slow pointer-events-none" style={{
      background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #AFA127 280deg, #F0E847 320deg, #AFA127 360deg)',
      filter: 'blur(8px)'
    }}></div>
    
    
    {<div className="absolute inset-0 rounded-2xl sm:rounded-3xl" style={{
      boxShadow: '0 0 40px rgba(240, 232, 71, 0.4), inset 0 0 20px rgba(240, 232, 71, 0.2), 0 0 60px rgba(240, 232, 71, 0.6), inset 0 0 30px rgba(240, 232, 71, 0.3), 0 8px 32px 0 rgba(240, 232, 71, 0.15)'
    }}></div> }

    {/* Main content with glassmorphism */}
    <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-xl" style={{ 
      backgroundColor: 'rgba(7, 17, 57, 0.95)',
      borderRadius: 'inherit'
    }}>

            {/* Logo with pulse animation */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                {/* Glow ring behind logo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F0E847]/20 to-[#D3CC50]/20 blur-xl animate-pulse-slow"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-full p-4 sm:p-5 border border-[#F0E847]/20 hover:scale-110 transition-transform duration-300">
                  <Image 
                    src="/img/umreclogonobg.png"
                    alt="UMREC Logo"
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-[90px] md:h-[90px]"
                  />
                </div>
              </div>
            </div>

            {/* Title with enhanced gradient */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 sm:mb-8 md:mb-10 font-bold animate-slide-down" style={{ fontFamily: 'Marcellus, serif' }}>
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F0E847] to-[#D3CC50] bg-clip-text text-transparent drop-shadow-glow">
                Log in to UMREConnect
              </span>
            </h1>

            {/* Success Message */}
            {message && (
              <div className="mb-4 sm:mb-6 text-green-400 text-xs sm:text-sm text-center bg-green-900/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 border border-green-500/20 animate-fade-in">
                {message}
              </div>
            )}

            {/* Login Form - Enhanced inputs */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Email Input with floating label effect */}
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 sm:px-6 md:px-7 py-3.5 sm:py-4 md:py-5 rounded-2xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847] transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-[#F0E847]/30"
                  style={{ 
                    fontFamily: 'Metropolis, sans-serif', 
                    fontWeight: 400, 
                    backgroundColor: 'rgba(200, 211, 224, 0.95)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                  required
                />
                {/* Decorative underline */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#D3CC50] to-[#F0E847] w-0 group-focus-within:w-full transition-all duration-500"></div>
              </div>

              {/* Password Input with enhanced toggle */}
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 sm:px-6 md:px-7 py-3.5 sm:py-4 md:py-5 pr-14 sm:pr-16 md:pr-18 rounded-2xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847] transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-[#F0E847]/30"
                  style={{ 
                    fontFamily: 'Metropolis, sans-serif', 
                    fontWeight: 400, 
                    backgroundColor: 'rgba(200, 211, 224, 0.95)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 sm:right-5 md:right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#F0E847] focus:outline-none transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-white/20"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
                {/* Decorative underline */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#D3CC50] to-[#F0E847] w-0 group-focus-within:w-full transition-all duration-500"></div>
              </div>

              {/* Error Message - Enhanced styling */}
              {error && (
                <div className="text-red-400 text-xs sm:text-sm text-center bg-red-900/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-3 border border-red-500/20 animate-shake">
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </span>
                </div>
              )}

              {/* Forgot Password Link - Enhanced */}
              <div className="flex justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-[#F0E847] hover:text-[#D3CC50] text-xs sm:text-sm transition-all duration-300 relative group inline-block"
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
                >
                  Forgot Password?
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F0E847] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>

              {/* Login Button - Premium gradient with hover effects */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 md:py-5 rounded-2xl text-sm sm:text-base font-bold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-xl hover:shadow-2xl"
                style={{ 
                  fontFamily: 'Metropolis, sans-serif', 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #F0E847 0%, #D3CC50 100%)',
                  color: '#000000',
                  boxShadow: '0 8px 25px rgba(240, 232, 71, 0.4)'
                }}
              >
                {/* Animated gradient overlay on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#F0E847] via-white/20 to-[#D3CC50] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Register Link - Enhanced with icon */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-white text-xs sm:text-sm" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-[#F0E847] hover:text-[#D3CC50] font-semibold transition-all duration-300 relative group inline-flex items-center gap-1"
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                >
                  Register
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F0E847] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Animations & Styles */}
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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
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

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out 0.2s both;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .drop-shadow-glow {
          filter: drop-shadow(0 0 20px rgba(240, 232, 71, 0.5));
        }

        /* Floating particles */
        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(240, 232, 71, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .particle-1 {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .particle-2 {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .particle-3 {
          width: 100px;
          height: 100px;
          bottom: 15%;
          left: 20%;
          animation-delay: 4s;
        }

        .particle-4 {
          width: 70px;
          height: 70px;
          top: 30%;
          right: 25%;
          animation-delay: 1s;
        }

        .particle-5 {
          width: 90px;
          height: 90px;
          bottom: 30%;
          right: 10%;
          animation-delay: 3s;
        }

        @media (max-width: 640px) {
          .particle {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
