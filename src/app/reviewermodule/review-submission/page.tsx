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

  // Complete review sections with all UMREC questions
  const reviewSections = [
    {
      title: 'Protocol Review - Research Design & Methodology',
      questions: [
        {
          id: 'q1',
          question: '1. Is/Are the research question(s) reasonable?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q1_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q1', values: ['No', 'Unable to Assess'] },
        },
        {
          id: 'q2',
          question: '2. Are the study objectives specific, measurable, attainable, and reasonable?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q2_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q2', values: ['No', 'Unable to Assess'] },
        },
        {
          id: 'q3',
          question: '3. Is the research methodology appropriate?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q3_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q3', values: ['No', 'Unable to Assess'] },
        },
      ],
    },
    {
      title: 'Protocol Review - Participants & Background',
      questions: [
        {
          id: 'q4',
          question: '4. Does the research need to be carried out with human participants?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q4_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q4', values: ['No', 'Unable to Assess'] },
        },
        {
          id: 'q5',
          question: '5. Does the protocol present sufficient background information or results of previous studies prior to human experimentation?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q5_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q5', values: ['No', 'Unable to Assess'] },
        },
      ],
    },
    {
      title: 'Protocol Review - Vulnerable Populations',
      questions: [
        {
          id: 'q6',
          question: '6. Does the study involve individuals who are vulnerable?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q6_comment',
          question: 'If YES, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q6', values: ['Yes'] },
        },
        {
          id: 'q7',
          question: '7. Are appropriate mechanisms in place to protect the vulnerable potential participants?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess', 'N/A'],
        },
        {
          id: 'q7_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q7', values: ['No', 'Unable to Assess'] },
        },
      ],
    },
    {
      title: 'Protocol Review - Risks & Benefits',
      questions: [
        {
          id: 'q8',
          question: '8. Are there probable risks to the human participants in the study?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q8_comment',
          question: 'If YES, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q8', values: ['Yes'] },
        },
        {
          id: 'q9',
          question: '9. What are the risks? Are these identified in the protocol?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q9_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q9', values: ['No', 'Unable to Assess'] },
        },
        {
          id: 'q9b',
          question: '● Are the possible benefits identified in the protocol?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q9b_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q9b', values: ['No', 'Unable to Assess'] },
        },
        {
          id: 'q10',
          question: '10. Does the protocol adequately address the risk/benefit balance?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q10_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q10', values: ['No', 'Unable to Assess'] },
        },
      ],
    },
    {
      title: 'Protocol Review - Privacy & Data Protection',
      questions: [
        {
          id: 'q11',
          question: '11. Does the protocol address issues of privacy and confidentiality? Is there a Data Protection Plan?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q11_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q11', values: ['No', 'Unable to Assess'] },
        },
      ],
    },
    {
      title: 'Protocol Review - Technical Aspects',
      questions: [
        {
          id: 'q12',
          question: '12. Are toxicological and pharmacological data adequate?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'N/A'],
        },
        {
          id: 'q12_comment',
          question: 'If NO, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q12', values: ['No'] },
        },
        {
          id: 'q13',
          question: '13. Is the informed consent procedure/form adequate and culturally appropriate?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'q13_comment',
          question: 'If NO, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q13', values: ['No'] },
        },
      ],
    },
    {
      title: 'Protocol Review - Researcher Qualifications',
      questions: [
        {
          id: 'q14',
          question: '14. Are the proponents adequately trained and do they have sufficient experience?',
          type: 'radio' as const,
          options: ['Yes', 'No', 'Unable to Assess'],
        },
        {
          id: 'q14_comment',
          question: 'If NO or UNABLE TO ASSESS, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q14', values: ['No', 'Unable to Assess'] },
        },
        {
          id: 'q15',
          question: '15. Does the protocol describe community engagement/consultation prior to and during the conduct of research?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'q15_comment',
          question: 'If NO, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q15', values: ['No'] },
        },
      ],
    },
    {
      title: 'Protocol Review - Dissemination & Facilities',
      questions: [
        {
          id: 'q16',
          question: '16. Does the protocol include strategies to be used in disseminating/ensuring utilization of the expected research results?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'q16_comment',
          question: 'If NO, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q16', values: ['No'] },
        },
        {
          id: 'q17',
          question: '17. Is the research facility appropriate?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'q17_comment',
          question: 'If NO, please comment:',
          type: 'textarea' as const,
          dependsOn: { id: 'q17', values: ['No'] },
        },
        {
          id: 'q18',
          question: '18. Do you have any other concerns?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'q18_comment',
          question: 'If YES, please describe:',
          type: 'textarea' as const,
          dependsOn: { id: 'q18', values: ['Yes'] },
        },
      ],
    },
    {
      title: 'Informed Consent Review - Part 1',
      questions: [
        {
          id: 'icf_q1',
          question: '1. Is it necessary to seek the informed consent of the participants?',
          type: 'radio' as const,
          options: ['Unable to Assess', 'Yes', 'No'],
        },
        {
          id: 'icf_q1_explain',
          question: 'If NO, please explain:',
          type: 'textarea' as const,
          dependsOn: { id: 'icf_q1', values: ['No'] },
        },
      ],
    },
    {
      title: 'Informed Consent - Information Provided (Part 1)',
      subtitle: 'If YES to Question 1, are the participants provided with sufficient information about:',
      questions: [
        {
          id: 'icf_purpose',
          question: '● Purpose of the study?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_duration',
          question: '● Expected duration of participation?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_procedures',
          question: '● Procedures to be carried out?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_discomforts',
          question: '● Discomforts and inconveniences?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_risks',
          question: '● Risks (including possible discrimination)?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
      ],
    },
    {
      title: 'Informed Consent - Information Provided (Part 2)',
      questions: [
        {
          id: 'icf_benefits',
          question: '● Benefit to the participants?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_compensation',
          question: '● Compensation and/or medical treatments in case of injury?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_contact',
          question: '● Who to contact for questions/assistance?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_withdrawal',
          question: '● Voluntary participation and withdrawal?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_confidentiality',
          question: '● Extent of confidentiality?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_data_protection',
          question: '● Data protection plan?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
      ],
    },
    {
      title: 'Informed Consent - Final Questions',
      questions: [
        {
          id: 'icf_q2',
          question: '2. Is the informed consent written in simple language?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_q3',
          question: '3. Does the protocol ensure consent is voluntary?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_q4',
          question: '4. Do you have any other concerns?',
          type: 'radio' as const,
          options: ['Yes', 'No'],
        },
        {
          id: 'icf_q4_concerns',
          question: 'If YES, please describe:',
          type: 'textarea' as const,
          dependsOn: { id: 'icf_q4', values: ['Yes'] },
        },
      ],
    },
    {
      title: 'Final Recommendation',
      questions: [
        {
          id: 'recommendation',
          question: 'Select your recommendation:',
          type: 'radio' as const,
          options: [
            'Approved with no revision',
            {
              label: 'Approved with Minor revision/s',
              subtext: '*The researcher may consider the suggestion for improvement purposes',
            },
            {
              label: 'Major revision/s and resubmission required',
              subtext: '*The researcher should submit the revised protocol with compliance',
            },
            'Disapproved',
          ],
        },
        {
          id: 'disapproval_reasons',
          question: 'Reasons for disapproval:',
          type: 'textarea' as const,
          dependsOn: { id: 'recommendation', values: ['Disapproved'] },
        },
        {
          id: 'ethics_recommendation',
          question: 'Ethics Review Recommendation:',
          type: 'textarea' as const,
          required: true,
        },
        {
          id: 'technical_suggestions',
          question: 'Technical Suggestions:',
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

  const handleNext = async () => {
    if (currentStep < reviewSections.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit review
      console.log('Submitting review with answers:', reviewAnswers);
      
      const result = await submitReview(submissionId!, reviewAnswers);
      
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
