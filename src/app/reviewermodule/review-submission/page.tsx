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
import { getExistingReview } from '@/app/actions/reviewer/getExistingReview';

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
      loadExistingReview();  // ✅ ADD THIS
    }
  }, [submissionId]);

  const loadExistingReview = async () => {
    try {
      const result = await getExistingReview(submissionId!);
      if (result.success && result.review) {
        // Combine protocol and consent answers
        const allAnswers = {
          ...result.review.protocol_answers,
          ...result.review.consent_answers
        };
        setReviewAnswers(allAnswers);
        console.log('✅ Existing review loaded:', allAnswers);
      }
    } catch (error) {
      console.error('Error loading existing review:', error);
    }
  };

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

  // Helper function to get section color based on type
  const getSectionColor = (section: any, index: number) => {
    // Check if it's Protocol Reviewer section (typically first sections)
    if (section.title?.toLowerCase().includes('protocol')) {
      return {
        completed: 'from-blue-600 to-blue-700',
        current: 'from-[#101C50] to-[#1a2d70]',
        ring: 'ring-[#101C50]/20',
        text: 'text-[#101C50]'
      };
    }
    // Check if it's Informed Consent section
    if (section.title?.toLowerCase().includes('consent') || section.title?.toLowerCase().includes('icf')) {
      return {
        completed: 'from-purple-600 to-purple-700',
        current: 'from-purple-600 to-purple-700',
        ring: 'ring-purple-600/20',
        text: 'text-purple-700'
      };
    }
    // Default color
    return {
      completed: 'from-green-600 to-green-700',
      current: 'from-[#101C50] to-[#1a2d70]',
      ring: 'ring-[#101C50]/20',
      text: 'text-[#101C50]'
    };
  };

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

          {/* Progress Stepper - Desktop & Tablet Only - SIMPLIFIED */}
          <div className="hidden md:block mb-8 sm:mb-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Review Progress
                </h3>
                <span className="text-sm sm:text-base font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Step {currentStep + 1} of {reviewSections.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Step Indicators - Numbers Only */}
              <div className="flex justify-between items-center gap-2">
                {reviewSections.map((section, index) => {
                  const colors = getSectionColor(section, index);
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${index < currentStep
                          ? `bg-gradient-to-br ${colors.completed} shadow-lg`
                          : index === currentStep
                            ? `bg-gradient-to-br ${colors.current} shadow-lg ring-4 ${colors.ring}`
                            : 'bg-gray-200'
                        }`}>
                        {index < currentStep ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <span className={`text-base font-bold ${index === currentStep ? 'text-white' : 'text-gray-500'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Grid - Natural height, no fixed containers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Left Side - Document Preview */}
            <div>
              <PreviewCard
                fileUrl={submissionData.pdf_url}
                filename={submissionData.pdf_filename || 'Research Document.pdf'}
              />
            </div>

            {/* Right Side - Review Questions with integrated controls */}
            <div>
              {/* Mobile Progress Indicator */}
              <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-100/50 mb-4">
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

              {/* Review Questions Card with integrated buttons and helper */}
              <ReviewQuestionsCard
                title={reviewSections[currentStep].title}
                subtitle={reviewSections[currentStep].subtitle}
                questions={reviewSections[currentStep].questions}
                onAnswersChange={handleAnswersChange}
                isLastProtocolSection={reviewSections[currentStep].isLastProtocolSection}
                isLastICFSection={reviewSections[currentStep].isLastICFSection}
                currentStep={currentStep}
                totalSteps={reviewSections.length}
                onBack={handleBack}
                onNext={handleNext}
                progressPercentage={progressPercentage}
                initialAnswers={reviewAnswers}  // ✅ ADD THIS
              />
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
