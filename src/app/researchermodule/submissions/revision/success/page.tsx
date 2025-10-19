// app/researchermodule/submissions/revision/success/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Clock, FileText, RefreshCw } from 'lucide-react';
import Footer from '@/components/researcher-reviewer/Footer';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';

export default function RevisionSuccess() {
  const router = useRouter();
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lastSubmission = localStorage.getItem('lastRevisionSubmission');
    if (lastSubmission) {
      setSubmissionData(JSON.parse(lastSubmission));
    } else {
      router.push('/researchermodule');
    }
    setIsLoading(false);
  }, [router]);

  const handleBackToDashboard = () => {
    // Clear last submission
    localStorage.removeItem('lastRevisionSubmission');

    // Clear all revision step data (Steps 1-7)
    for (let i = 1; i <= 7; i++) {
      localStorage.removeItem(`revisionStep${i}Data`);
    }

    // Clear sessionStorage files
    sessionStorage.removeItem('revisionStep5File');
    sessionStorage.removeItem('revisionStep6File');
    sessionStorage.removeItem('revisionStep7File');

    router.push('/researchermodule');
  };

  if (isLoading || !submissionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  const submissionDate = new Date(submissionData.submittedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const estimatedReviewDate = new Date(submissionData.submittedAt);
  estimatedReviewDate.setDate(estimatedReviewDate.getDate() + 7); // Faster review for revisions
  const reviewDate = estimatedReviewDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const countDocuments = () => {
    let count = 0;
    if (submissionData.step5?.fileName) count++;
    if (submissionData.step6?.fileName) count++;
    if (submissionData.step7?.fileName) count++;
    return count;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E8EEF3' }}>
      <NavbarRoles role="researcher" />

      <div className="py-6 sm:py-8 px-4 sm:px-6 md:px-12 lg:px-20 mt-16 sm:mt-20 md:mt-24">
        {/* Centered Success Header with responsive spacing */}
        <div className="text-center mt-6 sm:mt-10 md:mt-16 mb-12 sm:mb-16 md:mb-24">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E293B] mb-2 sm:mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Revision Submitted Successfully
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#64748B] px-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Your revised ethics review application has been resubmitted for re-evaluation.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 pb-8 sm:pb-12 mt-4 sm:mt-6 md:mt-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Revision Summary Badge */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-amber-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Revision Status
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    You have successfully submitted revisions for <strong>{submissionData.revisedSteps?.length || 0} section(s)</strong>.
                    The ethics committee will review your changes and provide feedback soon.
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Details Section - Border changed to gray-200 */}
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-amber-600 p-3 sm:p-4">
                <h3 className="text-white font-bold text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Revision Submission Details
                </h3>
              </div>

              <div className="p-4 sm:p-6">
                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {/* Submission Date */}
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#64748B] mb-0.5 sm:mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Resubmission Date
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submissionDate}
                      </p>
                    </div>
                  </div>

                  {/* Estimated Review Date */}
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#64748B] mb-0.5 sm:mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Estimated Review Date
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {reviewDate}
                      </p>
                    </div>
                  </div>

                  {/* Documents Updated */}
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#64748B] mb-0.5 sm:mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Documents Updated
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {countDocuments()} Document(s)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Revised Sections */}
                {submissionData.revisedSteps && submissionData.revisedSteps.length > 0 && (
                  <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                    <p className="text-xs text-[#64748B] mb-2 sm:mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Sections Revised:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {submissionData.revisedSteps.map((step: number) => (
                        <span
                          key={step}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300"
                          style={{ fontFamily: 'Metropolis, sans-serif' }}
                        >
                          Step {step}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Information */}
                <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-[#64748B] mb-1 sm:mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Project Title:
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {submissionData.step1?.title || submissionData.step1?.protocolTitle || 'N/A'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs text-[#64748B] mb-0.5 sm:mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Organization:
                      </p>
                      <p className="text-xs sm:text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submissionData.step1?.organization || 'Internal (UMAK)'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#64748B] mb-0.5 sm:mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Submitted by:
                      </p>
                      <p className="text-xs sm:text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submissionData.step1?.projectLeaderFirstName && submissionData.step1?.projectLeaderLastName
                          ? `${submissionData.step1.projectLeaderFirstName} ${submissionData.step1.projectLeaderLastName}`
                          : submissionData.step1?.principalInvestigator || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#64748B] mb-0.5 sm:mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        College:
                      </p>
                      <p className="text-xs sm:text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submissionData.step2?.college || submissionData.step1?.college || 'College of Computing and Information Sciences'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#64748B] mb-0.5 sm:mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Submission Status:
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-amber-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submissionData.status || 'Under Revision'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-3 sm:p-4 md:p-6 rounded-lg">
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                A confirmation email has been sent to{' '}
                <strong>{submissionData.step1?.projectLeaderEmail || submissionData.step1?.emailAddress || '[email]'}</strong> with your
                revision submission details. The University of Makati Research Ethics Committee will re-evaluate your revised application and
                contact you regarding their decision or any additional information required.
              </p>
            </div>

            {/* What's Next Section */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 sm:p-4 md:p-6 rounded-lg">
              <h4 className="text-sm sm:text-base font-bold text-amber-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                What Happens Next?
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 flex-shrink-0">1.</span>
                  <span>The ethics committee will review your revisions against their original feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 flex-shrink-0">2.</span>
                  <span>You'll receive an email notification about the revision status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 flex-shrink-0">3.</span>
                  <span>Track your submission status in your researcher dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 flex-shrink-0">4.</span>
                  <span>If approved, you'll receive an official ethics clearance certificate</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-2 sm:pt-4 pb-4 sm:pb-8">
              <button
                onClick={handleBackToDashboard}
                className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg text-base sm:text-lg font-semibold"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Go back to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
