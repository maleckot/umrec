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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/img/login.png"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
          sizes="100vw"
        />
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl mx-auto">
        <div className="relative rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl animate-spin-slow" style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #AFA127 280deg, #F0E847 320deg, #AFA127 360deg)',
            filter: 'blur(20px)'
          }} />
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl" style={{
            boxShadow: '0 0 40px rgba(240, 232, 71, 0.4), inset 0 0 20px rgba(240, 232, 71, 0.2), 0 0 60px rgba(240, 232, 71, 0.6), inset 0 0 30px rgba(240, 232, 71, 0.3)'
          }} />

          <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12" style={{ backgroundColor: '#071139' }}>
            {/* Logo */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <Image 
                src="/img/umreclogonobg.png"
                alt="UMREC Logo"
                width={80}
                height={80}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px]"
              />
            </div>

            {/* Step 1: Email Input */}
            {step === 'email' && (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-3 sm:mb-4 font-bold" style={{ fontFamily: 'Marcellus, serif' }}>
                  <span className="bg-gradient-to-r from-[#FFFFFF] to-[#F0E847] bg-clip-text text-transparent">
                    Forgot Password?
                  </span>
                </h1>
                <p className="text-center text-white text-xs sm:text-sm mb-6 sm:mb-8" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Enter your email to receive a verification code
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-full text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847]"
                      style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#C8D3E0' }}
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-400 text-xs sm:text-sm text-center bg-red-900/20 rounded-full px-3 sm:px-4 py-2">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 sm:py-3.5 md:py-4 rounded-full text-sm sm:text-base transition duration-200 hover:opacity-90 disabled:opacity-50"
                    style={{ 
                      fontFamily: 'Metropolis, sans-serif', 
                      fontWeight: 700,
                      backgroundColor: '#F0E847',
                      color: '#000000'
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Code'}
                  </button>

                  <div className="text-center">
                    <Link 
                      href="/login" 
                      className="text-[#F0E847] hover:underline text-xs sm:text-sm"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      Back to Login
                    </Link>
                  </div>
                </form>
              </>
            )}

            {/* Step 2: Code Verification */}
            {step === 'code' && (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-3 sm:mb-4 font-bold" style={{ fontFamily: 'Marcellus, serif' }}>
                  <span className="bg-gradient-to-r from-[#FFFFFF] to-[#F0E847] bg-clip-text text-transparent">
                    Enter Verification Code
                  </span>
                </h1>
                <p className="text-center text-white text-xs sm:text-sm mb-6 sm:mb-8" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  We sent a 6-digit code to <span className="text-[#F0E847]">{email}</span>
                </p>

                <form onSubmit={handleCodeSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-full text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847] text-center tracking-widest"
                      style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#C8D3E0', fontWeight: 700 }}
                      maxLength={6}
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-400 text-xs sm:text-sm text-center bg-red-900/20 rounded-full px-3 sm:px-4 py-2">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full py-3 sm:py-3.5 md:py-4 rounded-full text-sm sm:text-base transition duration-200 hover:opacity-90 disabled:opacity-50"
                    style={{ 
                      fontFamily: 'Metropolis, sans-serif', 
                      fontWeight: 700,
                      backgroundColor: '#F0E847',
                      color: '#000000'
                    }}
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCode('');
                        setError('');
                        handleEmailSubmit(new Event('submit') as any);
                      }}
                      className="text-[#F0E847] hover:underline text-xs sm:text-sm"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 3: New Password */}
            {step === 'password' && (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-3 sm:mb-4 font-bold" style={{ fontFamily: 'Marcellus, serif' }}>
                  <span className="bg-gradient-to-r from-[#FFFFFF] to-[#F0E847] bg-clip-text text-transparent">
                    Create New Password
                  </span>
                </h1>
                <p className="text-center text-white text-xs sm:text-sm mb-6 sm:mb-8" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Please enter your new password
                </p>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-full text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847]"
                      style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#C8D3E0' }}
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-full text-sm sm:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847]"
                      style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#C8D3E0' }}
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-400 text-xs sm:text-sm text-center bg-red-900/20 rounded-full px-3 sm:px-4 py-2">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 sm:py-3.5 md:py-4 rounded-full text-sm sm:text-base transition duration-200 hover:opacity-90 disabled:opacity-50"
                    style={{ 
                      fontFamily: 'Metropolis, sans-serif', 
                      fontWeight: 700,
                      backgroundColor: '#F0E847',
                      color: '#000000'
                    }}
                  >
                    {loading ? 'Updating...' : 'Reset Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

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
