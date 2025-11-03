'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { updateResearcherProfile } from '@/app/actions/researcher/updateResearcherProfile';
import { verifyCurrentPassword, updateUserPassword } from '@/app/actions/researcher/updatePassword';

interface AccountDetailsTabProps {
  userData: any;
  setUserData: (data: any) => void;
  isEditing: boolean;
  onEditClick: () => void;
  onSaveChanges: () => void;
  onCancelEdit: () => void;
}

export default function AccountDetailsTab({
  userData,
  setUserData,
  isEditing,
  onEditClick,
  onSaveChanges,
  onCancelEdit
}: AccountDetailsTabProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const handleSaveAll = async () => {
    setError('');
    setLoading(true);

    try {
      let passwordUpdated = false;

      if (passwords.newPassword && passwords.confirmPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          setError('New passwords do not match!');
          setLoading(false);
          return;
        }

        if (passwords.newPassword.length < 8) {
          setError('Password must be at least 8 characters!');
          setLoading(false);
          return;
        }

        const passwordResult = await updateUserPassword(passwords.newPassword);
        if (!passwordResult.success) {
          setError('Failed to update password: ' + (passwordResult.error || 'Unknown error'));
          setLoading(false);
          return;
        }

        passwordUpdated = true;
      } else if (passwords.newPassword || passwords.confirmPassword) {
        setError('Please fill in both password fields or leave both empty');
        setLoading(false);
        return;
      }

      const profileResult = await updateResearcherProfile(userData);

      if (!profileResult.success) {
        setError(profileResult.error || 'Failed to update profile');
        setLoading(false);
        return;
      }

      setLoading(false);
      onSaveChanges();
      setPasswords({ newPassword: '', confirmPassword: '' });
      setError('');
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancelEdit();
    setPasswords({ newPassword: '', confirmPassword: '' });
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Error Message Display */}
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-600 rounded-lg">
          <p className="text-sm text-red-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {error}
          </p>
        </div>
      )}

      {/* Account Information Section */}
      <div>
        <h3
          className="text-base font-bold text-[#003366] mb-4 pb-2 border-b-2 border-gray-200"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          Account Information
        </h3>

        <div className="space-y-4">
          {/* Username and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label
                className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Username
              </label>
              <input
                type="text"
                value={userData?.username ?? ''}  
                onChange={(e) => handleChange('username', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
            </div>

            <div>
              <label
                className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={userData?.email ?? ''}  
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="pt-6 border-t-2 border-gray-200">
        <h3
          className="text-base font-bold text-[#003366] mb-2"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          Change Password
        </h3>
        <div className="space-y-4">
          {/* New Password and Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="relative">
              <label
                className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter new password (optional)"
                className="w-full px-3 py-2 pr-10 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform translate-y-[2px] text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>

            <div className="relative">
              <label
                className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwords.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                disabled={!isEditing}
                placeholder="Confirm new password (optional)"
                className="w-full px-3 py-2 pr-10 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform translate-y-[2px] text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center pt-4">
        {!isEditing ? (
          <button
            onClick={onEditClick}
            className="px-8 py-2.5 bg-[#003366] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={loading}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Edit Account
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 bg-gray-500 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={loading}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 bg-[#003366] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              disabled={loading}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {loading ? '⏳ Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
