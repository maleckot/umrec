// app/reviewermodule/profile/page.tsx
'use client';

import { useState } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import PersonalInformationCard from '@/components/reviewer/profile/PersonalInformationCard';
import SecuritySettingsCard from '@/components/reviewer/profile/SecuritySettingsCard';
import ExpertiseAreasCard from '@/components/reviewer/profile/ExpertiseAreasCard';
import ReviewStatisticsCard from '@/components/reviewer/profile/ReviewStatisticsCard';

export default function ReviewerProfilePage() {
  // Mock data - replace with API call
  const profileData = {
    fullName: 'Prof. Juan Dela Cruz',
    email: 'email1234@gmail.com',
    department: 'College of Computing and Information Sciences',
    title: 'Associate Professor',
    lastPasswordChange: '3 months ago',
    expertiseAreas: ['Science', 'Technology', 'Engineering', 'Mathematics'],
    statistics: {
      totalReviewed: 1256,
      expedited: 450,
      fullReview: 750,
      overdue: 56,
    },
  };

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
          <PersonalInformationCard profileData={profileData} />

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
