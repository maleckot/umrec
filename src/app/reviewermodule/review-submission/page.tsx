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

export default function ReviewSubmissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRevisionRequested, setIsRevisionRequested] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState<any>({});
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW: State for review form from database
  const [reviewSections, setReviewSections] = useState<any[]>([]);
  const [formVersionId, setFormVersionId] = useState<string>('');

  // Load submission data
  useEffect(() => {
    if (submissionId) {
      loadSubmissionData();
    }
  }, [submissionId]);

  // ✅ NEW: Load review form from database
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

  // ✅ NEW: Load review form function
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
  // ✅ Simple validation: Check current section questions
  const currentSection = reviewSections[currentStep];
  
  // Get all visible questions (excluding conditional ones that shouldn't show)
  const visibleQuestions = currentSection.questions.filter((q: any) => {
    // If question has dependsOn, check if it should be visible
    if (q.dependsOn) {
      const dependsOnValue = reviewAnswers[q.dependsOn.id];
      return q.dependsOn.values.includes(dependsOnValue);
    }
    return true; // Always visible if no dependency
  });

  // Check if all visible questions are answered
  const unansweredQuestions = visibleQuestions.filter((q: any) => {
    const answer = reviewAnswers[q.id];
    return !answer || (typeof answer === 'string' && answer.trim() === '');
  });

  // ✅ Block if any questions are unanswered
  if (unansweredQuestions.length > 0) {
    alert('Please answer all questions before proceeding.');
    return;
  }

  // Continue to next step or submit
  if (currentStep < reviewSections.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    // Submit review
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

  // ✅ Show loading if either submission or form is loading
  if (loading || reviewSections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
        <NavbarRoles role="reviewer" />
        <div className="flex-grow flex items-center justify-center mt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!submissionData) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
        <NavbarRoles role="reviewer" />
        <div className="flex-grow flex items-center justify-center mt-24">
          <div className="text-center">
            <p className="text-gray-600 text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Submission not found
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
      <NavbarRoles role="reviewer" />

      <div className="flex-grow py-6 sm:py-8 px-4 sm:px-6 md:px-12 lg:px-20 mt-16 sm:mt-20 md:mt-24">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
          <BackButton label="Review Submission" href="/reviewermodule" />

          <SubmissionDetailsCard
            description={submissionData.title}
            category={submissionData.classification_type || 'N/A'}
            dateSubmitted={submissionData.dateSubmitted}
            dueDate={submissionData.dueDate}
            researchDescription={submissionData.research_description || 'No description provided'}
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <h3 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                Reviewing Submission
              </h3>
              <PreviewCard
                fileUrl={submissionData.pdf_url}
                filename={submissionData.pdf_filename || 'Research Document.pdf'}
              />
            </div>

            <div className="lg:col-span-2">
              <div className="mb-4">
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Step {currentStep + 1} of {reviewSections.length}
                </p>
              </div>

              <ReviewQuestionsCard
                title={reviewSections[currentStep].title}
                subtitle={reviewSections[currentStep].subtitle}
                questions={reviewSections[currentStep].questions}
                onAnswersChange={handleAnswersChange}
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleBack}
                  className="px-8 py-3 bg-gray-600 text-white text-base rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-[#101C50] text-white text-base rounded-full hover:bg-[#0d1640] transition-colors cursor-pointer"
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                >
                  {currentStep < reviewSections.length - 1 ? 'Next' : 'Submit'}
                </button>
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
