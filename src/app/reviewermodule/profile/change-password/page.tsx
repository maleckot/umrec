// app/reviewermodule/profile/change-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to change password
    console.log('Changing password:', formData);
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
                <input
                  type="password"
                  placeholder="At least 8 digits"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg text-[#101C50] focus:outline-none focus:ring-2 focus:ring-[#101C50]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-lg font-semibold text-[#101C50] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="At least 8 digits"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg text-[#101C50] focus:outline-none focus:ring-2 focus:ring-[#101C50]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#101C50] text-white rounded-lg hover:bg-[#0d1640] transition-colors font-semibold"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Save Changes
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
