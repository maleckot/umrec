'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { X, Eye, EyeOff } from 'lucide-react'; 

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setCheckingAuth(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !profile.role) {
        setCheckingAuth(false);
        setError('User profile/role not found');
        return;
      }

      redirectToRolePage(profile.role);
    } catch (error) {
      console.error('💥 Auth check error:', error);
      setCheckingAuth(false);
    }
  };

  const redirectToRolePage = (role: string | null | undefined) => {
    if (!role) return;
    const normalizedRole = role.toLowerCase().trim();
    switch (normalizedRole) {
      case 'admin': router.replace('/adminmodule'); break;
      case 'staff': router.replace('/staffmodule'); break;
      case 'researcher': router.replace('/researchermodule'); break;
      case 'reviewer': router.replace('/reviewermodule'); break;
      case 'secretariat': router.replace('/secretariatmodule'); break;
      default: 
        setError(`Invalid role. Please contact support.`);
        setCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setMessage('✅ Email verified! You can now log in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        redirectToRolePage(profile?.role);
    } else {
        setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071139]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F0E847]"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/login.png"
          alt="Login Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-[#071139]/50 to-black/60"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl mx-auto animate-fade-in-up">
        <div className="relative rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 overflow-hidden">
          {/* Border Glow */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl animate-spin-slow pointer-events-none" style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #AFA127 280deg, #F0E847 320deg, #AFA127 360deg)',
            filter: 'blur(8px)'
          }}></div>

          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl" style={{
            boxShadow: '0 0 40px rgba(240, 232, 71, 0.4), inset 0 0 20px rgba(240, 232, 71, 0.2)'
          }}></div>

          {/* Glass Card Content */}
          <div className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-xl" style={{
            backgroundColor: 'rgba(7, 17, 57, 0.95)',
            borderRadius: 'inherit'
          }}>

            {/* ✅ PLEASING EXIT BUTTON (Top Right) */}
            <Link 
                href="/" 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full text-gray-400 hover:text-[#F0E847] hover:bg-white/10 transition-all duration-300 group"
                title="Back to Homepage"
            >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </Link>

            {/* Logo */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative bg-white/5 backdrop-blur-sm rounded-full p-4 sm:p-5 border border-[#F0E847]/20 hover:scale-110 transition-transform duration-300">
                <Image
                  src="/img/umreclogonobg.png"
                  alt="UMREC Logo"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 sm:mb-8 md:mb-10 font-bold animate-slide-down" style={{ fontFamily: 'Marcellus, serif' }}>
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#F0E847] to-[#D3CC50] bg-clip-text text-transparent drop-shadow-glow">
                Log in to UMREConnect
              </span>
            </h1>

            {/* Message */}
            {message && (
              <div className="mb-4 text-green-400 text-sm text-center bg-green-900/20 rounded-xl py-2 border border-green-500/20">
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F0E847] transition-all"
                  style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: 'rgba(200, 211, 224, 0.95)' }}
                  required
                />
              </div>

              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 pr-12 rounded-2xl text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F0E847] transition-all"
                  style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: 'rgba(200, 211, 224, 0.95)' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#071139] transition-colors p-1" // ✅ Updated styling for icon
                  tabIndex={-1} // Prevent tab focus if desired
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* ✅ Replaced text with icons */}
                </button>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 rounded-xl py-2 border border-red-500/20 animate-shake">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-[#F0E847] hover:text-[#D3CC50] text-sm transition-colors" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold transition-all hover:scale-[1.02] shadow-xl hover:shadow-2xl"
                style={{
                  fontFamily: 'Metropolis, sans-serif',
                  background: 'linear-gradient(135deg, #F0E847 0%, #D3CC50 100%)',
                  color: '#000000',
                  boxShadow: '0 8px 25px rgba(240, 232, 71, 0.4)'
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-white text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#F0E847] hover:text-[#D3CC50] font-semibold transition-colors">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 90% { transform: translateX(-5px); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out 0.2s both; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .drop-shadow-glow { filter: drop-shadow(0 0 20px rgba(240, 232, 71, 0.5)); }
        .particle { position: absolute; background: radial-gradient(circle, rgba(240, 232, 71, 0.3) 0%, transparent 70%); border-radius: 50%; }
        .particle-1 { width: 80px; height: 80px; top: 10%; left: 10%; }
        .particle-2 { width: 60px; height: 60px; top: 60%; right: 15%; }
        .particle-3 { width: 100px; height: 100px; bottom: 15%; left: 20%; }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#071139]" />}>
      <LoginContent />
    </Suspense>
  );
}
