'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { handleRevisionSubmit } from '@/app/actions/lib/saveStep2';

// Import New Components
import ErrorModal from '@/components/researcher/submission/revision/step2/ErrorModal';
import RevisionCommentBox from '@/components/researcher/submission/revision/step2/RevisionCommentBox';
import Step2Header from '@/components/researcher/submission/revision/step2/Step2Header';
import GeneralInfoSection from '@/components/researcher/submission/revision/step2/GeneralInfoSection';
import StudyDetailsSection from '@/components/researcher/submission/revision/step2/StudyDetailsSection';
import TechnicalReviewSection from '@/components/researcher/submission/revision/step2/TechnicalReviewSection';
import DocumentChecklistSection from '@/components/researcher/submission/revision/step2/DocumentChecklistSection';

// Types
interface FormDataType {
  title: string;
  studySiteType: string;
  studySite: string;
  researcherFirstName: string;
  researcherMiddleName: string;
  researcherLastName: string;
  project_leader_email: string;
  faxNo: string;
  telNo: string;
  project_leader_contact: string;
  college: string;
  institution: string;
  institutionAddress: string;
  typeOfStudy: string[];
  typeOfStudyOthers: string;
  sourceOfFunding: string[];
  pharmaceuticalSponsor: string;
  fundingOthers: string;
  startDate: string;
  endDate: string;
  numParticipants: string;
  technicalReview: string;
  submittedToOther: string;
  hasApplicationForm: boolean;
  hasResearchProtocol: boolean;
  hasInformedConsent: boolean;
  hasInformedConsentOthers: boolean;
  informedConsentOthers: string;
  hasAssentForm: boolean;
  hasAssentFormOthers: boolean;
  assentFormOthers: string;
  hasEndorsementLetter: boolean;
  hasQuestionnaire: boolean;
  hasTechnicalReview: boolean;
  hasDataCollectionForms: boolean;
  hasProductBrochure: boolean;
  hasFDAAuthorization: boolean;
  hasCompanyPermit: boolean;
  hasSpecialPopulationPermit: boolean;
  specialPopulationPermitDetails: string;
  hasOtherDocs: boolean;
  otherDocsDetails: string;
  technicalReviewFile: File | { name: string; url: string; size?: number } | null;
}

const typeOfStudyMap: Record<string, string> = {
  'genetic': 'genetic',
  'stem_cell': 'stem_cell',
  'biomedical': 'biomedical',
  'public_health': 'public_health',
  'social_behavioral': 'social_behavioral',
  'health_operations': 'health_operations',
  'clinical_trial_researcher': 'clinical_trial_researcher',
  'clinical_trial_sponsored': 'clinical_trial_sponsored',
  'others': 'others',
};

const sourceOfFundingMap: Record<string, string> = {
  'self_funded': 'self_funded',
  'government': 'government',
  'scholarship': 'scholarship',
  'institution': 'institution',
  'pharmaceutical': 'pharmaceutical',
  'others': 'others',
};

const mapStoredValuesToOptions = (storedValue: any, mapObject: Record<string, string>) => {
  if (!storedValue) return [];
  if (Array.isArray(storedValue)) {
    return storedValue.map(v => mapObject[v] || v).filter(Boolean);
  }
  if (typeof storedValue === 'string') {
    return [mapObject[storedValue] || storedValue].filter(Boolean);
  }
  return [];
};

