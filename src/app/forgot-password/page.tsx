// app/forgot-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendPasswordResetOTP, verifyPasswordResetOTP, resetPasswordWithOTP} from '@/app/actions/auth/forgotPassword';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await sendPasswordResetOTP(email);

    if (!result.success) {
      setError(result.error || 'Failed to send verification code');
      setLoading(false);
      return;
    }
    
    setLoading(false);
    setStep('code');
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      setLoading(false);
      return;
    }

    const result = await verifyPasswordResetOTP(email, code);

    if (!result.success) {
      setError(result.error || 'Invalid verification code');
      setLoading(false);
      return;
    }
    
    setLoading(false);
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const result = await resetPasswordWithOTP(email, newPassword);

    if (!result.success) {
      setError(result.error || 'Failed to reset password');
      setLoading(false);
      return;
    }
    
    setLoading(false);
    router.push('/login?reset=success');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/img/login.png"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
          sizes="100vw"
        />
        {/* Different gradient overlay for distinction */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-[#050C2D]/40 to-black/50"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl mx-auto animate-fade-in-up">
        <div className="relative rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 overflow-hidden">
          {/* Animated border - Different rotation speed for distinction */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl animate-spin-medium pointer-events-none" style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #AFA127 280deg, #F0E847 320deg, #AFA127 360deg)',
            filter: 'blur(8px)'
          }} />

          {/* Main content with glassmorphism */}
          <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-xl" style={{ 
            backgroundColor: 'rgba(7, 17, 57, 0.95)',
            borderRadius: 'inherit'
          }}>
            {/* Logo with different animation */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F0E847]/30 to-[#D3CC50]/30 blur-2xl animate-pulse-medium"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-full p-4 sm:p-5 border border-[#F0E847]/30 hover:scale-110 hover:rotate-6 transition-all duration-500">
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

            {/* Step 1: Email Input */}
            {step === 'email' && (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-3 sm:mb-4 font-bold animate-slide-down" style={{ fontFamily: 'Marcellus, serif' }}>
                  <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F0E847] to-[#D3CC50] bg-clip-text text-transparent drop-shadow-glow">
                    Forgot Password?
                  </span>
                </h1>
                <p className="text-center text-white/80 text-xs sm:text-sm mb-6 sm:mb-8 animate-fade-in" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Enter your email to receive a verification code
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 sm:px-6 md:px-7 py-3.5 sm:py-4 md:py-5 rounded-2xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847] transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-[#F0E847]/30"
                      style={{ 
                        fontFamily: 'Metropolis, sans-serif', 
                        backgroundColor: 'rgba(200, 211, 224, 0.95)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                      }}
                      required
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#D3CC50] to-[#F0E847] w-0 group-focus-within:w-full transition-all duration-500"></div>
                  </div>

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
                    <span className="absolute inset-0 bg-gradient-to-r from-[#F0E847] via-white/20 to-[#D3CC50] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Code
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>

                  <div className="text-center">
                    <Link 
                      href="/login" 
                      className="text-[#F0E847] hover:text-[#D3CC50] text-xs sm:text-sm transition-all duration-300 relative group inline-flex items-center gap-1"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Login
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F0E847] group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </div>
                </form>
              </>
            )}

            {/* Step 2: Code Verification */}
            {step === 'code' && (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-3 sm:mb-4 font-bold animate-slide-down" style={{ fontFamily: 'Marcellus, serif' }}>
                  <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F0E847] to-[#D3CC50] bg-clip-text text-transparent drop-shadow-glow">
                    Enter Verification Code
                  </span>
                </h1>
                <p className="text-center text-white/80 text-xs sm:text-sm mb-6 sm:mb-8 animate-fade-in" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  We sent a 6-digit code to <span className="text-[#F0E847] font-semibold">{email}</span>
                </p>

                <form onSubmit={handleCodeSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="• • • • • •"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-5 sm:px-6 md:px-7 py-3.5 sm:py-4 md:py-5 rounded-2xl text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F0E847] text-center tracking-[0.5em] transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-[#F0E847]/30"
                      style={{ 
                        fontFamily: 'Metropolis, sans-serif', 
                        backgroundColor: 'rgba(200, 211, 224, 0.95)', 
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                      }}
                      maxLength={6}
                      required
                    />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#D3CC50] to-[#F0E847] w-0 group-focus-within:w-full transition-all duration-500"></div>
                  </div>

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

                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full py-3.5 sm:py-4 md:py-5 rounded-2xl text-sm sm:text-base font-bold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-xl hover:shadow-2xl"
                    style={{ 
                      fontFamily: 'Metropolis, sans-serif', 
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #F0E847 0%, #D3CC50 100%)',
                      color: '#000000',
                      boxShadow: '0 8px 25px rgba(240, 232, 71, 0.4)'
                    }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#F0E847] via-white/20 to-[#D3CC50] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify Code
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCode('');
                        setError('');
                        handleEmailSubmit(new Event('submit') as any);
                      }}
                      className="text-[#F0E847] hover:text-[#D3CC50] text-xs sm:text-sm transition-all duration-300 relative group inline-block"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      Resend Code
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F0E847] group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 3: New Password */}
            {step === 'password' && (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-3 sm:mb-4 font-bold animate-slide-down" style={{ fontFamily: 'Marcellus, serif' }}>
                  <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F0E847] to-[#D3CC50] bg-clip-text text-transparent drop-shadow-glow">
                    Create New Password
                  </span>
                </h1>
                <p className="text-center text-white/80 text-xs sm:text-sm mb-6 sm:mb-8 animate-fade-in" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Please enter your new password (minimum 8 characters)
                </p>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-5 sm:px-6 md:px-7 py-3.5 sm:py-4 md:py-5 pr-14 sm:pr-16 md:pr-18 rounded-2xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847] transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-[#F0E847]/30"
                      style={{ 
                        fontFamily: 'Metropolis, sans-serif', 
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#D3CC50] to-[#F0E847] w-0 group-focus-within:w-full transition-all duration-500"></div>
                  </div>

                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-5 sm:px-6 md:px-7 py-3.5 sm:py-4 md:py-5 pr-14 sm:pr-16 md:pr-18 rounded-2xl text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847] transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-[#F0E847]/30"
                      style={{ 
                        fontFamily: 'Metropolis, sans-serif', 
                        backgroundColor: 'rgba(200, 211, 224, 0.95)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 sm:right-5 md:right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#F0E847] focus:outline-none transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-white/20"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#D3CC50] to-[#F0E847] w-0 group-focus-within:w-full transition-all duration-500"></div>
                  </div>

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
                    <span className="absolute inset-0 bg-gradient-to-r from-[#F0E847] via-white/20 to-[#D3CC50] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        <>
                          Reset Password
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Animations & Styles */}
      <style jsx global>{`
        @keyframes spin-medium {
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

        @keyframes pulse-medium {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
        
        .animate-spin-medium {
          animation: spin-medium 10s linear infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out 0.2s both;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out 0.3s both;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-pulse-medium {
          animation: pulse-medium 4s ease-in-out infinite;
        }

        .drop-shadow-glow {
          filter: drop-shadow(0 0 20px rgba(240, 232, 71, 0.5));
        }
      `}</style>
    </div>
  );
}
