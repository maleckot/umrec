// app/reviewermodule/review-submission/page.tsx
'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import Breadcrumbs from '@/components/researcher-reviewer/Breadcrumbs';
import BackButton from '@/components/researcher-reviewer/BackButton';
import SubmissionDetailsCard from '@/components/reviewer/SubmissionDetailsCard';
import PreviewCard from '@/components/researcher-reviewer/PreviewCard';
import ReviewQuestionsCard from '@/components/reviewer/ReviewQuestionsCard';
import ReviewSubmitSuccessModal from '@/components/reviewer/ReviewSubmitSuccessModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSubmissionForReview } from '@/app/actions/reviewer/getSubmissionForReview';
import { submitReview } from '@/app/actions/reviewer/submitReview';
import { getReviewForm } from '@/app/actions/reviewer/getReviewForm';
import { Suspense } from 'react';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, FileText, Calendar } from 'lucide-react';

function ReviewSubmissionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRevisionRequested, setIsRevisionRequested] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState<any>({});
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [reviewSections, setReviewSections] = useState<any[]>([]);
  const [formVersionId, setFormVersionId] = useState<string>('');

  useEffect(() => {
    if (submissionId) {
      loadSubmissionData();
    }
  }, [submissionId]);

  useEffect(() => {
    loadReviewForm();
  }, []);

  const loadSubmissionData = async () => {
    setLoading(true);
    try {
      const result = await getSubmissionForReview(submissionId!);
      if (result.success) {
        setSubmissionData(result.data);
      } else {
        console.error('Failed to load submission:', result.error);
      }
    } catch (error) {
      console.error('Error loading submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviewForm = async () => {
    try {
      const result = await getReviewForm();
      if (result.success && result.sections && result.formVersion) {
        setReviewSections(result.sections);
        setFormVersionId(result.formVersion.id);
      } else {
        console.error('Failed to load review form:', result.error);
        alert('Failed to load review form: ' + result.error);
      }
    } catch (error) {
      console.error('Error loading review form:', error);
      alert('Error loading review form');
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/reviewermodule' },
    { label: 'Review Submission' },
  ];

  const handleAnswersChange = (answers: any) => {
    setReviewAnswers({ ...reviewAnswers, ...answers });
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/reviewermodule');
    }
  };

  const handleNext = async () => {
    const currentSection = reviewSections[currentStep];

    const visibleQuestions = currentSection.questions.filter((q: any) => {
      if (q.dependsOn) {
        const dependsOnValue = reviewAnswers[q.dependsOn.id];
        return q.dependsOn.values.includes(dependsOnValue);
      }
      return true;
    });

    const unansweredQuestions = visibleQuestions.filter((q: any) => {
      const answer = reviewAnswers[q.id];
      return !answer || (typeof answer === 'string' && answer.trim() === '');
    });

    if (unansweredQuestions.length > 0) {
      alert('Please answer all questions before proceeding.');
      return;
    }

    if (currentStep < reviewSections.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const result = await submitReview(submissionId!, reviewAnswers, formVersionId);

      if (result.success) {
        const needsRevision =
          reviewAnswers.recommendation === 'Approved with Minor revision/s' ||
          reviewAnswers.recommendation === 'Major revision/s and resubmission required' ||
          reviewAnswers.recommendation === 'Disapproved';

        setIsRevisionRequested(needsRevision);
        setShowSuccessModal(true);
      } else {
        alert('Failed to submit review: ' + result.error);
      }
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push('/reviewermodule');
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / reviewSections.length) * 100;

  if (loading || reviewSections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="flex-grow flex items-center justify-center mt-24">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#101C50]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#101C50] border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-700 text-lg font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading review form...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!submissionData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="flex-grow flex items-center justify-center mt-24">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-red-600" />
            </div>
            <p className="text-gray-700 text-xl font-bold mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Submission Not Found
            </p>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              The requested submission could not be loaded.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="flex-grow py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24 mt-16 sm:mt-20 md:mt-24">
        <div className="max-w-[1800px] mx-auto">
          {/* Breadcrumbs and Back Button */}
          <div className="mb-6 sm:mb-8">
            <Breadcrumbs items={breadcrumbItems} />
            <BackButton label="Back to Reviews" href="/reviewermodule" />
          </div>

          {/* Submission Details Card */}
          <div className="mb-8">
            <SubmissionDetailsCard
              description={submissionData.title}
              category={submissionData.classification_type || 'N/A'}
              dateSubmitted={submissionData.dateSubmitted}
              dueDate={submissionData.dueDate}
              researchDescription={submissionData.research_description || 'No description provided'}
            />
          </div>

          {/* Progress Stepper - Desktop & Tablet Only */}
          <div className="hidden md:block mb-8 sm:mb-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Review Progress
                </h3>
                <span className="text-sm sm:text-base font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {currentStep + 1} of {reviewSections.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Step Indicators */}
              <div className="relative flex justify-between">
                {reviewSections.map((section, index) => (
                  <div key={index} className="flex flex-col items-center" style={{ width: `${100 / reviewSections.length}%` }}>
                    <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index < currentStep 
                        ? 'bg-gradient-to-br from-green-600 to-green-700 shadow-lg' 
                        : index === currentStep 
                        ? 'bg-gradient-to-br from-[#101C50] to-[#1a2d70] shadow-lg ring-4 ring-[#101C50]/20' 
                        : 'bg-gray-200'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <span className={`text-sm sm:text-base font-bold ${index === currentStep ? 'text-white' : 'text-gray-500'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <p className={`mt-2 sm:mt-3 text-xs sm:text-sm text-center font-semibold ${
                      index === currentStep ? 'text-[#101C50]' : 'text-gray-500'
                    }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {section.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left Side - Document Preview */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                  <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                  Reviewing Submission
                </h3>
              </div>
              <PreviewCard
                fileUrl={submissionData.pdf_url}
                filename={submissionData.pdf_filename || 'Research Document.pdf'}
              />
            </div>

            {/* Right Side - Review Questions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mobile Progress Indicator */}
              <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-100/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Progress
                  </span>
                  <span className="text-sm font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Step {currentStep + 1} of {reviewSections.length}
                  </span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Review Questions Card */}
              <ReviewQuestionsCard
                title={reviewSections[currentStep].title}
                subtitle={reviewSections[currentStep].subtitle}
                questions={reviewSections[currentStep].questions}
                onAnswersChange={handleAnswersChange}
                isLastProtocolSection={reviewSections[currentStep].isLastProtocolSection}
                isLastICFSection={reviewSections[currentStep].isLastICFSection}
              />

              {/* Navigation Buttons */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100/50">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm sm:text-base rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all font-bold flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white text-sm sm:text-base rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all font-bold flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    {currentStep < reviewSections.length - 1 ? (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>

                {/* Step Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <span className="font-medium">
                      {currentStep === 0 ? 'First Step' : currentStep === reviewSections.length - 1 ? 'Final Step' : `Step ${currentStep + 1}`}
                    </span>
                    <span className="font-semibold text-[#101C50]">
                      {Math.round(progressPercentage)}% Complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Helper Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-200/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-blue-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Review Tip
                    </p>
                    <p className="text-xs sm:text-sm text-blue-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {currentStep === reviewSections.length - 1 
                        ? 'This is the final section. Review your answers before submitting.'
                        : 'Answer all questions in this section to proceed to the next step.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewSubmitSuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        submissionTitle={submissionData.title}
        isRevisionRequested={isRevisionRequested}
      />
      <Footer />
    </div>
  );
}

export default function ReviewSubmissionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="flex-grow flex items-center justify-center mt-24">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[#101C50]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#101C50] border-t-transparent animate-spin"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <ReviewSubmissionContent />
    </Suspense>
  );
}
