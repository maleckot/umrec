// app/researchermodule/profile/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import ProfileTabs from '@/components/researcher/profile/ProfileTabs';
import PersonalInformationTab from '@/components/researcher/profile/PersonalInformationTab';
import AccountDetailsTab from '@/components/researcher/profile/AccountDetailsTab';
import MySubmissionTab from '@/components/researcher/profile/MySubmissionTab';
import PasswordVerificationModal from '@/components/researcher/profile/PasswordVerificationModal';
import { getResearcherProfile } from '@/app/actions/researcher/getResearcherProfile';
import { updateResearcherProfile } from '@/app/actions/researcher/updateResearcherProfile';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'personal' | 'account' | 'submission'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState<any>(null);
  
  const [userData, setUserData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    contactNumber: '',
    gender: '',
    school: '',
    college: '',
    program: '',
    yearLevel: '',
    section: '',
    studentNo: '',
    email: '',
    organization: '',
    username: '',
  });

  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    const result = await getResearcherProfile();

    if (result.success && result.profile) {
      const profileData = {
        firstName: result.profile.firstName || '',
        middleName: result.profile.middleName || '',
        lastName: result.profile.lastName || '',
        dateOfBirth: result.profile.dateOfBirth || '',
        contactNumber: result.profile.contactNumber || '',
        gender: result.profile.gender || '',
        school: result.profile.school || '',
        college: result.profile.college || '',
        program: result.profile.program || '',
        yearLevel: result.profile.yearLevel || '',
        section: result.profile.section || '',
        studentNo: result.profile.studentNo || '',
        email: result.profile.email || '',
        organization: result.profile.organization || '',
        username: result.profile.username || ''
      };
      
      setUserData(profileData);
      setOriginalData(profileData);
      setSubmissions(result.submissions || []);
    } else {
      alert('Failed to load profile data');
    }
    
    setLoading(false);
  };

  const handleEditClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordVerified = () => {
    setShowPasswordModal(false);
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const result = await updateResearcherProfile(userData);

    if (result.success) {
      setIsEditing(false);
      setOriginalData(userData);
      alert('Changes saved successfully!');
    } else {
      alert('Failed to save changes: ' + result.error);
    }
    
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setUserData(originalData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <>
        <NavbarRoles role="researcher" />
        <div className="min-h-screen bg-[#E8EEF3] pt-24 md:pt-28 lg:pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
            <p className="text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading profile...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavbarRoles role="researcher" />
      <div className="min-h-screen bg-[#E8EEF3] pt-24 md:pt-28 lg:pt-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Sidebar - Profile Card */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#003366] flex items-center justify-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#003366] text-center mb-4 sm:mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {userData.firstName} {userData.middleName && userData.middleName[0]}. {userData.lastName}
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-[#003366] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Organization:
                    </p>
                    <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.organization || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#003366] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      School:
                    </p>
                    <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.school || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#003366] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      College:
                    </p>
                    <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.college || 'N/A'}
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

                  {activeTab === 'submission' && <MySubmissionTab submissions={submissions} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {showPasswordModal && (
        <PasswordVerificationModal
          onVerified={handlePasswordVerified}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
}
