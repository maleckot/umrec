// app/reviewermodule/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import PersonalInformationCard from '@/components/reviewer/profile/PersonalInformationCard';
import SecuritySettingsCard from '@/components/reviewer/profile/SecuritySettingsCard';
import ExpertiseAreasCard from '@/components/reviewer/profile/ExpertiseAreasCard';
import ReviewStatisticsCard from '@/components/reviewer/profile/ReviewStatisticsCard';
import { getReviewerProfile } from '@/app/actions/reviewer/getReviewerProfile';

export default function ReviewerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const result = await getReviewerProfile();

    if (result.success && result.profile) {
      setProfileData({
        fullName: result.profile.fullName,
        email: result.profile.email,
        department: result.profile.department,
        title: result.profile.title,
        expertiseAreas: result.profile.expertiseAreas,
        lastPasswordChange: result.profile.lastPasswordChange,
        statistics: result.statistics,
      });
    } else {
      alert('Failed to load profile: ' + (result.error || 'Unknown error'));
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="pt-24 md:pt-28 lg:pt-32 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50] mx-auto mb-4"></div>
            <p className="text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading profile...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="pt-24 md:pt-28 lg:pt-32 flex items-center justify-center min-h-[400px]">
          <p className="text-red-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Failed to load profile data
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            Account Settings
          </h1>

          {/* Personal Information */}
          <PersonalInformationCard 
            profileData={{
              fullName: profileData.fullName,
              email: profileData.email,
              department: profileData.department,
              title: profileData.title,
            }}
            onUpdate={loadProfile}
          />

          {/* Security Settings */}
          <SecuritySettingsCard lastPasswordChange={profileData.lastPasswordChange} />

          {/* Expertise Areas */}
          <ExpertiseAreasCard expertiseAreas={profileData.expertiseAreas} />

          {/* Review Statistics */}
          <ReviewStatisticsCard statistics={profileData.statistics} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
