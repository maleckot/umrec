// app/reviewermodule/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import PersonalInformationCard from '@/components/reviewer/profile/PersonalInformationCard';
import SecuritySettingsCard from '@/components/reviewer/profile/SecuritySettingsCard';
import ExpertiseAreasCard from '@/components/reviewer/profile/ExpertiseAreasCard';
import ReviewStatisticsCard from '@/components/reviewer/profile/ReviewStatisticsCard';
import CertificatesCard from '@/components/reviewer/profile/CertificatesCard';
import { getReviewerProfile } from '@/app/actions/reviewer/getReviewerProfile';
import { User, Shield, Award, BarChart3, FileCheck, Mail, Building2, Briefcase, CheckCircle } from 'lucide-react';

export default function ReviewerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('personal');

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
        // certificates: result.profile.certificates || [],
      });
    } else {
      alert('Failed to load profile: ' + (result.error || 'Unknown error'));
    }

    setLoading(false);
  };

  const handleCertificateUpload = async (file: File) => {
    console.log('Uploading certificate:', file.name);
  };

  const handleCertificateDelete = async (certificateId: string) => {
    console.log('Deleting certificate:', certificateId);
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'expertise', label: 'Expertise', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: FileCheck },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="pt-24 md:pt-28 lg:pt-32 flex items-center justify-center min-h-[500px]">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#101C50]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#101C50] border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-700 text-lg font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading your profile...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="pt-24 md:pt-28 lg:pt-32 flex items-center justify-center min-h-[500px]">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-red-600" />
            </div>
            <p className="text-red-600 text-xl font-bold mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Failed to Load Profile
            </p>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Please refresh the page or try again later
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pb-12">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Profile Header Card - Hero Section */}
          <div className="mb-8 animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100/50">
              {/* Cover Background */}
              <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-[#101C50] via-[#1a2d70] to-[#288cfa]">
                <div className="absolute inset-0 bg-black/10"></div>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
                  <div className="absolute top-20 right-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="relative px-6 sm:px-8 md:px-12 pb-8">
                {/* Avatar */}
                <div className="relative -mt-16 sm:-mt-20 mb-6">
                  <div className="inline-block">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-gradient-to-br from-[#101C50] to-[#1a2d70] rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white">
                      <span className="text-white font-bold text-4xl sm:text-5xl md:text-6xl" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {profileData.fullName?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    {/* Verified Badge */}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#101C50] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {profileData.fullName}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-xl text-sm font-bold border border-blue-200 shadow-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        <Briefcase className="w-4 h-4 inline mr-1.5" />
                        Reviewer
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-50 text-green-800 rounded-xl text-sm font-bold border border-green-200 shadow-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Verified Account
                      </span>
                    </div>
                    <div className="space-y-4">

                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Department</p>
                          <p className="text-sm sm:text-base font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {profileData.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Email</p>
                          <p className="text-sm sm:text-base font-bold text-[#101C50] break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {profileData.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats - Desktop */}
                  {profileData.statistics && (
                    <div className="lg:w-80 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50 shadow-md">
                      <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Review Activity
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-[#101C50] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {profileData.statistics.totalReviews || 0}
                          </p>
                          <p className="text-xs text-gray-600 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Total Reviews</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {profileData.statistics.completedReviews || 0}
                          </p>
                          <p className="text-xs text-gray-600 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-amber-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {profileData.statistics.pendingReviews || 0}
                          </p>
                          <p className="text-xs text-gray-600 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Pending</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {profileData.statistics.averageResponseTime || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-600 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Avg. Time</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            {/* Desktop Tabs */}
            <div className="hidden md:block">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-100/50">
                <div className="flex gap-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white shadow-lg transform scale-105'
                            : 'text-gray-600 hover:text-[#101C50] hover:bg-gray-50'
                        }`}
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm lg:text-base font-bold">{section.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Dropdown */}
            <div className="md:hidden">
              <div className="relative">
                <select
                  value={activeSection}
                  onChange={(e) => setActiveSection(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/10 focus:outline-none text-sm font-bold bg-white shadow-md transition-all appearance-none"
                  style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}
                >
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6 sm:space-y-8">
            {activeSection === 'personal' && (
              <div className="animate-fadeIn">
                <PersonalInformationCard 
                  profileData={{
                    fullName: profileData.fullName,
                    email: profileData.email,
                    department: profileData.department,
                    title: profileData.title,
                  }}
                  onUpdate={loadProfile}
                />
              </div>
            )}

            {activeSection === 'security' && (
              <div className="animate-fadeIn">
                <SecuritySettingsCard lastPasswordChange={profileData.lastPasswordChange} />
              </div>
            )}

            {activeSection === 'expertise' && (
              <div className="animate-fadeIn">
                <ExpertiseAreasCard expertiseAreas={profileData.expertiseAreas} />
              </div>
            )}

            {activeSection === 'certificates' && (
              <div className="animate-fadeIn">
                <CertificatesCard 
                  certificates={profileData.certificates}
                  onUpload={handleCertificateUpload}
                  onDelete={handleCertificateDelete}
                />
              </div>
            )}

            {activeSection === 'statistics' && (
              <div className="animate-fadeIn">
                <ReviewStatisticsCard statistics={profileData.statistics} />
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
