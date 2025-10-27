// app/researchermodule/submissions/revision/step2-external/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, Building, MessageSquare } from 'lucide-react';

// Revision Comment Box Component
const RevisionCommentBox: React.FC<{ comments: string }> = ({ comments }) => {
  return (
    <div className="mb-6 sm:mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Reviewer Comments
          </h3>
          <p className="text-amber-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {comments}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function RevisionStep2External() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [reviewerComments] = useState(
    'Please verify your organization name and update the external review status if there have been any changes since your initial submission.'
  );

  const [formData, setFormData] = useState({
    organizationName: '',
    hasExternalReview: '' as 'yes' | 'no' | '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('revisionStep2ExternalData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading Revision Step 2 External data:', error);
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
      localStorage.setItem('revisionStep2ExternalData', JSON.stringify(formData));
      console.log('💾 Revision Step 2 External auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem('revisionStep2ExternalData', JSON.stringify(formData));

    // Route based on whether they have external REC review
    if (formData.hasExternalReview === 'yes') {
      router.push('/researchermodule/submissions/revision/step3-external');
    } else {
      // New route for "No" answer
      router.push('/researchermodule/submissions/revision/step3-external-no-review');
    }
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/revision/step1');
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
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>2</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Non-UMak Applicants - Revision
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Update your organization details if needed
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 transition-all duration-500 rounded-full shadow-lg"
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
            {/* Reviewer Comments Box */}
            <RevisionCommentBox comments={reviewerComments} />

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Organization Name */}
              <div>
                <label
                  htmlFor="organizationName"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <Building size={16} className="text-white" />
                  </div>
                  Name of Organization <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="Enter your organization name"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-[#071139] transition-all duration-300 hover:border-gray-400"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
              </div>

              {/* Has External Review Question */}
              <div>
                <label className="block text-sm sm:text-base font-bold mb-4 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Has your research been reviewed by your Organization's/External Research Ethics Committee/Board? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group p-3 sm:p-4 rounded-xl hover:bg-orange-50 transition-colors border-2 border-transparent hover:border-orange-200">
                    <input
                      type="radio"
                      name="hasExternalReview"
                      value="yes"
                      checked={formData.hasExternalReview === 'yes'}
                      onChange={(e) => setFormData({ ...formData, hasExternalReview: e.target.value as 'yes' })}
                      className="w-5 h-5 text-orange-600 focus:ring-2 focus:ring-orange-500/20 cursor-pointer flex-shrink-0 mt-0.5"
                      required
                    />
                    <span className="text-sm sm:text-base text-[#071139] group-hover:text-orange-700 transition-colors flex-1 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Yes
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group p-3 sm:p-4 rounded-xl hover:bg-orange-50 transition-colors border-2 border-transparent hover:border-orange-200">
                    <input
                      type="radio"
                      name="hasExternalReview"
                      value="no"
                      checked={formData.hasExternalReview === 'no'}
                      onChange={(e) => setFormData({ ...formData, hasExternalReview: e.target.value as 'no' })}
                      className="w-5 h-5 text-orange-600 focus:ring-2 focus:ring-orange-500/20 cursor-pointer flex-shrink-0 mt-0.5"
                      required
                    />
                    <span className="text-sm sm:text-base text-[#071139] group-hover:text-orange-700 transition-colors flex-1 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      No
                    </span>
                  </label>
                </div>
              </div>

             {/* SINGLE ORANGE SAVE BUTTON */}
              <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Save changes"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-50"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
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
