// components/reviewer/profile/SecuritySettingsCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import PasswordVerificationModal from './EmailVerificationModal';
import { createClient } from '@/utils/supabase/client';
import { sendVerificationCode } from '@/app/actions/reviewer/sendVerificationCode'; // ✅ Add import

interface SecuritySettingsCardProps {
  lastPasswordChange: string;
}

export default function SecuritySettingsCard({ lastPasswordChange }: SecuritySettingsCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailLoaded, setEmailLoaded] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false); // ✅ Track sending state

  useEffect(() => {
    const getEmail = async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
      setEmailLoaded(true);
    };
    getEmail();
  }, []);

  // ✅ Send OTP when button is clicked
  const handleChangePassword = async () => {
    setSendingOtp(true);
    try {
      const result = await sendVerificationCode(userEmail);
      if (result.success) {
        setShowModal(true);
      } else {
        alert(result.error || 'Failed to send verification code');
      }
    } catch (error) {
      alert('Error sending verification code');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerify = () => {
    setShowModal(false);
    router.push('/reviewermodule/profile/change-password');
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-[#101C50] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Security Settings
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#101C50]" />
            </div>
            <div>
              <p className="font-semibold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Password
              </p>
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Last changed {lastPasswordChange}
              </p>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={!emailLoaded || sendingOtp}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#101C50] text-white rounded-lg hover:bg-[#0d1640] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {sendingOtp ? 'Sending...' : 'Change Password'}
          </button>
        </div>
      </div>

      {/* ✅ Remove auto-send - only show modal without sending */}
      <PasswordVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onVerify={handleVerify}
        title="Verify Your Password"
        email={userEmail}
      />
    </>
  );
}
