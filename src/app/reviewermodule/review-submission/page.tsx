// app/reviewermodule/review-submission/page.tsx
'use client';

import NavbarRoles from '@/components/NavbarRoles';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import BackButton from '@/components/BackButton';
import SubmissionDetailsCard from '@/components/reviewer/SubmissionDetailsCard';
import PreviewCard from '@/components/PreviewCard';
import ReviewQuestionsCard from '@/components/reviewer/ReviewQuestionsCard';
import ReviewSubmitSuccessModal from '@/components/reviewer/ReviewSubmitSuccessModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ReviewSubmissionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRevisionRequested, setIsRevisionRequested] = useState(false);
  const [reviewAnswers, setReviewAnswers] = useState<any>({});

  // Sample data
  const submissionData = {
    title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
    description: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
    category: 'Full Review',
    dateSubmitted: '08-10-2025',
    dueDate: '09-30-2025',
    researchDescription: 'This study investigates the relationship between dietary patterns and cardiovascular performance in adults aged 25-45. The research will collect data through surveys, cognitive assessments, and food diaries.',
    fileUrl: '/path/to/file.pdf',
    filename: 'Research Protocol.pdf',
  };

  // Review sections with questions - Updated with proper structure
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
      
      // Determine if revision was requested based on recommendation
      const recommendation = reviewAnswers[5]; // Question ID 5 is the recommendation
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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
      <NavbarRoles role="reviewer" />

      <div className="flex-grow py-8 px-6 md:px-12 lg:px-20 mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          <BackButton label="Review Submission" href="/reviewermodule" />

          {/* Submission Details */}
          <SubmissionDetailsCard
            description={submissionData.description}
            category={submissionData.category}
            dateSubmitted={submissionData.dateSubmitted}
            dueDate={submissionData.dueDate}
            researchDescription={submissionData.researchDescription}
          />

          {/* Two Column Layout - Adjusted proportions */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - PDF Preview (3 columns) */}
            <div className="lg:col-span-3">
              <h3 className="text-lg md:text-xl font-bold mb-4" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                Reviewing Submission
              </h3>
              <PreviewCard fileUrl={submissionData.fileUrl} filename={submissionData.filename} />
            </div>

            {/* Right Column - Review Questions (2 columns) */}
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
