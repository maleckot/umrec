// app/researchermodule/submissions/new/step2-external/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, Building } from 'lucide-react';

export default function Step2ExternalApplicants() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    organizationName: '',
    hasExternalReview: '' as 'yes' | 'no' | '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('step2ExternalData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading Step 2 External data:', error);
      }
    }
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (isInitialMount.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('step2ExternalData', JSON.stringify(formData));
      console.log('💾 Step 2 External auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem('step2ExternalData', JSON.stringify(formData));

    // Route based on whether they have external REC review
    if (formData.hasExternalReview === 'yes') {
      router.push('/researchermodule/submissions/new/step3-external');
    } else {
      // New route for "No" answer
      router.push('/researchermodule/submissions/new/step3-external-no-review');
    }
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new/step1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <button
                onClick={handleBack}
                className="w-12 h-12 bg-white border-2 border-[#071139]/20 rounded-full flex items-center justify-center hover:bg-[#071139] hover:border-[#071139] hover:shadow-lg transition-all duration-300 group"
                aria-label="Go back to previous page"
              >
                <ArrowLeft size={20} className="text-[#071139] group-hover:text-[#F7D117] transition-colors duration-300" />
              </button>

              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-[#071139] to-[#003366] text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>2</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Non-UMak Applicants
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Ensure all requested details are filled out accurately
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#F7D117] to-[#B8860B] h-3 transition-all duration-500 rounded-full shadow-lg"
                style={{ width: '25%' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Step 2 of 8
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                25% Complete
              </span>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Organization Name */}
              <div>
                <label
                  htmlFor="organizationName"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <Building size={16} className="text-[#F7D117]" />
                  </div>
                  Name of Organization
                </label>
                <input
                  id="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="Enter your organization name"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] transition-all duration-300 hover:border-gray-400"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
              </div>

              {/* Has External Review Question */}
              <div>
                <label className="block text-sm sm:text-base font-bold mb-4 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Has your research been reviewed by your Organization's/External Research Ethics Committee/Board?
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="hasExternalReview"
                      value="yes"
                      checked={formData.hasExternalReview === 'yes'}
                      onChange={(e) => setFormData({ ...formData, hasExternalReview: e.target.value as 'yes' })}
                      className="w-5 h-5 text-[#071139] focus:ring-2 focus:ring-[#071139]/20 cursor-pointer flex-shrink-0 mt-0.5"
                      required
                    />
                    <span className="text-sm sm:text-base text-[#071139] group-hover:text-[#003366] transition-colors flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Yes
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="hasExternalReview"
                      value="no"
                      checked={formData.hasExternalReview === 'no'}
                      onChange={(e) => setFormData({ ...formData, hasExternalReview: e.target.value as 'no' })}
                      className="w-5 h-5 text-[#071139] focus:ring-2 focus:ring-[#071139]/20 cursor-pointer flex-shrink-0 mt-0.5"
                      required
                    />
                    <span className="text-sm sm:text-base text-[#071139] group-hover:text-[#003366] transition-colors flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      No
                    </span>
                  </label>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-8 mt-8 border-t-2 border-gray-200">
                 <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gray-200 text-[#071139] rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Go back to previous step"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Previous Step
                  </span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden order-1 sm:order-2"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#F7D117] via-white/10 to-[#F7D117] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Next
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
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
