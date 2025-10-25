// app/researchermodule/submissions/new/step4-external/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, CheckCircle, FileText, Building, Shield, Edit } from 'lucide-react';

export default function Step4ExternalSummary() {
  const router = useRouter();
  const [step1Data, setStep1Data] = useState<any>(null);
  const [step2Data, setStep2Data] = useState<any>(null);
  const [step3Data, setStep3Data] = useState<any>(null);
  const [isReviewedPath, setIsReviewedPath] = useState(true);

  useEffect(() => {
    // Load all data from localStorage
    const data1 = localStorage.getItem('step1Data');
    const data2 = localStorage.getItem('step2ExternalData');
    const data3Reviewed = localStorage.getItem('step3ExternalData');
    const data3NoReview = localStorage.getItem('step3ExternalNoReviewData');

    // Always load Step 1 and Step 2 data for both paths
    if (data1) setStep1Data(JSON.parse(data1));
    if (data2) setStep2Data(JSON.parse(data2));

    // Determine path based on step2 answer
    let reviewedPath = true;
    if (data2) {
      const step2Parsed = JSON.parse(data2);
      reviewedPath = step2Parsed.hasExternalReview === 'yes';
    }

    if (reviewedPath) {
      // Reviewed path - also load step 3 REC data
      if (data3Reviewed) setStep3Data(JSON.parse(data3Reviewed));
      setIsReviewedPath(true);
    } else {
      // Non-reviewed path - no step 3 REC data
      setIsReviewedPath(false);
    }
  }, []);

  const handleBack = () => {
    // Route back based on which path user took
    if (isReviewedPath) {
      router.push('/researchermodule/submissions/new/step3-external');
    } else {
      router.push('/researchermodule/submissions/new/step3-external-no-review');
    }
  };

  const handleEdit = (step: string) => {
    if (step === 'step1') {
      router.push('/researchermodule/submissions/new/step1');
    } else if (step === 'step2') {
      router.push('/researchermodule/submissions/new/step2-external');
    } else if (step === 'step3-reviewed') {
      router.push('/researchermodule/submissions/new/step3-external');
    } else if (step === 'step3-no-review') {
      router.push('/researchermodule/submissions/new/step3-external-no-review');
    }
  };

  const handleSubmit = () => {
    router.push('/researchermodule/submissions/new/success');
  };

  const getRecTypeLabel = (type: string) => {
    switch (type) {
      case 'own': return 'Under our own organization';
      case 'not-own': return 'Not under own organization';
      case 'phreb': return 'Philippine Research Ethics Board (PHREB) itself';
      default: return type;
    }
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
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>4</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Review Your Submission
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Please review all information before submitting
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#F7D117] to-[#B8860B] h-3 transition-all duration-500 rounded-full shadow-lg"
                style={{ width: '100%' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Step 4 of 4
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                100% Complete
              </span>
            </div>
          </div>

          {/* Summary Content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="space-y-6 sm:space-y-8">
              {/* Step 1 Summary - ALWAYS SHOW */}
              {step1Data && (
                <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139] relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-[#F7D117]" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Researcher Details
                      </h2>
                    </div>
                    <button
                      onClick={() => handleEdit('step1')}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      <Edit size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Project Title</p>
                      <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>{step1Data.title}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Project Leader</p>
                      <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {step1Data.projectLeaderFirstName} {step1Data.projectLeaderMiddleName} {step1Data.projectLeaderLastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Email</p>
                      <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>{step1Data.projectLeaderEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Contact</p>
                      <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>{step1Data.projectLeaderContact}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Co-Authors</p>
                      <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>{step1Data.coAuthors}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 Summary - ALWAYS SHOW */}
              {step2Data && (
                <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139] relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
                        <Building size={20} className="text-[#F7D117]" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Organization Information
                      </h2>
                    </div>
                    <button
                      onClick={() => handleEdit('step2')}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      <Edit size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Organization Name</p>
                      <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>{step2Data.organizationName}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>External Review Status</p>
                      <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {step2Data.hasExternalReview === 'yes' ? 'Reviewed' : 'Not Yet Reviewed'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 Ethics Committee Details - ONLY FOR REVIEWED PATH */}
              {isReviewedPath && step3Data && (
                <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139] relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
                        <Shield size={20} className="text-[#F7D117]" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Ethics Committee Details
                      </h2>
                    </div>
                    <button
                      onClick={() => handleEdit('step3-reviewed')}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      <Edit size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Committee Type</p>
                      <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>{getRecTypeLabel(step3Data.recType)}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>PHREB Accreditation</p>
                      <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {step3Data.isAccredited === 'yes' ? 'Accredited' : 'Not Accredited'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Uploaded Document</p>
                      <p className="text-sm sm:text-base text-green-600 font-medium flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        <CheckCircle size={16} />
                        Consolidated Files for Research Request Uploaded
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Uploaded Documents - ONLY FOR NON-REVIEWED PATH */}
              {!isReviewedPath && (
                <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139] relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-[#F7D117]" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Uploaded Documents
                      </h2>
                    </div>
                    <button
                      onClick={() => handleEdit('step3-no-review')}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      <Edit size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Consolidated Files for Research Request</p>
                      <p className="text-sm sm:text-base text-green-600 font-medium flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        <CheckCircle size={16} />
                        Successfully Uploaded
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Important Note */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-yellow-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Important Notice
                    </h3>
                    <p className="text-sm sm:text-base text-yellow-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Please ensure all information above is correct before submitting. Once submitted, you will not be able to edit your application.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gray-200 text-[#071139] rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 order-2 sm:order-1"
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
                  onClick={handleSubmit}
                  className="w-full sm:w-auto group relative px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden order-1 sm:order-2"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <CheckCircle size={20} />
                    Submit Application
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
