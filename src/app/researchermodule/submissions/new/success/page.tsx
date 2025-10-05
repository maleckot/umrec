// app/researchermodule/submissions/new/success/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Clock, FileText } from 'lucide-react';
import Footer from '@/components/Footer';
import NavbarRoles from '@/components/NavbarRoles';

export default function SubmissionSuccess() {
  const router = useRouter();
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lastSubmission = localStorage.getItem('lastSubmission');
    if (lastSubmission) {
      setSubmissionData(JSON.parse(lastSubmission));
    } else {
      router.push('/researchermodule/submissions');
    }
    setIsLoading(false);
  }, [router]);

  const handleBackToDashboard = () => {
    router.push('/researchermodule/submissions');
  };

  if (isLoading || !submissionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#071139]"></div>
      </div>
    );
  }

  const submissionDate = new Date(submissionData.submittedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const estimatedReviewDate = new Date(submissionData.submittedAt);
  estimatedReviewDate.setDate(estimatedReviewDate.getDate() + 14);
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
      <NavbarRoles role="researcher" />
      
      {/* Add padding-top to account for fixed navbar height */}
      <div className="py-8 px-6 md:px-12 lg:px-20 mt-24">
        {/* Centered Success Header with spacing */}
        <div className="text-center mt-16 mb-24">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#FFD700] flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Submission Successful
          </h1>
          <p className="text-base sm:text-lg text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Your ethics review application has been submitted successfully.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-8 ">
          <div className="space-y-6">

            {/* Submission Details Section */}
            <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <div className="bg-[#071139] p-4">
                <h3 className="text-white font-bold text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Submission Details
                </h3>
              </div>
              
              <div className="p-4 sm:p-6">
                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {/* Submission Date */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-[#071139]" strokeWidth={2} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#64748B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Submission Date
                      </p>
                      <p className="text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submissionDate}
                      </p>
                    </div>
                  </div>

                  {/* Estimated Review Date */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-[#FFD700]" strokeWidth={2} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#64748B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Estimated Review Date
                      </p>
                      <p className="text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {reviewDate}
                      </p>
                    </div>
                  </div>

                  {/* Documents Uploaded */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-600" strokeWidth={2} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#64748B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Documents Uploaded
                      </p>
                      <p className="text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {countDocuments()} Documents
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-[#64748B] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Project Title:
                    </p>
                    <p className="text-sm font-medium text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {submissionData.step1?.protocolTitle || 'N/A'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#64748B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Organization:
                      </p>
                      <p className="text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {submissionData.step1?.organization || 'Internal (UMAK)'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#64748B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Submitted by:
                      </p>
                      <p className="text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Project Leader {submissionData.step1?.principalInvestigator || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#64748B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        College:
                      </p>
                      <p className="text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        College of Computing and Information Sciences
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                A confirmation email has been sent to <strong>{submissionData.step1?.emailAddress || '[email]'}</strong> with your submission details. 
                The University of Makati Research Ethics Committee will review your application and contact you regarding the next steps or any 
                additional information required.
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={handleBackToDashboard}
                className="px-8 py-3 bg-[#071139] text-white rounded-lg hover:bg-[#0a1d5e] transition-all duration-200 shadow-md hover:shadow-lg text-sm font-semibold"
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
