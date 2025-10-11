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
import { getSubmissionForReview } from '@/app/actions/getSubmissionForReview';

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

  useEffect(() => {
    if (submissionId) {
      loadSubmissionData();
    }
  }, [submissionId]);

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

  // Review sections with questions
  const reviewSections = [
    {
      title: 'Check the appropriate box.',
      questions: [
        {
          id: 1,
          question: '1. Is/Are the research question(s) reasonable?',
          type: 'radio' as const,
          options: ['Unable to Access', 'Yes', 'No'],
          showCommentOn: ['Unable to Access', 'No'],
        },
        {
          id: 2,
          question: 'Leave a comment.',
          type: 'textarea' as const,
          showCommentOn: ['Unable to Access', 'No'],
        },
      ],
    },
    {
      title: 'Answer the appropriate box.',
      questions: [
        {
          id: 3,
          question: '18. Do you have any concerns?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
          showCommentOn: ['Yes'],
        },
        {
          id: 4,
          question: 'Leave a comment.',
          type: 'textarea' as const,
          showCommentOn: ['Yes'],
        },
      ],
    },
    {
      title: 'Recommendation:',
      questions: [
        {
          id: 5,
          question: '',
          type: 'radio' as const,
          options: [
            'Approved with no revision',
            { 
              label: 'Approved with Minor revision/s', 
              subtext: '*The researcher may consider the suggestion/s for improvement purposes' 
            },
            { 
              label: 'Major revision/s and resubmission required', 
              subtext: '*The researcher should submit the revised protocol with compliance or justification on the review recommendations' 
            },
            'Disapproved',
          ],
          showCommentOn: ['Disapproved'],
        },
        {
          id: 6,
          question: 'Reasons for disapproval:',
          type: 'textarea' as const,
          showCommentOn: ['Disapproved'],
        },
        {
          id: 7,
          question: 'Ethics Review Recommendation:',
          type: 'textarea' as const,
        },
        {
          id: 8,
          question: 'Technical Suggestions',
          type: 'textarea' as const,
        },
      ],
    },
  ];

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

  const handleNext = () => {
    if (currentStep < reviewSections.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit review
      console.log('Review submitted with answers:', reviewAnswers);
      
      const recommendation = reviewAnswers[5];
      const needsRevision = recommendation === 'Approved with Minor revision/s' || 
                           recommendation === 'Major revision/s and resubmission required' ||
                           recommendation === 'Disapproved';
      
      setIsRevisionRequested(needsRevision);
      setShowSuccessModal(true);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push('/reviewermodule');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
        <NavbarRoles role="reviewer" />
        <div className="flex-grow flex items-center justify-center mt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading submission...
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

          {/* Submission Details */}
          <SubmissionDetailsCard
            description={submissionData.title}
            category={submissionData.classification_type || 'N/A'}
            dateSubmitted={submissionData.dateSubmitted}
            dueDate={submissionData.dueDate}
            researchDescription={submissionData.research_description || 'No description provided'}
          />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - PDF Preview */}
            <div className="lg:col-span-3">
              <h3 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                Reviewing Submission
              </h3>
              <PreviewCard 
                fileUrl={submissionData.pdf_url} 
                filename={submissionData.pdf_filename || 'Research Document.pdf'} 
              />
            </div>

            {/* Right Column - Review Questions */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Step {currentStep + 1} of {reviewSections.length}
                </p>
              </div>

              <ReviewQuestionsCard
                title={reviewSections[currentStep].title}
                questions={reviewSections[currentStep].questions}
                onAnswersChange={handleAnswersChange}
              />

              {/* Navigation Buttons */}
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

      {/* Success Modal */}
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
