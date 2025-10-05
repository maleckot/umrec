'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

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
      // Debug: Check if session exists
      console.log('Login data:', data);
      console.log('User ID:', data.user.id);
      console.log('Session:', data.session);

      // Wait a moment for session to be set in storage
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if auth token is being sent
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session after login:', session);

      // Create a new client with the session explicitly set
      const authenticatedSupabase = createClient();
      await authenticatedSupabase.auth.setSession(data.session!);

      // Now query with the authenticated client
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

      // Redirect based on role
      switch (profile.role) {
        case 'admin':
          router.push('/admin/dashboard');
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
          router.push('/secretariat/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/img/login.png"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="relative rounded-3xl p-1.5 overflow-hidden">
          {/* Larger animated light beam - now 120 degrees */}
          <div className="absolute inset-0 rounded-5xl animate-spin-slow" style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, #AFA127 280deg, #F0E847 320deg, #AFA127 360deg)',
            filter: 'blur(20px)'
          }}></div>
          
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 rounded-3xl" style={{
            boxShadow: '0 0 60px rgba(240, 232, 71, 0.6), inset 0 0 30px rgba(240, 232, 71, 0.3)'
          }}></div>

          <div className="relative rounded-3xl p-12" style={{ backgroundColor: '#071139' }}>
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image 
                src="/img/umreclogonobg.png"
                alt="UMREC Logo"
                width={100}
                height={100}
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl text-center mb-10 font-bold" style={{ fontFamily: 'Marcellus, serif' }}>
              <span className="bg-gradient-to-r from-[#FFFFFF] to-[#F0E847] bg-clip-text text-transparent">
                Log in to UMREConnect
              </span>
            </h1>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847]"
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, backgroundColor: '#C8D3E0' }}
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F0E847]"
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, backgroundColor: '#C8D3E0' }}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 rounded-full px-4 py-2">
                  {error}
                </div>
              )}

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-[#F0E847] hover:underline text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full transition duration-200 hover:opacity-90 disabled:opacity-50"
                style={{ 
                  fontFamily: 'Metropolis, sans-serif', 
                  fontWeight: 700,
                  backgroundColor: '#F0E847',
                  color: '#000000'
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-white text-sm" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-[#F0E847] hover:underline"
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
                >
                  Register
                </Link>
              </p>
            </div>
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
