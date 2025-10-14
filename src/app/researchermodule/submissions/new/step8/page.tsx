// app/researchermodule/submissions/new/step8/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubmissionStepLayout from '@/components/researcher/submission/SubmissionStepLayout';
import ReviewSectionCard from '@/components/researcher/submission/ReviewSectionCard';
import ReviewField from '@/components/researcher/submission/ReviewField';
import DocumentListItem from '@/components/researcher/submission/DocumentListItem';
import { CheckCircle } from 'lucide-react';
import { submitResearchApplication } from '@/app/actions/researcher/submitResearchApplication';

export default function Step8ReviewSubmit() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allData, setAllData] = useState<any>({});

  useEffect(() => {
    const step1 = JSON.parse(localStorage.getItem('step1Data') || '{}');
    const step2 = JSON.parse(localStorage.getItem('step2Data') || '{}');
    const step3 = JSON.parse(localStorage.getItem('step3Data') || '{}');
    const step4 = JSON.parse(localStorage.getItem('step4Data') || '{}');
    const step5 = JSON.parse(localStorage.getItem('step5Data') || '{}');
    const step6 = JSON.parse(localStorage.getItem('step6Data') || '{}');
    const step7 = JSON.parse(localStorage.getItem('step7Data') || '{}');

    setAllData({ step1, step2, step3, step4, step5, step6, step7 });

    console.log('All collected data:', { step1, step2, step3, step4, step5, step6, step7 });
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      console.log('Starting submission...');
      console.log('Data to submit:', allData);

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

      const result = await submitResearchApplication(allData, files);

      console.log('Server action result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Submission failed');
      }

      // Clear sessionStorage files
      sessionStorage.removeItem('step5File');
      sessionStorage.removeItem('step6File');
      sessionStorage.removeItem('step7File');

      // Store submission data for success page
      const submissionData = {
        submissionId: result.submissionId,
        ...allData,
        submittedAt: new Date().toISOString(),
        status: 'Pending Review'
      };

      localStorage.setItem('lastSubmission', JSON.stringify(submissionData));

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

  return (
    <SubmissionStepLayout
      stepNumber={8}
      title="Review & Submit"
      description="Review all your submission details before submitting."
      onBack={handleBack}
      onNext={handleSubmit}
      isNextDisabled={isSubmitting}
      totalSteps={8}
    >


        {/* Alert Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <h4 className="font-bold text-[#1E293B] text-base mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Review Your Submission
              </h4>
              <p className="text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Please carefully review all the information below. You can click "Edit" on any section to make changes.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Researcher Details */}
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <div className="bg-[#071139] p-4 flex items-center justify-between">
            <h3 className="text-white font-bold text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Researcher Details
            </h3>
            <button
              type="button"
              onClick={() => handleEdit(1)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white text-[#071139] rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <span>Edit</span>
            </button>
          </div>
          <div className="p-4 space-y-3">
            <ReviewField label="Title of the Project" value={allData.step1?.protocolTitle || allData.step1?.title || 'N/A'} fullWidth />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ReviewField
                label="Project Leader Full Name"
                value={allData.step1?.principalInvestigator || `${allData.step1?.projectLeaderFirstName || ''} ${allData.step1?.projectLeaderLastName || ''}`.trim() || 'N/A'}
              />
              <ReviewField label="Email of the Project Leader" value={allData.step1?.emailAddress || allData.step1?.projectLeaderEmail || 'N/A'} />
            </div>
            <ReviewField label="Organization" value={allData.step1?.organization || allData.step1?.position || 'N/A'} fullWidth />
            {allData.step1?.coInvestigators && allData.step1.coInvestigators.length > 0 && (
              <div>
                <p className="text-xs text-[#64748B] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>List of Co-Authors</p>
                <div className="space-y-1">
                  {allData.step1.coInvestigators.map((ci: any, index: number) => (
                    <p key={index} className="text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      • {ci.name} ({ci.email})
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Application for Ethics Review */}
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <div className="bg-[#071139] p-4 flex items-center justify-between">
            <h3 className="text-white font-bold text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Application for Ethics Review
            </h3>
            <button
              type="button"
              onClick={() => handleEdit(2)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white text-[#071139] rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <span>Edit</span>
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                1. General Information
              </h4>
              <div className="space-y-2 pl-4">
                <ReviewField
                  label="Study Site Type"
                  value={allData.step2?.studySiteType || 'N/A'}
                  fullWidth
                />
                <ReviewField
                  label="Type of Study"
                  value={formatTypeOfStudy(
                    allData.step2?.typeOfStudy,
                    allData.step2?.typeOfStudyOthers
                  )}
                  fullWidth
                />
                <ReviewField
                  label="Study Duration"
                  value={`${allData.step2?.startDate || 'N/A'} to ${allData.step2?.endDate || 'N/A'}`}
                  fullWidth
                />
                <ReviewField
                  label="Number of Participants"
                  value={allData.step2?.numParticipants || 'N/A'}
                  fullWidth
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                2. Checklist of Documents
              </h4>
              <div className="pl-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`w-4 h-4 ${allData.step5?.fileName ? 'text-green-600' : 'text-gray-300'}`} strokeWidth={2} />
                  <p className="text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Research Instrument: <strong>{allData.step5?.fileName ? '✓ Uploaded' : '✗ Not Uploaded'}</strong>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`w-4 h-4 ${allData.step6?.fileName ? 'text-green-600' : 'text-gray-300'}`} strokeWidth={2} />
                  <p className="text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Proposal Defense Certification: <strong>{allData.step6?.fileName ? '✓ Uploaded' : '✗ Not Uploaded'}</strong>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className={`w-4 h-4 ${allData.step7?.fileName ? 'text-green-600' : 'text-gray-300'}`} strokeWidth={2} />
                  <p className="text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Endorsement Letter: <strong>{allData.step7?.fileName ? '✓ Uploaded' : '✗ Not Uploaded'}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Research Protocol */}
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <div className="bg-[#071139] p-4 flex items-center justify-between">
            <h3 className="text-white font-bold text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Research Protocol
            </h3>
            <button
              type="button"
              onClick={() => handleEdit(3)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white text-[#071139] rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <span>Edit</span>
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-[#64748B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Protocol Summary</p>
              <p className="text-sm text-[#1E293B] line-clamp-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stripHtmlTags(allData.step3?.formData?.introduction || '')}...
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Informed Consent/Assent Form */}
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <div className="bg-[#071139] p-4 flex items-center justify-between">
            <h3 className="text-white font-bold text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Informed Consent / Assent Form
            </h3>
            <button
              type="button"
              onClick={() => handleEdit(4)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white text-[#071139] rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <span>Edit</span>
            </button>
          </div>
          <div className="p-4">
            <ReviewField
              label="Participant Type"
              value={getConsentTypeLabel(allData.step4?.consentType)}
              fullWidth
            />
          </div>
        </div>

        {/* Loading indicator */}
        {isSubmitting && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-sm text-blue-700 font-semibold">
                Uploading files and submitting your application...
              </p>
            </div>
          </div>
        )}

        {/* Final Confirmation */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Declaration
          </h4>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            By submitting this application, I/we certify that all information provided is accurate and complete to the best of my/our knowledge.
            I/we understand that any false or misleading information may result in the rejection of this application or withdrawal of ethics approval.
          </p>
        </div>
    </SubmissionStepLayout>
  );
}