function RevisionStep2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const docId = searchParams.get('docId');
  const docType = searchParams.get('docType');

  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [revisionComments, setRevisionComments] = useState('');

  const isQuickRevision = !!docId && docType === 'application_form';

  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    studySiteType: '',
    studySite: '',
    researcherFirstName: '',
    researcherMiddleName: '',
    researcherLastName: '',
    project_leader_email: '',
    project_leader_contact: '',
    telNo: '',
    faxNo: 'N/A',
    college: '',
    institution: 'University of Makati',
    institutionAddress: '',
    typeOfStudy: [],
    typeOfStudyOthers: '',
    sourceOfFunding: [],
    pharmaceuticalSponsor: '',
    fundingOthers: '',
    startDate: '',
    endDate: '',
    numParticipants: '',
    technicalReview: '',
    technicalReviewFile: null,
    submittedToOther: '',
    hasApplicationForm: true,
    hasResearchProtocol: false,
    hasInformedConsent: false,
    hasInformedConsentOthers: false,
    informedConsentOthers: '',
    hasAssentForm: false,
    hasAssentFormOthers: false,
    assentFormOthers: '',
    hasEndorsementLetter: false,
    hasQuestionnaire: false,
    hasTechnicalReview: false,
    hasDataCollectionForms: false,
    hasProductBrochure: false,
    hasFDAAuthorization: false,
    hasCompanyPermit: false,
    hasSpecialPopulationPermit: false,
    specialPopulationPermitDetails: '',
    hasOtherDocs: false,
    otherDocsDetails: '',
  });

  const [coResearchers, setCoResearchers] = useState<Array<{ name: string; contact: string; email: string }>>([{ name: '', contact: '', email: '' }]);
  const [technicalAdvisers, setTechnicalAdvisers] = useState<Array<{ name: string; contact: string; email: string }>>([{ name: '', contact: '', email: '' }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorList, setErrorList] = useState<string[]>([]);

  const umakColleges = [
    'College of Liberal Arts and Sciences (CLAS)',
    'College of Human Kinetics (CHK)',
    'College of Business and Financial Science (CBFS)',
    'College of Computing and Information Sciences (CCIS)',
    'College of Construction Sciences and Engineering (CCSE)',
    'College of Governance and Public Policy (CGPP)',
    'College of Engineering Technology (CET)',
    'College of Tourism and Hospitality Management (CTHM)',
    'College of Innovative Teacher Education (CITE)',
    'College of Continuing, Advanced and Professional Studies (CCAPS)',
    'Institute of Arts and Design (IAD)',
    'Institute of Accountancy (IOA)',
    'Institute of Pharmacy (IOP)',
    'Institute of Nursing (ION)',
    'Institute of Imaging Health Science (IIHS)',
    'Institute of Technical Education and Skills Training (ITEST)',
    'Institute for Social Development and Nation Building (ISDNB)',
    'Institute of Psychology (IOPsy)',
    'Institute of Social Work (ISW)',
    'Institute of Disaster and Emergency Management (IDEM)',
  ];

  const isUMak = formData.institution.toLowerCase().includes('umak') || formData.institution.toLowerCase().includes('university of makati');

  const validateInput = (value: string, fieldName: string): string | null => {
    const trimmedValue = value.trim().toLowerCase();
    if (!trimmedValue) return `${fieldName} is required`;
    const naVariations = ['n/a', 'na', 'n.a', 'n.a.', 'not applicable', 'none'];
    if (fieldName !== 'Fax No' && naVariations.includes(trimmedValue)) return `${fieldName} cannot be "N/A"`;
    if (fieldName !== 'Middle Name' && trimmedValue.length < 3) return `${fieldName} must be at least 3 characters`;
    return null;
  };

  useEffect(() => {
    if (!submissionId) {
      alert('No submission ID found');
      router.push('/researchermodule/submissions');
      return;
    }

    const fetchSubmissionData = async () => {
      const supabase = createClient();
      setLoadingComments(true);
      try {
        const { data, error } = await supabase.from('research_submissions').select('*').eq('id', submissionId).single();
        if (error) throw error;

        // Fetch Comments
        if (docId) {
             const { data: verification } = await supabase.from('document_verifications').select('feedback_comment').eq('document_id', docId).single();
             if (verification?.feedback_comment) setRevisionComments(verification.feedback_comment);
             else setRevisionComments('No specific feedback provided.');
        } else {
             const { data: reviews } = await supabase.from('reviews').select('*').eq('submission_id', submissionId).eq('status', 'submitted');
             if (reviews && reviews.length > 0) {
                 const comments = reviews.map((r, i) => `**Reviewer ${i + 1}:**\n${r.protocol_recommendation || ''}`).join('\n---\n');
                 setRevisionComments(comments);
             } else {
                 setRevisionComments('No reviewer comments available.');
             }
        }

        // Fetch Form Data
        const { data: appFormData } = await supabase.from('application_forms').select('*').eq('submission_id', submissionId).single();
        if (appFormData) {
            setFormData(prev => ({
                ...prev,
                title: data.title || '',
                institution: appFormData.institution || 'University of Makati',
                // Map other fields similarly as in original code...
                studySite: appFormData.study_site || '',
                researcherFirstName: appFormData.researcher_first_name || '',
                researcherLastName: appFormData.researcher_last_name || '',
                project_leader_email: data.project_leader_email || '',
                project_leader_contact: data.project_leader_contact || '',
                typeOfStudy: mapStoredValuesToOptions(appFormData.type_of_study, typeOfStudyMap),
                sourceOfFunding: mapStoredValuesToOptions(appFormData.source_of_funding, sourceOfFundingMap),
                // ... continue mapping
            }));
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
        setIsClient(true);
        setLoadingComments(false);
        isInitialMount.current = false;
      }
    };
    fetchSubmissionData();
  }, [submissionId, docId, router]);

  useEffect(() => {
     if (isInitialMount.current || !isClient) return;
     if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
     saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem('revisionStep2Data', JSON.stringify(formData));
        console.log('💾 Auto-saved Step 2');
     }, 1000);
     return () => clearTimeout(saveTimeoutRef.current!);
  }, [formData, isClient]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation Logic
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Title is required";
    // ... add other validations

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setErrorList(Object.values(newErrors));
        setShowErrorModal(true);
        setIsSubmitting(false);
        return;
    }

    try {
      if (isQuickRevision && submissionId) {
         const result = await handleRevisionSubmit(submissionId, formData, coResearchers, technicalAdvisers, formData.technicalReviewFile instanceof File ? formData.technicalReviewFile : undefined);
         if (!result.success) throw new Error(result.error);
         alert(result.message);
         router.push(`/researchermodule/activity-details?id=${submissionId}`);
      } else {
         localStorage.setItem('revisionStep2Data', JSON.stringify(formData));
         router.push(`/researchermodule/submissions/revision/step3?mode=revision&id=${submissionId}`);
      }
    } catch (error: any) {
        alert(`Failed: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleCheckAll = () => {
    setFormData({ ...formData, hasResearchProtocol: true, hasInformedConsent: true, hasEndorsementLetter: true, hasQuestionnaire: true, hasTechnicalReview: true, hasDataCollectionForms: true, hasProductBrochure: true, hasFDAAuthorization: true, hasCompanyPermit: true, hasSpecialPopulationPermit: true, hasOtherDocs: true });
  };

  const handleUncheckAll = () => {
    setFormData({ ...formData, hasResearchProtocol: false, hasInformedConsent: false, hasEndorsementLetter: false, hasQuestionnaire: false, hasTechnicalReview: false, hasDataCollectionForms: false, hasProductBrochure: false, hasFDAAuthorization: false, hasCompanyPermit: false, hasSpecialPopulationPermit: false, hasOtherDocs: false });
  };

  const handleBack = () => {
    if (isQuickRevision && submissionId) {
      router.push(`/researchermodule/activity-details?id=${submissionId}`);
    } else {
      router.push(`/researchermodule/submissions/revision/step1?mode=revision&id=${submissionId}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          
          <Step2Header isQuickRevision={isQuickRevision} onBack={handleBack} />

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            
            {loadingComments ? (
               <div className="animate-pulse h-20 bg-gray-200 rounded-xl mb-6"></div>
            ) : (
               <RevisionCommentBox comments={revisionComments} />
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <GeneralInfoSection 
                formData={formData} 
                coResearchers={coResearchers} 
                technicalAdvisers={technicalAdvisers} 
                errors={errors} 
                isUMak={isUMak} 
                umakColleges={umakColleges} 
                handleInputChange={handleInputChange} 
                setCoResearchers={setCoResearchers} 
                setTechnicalAdvisers={setTechnicalAdvisers} 
              />
              
              <StudyDetailsSection 
                formData={formData} 
                setFormData={setFormData} 
                handleInputChange={handleInputChange} 
              />

              <TechnicalReviewSection 
                formData={formData} 
                setFormData={setFormData} 
                handleInputChange={handleInputChange} 
              />

              <DocumentChecklistSection 
                formData={formData} 
                setFormData={setFormData} 
                handleCheckAll={handleCheckAll} 
                handleUncheckAll={handleUncheckAll} 
              />

              <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                   {isSubmitting ? 'Saving...' : (isQuickRevision ? 'Submit Revision' : 'Save & Continue')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
      <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errors={errorList} />
    </div>
  );
}

export default function RevisionStep2() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RevisionStep2Content />
    </Suspense>
  );
}
