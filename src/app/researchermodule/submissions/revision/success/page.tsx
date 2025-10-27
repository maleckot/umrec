// app/researchermodule/submissions/revision/success/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Clock, FileText, Home, RefreshCw } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center py-12">
          <div className="text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const submissionDate = new Date(submissionData.submittedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const estimatedReviewDate = new Date(submissionData.submittedAt);
  estimatedReviewDate.setDate(estimatedReviewDate.getDate() + 10); // Revisions typically reviewed faster
  const reviewDate = estimatedReviewDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const countDocuments = () => {
    let count = 0;
    if (submissionData.step5?.fileName) count++;
    if (submissionData.step6?.fileName) count++;
    if (submissionData.step7?.fileName) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Success Header - Centered with Icon */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl animate-bounce-slow">
                  <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={3} />
                </div>
                <div className="absolute inset-0 rounded-full bg-orange-500 opacity-20 animate-ping"></div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#071139] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Revision Submitted Successfully!
            </h1>
            <p className="text-base sm:text-lg text-gray-600 px-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Your revised ethics review application has been submitted for re-review
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="space-y-6 sm:space-y-8">

              {/* Submission Details Section */}
              <div className="bg-white rounded-lg border-2 border-orange-200 overflow-hidden shadow-md">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                  <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <RefreshCw className="w-5 h-5" />
                    Revision Submission Details
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Info Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    {/* Submission Date */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shadow-sm">
                          <Calendar className="w-6 h-6 text-orange-600" strokeWidth={2} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Revision Date
                        </p>
                        <p className="text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {submissionDate}
                        </p>
                      </div>
                    </div>

                    {/* Estimated Review Date */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shadow-sm">
                          <Clock className="w-6 h-6 text-amber-600" strokeWidth={2} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Estimated Re-Review
                        </p>
                        <p className="text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {reviewDate}
                        </p>
                      </div>
                    </div>

                    {/* Sections Revised */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shadow-sm">
                          <FileText className="w-6 h-6 text-green-600" strokeWidth={2} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Sections Revised
                        </p>
                        <p className="text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {submissionData.revisedSteps?.length || 0} Updated
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Project Information */}
                  <div className="space-y-4 pt-4 border-t-2 border-orange-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Project Title:
                      </p>
                      <p className="text-sm font-semibold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submissionData.step1?.title || submissionData.step1?.protocolTitle || 'N/A'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Organization:
                        </p>
                        <p className="text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {submissionData.step1?.organization || 'Internal (UMAK)'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Revised by:
                        </p>
                        <p className="text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {submissionData.step1?.projectLeaderFirstName && submissionData.step1?.projectLeaderLastName
                            ? `${submissionData.step1.projectLeaderFirstName} ${submissionData.step1.projectLeaderLastName}`
                            : submissionData.step1?.principalInvestigator || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Status:
                        </p>
                        <p className="text-sm font-semibold text-orange-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {submissionData.status || 'Under Re-Review'}
                        </p>
                      </div>

                      {countDocuments() > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Documents Updated:
                          </p>
                          <p className="text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {countDocuments()} File(s)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Notice */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-5 rounded-r-lg">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  A confirmation email has been sent to <strong>{submissionData.step1?.projectLeaderEmail || submissionData.step1?.emailAddress || '[email]'}</strong> with your revision details. 
                  The University of Makati Research Ethics Committee will re-review your updated application and contact you regarding the outcome or any 
                  additional changes required.
                </p>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-600 p-4 sm:p-5 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  What happens next?
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <li className="flex items-start gap-2">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Your revised submission will be re-evaluated by the UMREC committee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>The committee will verify that all requested changes have been properly addressed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>You will receive updates via email on the re-review status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>If approved, you will receive your ethics clearance certificate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                    <span>You can track your revision status in your dashboard</span>
                  </li>
                </ul>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-lg">
                <h4 className="font-bold text-amber-900 text-sm sm:text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  Thank You for Your Cooperation
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Thank you for addressing the reviewer's feedback and resubmitting your application. The committee appreciates your attention to detail 
                  and commitment to ethical research standards. Re-reviews are typically completed faster than initial submissions.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleBackToDashboard}
                  className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Home className="w-5 h-5" />
                    Go Back to Dashboard
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
