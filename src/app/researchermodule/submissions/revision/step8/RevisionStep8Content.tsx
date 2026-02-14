'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { submitRevisionApplication } from '@/app/actions/researcher/submitRevisionApplication';

// UI Components
import Step8Header from '@/components/researcher/submission/revision/step8/Step8Header';
import AlertBanner from '@/components/researcher/submission/revision/step8/AlertBanner';
import RevisionSummary from '@/components/researcher/submission/revision/step8/RevisionSummary';
import ResearcherDetailsSection from '@/components/researcher/submission/revision/step8/ResearcherDetailsSection';
import ApplicationReviewSection from '@/components/researcher/submission/revision/step8/ApplicationReviewSection';
import ProtocolSection from '@/components/researcher/submission/revision/step8/ProtocolSection';
import ConsentFormSection from '@/components/researcher/submission/revision/step8/ConsentFormSection';
import LoadingIndicator from '@/components/researcher/submission/revision/step8/LoadingIndicator';
import DeclarationNotice from '@/components/researcher/submission/revision/step8/DeclarationNotice';
import NavigationButtons from '@/components/researcher/submission/revision/step8/NavigationButtons';

export default function RevisionStep8Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allData, setAllData] = useState<any>({});
  const [revisedSteps, setRevisedSteps] = useState<number[]>([]);
  const isInitialMount = useRef(true);

  // Revision Comments Logic
  const [, setRevisionComments] = useState<string>('');
  const [, setLoadingComments] = useState(true);

  useEffect(() => {
    setIsClient(true);

    if (!submissionId) {
      if (!isInitialMount.current) {
        alert('No submission ID found. Redirecting...');
        router.push('/researchermodule/submissions');
      }
      return;
    }

    // Load Data
    const step1 = JSON.parse(localStorage.getItem('revisionStep1Data') || '{}');
    const step2 = JSON.parse(localStorage.getItem('revisionStep2Data') || '{}');
    const coResearchers = JSON.parse(localStorage.getItem('revisionStep2CoResearchers') || '[]');
    const technicalAdvisers = JSON.parse(localStorage.getItem('revisionStep2TechnicalAdvisers') || '[]');
    step2.coResearchers = coResearchers;
    step2.technicalAdvisers = technicalAdvisers;

    const step3 = JSON.parse(localStorage.getItem('revisionStep3Data') || '{}');
    const step4 = JSON.parse(localStorage.getItem('revisionStep4Data') || '{}');
    const step5 = JSON.parse(localStorage.getItem('revisionStep5Data') || '{}');
    const step6 = JSON.parse(localStorage.getItem('revisionStep6Data') || '{}');
    const step7 = JSON.parse(localStorage.getItem('revisionStep7Data') || '{}');

    setAllData({ step1, step2, step3, step4, step5, step6, step7 });

    const revised: number[] = [];
    if (Object.keys(step1).length > 0) revised.push(1);
    if (Object.keys(step2).length > 0 && Object.keys(step2).length > 2) revised.push(2);
    if (Object.keys(step3).length > 0) revised.push(3);
    if (Object.keys(step4).length > 0) revised.push(4);
    if (Object.keys(step5).length > 0) revised.push(5);
    if (Object.keys(step6).length > 0) revised.push(6);
    if (Object.keys(step7).length > 0) revised.push(7);
    setRevisedSteps(revised);

    // Fetch Comments Logic
    const fetchComments = async () => {
      setLoadingComments(true);
      const supabase = createClient();
      try {
        const { data: reviews } = await supabase
          .from('reviews')
          .select(`protocol_recommendation, protocol_technical_suggestions, icf_recommendation, icf_technical_suggestions`)
          .eq('submission_id', submissionId)
          .eq('status', 'submitted');

        if (reviews && reviews.length > 0) {
          const allComments = reviews.map((review, index) => {
            let text = `**Reviewer ${index + 1} Comments:**\n`;
            if (review.protocol_recommendation) text += `\n📋 **Protocol:** ${review.protocol_recommendation}\n`;
            if (review.protocol_technical_suggestions) text += `💡 **Protocol Suggestions:** ${review.protocol_technical_suggestions}\n`;
            if (review.icf_recommendation) text += `\n📋 **ICF:** ${review.icf_recommendation}\n`;
            if (review.icf_technical_suggestions) text += `💡 **ICF Suggestions:** ${review.icf_technical_suggestions}\n`;
            return text;
          }).join('\n---\n');
          setRevisionComments(allComments);
        } else {
          setRevisionComments('No reviewer comments available.');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setRevisionComments('Unable to load feedback comments.');
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
    isInitialMount.current = false;
  }, [submissionId, router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!submissionId) {
      alert('Error: Submission ID is missing. Cannot submit.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Process Signatures
      let processedStep3 = allData.step3;
      if (allData.step3?.researchers && Array.isArray(allData.step3.researchers)) {
        const researchersWithBase64 = allData.step3.researchers.map((r: any) => ({
          id: r.id,
          name: r.name,
          signatureBase64: typeof window !== 'undefined' ? (sessionStorage.getItem(`signature_${r.id}`) || null) : null
        }));
        processedStep3 = { ...allData.step3, researchers: researchersWithBase64 };
      }

      const revisionData = {
        ...allData,
        step3: processedStep3,
        revisedSteps: revisedSteps,
        revisionSubmittedAt: new Date().toISOString(),
      };

      const files = {
        step2TechnicalReview: sessionStorage.getItem('revisionStep2File') || undefined,
        step5: sessionStorage.getItem('revisionStep5File') || undefined,
        step6: sessionStorage.getItem('revisionStep6File') || undefined,
        step7: sessionStorage.getItem('revisionStep7File') || undefined,
      };

      const result = await submitRevisionApplication(submissionId, revisionData, files);

      if (!result.success) {
        // @ts-ignore
        throw new Error(result.error || 'Revision submission failed');
      }

      // Cleanup
      sessionStorage.removeItem('revisionStep2File');
      sessionStorage.removeItem('revisionStep5File');
      sessionStorage.removeItem('revisionStep6File');
      sessionStorage.removeItem('revisionStep7File');
      allData.step3?.researchers?.forEach((r: any) => sessionStorage.removeItem(`signature_${r.id}`));
      for (let i = 1; i <= 7; i++) localStorage.removeItem(`revisionStep${i}Data`);
      localStorage.removeItem('step2CoResearchers');
      localStorage.removeItem('step2TechnicalAdvisers');

      const submissionData = {
        submissionId: result.submissionId,
        revisedSteps,
        ...allData,
        submittedAt: new Date().toISOString(),
        status: 'pending_revision',
      };
      localStorage.setItem('lastRevisionSubmission', JSON.stringify(submissionData));

      router.push('/researchermodule/submissions/revision/success');
    } catch (error) {
      console.error('Revision submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit revision. Please try again.';
      alert(`Error: ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (!submissionId) return;
    router.push(`/researchermodule/submissions/revision/step7?id=${submissionId}`);
  };

  const handleEdit = (step: number) => {
    if (!submissionId) return;
    router.push(`/researchermodule/submissions/revision/step${step}?id=${submissionId}`);
  };

  // Helper Functions
  const stripHtmlTags = (html: string) => {
    if (!isClient) return '...';
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
      return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
    });
    return formattedTypes.join(', ');
  };

  if (!isClient) return null;

  return (
    <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
      <div className="max-w-[1400px] mx-auto">
        
        <Step8Header onBack={handleBack} />

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
          
          <AlertBanner />

          <RevisionSummary revisedCount={revisedSteps.length} />

          <div className="space-y-6 sm:space-y-8">
            
            {revisedSteps.includes(1) && (
              <ResearcherDetailsSection 
                data={allData.step1} 
                onEdit={() => handleEdit(1)} 
              />
            )}

            {revisedSteps.includes(2) && (
              <ApplicationReviewSection 
                data={allData} // Passing full data because step 2 needs step 5,6,7 file info
                onEdit={() => handleEdit(2)}
                formatTypeOfStudy={formatTypeOfStudy}
              />
            )}

            {revisedSteps.includes(3) && (
              <ProtocolSection 
                data={allData.step3} 
                onEdit={() => handleEdit(3)}
                stripHtml={stripHtmlTags}
              />
            )}

            {revisedSteps.includes(4) && (
              <ConsentFormSection 
                data={allData.step4} 
                onEdit={() => handleEdit(4)}
                getLabel={getConsentTypeLabel}
              />
            )}

            {isSubmitting && <LoadingIndicator />}

            <DeclarationNotice />

            <NavigationButtons 
              onBack={handleBack} 
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting} 
              hasRevisions={revisedSteps.length > 0} 
            />

          </div>
        </div>
      </div>
    </div>
  );
}
