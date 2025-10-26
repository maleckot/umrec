// app/researchermodule/submissions/new/step2/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, User, Mail, Phone, Users, Building, AlertCircle, X, Info, Plus, Trash2, Calendar, FileText, CheckSquare } from 'lucide-react';

// Error Modal Component (same as Step 1)
const ErrorModal: React.FC<{ isOpen: boolean; onClose: () => void; errors: string[] }> = ({ isOpen, onClose, errors }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Validation Errors
              </h3>
              <p className="text-red-100 text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Please fix the following issues
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors" aria-label="Close">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          <ul className="space-y-3">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700 flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>{error}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="w-full px-6 py-3 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold shadow-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Got it, I'll fix these
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

// Fixed Tooltip Component with aria-label
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button 
        type="button" 
        onMouseEnter={() => setShow(true)} 
        onMouseLeave={() => setShow(false)} 
        onClick={() => setShow(!show)} 
        className="p-1" 
        aria-label="Show information tooltip"
      >
        {children}
      </button>
      {show && (
        <>
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShow(false)} />
          <div className="absolute z-50 right-0 top-full mt-2 md:right-auto md:top-auto md:bottom-full md:left-1/2 md:-translate-x-1/2 md:mb-2 w-56 sm:w-64 p-2.5 bg-[#071139] text-white text-xs rounded-lg shadow-2xl" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {text}
            <button 
              onClick={() => setShow(false)} 
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full font-bold" 
              aria-label="Close tooltip"
            >
              ×
            </button>
            <div className="hidden md:block absolute w-2 h-2 bg-[#071139] rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
            <div className="md:hidden absolute w-2 h-2 bg-[#071139] rotate-45 right-4 -top-1"></div>
          </div>
        </>
      )}
    </div>
  );
};


export default function Step2ApplicationForm() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    studySiteType: '',
    studySite: '',
    researcherFirstName: '',
    researcherMiddleName: '',
    researcherLastName: '',
    telNo: '',
    mobileNo: '',
    email: '',
    faxNo: 'N/A',
    college: '',
    institution: 'University of Makati',
    institutionAddress: '',
    typeOfStudy: [] as string[],
    typeOfStudyOthers: '',
    sourceOfFunding: [] as string[],
    pharmaceuticalSponsor: '',
    fundingOthers: '',
    startDate: '',
    endDate: '',
    numParticipants: '',
    technicalReview: '',
    technicalReviewFile: null as File | null,
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

// Update state at the beginning
const [coResearchers, setCoResearchers] = useState<Array<{ name: string; contact: string; email: string }>>([
  { name: '', contact: '', email: '' }
]);


