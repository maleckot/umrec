// app/researchermodule/submissions/new/step8/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, CheckCircle, FileText, Building, Shield, Edit, AlertCircle } from 'lucide-react';
import { submitResearchApplication } from '@/app/actions/researcher/submitResearchApplication';

export default function Step8ReviewSubmit() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allData, setAllData] = useState<any>({});
  const isInitialMount = useRef(true);

  useEffect(() => {
    setIsClient(true);
    
    const step1 = JSON.parse(localStorage.getItem('step1Data') || '{}');
    const step2 = JSON.parse(localStorage.getItem('step2Data') || '{}');

    const coResearchers = JSON.parse(localStorage.getItem('step2CoResearchers') || '[{"name":"","contact":"","email":""}]');
    const technicalAdvisers = JSON.parse(localStorage.getItem('step2TechnicalAdvisers') || '[{"name":"","contact":"","email":""}]');
    
  // ✅ Merge them into step2
    step2.coResearchers = coResearchers;
    step2.technicalAdvisers = technicalAdvisers;

    const step3 = JSON.parse(localStorage.getItem('step3Data') || '{}');
    const step4 = JSON.parse(localStorage.getItem('step4Data') || '{}');
    const step5 = JSON.parse(localStorage.getItem('step5Data') || '{}');
    const step6 = JSON.parse(localStorage.getItem('step6Data') || '{}');
    const step7 = JSON.parse(localStorage.getItem('step7Data') || '{}');

    setAllData({ step1, step2, step3, step4, step5, step6, step7 });

    console.log('All collected data:', { step1, step2, step3, step4, step5, step6, step7 });
    isInitialMount.current = false;
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      console.log('Starting submission...');

      // ✅ Process researcher signatures from sessionStorage
      let processedStep3 = allData.step3;
      if (allData.step3?.researchers && Array.isArray(allData.step3.researchers)) {
        console.log('📝 Processing researcher signatures from sessionStorage...');

        const researchersWithBase64 = allData.step3.researchers.map((r: any) => {
          const base64 = sessionStorage.getItem(`signature_${r.id}`);

          if (base64) {
            console.log(`✅ Found signature for ${r.name}`);
          } else {
            console.log(`❌ No signature found for ${r.name}`);
          }

          return {
            id: r.id,
            name: r.name,
            signatureBase64: base64 || null
          };
        });

        processedStep3 = {
          ...allData.step3,
          researchers: researchersWithBase64
        };

        console.log('✅ Signatures processed:', researchersWithBase64);
      }

      // ✅ Create submission data with processed signatures
      const submissionData = {
        ...allData,
        step3: processedStep3
      };

      console.log('Data to submit:', submissionData);

      const files = {
        step5: sessionStorage.getItem('step5File') || undefined,
        step6: sessionStorage.getItem('step6File') || undefined,
        step7: sessionStorage.getItem('step7File') || undefined,
      };

      console.log('Files to upload:', {
        step5: files.step5 ? 'Present' : 'Missing',
        step6: files.step6 ? 'Present' : 'Missing',
        step7: files.step7 ? 'Present' : 'Missing',
      });

      const result = await submitResearchApplication(submissionData, files);

      console.log('Server action result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Submission failed');
      }

      // Clear sessionStorage files
      sessionStorage.removeItem('step5File');
      sessionStorage.removeItem('step6File');
      sessionStorage.removeItem('step7File');

      // Store submission data for success page
      const submissionDataForStorage = {
        submissionId: result.submissionId,
        ...submissionData,
        submittedAt: new Date().toISOString(),
        status: 'Pending Review'
      };

      localStorage.setItem('lastSubmission', JSON.stringify(submissionDataForStorage));

      // Redirect to success page
      router.push('/researchermodule/submissions/new/success');

    } catch (error) {
      console.error('Submission error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
      alert(`Error: ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new/step7');
  };

  const handleEdit = (step: number) => {
    router.push(`/researchermodule/submissions/new/step${step}`);
  };

  const stripHtmlTags = (html: string) => {
    return html?.replace(/<[^>]*>/g, '').substring(0, 200) || 'N/A';
  };

  const getConsentTypeLabel = (type: string) => {
    if (type === 'adult') return 'Adult Participants';
    if (type === 'minor') return 'Minor Participants';
    if (type === 'both') return 'Both Adult and Minor Participants';
    return 'N/A';
  };

  const formatTypeOfStudy = (typeOfStudy: string[], typeOfStudyOthers?: string) => {
    if (!typeOfStudy || typeOfStudy.length === 0) return 'N/A';

    const formattedTypes = typeOfStudy.map(type => {
      if (type.toLowerCase() === 'others' && typeOfStudyOthers) {
        return `Others: ${typeOfStudyOthers}`;
      }
      return type;
    });

    return formattedTypes.join(', ');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center py-12">
          <div className="text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Loading...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>8</span>
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
                Step 8 of 8
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                100% Complete
              </span>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="space-y-6 sm:space-y-8">
              {/* Section 1: Researcher Details */}
              <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139]">
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
                    onClick={() => handleEdit(1)}
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
                    <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {allData.step1?.protocolTitle || allData.step1?.title || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Project Leader</p>
                    <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {allData.step1?.principalInvestigator || `${allData.step1?.projectLeaderFirstName || ''} ${allData.step1?.projectLeaderLastName || ''}`.trim() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Email</p>
                    <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {allData.step1?.emailAddress || allData.step1?.projectLeaderEmail || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Organization</p>
                    <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {allData.step1?.organization || allData.step1?.position || 'N/A'}
                    </p>
                  </div>
                  {allData.step1?.coInvestigators && allData.step1.coInvestigators.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="text-xs sm:text-sm text-gray-500 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>Co-Investigators</p>
                      <div className="space-y-1">
                        {allData.step1.coInvestigators.map((ci: any, index: number) => (
                          <p key={index} className="text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            • {ci.name} ({ci.email})
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Application for Ethics Review */}
              <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
                      <Building size={20} className="text-[#F7D117]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Application for Ethics Review
                    </h2>
                  </div>
                  <button
                    onClick={() => handleEdit(2)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <Edit size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Study Site Type</p>
                    <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {allData.step2?.studySiteType || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Type of Study</p>
                    <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {formatTypeOfStudy(allData.step2?.typeOfStudy, allData.step2?.typeOfStudyOthers)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Study Duration</p>
                    <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {allData.step2?.startDate || 'N/A'} to {allData.step2?.endDate || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Number of Participants</p>
                    <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {allData.step2?.numParticipants || 'N/A'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs sm:text-sm text-gray-500 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>Uploaded Documents</p>
                    <div className="space-y-1">
                      <p className="text-sm text-[#071139] flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        <CheckCircle size={16} className={allData.step5?.fileName ? 'text-green-600' : 'text-gray-300'} />
                        Research Instrument: {allData.step5?.fileName ? '✓ Uploaded' : '✗ Not Uploaded'}
                      </p>
                      <p className="text-sm text-[#071139] flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        <CheckCircle size={16} className={allData.step6?.fileName ? 'text-green-600' : 'text-gray-300'} />
                        Proposal Defense Certification: {allData.step6?.fileName ? '✓ Uploaded' : '✗ Not Uploaded'}
                      </p>
                      <p className="text-sm text-[#071139] flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        <CheckCircle size={16} className={allData.step7?.fileName ? 'text-green-600' : 'text-gray-300'} />
                        Endorsement Letter: {allData.step7?.fileName ? '✓ Uploaded' : '✗ Not Uploaded'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Research Protocol */}
              <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
                      <Shield size={20} className="text-[#F7D117]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Research Protocol
                    </h2>
                  </div>
                  <button
                    onClick={() => handleEdit(3)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <Edit size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Protocol Summary</p>
                  <p className="text-sm sm:text-base text-[#071139] line-clamp-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {stripHtmlTags(allData.step3?.formData?.introduction || '')}...
                  </p>
                </div>
              </div>

              {/* Section 4: Informed Consent/Assent Form */}
              <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-[#F7D117]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Informed Consent / Assent Form
                    </h2>
                  </div>
                  <button
                    onClick={() => handleEdit(4)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <Edit size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Participant Type</p>
                  <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {getConsentTypeLabel(allData.step4?.consentType)}
                  </p>
                </div>
              </div>

              {/* Loading indicator */}
              {isSubmitting && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-blue-700 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Uploading files and submitting your application...
                    </p>
                  </div>
                </div>
              )}

              {/* Important Notice */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-yellow-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Declaration
                    </h3>
                    <p className="text-sm sm:text-base text-yellow-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      By submitting this application, I/we certify that all information provided is accurate and complete to the best of my/our knowledge.
                      I/we understand that any false or misleading information may result in the rejection of this application or withdrawal of ethics approval.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gray-200 text-[#071139] rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
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
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto group relative px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl transition-all duration-300 overflow-hidden order-1 sm:order-2 ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-2xl hover:scale-105'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Submit application"
                >
                  {!isSubmitting && (
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Submit Application
                      </>
                    )}
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
