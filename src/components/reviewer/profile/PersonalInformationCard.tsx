// components/reviewer/profile/PersonalInformationCard.tsx
'use client';

import { useState } from 'react';
import EmailVerificationModal from './EmailVerificationModal';
import { updateReviewerProfile } from '@/app/actions/reviewer/updateReviewerProfile';
import { sendVerificationCode } from '@/app/actions/reviewer/sendVerificationCode'; // Create this action

interface PersonalInformationCardProps {
  profileData: {
    fullName: string;
    email: string;
    department: string;
    title: string;
  };
  onUpdate: () => void;
}

export default function PersonalInformationCard({ profileData, onUpdate }: PersonalInformationCardProps) {
  const [formData, setFormData] = useState(profileData);
  const [originalData, setOriginalData] = useState(profileData);
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  // ✅ Send code when Edit is clicked
  const handleEditClick = async () => {
    if (!isVerified) {
      setSending(true);
      try {
        const result = await sendVerificationCode(profileData.email);
        if (result.success) {
          setShowModal(true);
        } else {
          alert('Failed to send verification code: ' + result.error);
        }
      } catch (error) {
        alert('Error sending code: ' + error);
      } finally {
        setSending(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleVerify = () => {
    setIsVerified(true);
    setShowModal(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateReviewerProfile(formData);

    if (result.success) {
      alert('Profile updated successfully!');
      setIsEditing(false);
      setOriginalData(formData);
      setIsVerified(false); // Reset verification for next edit
      onUpdate();
    } else {
      alert('Failed to update profile: ' + result.error);
    }
    
    setSaving(false);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Personal Information
          </h2>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              disabled={sending}
              className="px-6 py-2 bg-[#101C50] text-white rounded-lg hover:bg-[#0d1640] transition-colors font-semibold disabled:opacity-50"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {sending ? 'Sending...' : 'Edit'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg text-[#101C50] focus:outline-none focus:ring-2 focus:ring-[#101C50] ${
                isEditing ? 'bg-gray-100 border-2 border-gray-300' : 'bg-gray-50 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg text-[#101C50] focus:outline-none focus:ring-2 focus:ring-[#101C50] ${
                isEditing ? 'bg-gray-100 border-2 border-gray-300' : 'bg-gray-50 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg text-[#101C50] focus:outline-none focus:ring-2 focus:ring-[#101C50] ${
                isEditing ? 'bg-gray-100 border-2 border-gray-300' : 'bg-gray-50 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-lg text-[#101C50] focus:outline-none focus:ring-2 focus:ring-[#101C50] ${
                isEditing ? 'bg-gray-100 border-2 border-gray-300' : 'bg-gray-50 cursor-not-allowed'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-[#101C50] text-white rounded-lg hover:bg-[#0d1640] transition-colors font-semibold disabled:opacity-50"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Email Verification Modal */}
        <EmailVerificationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onVerify={handleVerify}
          title="Verify Your Email"
          email={profileData?.email || ''}
          onResendCode={
            async () => {
              await sendVerificationCode(profileData.email);
              alert('Verification code resent to ' + profileData.email);
            }
          }
      />
    </>
  );
}