// Update state
const [technicalAdvisers, setTechnicalAdvisers] = useState<Array<{ name: string; contact: string; email: string }>>([
  { name: '', contact: '', email: '' }
]);


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

  const isUMak = formData.institution.toLowerCase().includes('umak') || 
                 formData.institution.toLowerCase().includes('university of makati');

  // Validation function
  const validateInput = (value: string, fieldName: string): string | null => {
    const trimmedValue = value.trim().toLowerCase();
    
    if (!trimmedValue) {
      return `${fieldName} is required`;
    }

    const naVariations = ['n/a', 'na', 'n.a', 'n.a.', 'not applicable', 'none'];
    if (fieldName !== 'Fax No' && naVariations.includes(trimmedValue)) {
      return `${fieldName} cannot be "N/A"`;
    }

    const irrelevantPhrases = [
      'i dont know', "i don't know", 'idk', 'working in progress', 'work in progress',
      'wip', 'tbd', 'to be determined', 'later', 'soon', 'testing', 'test',
      'asdf', 'qwerty', '123', 'abc', 'unknown', 'temp', 'temporary'
    ];

    if (irrelevantPhrases.some(phrase => trimmedValue.includes(phrase))) {
      return `${fieldName} contains invalid text`;
    }

    if (fieldName !== 'Middle Name' && trimmedValue.length < 3) {
      return `${fieldName} must be at least 5 characters`;
    }

    return null;
  };

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('step2Data');
    const step1Raw = localStorage.getItem('step1Data');
    
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        const isEmpty = !parsedData.title && !parsedData.email;
        
        if (isEmpty && step1Raw) {
          const step1Data = JSON.parse(step1Raw);
          setFormData({
            ...parsedData,
            title: step1Data.title || '',
            researcherFirstName: step1Data.projectLeaderFirstName || '',
            researcherMiddleName: step1Data.projectLeaderMiddleName || '',
            researcherLastName: step1Data.projectLeaderLastName || '',
            mobileNo: step1Data.projectLeaderContact || '',
            email: step1Data.projectLeaderEmail || '',
            institution: step1Data.organization === 'internal' ? 'University of Makati' : '',
          });
        } else {
          setFormData({ ...parsedData, technicalReviewFile: null });
        }
      } catch (error) {
        console.error('Error loading step2 data:', error);
      }
    } else if (step1Raw) {
      try {
        const step1Data = JSON.parse(step1Raw);
        setFormData(prev => ({
          ...prev,
          title: step1Data.title || '',
          researcherFirstName: step1Data.projectLeaderFirstName || '',
          researcherMiddleName: step1Data.projectLeaderMiddleName || '',
          researcherLastName: step1Data.projectLeaderLastName || '',
          mobileNo: step1Data.projectLeaderContact || '',
          email: step1Data.projectLeaderEmail || '',
          institution: step1Data.organization === 'internal' ? 'University of Makati' : '',
        }));
      } catch (error) {
        console.error('Error loading step1 data:', error);
      }
    }
    
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (isInitialMount.current || !isClient) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const dataToSave = { ...formData };
      delete (dataToSave as any).technicalReviewFile;
      localStorage.setItem('step2Data', JSON.stringify(dataToSave));
      localStorage.setItem('step2CoResearchers', JSON.stringify(coResearchers));
      localStorage.setItem('step2TechnicalAdvisers', JSON.stringify(technicalAdvisers));
      console.log('💾 Step 2 auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, coResearchers, technicalAdvisers, isClient]);

  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    const titleError = validateInput(formData.title, 'Title');
    if (titleError) newErrors.title = titleError;

    const firstNameError = validateInput(formData.researcherFirstName, 'First Name');
    if (firstNameError) newErrors.researcherFirstName = firstNameError;

    const lastNameError = validateInput(formData.researcherLastName, 'Last Name');
    if (lastNameError) newErrors.researcherLastName = lastNameError;

    const emailError = validateInput(formData.email, 'Email');
    if (emailError) newErrors.email = emailError;

    const mobileError = validateInput(formData.mobileNo, 'Mobile Number');
    if (mobileError) newErrors.mobileNo = mobileError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorList(Object.values(newErrors));
      setShowErrorModal(true);
      return;
    }

    const dataToSave = { ...formData };
    delete (dataToSave as any).technicalReviewFile;
    localStorage.setItem('step2Data', JSON.stringify(dataToSave));
    localStorage.setItem('step2CoResearchers', JSON.stringify(coResearchers));
    localStorage.setItem('step2TechnicalAdvisers', JSON.stringify(technicalAdvisers));
    router.push('/researchermodule/submissions/new/step3');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new/step1');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value});
    if (errors[field]) {
      setErrors({...errors, [field]: ''});
    }
  };

  // Check All functionality for supplementary docs
  const handleCheckAll = () => {
    setFormData({
      ...formData,
      hasResearchProtocol: true,
      hasInformedConsent: true,
      hasEndorsementLetter: true,
      hasQuestionnaire: true,
      hasTechnicalReview: true,
      hasDataCollectionForms: true,
      hasProductBrochure: true,
      hasFDAAuthorization: true,
      hasCompanyPermit: true,
      hasSpecialPopulationPermit: true,
      hasOtherDocs: true,
    });
  };

  const handleUncheckAll = () => {
    setFormData({
      ...formData,
      hasResearchProtocol: false,
      hasInformedConsent: false,
      hasEndorsementLetter: false,
      hasQuestionnaire: false,
      hasTechnicalReview: false,
      hasDataCollectionForms: false,
      hasProductBrochure: false,
      hasFDAAuthorization: false,
      hasCompanyPermit: false,
      hasSpecialPopulationPermit: false,
      hasOtherDocs: false,
    });
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#071139] mx-auto mb-4"></div>
            <p className="text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Loading form...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <button onClick={handleBack} className="w-12 h-12 bg-white border-2 border-[#071139]/20 rounded-full flex items-center justify-center hover:bg-[#071139] hover:border-[#071139] hover:shadow-lg transition-all duration-300 group" aria-label="Go back">
                <ArrowLeft size={20} className="text-[#071139] group-hover:text-[#F7D117] transition-colors duration-300" />
              </button>
              
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-[#071139] to-[#003366] text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>2</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Application for Ethics Review
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Please accomplish this form accurately
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-[#F7D117] to-[#B8860B] h-3 transition-all duration-500 rounded-full shadow-lg" style={{ width: '25%' }} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Step 2 of 8</span>
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>25% Complete</span>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <form className="space-y-6 sm:space-y-8">
              
              {/* Section 1 Header */}
              <div className="bg-gradient-to-r from-[#071139]/10 to-[#003366]/10 border-l-4 border-[#071139] p-6 rounded-xl">
                <h4 className="font-bold text-[#071139] text-lg mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <FileText size={20} />
                  1. General Information
                </h4>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Fields marked with <span className="text-red-500">*</span> are required. Some information pre-filled from Step 1.
                </p>
              </div>

              {/* Title - Pre-filled */}
              <div>
                <label htmlFor="title" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  Title of Study <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${
                    errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.title}
                  </p>
                )}
              </div>

              {/* Study Site */}
              <div>
                <label htmlFor="studySite" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <Building size={16} className="text-[#F7D117]" />
                  </div>
                  Study Site <span className="text-red-500">*</span>
                </label>
                <input
                  id="studySite"
                  type="text"
                  value={formData.studySite}
                  onChange={(e) => handleInputChange('studySite', e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] transition-all duration-300 hover:border-gray-400"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
              </div>

             {/* Name of Researcher - WITH VISIBLE LABELS */}
<div>
  <div className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
      <User size={16} className="text-[#F7D117]" />
    </div>
    <span>Name of Researcher <span className="text-red-500">*</span></span>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
    <div>
      <label htmlFor="researcherFirstName" className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        First Name
      </label>
      <input
        id="researcherFirstName"
        type="text"
        placeholder="First Name"
        value={formData.researcherFirstName}
        onChange={(e) => handleInputChange('researcherFirstName', e.target.value)}
        className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
        required
      />
    </div>
    <div>
      <label htmlFor="researcherMiddleName" className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Middle Name
      </label>
      <input
        id="researcherMiddleName"
        type="text"
        placeholder="Reyes"
        value={formData.researcherMiddleName}
        onChange={(e) => handleInputChange('researcherMiddleName', e.target.value)}
        className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      />
    </div>
    <div>
      <label htmlFor="researcherLastName" className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Last Name
      </label>
      <input
        id="researcherLastName"
        type="text"
        placeholder="Last Name"
        value={formData.researcherLastName}
        onChange={(e) => handleInputChange('researcherLastName', e.target.value)}
        className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
        required
      />
    </div>
  </div>
</div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="mobileNo" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                      <Phone size={16} className="text-[#F7D117]" />
                    </div>
                    Mobile No <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="mobileNo"
                    type="tel"
                    value={formData.mobileNo}
                    onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                   className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] placeholder:text-gray-500"
style={{ fontFamily: 'Metropolis, sans-serif', color: '#071139', fontWeight: 500 }}

                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                      <Mail size={16} className="text-[#F7D117]" />
                    </div>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] placeholder:text-gray-500"
style={{ fontFamily: 'Metropolis, sans-serif', color: '#071139', fontWeight: 500 }}
                    required
                  />
                </div>
              </div>

              {/* Co-Researchers with Contact and Email */}
<div>
  <div className="flex items-center justify-between mb-3">
    <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
        <Users size={16} className="text-[#F7D117]" />
      </div>
      Co-Researchers
    </label>
    <button
      type="button"
      onClick={() => setCoResearchers([...coResearchers, { name: '', contact: '', email: '' }])}
      className="flex items-center gap-1 px-3 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-colors text-sm font-semibold"
      style={{ fontFamily: 'Metropolis, sans-serif' }}
      aria-label="Add new co-researcher"
    >
      <Plus size={16} /> Add
    </button>
  </div>
  {coResearchers.map((coResearcher, index) => (
    <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-xl mb-3 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Co-Researcher #{index + 1}
        </span>
        {coResearchers.length > 1 && (
          <button
            type="button"
            onClick={() => setCoResearchers(coResearchers.filter((_, i) => i !== index))}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            aria-label={`Remove co-researcher ${index + 1}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div>
        <label htmlFor={`coResearcherName-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Full Name
        </label>
        <input
          id={`coResearcherName-${index}`}
          type="text"
          placeholder="Juan A. Dela Cruz"
          value={coResearcher.name}
          onChange={(e) => {
            const updated = [...coResearchers];
            updated[index].name = e.target.value;
            setCoResearchers(updated);
          }}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`coResearcherContact-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Contact Number
          </label>
          <input
            id={`coResearcherContact-${index}`}
            type="tel"
            placeholder="+63 912 345 6789"
            value={coResearcher.contact}
            onChange={(e) => {
              const updated = [...coResearchers];
              updated[index].contact = e.target.value;
              setCoResearchers(updated);
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>
        
        <div>
          <label htmlFor={`coResearcherEmail-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Email Address
          </label>
          <input
            id={`coResearcherEmail-${index}`}
            type="email"
            placeholder="email@example.com"
            value={coResearcher.email}
            onChange={(e) => {
              const updated = [...coResearchers];
              updated[index].email = e.target.value;
              setCoResearchers(updated);
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>
      </div>
    </div>
  ))}
</div>



             {/* Technical/Content Advisers */}
<div>
  <div className="flex items-center justify-between mb-3">
    <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
        <Users size={16} className="text-[#F7D117]" />
      </div>
      Technical/Content Adviser/s
    </label>
    <button
      type="button"
      onClick={() => setTechnicalAdvisers([...technicalAdvisers, { name: '', contact: '', email: '' }])}
      className="flex items-center gap-1 px-3 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-colors text-sm font-semibold"
      style={{ fontFamily: 'Metropolis, sans-serif' }}
      aria-label="Add new technical adviser"
    >
      <Plus size={16} /> Add
    </button>
  </div>
  {technicalAdvisers.map((adviser, index) => (
    <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-xl mb-3 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Adviser #{index + 1}
        </span>
        {technicalAdvisers.length > 1 && (
          <button
            type="button"
            onClick={() => setTechnicalAdvisers(technicalAdvisers.filter((_, i) => i !== index))}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            aria-label={`Remove adviser ${index + 1}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div>
        <label htmlFor={`adviserName-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Full Name
        </label>
        <input
          id={`adviserName-${index}`}
          type="text"
          placeholder="Dr. Maria Santos"
          value={adviser.name}
          onChange={(e) => {
            const updated = [...technicalAdvisers];
            updated[index].name = e.target.value;
            setTechnicalAdvisers(updated);
          }}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`adviserContact-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Contact Number
          </label>
          <input
            id={`adviserContact-${index}`}
            type="tel"
            placeholder="+63 912 345 6789"
            value={adviser.contact}
            onChange={(e) => {
              const updated = [...technicalAdvisers];
              updated[index].contact = e.target.value;
              setTechnicalAdvisers(updated);
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>
        
        <div>
          <label htmlFor={`adviserEmail-${index}`} className="block text-xs font-medium mb-1 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Email Address
          </label>
          <input
            id={`adviserEmail-${index}`}
            type="email"
            placeholder="email@example.com"
            value={adviser.email}
            onChange={(e) => {
              const updated = [...technicalAdvisers];
              updated[index].email = e.target.value;
              setTechnicalAdvisers(updated);
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>
      </div>
    </div>
  ))}
</div>


{/* Institution */}
<div>
  <label htmlFor="institution" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
      <Building size={16} className="text-[#F7D117]" />
    </div>
    Institution <span className="text-red-500">*</span>
  </label>
  <input
    id="institution"
    type="text"
    value={formData.institution}
    onChange={(e) => handleInputChange('institution', e.target.value)}
    placeholder="University of Makati"
    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] placeholder:text-gray-500"
style={{ fontFamily: 'Metropolis, sans-serif', color: '#071139', fontWeight: 500 }}

    required
  />
</div>

{/* College/Department - Conditional Dropdown for UMak */}
<div>
  <label htmlFor="college" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
      <Building size={16} className="text-[#F7D117]" />
    </div>
    College/Department <span className="text-red-500">*</span>
  </label>
  {isUMak ? (
    <select
      id="college"
      value={formData.college}
      onChange={(e) => handleInputChange('college', e.target.value)}
      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] cursor-pointer"
      style={{ fontFamily: 'Metropolis, sans-serif' }}
      required
    >
      <option value="">Select College/Department</option>
      {umakColleges.map((college) => (
        <option key={college} value={college}>
          {college}
        </option>
      ))}
    </select>
  ) : (
    <input
      id="college"
      type="text"
      value={formData.college}
      onChange={(e) => handleInputChange('college', e.target.value)}
      placeholder="Enter your college/department"
      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] placeholder:text-gray-500"
style={{ fontFamily: 'Metropolis, sans-serif', color: '#071139', fontWeight: 500 }}

      required
    />
  )}
  {isUMak && (
    <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      Select from UMak colleges and institutes
    </p>
  )}
</div>

{/* Address of Institution */}
<div>
  <label htmlFor="institutionAddress" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
      <Building size={16} className="text-[#F7D117]" />
    </div>
    Address of Institution <span className="text-red-500">*</span>
  </label>
  <input
    id="institutionAddress"
    type="text"
    value={formData.institutionAddress}
    onChange={(e) => handleInputChange('institutionAddress', e.target.value)}
    placeholder="J.P. Rizal Extension, West Rembo, Makati City"
   className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] placeholder:text-gray-500"
style={{ fontFamily: 'Metropolis, sans-serif', color: '#071139', fontWeight: 500 }}
    required
  />
</div>

{/* Type of Study - FIXED with nested input */}
<div>
  <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md flex-shrink-0">
      <FileText size={16} className="text-[#F7D117]" />
    </div>
    <span className="flex-1">Type of Study <span className="text-red-500">*</span></span>
    <Tooltip text="Select all types that apply to your research study">
      <Info size={18} className="text-gray-400 cursor-help flex-shrink-0" />
    </Tooltip>
  </label>
  <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
    {[
      { value: 'clinical_trial_sponsored', label: 'Clinical Trial (Sponsored)' },
      { value: 'clinical_trial_researcher', label: 'Clinical Trials (Researcher-initiated)' },
      { value: 'health_operations', label: 'Health Operations Research (Health Programs and Policies)' },
      { value: 'social_behavioral', label: 'Social / Behavioral Research' },
      { value: 'public_health', label: 'Public Health / Epidemiologic Research' },
      { value: 'biomedical', label: 'Biomedical research (Retrospective, Prospective, and diagnostic studies)' },
      { value: 'stem_cell', label: 'Stem Cell Research' },
      { value: 'genetic', label: 'Genetic Research' },
      { value: 'others', label: 'Others (please specify)' }
    ].map((option) => (
      <div key={option.value}>
        <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-white rounded-lg transition-colors group">
          <input
            type="checkbox"
            checked={formData.typeOfStudy.includes(option.value)}
            onChange={(e) => {
              if (e.target.checked) {
                setFormData({ ...formData, typeOfStudy: [...formData.typeOfStudy, option.value] });
              } else {
                setFormData({ ...formData, typeOfStudy: formData.typeOfStudy.filter(v => v !== option.value) });
              }
            }}
            className="w-5 h-5 min-w-[1.25rem] rounded mt-0.5 text-[#071139] focus:ring-2 focus:ring-[#071139] border-gray-300 cursor-pointer"
          />
          <span className="text-sm text-[#071139] leading-snug flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {option.label}
          </span>
        </label>
        
        {/* MOVED INSIDE: Conditional input appears right below the checkbox when selected */}
        {option.value === 'others' && formData.typeOfStudy.includes('others') && (
          <div className="ml-11 mr-3 mb-2">
            <input
              type="text"
              placeholder="Please specify other type of study"
              value={formData.typeOfStudyOthers}
              onChange={(e) => handleInputChange('typeOfStudyOthers', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] placeholder:text-gray-400 bg-white"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
          </div>
        )}
      </div>
    ))}
  </div>
</div>


{/* Study Site Type - FIXED */}
<div>
  <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md flex-shrink-0">
      <Building size={16} className="text-[#F7D117]" />
    </div>
    <span className="flex-1">Study Site Type <span className="text-red-500">*</span></span>
    <Tooltip text="Select whether your study involves multiple locations or a single site">
      <Info size={18} className="text-gray-400 cursor-help flex-shrink-0" />
    </Tooltip>
  </label>
  <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
    {[
      { value: 'Multicenter (International)', label: 'Multicenter (International)' },
      { value: 'Multicenter (National)', label: 'Multicenter (National)' },
      { value: 'Single Site', label: 'Single Site' }
    ].map((option) => (
      <label key={option.value} className="flex items-start gap-3 cursor-pointer p-3 hover:bg-white rounded-lg transition-colors group">
        <input
          type="radio"
          name="studySiteType"
          value={option.value}
          checked={formData.studySiteType === option.value}
          onChange={(e) => handleInputChange('studySiteType', e.target.value)}
          className="w-5 h-5 min-w-[1.25rem] mt-0.5 text-[#071139] focus:ring-2 focus:ring-[#071139] border-gray-300 cursor-pointer"
        />
        <span className="text-sm text-[#071139] leading-snug flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {option.label}
        </span>
      </label>
    ))}
  </div>
</div>


{/* Source of Funding - FIXED */}
<div>
  <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md flex-shrink-0">
      <FileText size={16} className="text-[#F7D117]" />
    </div>
    <span className="flex-1">Source of Funding <span className="text-red-500">*</span></span>
    <Tooltip text="Select all funding sources that apply to your research">
      <Info size={18} className="text-gray-400 cursor-help flex-shrink-0" />
    </Tooltip>
  </label>
  <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
    {[
      { value: 'self_funded', label: 'Self-funded' },
      { value: 'government', label: 'Government-Funded' },
      { value: 'scholarship', label: 'Scholarship/Research Grant' },
      { value: 'pharmaceutical', label: 'Sponsored by Pharmaceutical Company' },
      { value: 'institution', label: 'Institution-Funded' },
      { value: 'others', label: 'Others (please specify)' }
    ].map((option) => (
      <div key={option.value}>
        <label className="flex items-start gap-3 cursor-pointer p-3 hover:bg-white rounded-lg transition-colors group">
          <input
            type="checkbox"
            checked={formData.sourceOfFunding.includes(option.value)}
            onChange={(e) => {
              if (e.target.checked) {
                setFormData({ ...formData, sourceOfFunding: [...formData.sourceOfFunding, option.value] });
              } else {
                setFormData({ ...formData, sourceOfFunding: formData.sourceOfFunding.filter(v => v !== option.value) });
              }
            }}
            className="w-5 h-5 min-w-[1.25rem] rounded mt-0.5 text-[#071139] focus:ring-2 focus:ring-[#071139] border-gray-300 cursor-pointer"
          />
          <span className="text-sm text-[#071139] leading-snug flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {option.label}
          </span>
        </label>
        
        {/* MOVED INSIDE: Pharmaceutical Company input appears right below its checkbox */}
        {option.value === 'pharmaceutical' && formData.sourceOfFunding.includes('pharmaceutical') && (
          <div className="ml-11 mr-3 mb-2">
            <input
              type="text"
              placeholder="Specify Pharmaceutical Company"
              value={formData.pharmaceuticalSponsor}
              onChange={(e) => handleInputChange('pharmaceuticalSponsor', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] placeholder:text-gray-400 bg-white"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
          </div>
        )}
        
        {/* MOVED INSIDE: Others input appears right below its checkbox */}
        {option.value === 'others' && formData.sourceOfFunding.includes('others') && (
          <div className="ml-11 mr-3 mb-2">
            <input
              type="text"
              placeholder="Specify Other Funding Source"
              value={formData.fundingOthers}
              onChange={(e) => handleInputChange('fundingOthers', e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] placeholder:text-gray-400 bg-white"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
          </div>
        )}
      </div>
    ))}
  </div>
</div>



{/* Duration of the Study - WITH PROPER LABELS */}
<div>
  <div className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
      <Calendar size={16} className="text-[#F7D117]" />
    </div>
    <span>Duration of the Study <span className="text-red-500">*</span></span>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label htmlFor="startDate" className="block text-xs font-medium mb-2 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Start date
      </label>
      <div className="relative">
        <input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange('startDate', e.target.value)}
          className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          required
        />
        <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
      </div>
    </div>
    
    <div>
      <label htmlFor="endDate" className="block text-xs font-medium mb-2 text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        End date
      </label>
      <div className="relative">
        <input
          id="endDate"
          type="date"
          value={formData.endDate}
          onChange={(e) => handleInputChange('endDate', e.target.value)}
          className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          required
        />
        <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
      </div>
    </div>
  </div>
</div>


{/* Number of Participants */}
<div>
  <label htmlFor="numParticipants" className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
      <Users size={16} className="text-[#F7D117]" />
    </div>
    No. of study participants <span className="text-red-500">*</span>
  </label>
  <input
    id="numParticipants"
    type="number"
    value={formData.numParticipants}
    onChange={(e) => handleInputChange('numParticipants', e.target.value)}
    placeholder="e.g., 100"
    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] placeholder:text-gray-500"
style={{ fontFamily: 'Metropolis, sans-serif', color: '#071139', fontWeight: 500 }}

    required
  />
</div>

{/* Technical Review */}
<div>
  <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
      <FileText size={16} className="text-[#F7D117]" />
    </div>
    Has the Research undergone a Technical Review? <span className="text-red-500">*</span>
  </label>
  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
    <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
      <input
        type="radio"
        name="technicalReview"
        value="yes"
        checked={formData.technicalReview === 'yes'}
        onChange={(e) => handleInputChange('technicalReview', e.target.value)}
        className="w-5 h-5"
      />
      <span className="text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Yes (please attach technical review results)
      </span>
    </label>
    <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
      <input
        type="radio"
        name="technicalReview"
        value="no"
        checked={formData.technicalReview === 'no'}
        onChange={(e) => handleInputChange('technicalReview', e.target.value)}
        className="w-5 h-5"
      />
      <span className="text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        No
      </span>
    </label>
  </div>
  
  {/* File Upload appears when "Yes" is selected */}
  {formData.technicalReview === 'yes' && (
    <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
      <label className="block text-sm font-semibold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Upload Technical Review Results <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                e.target.value = '';
                return;
              }
              setFormData({ ...formData, technicalReviewFile: file });
            }
          }}
          className="hidden"
          id="technicalReviewFile"
          required
        />
        <label
          htmlFor="technicalReviewFile"
          className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-dashed border-[#071139] rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-300 group"
        >
          <svg className="w-8 h-8 text-[#071139] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {formData.technicalReviewFile ? formData.technicalReviewFile.name : 'Click to upload file'}
            </p>
            <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              PDF, DOC, DOCX (max 10MB)
            </p>
          </div>
        </label>
      </div>
      
      {/* Show selected file info */}
      {formData.technicalReviewFile && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {formData.technicalReviewFile.name}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {(formData.technicalReviewFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormData({ ...formData, technicalReviewFile: null });
              const fileInput = document.getElementById('technicalReviewFile') as HTMLInputElement;
              if (fileInput) fileInput.value = '';
            }}
            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
            aria-label="Remove file"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  )}
</div>


{/* Submitted to Another UMREC */}
<div>
  <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
      <FileText size={16} className="text-[#F7D117]" />
    </div>
    Has the Research been submitted to another UMREC? <span className="text-red-500">*</span>
  </label>
  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
    <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
      <input
        type="radio"
        name="submittedToOther"
        value="yes"
        checked={formData.submittedToOther === 'yes'}
        onChange={(e) => handleInputChange('submittedToOther', e.target.value)}
        className="w-5 h-5"
      />
      <span className="text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Yes
      </span>
    </label>
    <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
      <input
        type="radio"
        name="submittedToOther"
        value="no"
        checked={formData.submittedToOther === 'no'}
        onChange={(e) => handleInputChange('submittedToOther', e.target.value)}
        className="w-5 h-5"
      />
      <span className="text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        No
      </span>
    </label>
  </div>
</div>

             {/* Checklist Section Header */}
<div className="bg-gradient-to-r from-[#F7D117]/10 to-[#B8860B]/10 border-l-4 border-[#F7D117] p-6 rounded-xl">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
    <h3 className="font-bold text-[#071139] text-lg flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      <CheckSquare size={20} />
      2. Checklist of Documents
    </h3>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleCheckAll}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
        aria-label="Check all document options"
      >
        Check All
      </button>
      <button
        type="button"
        onClick={handleUncheckAll}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-semibold"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
        aria-label="Uncheck all document options"
      >
        Uncheck All
      </button>
    </div>
  </div>
</div>


             {/* Basic Requirements - WITH FIELDSET */}
<fieldset>
  <legend className="font-semibold text-[#071139] text-lg mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    Basic Requirements:
  </legend>
  <div className="space-y-4">
    <label className="flex items-center gap-3 cursor-not-allowed opacity-75 p-3 bg-gray-50 rounded-lg">
      <input type="checkbox" checked={true} disabled className="w-5 h-5 rounded cursor-not-allowed" />
      <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Application for Ethics Review
      </span>
      <Tooltip text="This form is automatically included with your submission">
        <Info size={18} className="text-gray-400 cursor-help" />
      </Tooltip>
    </label>

    <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <input
        type="checkbox"
        checked={formData.hasResearchProtocol}
        onChange={(e) => setFormData({ ...formData, hasResearchProtocol: e.target.checked })}
        className="w-5 h-5 rounded"
      />
      <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Research Protocol
      </span>
      <Tooltip text="Detailed plan describing research objectives, methodology, and procedures">
        <Info size={18} className="text-gray-400 cursor-help" />
      </Tooltip>
    </label>

    <div className="space-y-2">
      <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <input
          type="checkbox"
          checked={formData.hasInformedConsent}
          onChange={(e) => setFormData({ ...formData, hasInformedConsent: e.target.checked })}
          className="w-5 h-5 rounded"
        />
        <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Informed Consent Form
        </span>
        <Tooltip text="Document explaining research to participants and obtaining their voluntary agreement">
          <Info size={18} className="text-gray-400 cursor-help" />
        </Tooltip>
      </label>
      
      {formData.hasInformedConsent && (
        <div className="ml-8 sm:ml-11 space-y-2">
          <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={formData.hasInformedConsentOthers}
              onChange={(e) => setFormData({ ...formData, hasInformedConsentOthers: e.target.checked })}
              className="w-5 h-5 rounded"
            />
            <span className="text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Others (please specify)
            </span>
          </label>
          {formData.hasInformedConsentOthers && (
            <input
              type="text"
              placeholder="Specify here"
              value={formData.informedConsentOthers}
              onChange={(e) => setFormData({ ...formData, informedConsentOthers: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              aria-label="Specify other informed consent documents"
            />
          )}
        </div>
      )}
    </div>

    <div className="space-y-2">
      <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <p className="text-sm font-semibold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Assent Form (if applicable):
        </p>
        <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Required when research involves minors or vulnerable populations
        </p>
      </div>
      
      <div className="ml-4 sm:ml-6 space-y-2">
        <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <input
            type="checkbox"
            checked={formData.hasAssentForm}
            onChange={(e) => setFormData({ ...formData, hasAssentForm: e.target.checked })}
            className="w-5 h-5 rounded"
          />
          <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Assent Form
          </span>
          <Tooltip text="Simplified consent form for minors or individuals unable to provide full informed consent">
            <Info size={18} className="text-gray-400 cursor-help" />
          </Tooltip>
        </label>
        
        {formData.hasAssentForm && (
          <div className="ml-8 sm:ml-11 space-y-2">
            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={formData.hasAssentFormOthers}
                onChange={(e) => setFormData({ ...formData, hasAssentFormOthers: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Others (please specify)
              </span>
            </label>
            {formData.hasAssentFormOthers && (
              <input
                type="text"
                placeholder="Specify here"
                value={formData.assentFormOthers}
                onChange={(e) => setFormData({ ...formData, assentFormOthers: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139]"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
                aria-label="Specify other assent form documents"
              />
            )}
          </div>
        )}
      </div>
    </div>

    <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <input
        type="checkbox"
        checked={formData.hasEndorsementLetter}
        onChange={(e) => setFormData({ ...formData, hasEndorsementLetter: e.target.checked })}
        className="w-5 h-5 rounded"
      />
      <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Endorsement Letter
      </span>
      <Tooltip text="Official letter from your institution or adviser supporting your research">
        <Info size={18} className="text-gray-400 cursor-help" />
      </Tooltip>
    </label>

    <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <input
        type="checkbox"
        checked={formData.hasQuestionnaire}
        onChange={(e) => setFormData({ ...formData, hasQuestionnaire: e.target.checked })}
        className="w-5 h-5 rounded"
      />
      <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Questionnaire (if applicable)
      </span>
      <Tooltip text="Survey instrument or interview guide for data collection">
        <Info size={18} className="text-gray-400 cursor-help" />
      </Tooltip>
    </label>
  </div>
</fieldset>

              {/* Supplementary Documents - UPDATED LIST */}
              <div className="space-y-4">
                <h5 className="font-semibold text-[#071139] text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Supplementary Documents:
                </h5>

                <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasTechnicalReview}
                    onChange={(e) => setFormData({ ...formData, hasTechnicalReview: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Technical review/pre-oral defense (Any documentary proof)
                  </span>
                  <Tooltip text="Evidence of technical evaluation or preliminary defense of your research proposal">
                    <Info size={18} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasDataCollectionForms}
                    onChange={(e) => setFormData({ ...formData, hasDataCollectionForms: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Data Collection Forms (if applicable)
                  </span>
                  <Tooltip text="Forms used to systematically gather research data from participants">
                    <Info size={18} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasProductBrochure}
                    onChange={(e) => setFormData({ ...formData, hasProductBrochure: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Product Brochure (if applicable)
                  </span>
                  <Tooltip text="Informational materials about products being studied in the research">
                    <Info size={18} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasFDAAuthorization}
                    onChange={(e) => setFormData({ ...formData, hasFDAAuthorization: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Philippine FDA Marketing Authorization or Import License (if applicable)
                  </span>
                  <Tooltip text="Official permit from FDA for pharmaceutical or medical products used in research">
                    <Info size={18} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.hasCompanyPermit}
                    onChange={(e) => setFormData({ ...formData, hasCompanyPermit: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Permit/s for the use of company name
                  </span>
                  <Tooltip text="Authorization to reference or use a company's name in your research">
                    <Info size={18} className="text-gray-400 cursor-help" />
                  </Tooltip>
                </label>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.hasSpecialPopulationPermit}
                      onChange={(e) => setFormData({ ...formData, hasSpecialPopulationPermit: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Permit/s for special populations (please specify)
                    </span>
                    <Tooltip text="Special approval for research involving vulnerable groups (minors, pregnant women, prisoners, etc.)">
                      <Info size={18} className="text-gray-400 cursor-help" />
                    </Tooltip>
                  </label>
                  {formData.hasSpecialPopulationPermit && (
                    <input
                      type="text"
                      placeholder="Specify special population details"
                      value={formData.specialPopulationPermitDetails}
                      onChange={(e) => setFormData({ ...formData, specialPopulationPermitDetails: e.target.value })}
                      className="ml-11 w-[calc(100%-2.75rem)] px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none"
                      style={{ fontFamily: 'Metropolis, sans-serif', color: '#071139' }}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.hasOtherDocs}
                      onChange={(e) => setFormData({ ...formData, hasOtherDocs: e.target.checked })}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm text-[#071139] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Others (please specify)
                    </span>
                    <Tooltip text="Any additional relevant documents not listed above">
                      <Info size={18} className="text-gray-400 cursor-help" />
                    </Tooltip>
                  </label>
                  {formData.hasOtherDocs && (
                    <textarea
                      placeholder="Specify other documents (e.g., The researcher is the participant because the study is a narrative inquiry)"
                      value={formData.otherDocsDetails}
                      onChange={(e) => setFormData({ ...formData, otherDocsDetails: e.target.value })}
                      rows={3}
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] placeholder:text-gray-500"
style={{ fontFamily: 'Metropolis, sans-serif', color: '#071139' }}
                    />
                  )}
                </div>
              </div>

                       {/* Enhanced Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gray-200 text-[#071139] rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Go back to previous step"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Previous Step
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={handleNext}
                  className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Proceed to step 3"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#F7D117] via-white/10 to-[#F7D117] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Next Step
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
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
