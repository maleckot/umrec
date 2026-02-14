'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { submitResearchApplication } from '@/app/actions/researcher/submitResearchApplication';
import { ArrowLeft, CheckCircle } from 'lucide-react';

// Import Components
import ReviewHeader from '@/components/researcher/submission/steps/step8/ReviewHeader';
import ResearcherDetailsSection from '@/components/researcher/submission/steps/step8/ResearcherDetailsSection';
import EthicsReviewSection from '@/components/researcher/submission/steps/step8/EthicsReviewSection';
import ResearchProtocolSection from '@/components/researcher/submission/steps/step8/ResearchProtocolSection';
import FileReviewSection from '@/components/researcher/submission/steps/step8/FileReviewSection';
import DeclarationSection from '@/components/researcher/submission/steps/step8/DeclarationSection';

export default function Step8ReviewSubmit() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allData, setAllData] = useState<any>({});
  const isInitialMount = useRef(true);

  useEffect(() => {
    setIsClient(true);
    
    // Load all steps
    const step1 = JSON.parse(localStorage.getItem('step1Data') || '{}');
    const step2 = JSON.parse(localStorage.getItem('step2Data') || '{}');
    const coResearchers = JSON.parse(localStorage.getItem('step2CoResearchers') || '[{"name":"","contact":"","email":""}]');
    const technicalAdvisers = JSON.parse(localStorage.getItem('step2TechnicalAdvisers') || '[{"name":"","contact":"","email":""}]');
    
    // Merge array data into step 2
    step2.coResearchers = coResearchers;
    step2.technicalAdvisers = technicalAdvisers;

    const step3 = JSON.parse(localStorage.getItem('step3Data') || '{}');
    const step4 = JSON.parse(localStorage.getItem('step4Data') || '{}');
    const step5 = JSON.parse(localStorage.getItem('step5Data') || '{}');
    const step6 = JSON.parse(localStorage.getItem('step6Data') || '{}');
    const step7 = JSON.parse(localStorage.getItem('step7Data') || '{}');

    setAllData({ step1, step2, step3, step4, step5, step6, step7 });
    isInitialMount.current = false;
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Process signatures
      let processedStep3 = allData.step3;
      if (allData.step3?.researchers && Array.isArray(allData.step3.researchers)) {
        const researchersWithBase64 = allData.step3.researchers.map((r: any) => {
          const base64 = sessionStorage.getItem(`signature_${r.id}`);
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
      }

      const submissionData = {
        ...allData,
        step3: processedStep3
      };

      const files = {
        step2TechnicalReview: sessionStorage.getItem('step2TechnicalReviewFile') || undefined,
        step5: sessionStorage.getItem('step5File') || undefined,
        step6: sessionStorage.getItem('step6File') || undefined,
        step7: sessionStorage.getItem('step7File') || undefined,
      };

      const result = await submitResearchApplication(submissionData, files);

      if (!result.success) {
        throw new Error(result.error || 'Submission failed');
      }

      // Cleanup
      sessionStorage.removeItem('step2TechnicalReviewFile');
      sessionStorage.removeItem('step5File');
      sessionStorage.removeItem('step6File');
      sessionStorage.removeItem('step7File');

      // Save for success page
      const submissionDataForStorage = {
        submissionId: result.submissionId,
        ...submissionData,
        submittedAt: new Date().toISOString(),
        status: 'Pending Review'
      };

      localStorage.setItem('lastSubmission', JSON.stringify(submissionDataForStorage));
      router.push('/researchermodule/submissions/new/success');

    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application.';
      alert(`Error: ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => router.push('/researchermodule/submissions/new/step7');
  const handleEdit = (step: number) => router.push(`/researchermodule/submissions/new/step${step}`);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center py-12">
          <div className="text-[#071139] font-bold">Loading...</div>
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
          
          <ReviewHeader currentStep={8} totalSteps={8} onBack={handleBack} />

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="space-y-6 sm:space-y-8">
              
              {/* Step 1: Researcher Details */}
              <ResearcherDetailsSection 
                data={allData.step1} 
                onEdit={() => handleEdit(1)} 
              />
              
              {/* Step 2: Ethics Review */}
              <EthicsReviewSection 
                step2={allData.step2} 
                onEdit={() => handleEdit(2)} 
              />
              
              {/* Step 3 & 4: Protocol & Consent */}
              <ResearchProtocolSection 
                step3={allData.step3} 
                step4={allData.step4}
                onEditProtocol={() => handleEdit(3)}
                onEditConsent={() => handleEdit(4)}
              />

              {/* Step 5: Research Instrument */}
              <FileReviewSection 
                title="Validated Research Instrument"
                fileName={allData.step5?.fileName}
                stepNumber={5}
                onEdit={() => handleEdit(5)}
              />

              {/* Step 6: Proposal Defense */}
              <FileReviewSection 
                title="Proposal Defense Certification"
                fileName={allData.step6?.fileName}
                stepNumber={6}
                onEdit={() => handleEdit(6)}
              />

              {/* Step 7: Endorsement Letter */}
              <FileReviewSection 
                title="Endorsement Letter from Research Adviser"
                fileName={allData.step7?.fileName}
                stepNumber={7}
                onEdit={() => handleEdit(7)}
              />

              {isSubmitting && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 sm:p-5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-blue-900 font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Uploading files and submitting your application...
                    </p>
                  </div>
                </div>
              )}

              <DeclarationSection />

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gray-200 text-[#071139] rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <ArrowLeft size={20} />
                    Previous Step
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto group relative px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl transition-all duration-300 overflow-hidden order-1 sm:order-2 ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-2xl hover:scale-105'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
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
