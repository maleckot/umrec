// app/reviewermodule/profile/change-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { changeReviewerPassword } from '@/app/actions/reviewer/changePassword';
import { Eye, EyeOff, Lock, Shield, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';

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

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    if (checks.length) strength++;
    if (checks.uppercase) strength++;
    if (checks.lowercase) strength++;
    if (checks.number) strength++;
    if (checks.special) strength++;

    return { strength, checks };
  };

  const { strength, checks } = calculatePasswordStrength(formData.newPassword);

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  const getStrengthText = () => {
    if (strength <= 1) return { text: 'Weak', color: 'text-red-600' };
    if (strength <= 2) return { text: 'Fair', color: 'text-orange-600' };
    if (strength <= 3) return { text: 'Good', color: 'text-yellow-600' };
    if (strength <= 4) return { text: 'Strong', color: 'text-green-600' };
    return { text: 'Very Strong', color: 'text-green-700' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

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

  const passwordsMatch = formData.confirmPassword && formData.newPassword === formData.confirmPassword;
  const passwordsDontMatch = formData.confirmPassword && formData.newPassword !== formData.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/reviewermodule/profile')}
            className="flex items-center gap-2.5 mb-6 sm:mb-8 px-5 py-3 bg-white/80 backdrop-blur-sm text-[#101C50] hover:bg-white rounded-2xl transition-all shadow-md hover:shadow-lg group"
            style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 700 }}
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </button>

          {/* Page Header */}
          <div className="mb-8 sm:mb-10 animate-fadeIn">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#101C50] to-[#1a2d70] rounded-2xl flex items-center justify-center shadow-lg">
                <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 
                  className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#101C50] via-[#1a2d70] to-[#101C50] bg-clip-text text-transparent"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Change Password
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full mt-2"></div>
              </div>
            </div>
            <p className="text-gray-600 text-sm sm:text-base ml-0 sm:ml-20" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Update your password to keep your account secure
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-gray-100/50">
            {/* Security Notice */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 mb-8 border border-blue-200/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-blue-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Password Security Tips
                  </h3>
                  <ul className="text-xs sm:text-sm text-blue-800 space-y-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <li>• Use a mix of uppercase, lowercase, numbers, and symbols</li>
                    <li>• Avoid common words or personal information</li>
                    <li>• Make it at least 8 characters long</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* New Password */}
              <div>
                <label className="flex items-center gap-2 text-base sm:text-lg font-bold text-[#101C50] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <Lock className="w-5 h-5" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-5 py-4 pr-14 bg-gray-50 rounded-2xl text-[#101C50] focus:outline-none focus:ring-4 focus:ring-[#101C50]/10 border-2 border-gray-200 focus:border-[#101C50] transition-all text-sm sm:text-base"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                    autoComplete="new-password"
                    id="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#101C50] transition-colors p-2"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-4 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-semibold text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Password Strength
                      </span>
                      <span className={`text-xs sm:text-sm font-bold ${getStrengthText().color}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {getStrengthText().text}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStrengthColor()} transition-all duration-300 rounded-full`}
                        style={{ width: `${(strength / 5) * 100}%` }}
                      ></div>
                    </div>

                    {/* Password Requirements Checklist */}
                    <div className="mt-4 space-y-2">
                      <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Requirements:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { key: 'length', label: 'At least 8 characters', met: checks.length },
                          { key: 'uppercase', label: 'Uppercase letter (A-Z)', met: checks.uppercase },
                          { key: 'lowercase', label: 'Lowercase letter (a-z)', met: checks.lowercase },
                          { key: 'number', label: 'Number (0-9)', met: checks.number },
                          { key: 'special', label: 'Special character (!@#$)', met: checks.special },
                        ].map((req) => (
                          <div key={req.key} className="flex items-center gap-2">
                            {req.met ? (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                            )}
                            <span className={`text-xs sm:text-sm ${req.met ? 'text-green-700 font-semibold' : 'text-gray-500'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="flex items-center gap-2 text-base sm:text-lg font-bold text-[#101C50] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <Lock className="w-5 h-5" />
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full px-5 py-4 pr-14 bg-gray-50 rounded-2xl text-[#101C50] focus:outline-none focus:ring-4 focus:ring-[#101C50]/10 border-2 transition-all text-sm sm:text-base ${
                      passwordsDontMatch 
                        ? 'border-red-300 focus:border-red-500' 
                        : passwordsMatch 
                        ? 'border-green-300 focus:border-green-500' 
                        : 'border-gray-200 focus:border-[#101C50]'
                    }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#101C50] transition-colors p-2"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-3 flex items-center gap-2 animate-fadeIn">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs sm:text-sm text-green-700 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Passwords match
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs sm:text-sm text-red-700 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Passwords do not match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-2xl p-4 sm:p-5 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm sm:text-base text-red-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Error
                      </p>
                      <p className="text-xs sm:text-sm text-red-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/reviewermodule/profile')}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-2xl hover:from-gray-300 hover:to-gray-400 transition-all font-bold disabled:opacity-50 text-sm sm:text-base shadow-md hover:shadow-lg"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !passwordsMatch || strength < 3}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base shadow-lg flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Security Info */}
          <div className="mt-8 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-5 sm:p-6 border border-amber-200/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-amber-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  After Changing Your Password
                </h3>
                <p className="text-xs sm:text-sm text-amber-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  You'll be able to log in with your new password immediately. Make sure to update any saved passwords in your browser or password manager.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
