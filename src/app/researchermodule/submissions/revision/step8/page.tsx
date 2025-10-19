// app/researchermodule/submissions/revision/step8/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RevisionStepLayout from '@/components/researcher/revision/RevisionStepLayout';
import ReviewField from '@/components/researcher/submission/ReviewField';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { submitResearchApplication } from '@/app/actions/researcher/submitResearchApplication';

export default function RevisionStep8() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allData, setAllData] = useState<any>({});
  const [revisedSteps, setRevisedSteps] = useState<number[]>([]);

  useEffect(() => {
    // Load all revision data
    const step1 = JSON.parse(localStorage.getItem('revisionStep1Data') || '{}');
    const step2 = JSON.parse(localStorage.getItem('revisionStep2Data') || '{}');
    const step3 = JSON.parse(localStorage.getItem('revisionStep3Data') || '{}');
    const step4 = JSON.parse(localStorage.getItem('revisionStep4Data') || '{}');
    const step5 = JSON.parse(localStorage.getItem('revisionStep5Data') || '{}');
    const step6 = JSON.parse(localStorage.getItem('revisionStep6Data') || '{}');
    const step7 = JSON.parse(localStorage.getItem('revisionStep7Data') || '{}');

    setAllData({ step1, step2, step3, step4, step5, step6, step7 });

    // Determine which steps have been revised (have data)
    const revised: number[] = [];
    if (Object.keys(step1).length > 0) revised.push(1);
    if (Object.keys(step2).length > 0) revised.push(2);
    if (Object.keys(step3).length > 0) revised.push(3);
    if (Object.keys(step4).length > 0) revised.push(4);
    if (Object.keys(step5).length > 0) revised.push(5);
    if (Object.keys(step6).length > 0) revised.push(6);
    if (Object.keys(step7).length > 0) revised.push(7);

    setRevisedSteps(revised);

    console.log('All collected revision data:', { step1, step2, step3, step4, step5, step6, step7 });
    console.log('Revised steps:', revised);
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      console.log('Starting revision submission...');
      console.log('Revision data to submit:', allData);

      const files = {
        step5: sessionStorage.getItem('revisionStep5File') || undefined,
        step6: sessionStorage.getItem('revisionStep6File') || undefined,
        step7: sessionStorage.getItem('revisionStep7File') || undefined,
      };

      console.log('Files to upload:', {
        step5: files.step5 ? 'Present' : 'Missing',
        step6: files.step6 ? 'Present' : 'Missing',
        step7: files.step7 ? 'Present' : 'Missing',
      });

      // Add revision metadata to the data
      const revisionData = {
        ...allData,
        isRevision: true,
        revisedSteps: revisedSteps,
        revisionSubmittedAt: new Date().toISOString(),
      };

      // Call the existing function without the third parameter
      const result = await submitResearchApplication(revisionData, files);

      console.log('Server action result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Revision submission failed');
      }

      // Clear sessionStorage files
      sessionStorage.removeItem('revisionStep5File');
      sessionStorage.removeItem('revisionStep6File');
      sessionStorage.removeItem('revisionStep7File');

      // Clear localStorage revision data
      for (let i = 1; i <= 7; i++) {
        localStorage.removeItem(`revisionStep${i}Data`);
      }

      // Store submission data for success page
      const submissionData = {
        submissionId: result.submissionId,
        revisedSteps,
        ...allData,
        submittedAt: new Date().toISOString(),
        status: 'Under Re-Review',
      };

      localStorage.setItem('lastRevisionSubmission', JSON.stringify(submissionData));

      // Redirect to success page
      router.push('/researchermodule/submissions/revision/success');
    } catch (error) {
      console.error('Revision submission error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit revision. Please try again.';
      alert(`Error: ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Navigate back to the highest revised step
    if (revisedSteps.length === 0) {
      router.push('/researchermodule/submissions/revision/step1');
      return;
    }
    const maxStep = Math.max(...revisedSteps);
    router.push(`/researchermodule/submissions/revision/step${maxStep}`);
  };

  const handleEdit = (step: number) => {
    router.push(`/researchermodule/submissions/revision/step${step}`);
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

    const formattedTypes = typeOfStudy.map((type) => {
      if (type.toLowerCase() === 'others' && typeOfStudyOthers) {
        return `Others: ${typeOfStudyOthers}`;
      }
      return type;
    });

    return formattedTypes.join(', ');
  };

  return (
    <RevisionStepLayout
      stepNumber={8}
      title="Review & Submit Revisions"
      description="Review all your revised sections before resubmitting."
      onBack={handleBack}
    >
      {/* Alert Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Review Your Revisions
            </h4>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Please carefully review all the revised sections below. Only the sections you modified will be shown. You can click "Edit" on any section to make additional changes before final submission.
            </p>
          </div>
        </div>
      </div>

      {/* Revision Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
        <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Revision Summary
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={2} />
            <span className="text-xs sm:text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <strong>{revisedSteps.length}</strong> section(s) revised
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" strokeWidth={2} />
            <span className="text-xs sm:text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Ready for re-review
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Section 1: Researcher Details */}
        {revisedSteps.includes(1) && (
          <div className="bg-white rounded-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-amber-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" strokeWidth={2} />
                <h3 className="text-white font-bold text-sm sm:text-base truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Researcher Details (Revised)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleEdit(1)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold flex-shrink-0"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <span>Edit</span>
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3">
              <ReviewField label="Title of the Project" value={allData.step1?.title || 'N/A'} fullWidth />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ReviewField
                  label="Project Leader Full Name"
                  value={`${allData.step1?.projectLeaderFirstName || ''} ${allData.step1?.projectLeaderMiddleName || ''} ${allData.step1?.projectLeaderLastName || ''}`.trim() || 'N/A'}
                />
                <ReviewField label="Email" value={allData.step1?.projectLeaderEmail || 'N/A'} />
              </div>
              <ReviewField label="Organization" value={allData.step1?.organization || 'N/A'} fullWidth />
              <ReviewField label="Co-Authors" value={allData.step1?.coAuthors || 'N/A'} fullWidth />
            </div>
          </div>
        )}

        {/* Section 2: Application for Ethics Review */}
        {revisedSteps.includes(2) && (
          <div className="bg-white rounded-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-amber-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" strokeWidth={2} />
                <h3 className="text-white font-bold text-sm sm:text-base truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Application for Ethics Review (Revised)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleEdit(2)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold flex-shrink-0"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <span>Edit</span>
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  General Information
                </h4>
                <div className="space-y-2 pl-3 sm:pl-4">
                  <ReviewField label="Study Site Type" value={allData.step2?.studySiteType || 'N/A'} fullWidth />
                  <ReviewField label="Type of Study" value={formatTypeOfStudy(allData.step2?.typeOfStudy, allData.step2?.typeOfStudyOthers)} fullWidth />
                  <ReviewField label="Study Duration" value={`${allData.step2?.startDate || 'N/A'} to ${allData.step2?.endDate || 'N/A'}`} fullWidth />
                  <ReviewField label="Number of Participants" value={allData.step2?.numParticipants || 'N/A'} fullWidth />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Research Protocol */}
        {revisedSteps.includes(3) && (
          <div className="bg-white rounded-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-amber-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" strokeWidth={2} />
                <h3 className="text-white font-bold text-sm sm:text-base truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Research Protocol (Revised)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleEdit(3)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold flex-shrink-0"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <span>Edit</span>
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3">
              <div>
                <p className="text-xs text-[#64748B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Protocol Summary (Introduction)
                </p>
                <p className="text-xs sm:text-sm text-[#1E293B] line-clamp-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {stripHtmlTags(allData.step3?.formData?.introduction || '')}...
                </p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" strokeWidth={2} />
                <span className="text-xs text-amber-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  All protocol sections have been updated
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Informed Consent/Assent Form */}
        {revisedSteps.includes(4) && (
          <div className="bg-white rounded-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-amber-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" strokeWidth={2} />
                <h3 className="text-white font-bold text-sm sm:text-base truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Informed Consent / Assent Form (Revised)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleEdit(4)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold flex-shrink-0"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <span>Edit</span>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <ReviewField label="Participant Type" value={getConsentTypeLabel(allData.step4?.consentType)} fullWidth />
            </div>
          </div>
        )}

        {/* Section 5: Research Instrument */}
        {revisedSteps.includes(5) && (
          <div className="bg-white rounded-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-amber-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" strokeWidth={2} />
                <h3 className="text-white font-bold text-sm sm:text-base truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Research Instrument (Updated)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleEdit(5)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold flex-shrink-0"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <span>Edit</span>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 bg-green-50 p-3 sm:p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={2} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-green-900 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {allData.step5?.fileName || 'Document uploaded'}
                  </p>
                  <p className="text-xs text-green-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Uploaded: {allData.step5?.uploadedAt ? new Date(allData.step5.uploadedAt).toLocaleString() : 'Recently'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Proposal Defense Certification */}
        {revisedSteps.includes(6) && (
          <div className="bg-white rounded-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-amber-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" strokeWidth={2} />
                <h3 className="text-white font-bold text-sm sm:text-base truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Proposal Defense Certification (Updated)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleEdit(6)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold flex-shrink-0"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <span>Edit</span>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 bg-green-50 p-3 sm:p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={2} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-green-900 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {allData.step6?.fileName || 'Document uploaded'}
                  </p>
                  <p className="text-xs text-green-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Uploaded: {allData.step6?.uploadedAt ? new Date(allData.step6.uploadedAt).toLocaleString() : 'Recently'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 7: Endorsement Letter */}
        {revisedSteps.includes(7) && (
          <div className="bg-white rounded-lg border-2 border-amber-200 overflow-hidden">
            <div className="bg-amber-600 p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" strokeWidth={2} />
                <h3 className="text-white font-bold text-sm sm:text-base truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Endorsement Letter (Updated)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleEdit(7)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition-colors text-xs font-semibold flex-shrink-0"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <span>Edit</span>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 bg-green-50 p-3 sm:p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={2} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-green-900 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {allData.step7?.fileName || 'Document uploaded'}
                  </p>
                  <p className="text-xs text-green-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Uploaded: {allData.step7?.uploadedAt ? new Date(allData.step7.uploadedAt).toLocaleString() : 'Recently'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isSubmitting && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
              <p className="text-xs sm:text-sm text-blue-700 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Uploading files and submitting your revision...
              </p>
            </div>
          </div>
        )}

        {/* Final Confirmation */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Declaration
          </h4>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            By submitting this revision, I/we certify that all requested changes have been addressed and all revised information provided is accurate and complete to the best of my/our knowledge. I/we understand that the revised submission will be re-evaluated by the University of Makati Research Ethics Committee.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 sm:pt-8 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-semibold order-2 sm:order-1"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || revisedSteps.length === 0}
            className="w-full sm:w-auto px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold cursor-pointer order-1 sm:order-2"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Revision'}
          </button>
        </div>
      </div>
    </RevisionStepLayout>
  );
}
