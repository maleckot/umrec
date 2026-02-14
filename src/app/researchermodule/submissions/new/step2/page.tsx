'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { Trash2 } from 'lucide-react';

// Imports from the new structure
import ErrorModal from '@/components/researcher/submission/shared/ErrorModal';
import Step2Header from '@/components/researcher/submission/steps/step2/Step2Header';
import Step2Form from '@/components/researcher/submission/steps/step2/Step2Form';

export default function Step2ApplicationForm() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Consolidated State matching your original file fields
  const [formData, setFormData] = useState({
    title: '',
    studySite: '',
    researcherFirstName: '',
    researcherMiddleName: '',
    researcherLastName: '',
    mobileNo: '',
    email: '',
    institution: 'University of Makati',
    college: '',
    institutionAddress: '',
    typeOfStudy: [] as string[],
    typeOfStudyOthers: '',
    startDate: '',
    endDate: '',
    numParticipants: '',
    technicalReview: '',
    submittedToOther: '',

    // Checklist booleans & fields
    hasEndorsementLetter: false,
    hasResearchProtocol: false,
    hasTechnicalReview: false, // For supplementary checklist
    hasDataCollectionForms: false,
    hasInformedConsent: false,
    hasInformedConsentOthers: false,
    informedConsentOthers: '',
    hasAssentForm: false,
    hasQuestionnaire: false,
    hasProductBrochure: false,
    hasFDAAuthorization: false,
    hasCompanyPermit: false,
    hasSpecialPopulationPermit: false,
    specialPopulationPermitDetails: '',
    hasOtherDocs: false,
    otherDocsDetails: '',

    // File objects
    technicalReviewFile: null as File | null,
    technicalReviewFileName: '',
    technicalReviewFileSize: 0,
    endorsementLetterFile: null as File | null,
    checklistTechnicalReviewFile: null as File | null,
    dataCollectionFormsFile: null as File | null,
    questionnaireFile: null as File | null,
    productBrochureFile: null as File | null,
    fdaAuthorizationFile: null as File | null,
    companyPermitFile: null as File | null,
    specialPopulationPermitFile: null as File | null,
    otherDocsFile: null as File | null,
  });

  const [coResearchers, setCoResearchers] = useState<Array<{ name: string; contact: string; email: string }>>([
    { name: '', contact: '', email: '' }
  ]);

  const [technicalAdvisers, setTechnicalAdvisers] = useState<Array<{ name: string; contact: string; email: string }>>([
    { name: '', contact: '', email: '' }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorList, setErrorList] = useState<string[]>([]);

  // Validation Logic
  const validateInput = (value: string, fieldName: string): string | null => {
    const trimmedValue = value.trim().toLowerCase();
    if (!trimmedValue) return `${fieldName} is required`;
    return null;
  };

  // Effects for Loading/Saving
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('step2Data');
    const step1Raw = localStorage.getItem('step1Data');
    
    if (saved) {
       try {
          // Merge saved data carefully
          setFormData(prev => ({...prev, ...JSON.parse(saved)}));
       } catch(e) { console.error(e); }
    } else if (step1Raw) {
       // Pre-fill from Step 1
       const step1 = JSON.parse(step1Raw);
       setFormData(prev => ({
          ...prev,
          title: step1.title || '',
          researcherFirstName: step1.projectLeaderFirstName || '',
          researcherLastName: step1.projectLeaderLastName || '',
          email: step1.projectLeaderEmail || '',
          mobileNo: step1.projectLeaderContact || '',
          institution: step1.organization === 'internal' ? 'University of Makati' : ''
       }));
    }
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (isInitialMount.current || !isClient) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      // Exclude file objects from localStorage to avoid quota errors
      const { 
          technicalReviewFile, endorsementLetterFile, checklistTechnicalReviewFile, 
          dataCollectionFormsFile, questionnaireFile, productBrochureFile, 
          fdaAuthorizationFile, companyPermitFile, specialPopulationPermitFile, 
          otherDocsFile, ...safeData 
      } = formData;

      localStorage.setItem('step2Data', JSON.stringify(safeData));
      localStorage.setItem('step2CoResearchers', JSON.stringify(coResearchers));
      localStorage.setItem('step2TechnicalAdvisers', JSON.stringify(technicalAdvisers));
      console.log('💾 Step 2 auto-saved');
    }, 1000);

    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [formData, coResearchers, technicalAdvisers, isClient]);

  // Handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    const titleError = validateInput(formData.title, 'Title');
    if (titleError) newErrors.title = titleError;
    
    // Validate other required fields
    if (!formData.studySite) newErrors.studySite = "Study Site is required";
    if (!formData.researcherLastName) newErrors.researcherLastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile Number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorList(Object.values(newErrors));
      setShowErrorModal(true);
      return;
    }
    
    // Save state before navigating
    const { 
        technicalReviewFile, endorsementLetterFile, checklistTechnicalReviewFile, 
        dataCollectionFormsFile, questionnaireFile, productBrochureFile, 
        fdaAuthorizationFile, companyPermitFile, specialPopulationPermitFile, 
        otherDocsFile, ...safeData 
    } = formData;
    
    localStorage.setItem('step2Data', JSON.stringify(safeData));
    localStorage.setItem('step2CoResearchers', JSON.stringify(coResearchers));
    localStorage.setItem('step2TechnicalAdvisers', JSON.stringify(technicalAdvisers));

    router.push('/researchermodule/submissions/new/step3');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new/step1');
  };

  const renderPDFUpload = (key: string, fileState: File | null, setFile: (f: File | null) => void) => (
    <div className="ml-11 mt-2 mb-2 w-[calc(100%-2.75rem)] animate-fade-in">
      <div className="flex items-center gap-3">
          <input
              type="file"
              accept=".pdf"
              className="block w-full text-sm text-[#071139] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#071139]/10 file:text-[#071139] hover:file:bg-[#071139]/20 file:cursor-pointer cursor-pointer"
              onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                      if (file.type !== "application/pdf") {
                          alert("Only PDF files are allowed.");
                          e.target.value = '';
                          return;
                      }
                      setFile(file);
                  }
              }}
          />
          {fileState && (
              <button type="button" onClick={() => setFile(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
              </button>
          )}
      </div>
      {fileState && <p className="text-xs text-green-600 mt-1">File selected: {fileState.name}</p>}
    </div>
  );

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7] flex items-center justify-center">
         <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#071139]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <Step2Header onBack={handleBack} />
          
          <Step2Form 
            formData={formData}
            errors={errors}
            coResearchers={coResearchers}
            setCoResearchers={setCoResearchers}
            technicalAdvisers={technicalAdvisers}
            setTechnicalAdvisers={setTechnicalAdvisers}
            handleInputChange={handleInputChange}
            setFormData={setFormData}           // <--- Added missing prop
            renderPDFUpload={renderPDFUpload}
            handleNext={handleNext}
            handleBack={handleBack}             // <--- Added missing prop
          />
        </div>
      </div>

      <Footer />
      <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errors={errorList} />
    </div>
  );
}
