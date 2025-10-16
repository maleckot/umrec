// components/researcher/profile/AccountDetailsTab.tsx
'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

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

  const handleChange = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords({ ...passwords, [field]: value });
  };

 // Update the handleSaveAll function in AccountDetailsTab.tsx

const handleSaveAll = async () => {
  // Validate password change if fields are filled
  if (passwords.newPassword || passwords.confirmPassword) {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwords.newPassword.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }
    
    // Update password
    const { updateUserPassword } = await import('@/app/actions/researcher/updatePassword');
    const passwordResult = await updateUserPassword(passwords.newPassword);
    
    if (!passwordResult.success) {
      alert('Failed to update password: ' + passwordResult.error);
      return;
    }
  }
  
  // Save all changes
  onSaveChanges();
  
  // Reset password fields
  setPasswords({ newPassword: '', confirmPassword: '' });
};


  const handleCancel = () => {
    onCancelEdit();
    // Reset password fields
    setPasswords({ newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      {/* Account Information Section */}
      <div>
        <h3 className="text-base font-bold text-[#003366] mb-4 pb-2 border-b-2 border-gray-200" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Account Information
        </h3>
        
        <div className="space-y-4">
          {/* Username and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Username
              </label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Email Address
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section - Always visible but disabled when not editing */}
      <div className="pt-6 border-t-2 border-gray-200">
        <h3 className="text-base font-bold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Change Password
        </h3>
        <div className="space-y-4">
          {/* New Password and Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="relative">
              <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter new password"
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
              <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwords.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                disabled={!isEditing}
                placeholder="Confirm new password"
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
            className="px-8 py-2.5 bg-[#003366] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Edit Account
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 bg-gray-500 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 bg-[#003366] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
