// app/researchermodule/submissions/revision/step8/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, CheckCircle, FileText, Building, Shield, Edit, AlertCircle } from 'lucide-react';
import { submitResearchApplication } from '@/app/actions/researcher/submitResearchApplication';

export default function RevisionStep8() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allData, setAllData] = useState<any>({});
  const [revisedSteps, setRevisedSteps] = useState<number[]>([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    setIsClient(true);
    
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
    isInitialMount.current = false;
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

      // Call the existing function
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
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>8</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Review & Submit Revisions
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
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 transition-all duration-500 rounded-full shadow-lg"
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
            {/* Alert Banner */}
            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Review Your Revisions
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Please carefully review all revised sections below. Only the sections you modified will be shown. You can click "Edit" on any section to make additional changes before final submission.
                  </p>
                </div>
              </div>
            </div>

            {/* Revision Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-500 rounded-r-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Revision Summary
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs sm:text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <strong>{revisedSteps.length}</strong> section(s) revised
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs sm:text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Ready for re-review
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Section 1: Researcher Details */}
              {revisedSteps.includes(1) && (
                <div className="bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-xl p-4 sm:p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                        <FileText size={20} className="text-white" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Researcher Details (Revised)
                      </h2>
                    </div>
                    <button
                      onClick={() => handleEdit(1)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
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
                  </div>
                </div>
              )}

              {/* Section 2: Application for Ethics Review */}
              {revisedSteps.includes(2) && (
                <div className="bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-xl p-4 sm:p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                        <Building size={20} className="text-white" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Application for Ethics Review (Revised)
                      </h2>
                    </div>
                    <button
                      onClick={() => handleEdit(2)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
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
              )}

              {/* Section 3: Research Protocol */}
              {revisedSteps.includes(3) && (
                <div className="bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-xl p-4 sm:p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                        <Shield size={20} className="text-white" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Research Protocol (Revised)
                      </h2>
                    </div>
                    <button
                      onClick={() => handleEdit(3)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
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
              )}

              {/* Section 4: Informed Consent/Assent Form */}
              {revisedSteps.includes(4) && (
                <div className="bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-xl p-4 sm:p-6 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                        <FileText size={20} className="text-white" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Informed Consent / Assent Form (Revised)
                      </h2>
                    </div>
                    <button
                      onClick={() => handleEdit(4)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
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
              )}

              {/* Loading indicator */}
              {isSubmitting && (
                <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                    <p className="text-sm text-orange-700 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Uploading files and submitting your revision...
                    </p>
                  </div>
                </div>
              )}

              {/* Important Notice */}
              <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-lg font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-orange-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Declaration
                    </h3>
                    <p className="text-sm sm:text-base text-orange-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      By submitting this revision, I/we certify that all requested changes have been addressed and all revised information provided is accurate and complete to the best of my/our knowledge. I/we understand that the revised submission will be re-evaluated by the University of Makati Research Ethics Committee.
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
                  disabled={isSubmitting || revisedSteps.length === 0}
                  className={`w-full sm:w-auto group relative px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl transition-all duration-300 overflow-hidden order-1 sm:order-2 ${
                    isSubmitting || revisedSteps.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-2xl hover:scale-105'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Submit revision"
                >
                  {!isSubmitting && revisedSteps.length > 0 && (
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
                        Submit Revision
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
