// app/researchermodule/submissions/new/step1/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft } from 'lucide-react';

export default function Step1ResearcherDetails() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    studySite: '',
    projectLeaderFirstName: '',
    projectLeaderMiddleName: '',
    projectLeaderLastName: '',
    projectLeaderEmail: '',
    projectLeaderContact: '',
    coAuthors: '',
    organization: 'internal',
    college: '',
    typeOfStudy: [] as string[],
    multicenter: '',
    sourceOfFunding: [] as string[],
    fundingOthers: '',
    startDate: '',
    endDate: '',
    numParticipants: '',
    technicalReview: '',
    submittedToOtherUMREC: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('step1Data', JSON.stringify(formData));
    router.push('/researchermodule/submissions/new/step2');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new');
  };

  return (
    <div className="min-h-screen bg-[#DAE0E7] flex flex-col">
      <NavbarRoles role="researcher" />
      
      <div className="flex-grow py-8 px-6 md:px-12 lg:px-20 mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Back Button, Step Number, and Title */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              {/* Back Button - Same size as step number */}
              <button
                onClick={handleBack}
                className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <ArrowLeft size={20} className="text-[#1E293B]" />
              </button>
              
              {/* Step Number */}
              <div className="w-12 h-12 bg-[#1E293B] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              
              {/* Title and Description */}
              <div>
                <h1 className="text-2xl font-bold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Researcher Details
                </h1>
                <p className="text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Ensure all requested details are filled out accurately.
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#FFD700] h-2 transition-all duration-500"
                style={{ width: '12.5%' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Step 1 of 8
              </span>
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                12% Complete
              </span>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title of Project */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Title of the project
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
              </div>

              {/* Project Leader Full Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Project Leader Full Name
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.projectLeaderLastName}
                    onChange={(e) => setFormData({...formData, projectLeaderLastName: e.target.value})}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.projectLeaderFirstName}
                    onChange={(e) => setFormData({...formData, projectLeaderFirstName: e.target.value})}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Middle Name"
                    value={formData.projectLeaderMiddleName}
                    onChange={(e) => setFormData({...formData, projectLeaderMiddleName: e.target.value})}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </div>
              </div>

              {/* Email and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Email of the Project Leader
                  </label>
                  <input
                    type="email"
                    value={formData.projectLeaderEmail}
                    onChange={(e) => setFormData({...formData, projectLeaderEmail: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Contact Number of the Project Leader
                  </label>
                  <input
                    type="tel"
                    value={formData.projectLeaderContact}
                    onChange={(e) => setFormData({...formData, projectLeaderContact: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                    required
                  />
                </div>
              </div>

              {/* Co-Authors */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  List of Co-Authors
                  <span className="text-[#64748B] font-normal text-xs ml-2">If there are none, please write N/A</span>
                </label>
                <textarea
                  value={formData.coAuthors}
                  onChange={(e) => setFormData({...formData, coAuthors: e.target.value})}
                  rows={3}
                  placeholder="Juan A. Dela Cruz, Jeon H. Womwoo, Choi J. Seungcheol"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none resize-none text-[#1E293B]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Organization
                </label>
                <select
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                >
                  <option value="internal">Internal (UMak)</option>
                  <option value="external">External</option>
                </select>
              </div>

              {/* Navigation Button - Only Next */}
              <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#071139] text-[#F0E847] rounded-lg hover:bg-[#0F172A] transition-colors font-semibold cursor-pointer"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
