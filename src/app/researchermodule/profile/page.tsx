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
import { User, Mail, Building, GraduationCap } from 'lucide-react';

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
        <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7] pt-24 md:pt-28 lg:pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 blur-2xl bg-[#071139]/20 rounded-full animate-pulse"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#071139] mx-auto mb-4"></div>
            </div>
            <p className="text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7] pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] relative inline-block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              My Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Manage your personal information and account settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Enhanced Left Sidebar - Profile Card */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
                {/* Profile Picture with Gradient Border */}
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#071139] to-[#F7D117] rounded-full blur-md opacity-50"></div>
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#071139] to-[#0a1a52] flex items-center justify-center shadow-xl ring-4 ring-white">
                      <User className="w-14 h-14 sm:w-18 sm:h-18 text-white" />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-xl sm:text-2xl font-bold text-[#071139] text-center mb-6 sm:mb-8" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {userData.firstName} {userData.middleName && userData.middleName[0]}. {userData.lastName}
                </h2>

                {/* Profile Details with Icons */}
                <div className="space-y-4 sm:space-y-5">
                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#0a1a52] flex items-center justify-center flex-shrink-0">
                        <Building className="w-4 h-4 text-[#F7D117]" />
                      </div>
                      <p className="text-xs font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Organization
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 ml-11" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.organization || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#0a1a52] flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-[#F7D117]" />
                      </div>
                      <p className="text-xs font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        School
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 ml-11" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.school || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#0a1a52] flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-[#F7D117]" />
                      </div>
                      <p className="text-xs font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        College
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 ml-11" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.college || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#0a1a52] flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-[#F7D117]" />
                      </div>
                      <p className="text-xs font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Email Address
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 break-words ml-11" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {userData.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Right Content - Tabs */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
                <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
                
                <div className="p-4 sm:p-6 md:p-8">
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
