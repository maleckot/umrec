// app/researchermodule/profile/page.tsx
'use client';

import { useState } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import ProfileTabs from '@/components/researcher/profile/ProfileTabs';
import PersonalInformationTab from '@/components/researcher/profile/PersonalInformationTab';
import AccountDetailsTab from '@/components/researcher/profile/AccountDetailsTab';
import MySubmissionTab from '@/components/researcher/profile/MySubmissionTab';
import PasswordVerificationModal from '@/components/researcher/profile/PasswordVerificationModal';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'account' | 'submission'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Mock user data - replace with actual data from backend
  const [userData, setUserData] = useState({
    firstName: 'Juan',
    middleName: 'Alfonso',
    lastName: 'Dela Cruz',
    dateOfBirth: '1999-05-15',
    contactNumber: '09993232945',
    gender: 'Male',
    school: 'University of Makati',
    college: 'College of Computing and Information Sciences',
    program: 'Bachelor of Science in Computer Science',
    yearLevel: '4th Year',
    section: 'IV-BCSAD',
    studentNo: 'K12920931',
    username: 'username123',
    email: 'email12345@umak.edu.ph',
    organization: 'Internal (UMAK)'
  });

  const handleEditClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordVerified = () => {
    setShowPasswordModal(false);
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    // TODO: Save changes to backend
    setIsEditing(false);
    alert('Changes saved successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // TODO: Reset form data to original values
  };

  return (
    <>
      <NavbarRoles role="researcher" />
      {/* Add proper top padding and reduce side margins */}
      <div className="min-h-screen bg-[#E8EEF3] pt-24 md:pt-28 lg:pt-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Sidebar - Profile Card */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                {/* Profile Picture */}
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#003366] flex items-center justify-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-lg sm:text-xl font-bold text-[#003366] text-center mb-4 sm:mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {userData.firstName} {userData.middleName && userData.middleName[0]}. {userData.lastName}
                </h2>

                {/* Quick Info */}
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-[#003366] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Organization:
                    </p>
                    <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.organization}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#003366] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      School:
                    </p>
                    <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.school}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#003366] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      College:
                    </p>
                    <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.college}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#003366] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Email Address:
                    </p>
                    <p className="text-sm text-gray-700 break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Tabs */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="bg-white rounded-xl shadow-sm">
                <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="p-4 sm:p-6">
                  {activeTab === 'personal' && (
                    <PersonalInformationTab
                      userData={userData}
                      setUserData={setUserData}
                      isEditing={isEditing}
                      onEditClick={handleEditClick}
                      onSaveChanges={handleSaveChanges}
                      onCancelEdit={handleCancelEdit}
                    />
                  )}

                  {activeTab === 'account' && (
                    <AccountDetailsTab
                      userData={userData}
                      setUserData={setUserData}
                      isEditing={isEditing}
                      onEditClick={handleEditClick}
                      onSaveChanges={handleSaveChanges}
                      onCancelEdit={handleCancelEdit}
                    />
                  )}

                  {activeTab === 'submission' && <MySubmissionTab />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Password Verification Modal */}
      {showPasswordModal && (
        <PasswordVerificationModal
          onVerified={handlePasswordVerified}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
}
