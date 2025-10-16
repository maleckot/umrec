// app/reviewermodule/profile/change-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { changeReviewerPassword } from '@/app/actions/reviewer/changePassword';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const result = await changeReviewerPassword(formData.newPassword);

    if (result.success) {
      alert('Password changed successfully!');
      router.push('/reviewermodule/profile');
    } else {
      setError(result.error || 'Failed to change password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            Change Password
          </h1>

          {/* Form */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-lg font-semibold text-[#101C50] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Enter New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-lg text-[#101C50] focus:outline-none focus:ring-2 focus:ring-[#101C50] border-2 border-gray-300"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-lg font-semibold text-[#101C50] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-lg text-[#101C50] focus:outline-none focus:ring-2 focus:ring-[#101C50] border-2 border-gray-300"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg px-4 py-3">
                  <p className="text-red-600 text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/reviewermodule/profile')}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#101C50] text-white rounded-lg hover:bg-[#0d1640] transition-colors font-semibold disabled:opacity-50"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
