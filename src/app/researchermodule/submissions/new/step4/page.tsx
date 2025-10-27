// app/researchermodule/submissions/new/step4/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, FileText, AlertCircle, X } from 'lucide-react';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { RadioGroup } from '@/components/researcher/submission/FormComponents';

// ✅ Error Modal - ONLY DECLARED ONCE AT TOP
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
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Close error dialog"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <ul className="space-y-3">
            {errors.map((error, index) => (
              <li 
                key={index} 
                className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700 flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {error}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Got it, I'll fix these
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// ✅ MAIN COMPONENT - ONLY DECLARED ONCE
export default function Step4InformedConsent() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [consentType, setConsentType] = useState<'adult' | 'minor' | 'both' | ''>('');
  const [adultLanguage, setAdultLanguage] = useState<'english' | 'tagalog' | 'both' | ''>('');
  const [minorLanguage, setMinorLanguage] = useState<'english' | 'tagalog' | 'both' | ''>('');
  
  const [step2Data, setStep2Data] = useState<any>(null);
  const [step3Data, setStep3Data] = useState<any>(null);

  const [formData, setFormData] = useState({
  // Header Information
  participantGroupIdentity: '',
  informedConsentFor: '',
  // Adult Consent Form
  introductionEnglish: '',
  introductionTagalog: '',
  purposeEnglish: '',
  purposeTagalog: '',
  researchInterventionEnglish: '',
  researchInterventionTagalog: '',
  participantSelectionEnglish: '',
  participantSelectionTagalog: '',
  voluntaryParticipationEnglish: '',
  voluntaryParticipationTagalog: '',
  proceduresEnglish: '',
  proceduresTagalog: '',
  durationEnglish: '',
  durationTagalog: '',
  risksEnglish: '',
  risksTagalog: '',
  benefitsEnglish: '',
  benefitsTagalog: '',
  reimbursementsEnglish: '',
  reimbursementsTagalog: '',
  confidentialityEnglish: '',
  confidentialityTagalog: '',
  sharingResultsEnglish: '',
  sharingResultsTagalog: '',
  rightToRefuseEnglish: '',
  rightToRefuseTagalog: '',
  whoToContactEnglish: '',
  whoToContactTagalog: '',
  // Part II Certificate
  certificateConsentEnglish: '',
  certificateConsentTagalog: '',
  // Minor Assent Form
  introductionMinorEnglish: '',
  introductionMinorTagalog: '',
  purposeMinorEnglish: '',
  purposeMinorTagalog: '',
  choiceOfParticipantsEnglish: '',
  choiceOfParticipantsTagalog: '',
  voluntarinessMinorEnglish: '',
  voluntarinessMinorTagalog: '',
  proceduresMinorEnglish: '',
  proceduresMinorTagalog: '',
  risksMinorEnglish: '',
  risksMinorTagalog: '',
  benefitsMinorEnglish: '',
  benefitsMinorTagalog: '',
  confidentialityMinorEnglish: '',
  confidentialityMinorTagalog: '',
  sharingFindingsEnglish: '',
  sharingFindingsTagalog: '',
  contactPerson: '',
  contactNumber: ''
});


  // ✅ HELPER FUNCTIONS INSIDE COMPONENT
  const stripHtmlTags = (html: string | undefined): string => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const validateInput = (value: string | undefined, fieldName: string): string | null => {
    if (!value) {
      return `${fieldName} is required`;
    }

    const trimmedValue = value.trim().toLowerCase();
    
    if (!trimmedValue) {
      return `${fieldName} is required`;
    }

    const naVariations = ['n/a', 'na', 'n.a', 'n.a.', 'not applicable', 'none'];
    if (naVariations.includes(trimmedValue)) {
      return `${fieldName} cannot be "N/A" - please provide actual information`;
    }

    const irrelevantPhrases = [
      'i dont know', "i don't know", 'idk', 'working in progress',
      'work in progress', 'wip', 'tbd', 'to be determined',
      'later', 'soon', 'testing', 'test', 'asdf', 'qwerty',
      '123', 'abc', 'unknown', 'temp', 'temporary',
      'sample', 'example', 'placeholder'
    ];

    if (irrelevantPhrases.some(phrase => trimmedValue.includes(phrase))) {
      return `${fieldName} contains invalid text. Please provide accurate information`;
    }

    if (trimmedValue.length < 10) {
      return `${fieldName} must be at least 10 characters with meaningful content`;
    }

    return null;
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!consentType) {
      errors.push('Please select participant type');
    }

    if (consentType === 'adult' || consentType === 'both') {
      if (!adultLanguage) {
        errors.push('Please select language for adult consent form');
      }
      
      const participantError = validateInput(formData.participantGroupIdentity, 'Participant Group Identity');
      if (participantError) errors.push(participantError);
      
      if (adultLanguage === 'english' || adultLanguage === 'both') {
        const introText = stripHtmlTags(formData.introductionEnglish);
        const introError = validateInput(introText, 'Introduction (English)');
        if (introError) errors.push(introError);
        
        const purposeText = stripHtmlTags(formData.purposeEnglish);
        const purposeError = validateInput(purposeText, 'Purpose (English)');
        if (purposeError) errors.push(purposeError);
        
        const interventionText = stripHtmlTags(formData.researchInterventionEnglish);
        const interventionError = validateInput(interventionText, 'Research Intervention (English)');
        if (interventionError) errors.push(interventionError);
        
        const selectionText = stripHtmlTags(formData.participantSelectionEnglish);
        const selectionError = validateInput(selectionText, 'Participant Selection (English)');
        if (selectionError) errors.push(selectionError);
        
        const voluntaryText = stripHtmlTags(formData.voluntaryParticipationEnglish);
        const voluntaryError = validateInput(voluntaryText, 'Voluntary Participation (English)');
        if (voluntaryError) errors.push(voluntaryError);
        
        const proceduresText = stripHtmlTags(formData.proceduresEnglish);
        const proceduresError = validateInput(proceduresText, 'Procedures (English)');
        if (proceduresError) errors.push(proceduresError);
        
        const durationText = stripHtmlTags(formData.durationEnglish);
        const durationError = validateInput(durationText, 'Duration (English)');
        if (durationError) errors.push(durationError);
        
        const risksText = stripHtmlTags(formData.risksEnglish);
        const risksError = validateInput(risksText, 'Risks (English)');
        if (risksError) errors.push(risksError);
        
        const benefitsText = stripHtmlTags(formData.benefitsEnglish);
        const benefitsError = validateInput(benefitsText, 'Benefits (English)');
        if (benefitsError) errors.push(benefitsError);
        
        const reimbursementsText = stripHtmlTags(formData.reimbursementsEnglish);
        const reimbursementsError = validateInput(reimbursementsText, 'Reimbursements (English)');
        if (reimbursementsError) errors.push(reimbursementsError);
        
        const confidentialityText = stripHtmlTags(formData.confidentialityEnglish);
        const confidentialityError = validateInput(confidentialityText, 'Confidentiality (English)');
        if (confidentialityError) errors.push(confidentialityError);
        
        const sharingText = stripHtmlTags(formData.sharingResultsEnglish);
        const sharingError = validateInput(sharingText, 'Sharing Results (English)');
        if (sharingError) errors.push(sharingError);
        
        const refuseText = stripHtmlTags(formData.rightToRefuseEnglish);
        const refuseError = validateInput(refuseText, 'Right to Refuse or Withdraw (English)');
        if (refuseError) errors.push(refuseError);
        
        const contactText = stripHtmlTags(formData.whoToContactEnglish);
        const contactError = validateInput(contactText, 'Who to Contact (English)');
        if (contactError) errors.push(contactError);
      }

      if (adultLanguage === 'tagalog' || adultLanguage === 'both') {
        const introText = stripHtmlTags(formData.introductionTagalog);
        const introError = validateInput(introText, 'Panimula (Tagalog)');
        if (introError) errors.push(introError);
        
        const purposeText = stripHtmlTags(formData.purposeTagalog);
        const purposeError = validateInput(purposeText, 'Layunin ng Pananaliksik (Tagalog)');
        if (purposeError) errors.push(purposeError);
        
        const interventionText = stripHtmlTags(formData.researchInterventionTagalog);
        const interventionError = validateInput(interventionText, 'Uri ng Interbensyon (Tagalog)');
        if (interventionError) errors.push(interventionError);
        
        const selectionText = stripHtmlTags(formData.participantSelectionTagalog);
        const selectionError = validateInput(selectionText, 'Pagpili ng Kalahok (Tagalog)');
        if (selectionError) errors.push(selectionError);
        
        const voluntaryText = stripHtmlTags(formData.voluntaryParticipationTagalog);
        const voluntaryError = validateInput(voluntaryText, 'Kusang-loob na Paglahok (Tagalog)');
        if (voluntaryError) errors.push(voluntaryError);
        
        const proceduresText = stripHtmlTags(formData.proceduresTagalog);
        const proceduresError = validateInput(proceduresText, 'Mga Pamamaraan (Tagalog)');
        if (proceduresError) errors.push(proceduresError);
        
        const durationText = stripHtmlTags(formData.durationTagalog);
        const durationError = validateInput(durationText, 'Tagal ng Pag-aaral (Tagalog)');
        if (durationError) errors.push(durationError);
        
        const risksText = stripHtmlTags(formData.risksTagalog);
        const risksError = validateInput(risksText, 'Mga Panganib (Tagalog)');
        if (risksError) errors.push(risksError);
        
        const benefitsText = stripHtmlTags(formData.benefitsTagalog);
        const benefitsError = validateInput(benefitsText, 'Mga Benepisyo (Tagalog)');
        if (benefitsError) errors.push(benefitsError);
        
        const reimbursementsText = stripHtmlTags(formData.reimbursementsTagalog);
        const reimbursementsError = validateInput(reimbursementsText, 'Kabayaran (Tagalog)');
        if (reimbursementsError) errors.push(reimbursementsError);
        
        const confidentialityText = stripHtmlTags(formData.confidentialityTagalog);
        const confidentialityError = validateInput(confidentialityText, 'Pagiging Kumpidensyal (Tagalog)');
        if (confidentialityError) errors.push(confidentialityError);
        
        const sharingText = stripHtmlTags(formData.sharingResultsTagalog);
        const sharingError = validateInput(sharingText, 'Pagbabahagi ng mga Resulta (Tagalog)');
        if (sharingError) errors.push(sharingError);
        
        const refuseText = stripHtmlTags(formData.rightToRefuseTagalog);
        const refuseError = validateInput(refuseText, 'Karapatan na Tumanggi o Umurong (Tagalog)');
        if (refuseError) errors.push(refuseError);
        
        const contactText = stripHtmlTags(formData.whoToContactTagalog);
        const contactError = validateInput(contactText, 'Sino ang Makikipag-ugnayan (Tagalog)');
        if (contactError) errors.push(contactError);
      }
    }

    if (consentType === 'minor' || consentType === 'both') {
      if (!minorLanguage) {
        errors.push('Please select language for minor assent form');
      }
      
      if (minorLanguage === 'english' || minorLanguage === 'both') {
        const introText = stripHtmlTags(formData.introductionMinorEnglish);
        const introError = validateInput(introText, 'Introduction - Minor (English)');
        if (introError) errors.push(introError);
        
        const purposeText = stripHtmlTags(formData.purposeMinorEnglish);
        const purposeError = validateInput(purposeText, 'Purpose - Minor (English)');
        if (purposeError) errors.push(purposeError);
        
        const choiceText = stripHtmlTags(formData.choiceOfParticipantsEnglish);
        const choiceError = validateInput(choiceText, 'Choice of Participants - Minor (English)');
        if (choiceError) errors.push(choiceError);
        
        const voluntarinessText = stripHtmlTags(formData.voluntarinessMinorEnglish);
        const voluntarinessError = validateInput(voluntarinessText, 'Voluntariness - Minor (English)');
        if (voluntarinessError) errors.push(voluntarinessError);
        
        const proceduresText = stripHtmlTags(formData.proceduresMinorEnglish);
        const proceduresError = validateInput(proceduresText, 'Procedures - Minor (English)');
        if (proceduresError) errors.push(proceduresError);
        
        const risksText = stripHtmlTags(formData.risksMinorEnglish);
        const risksError = validateInput(risksText, 'Risks - Minor (English)');
        if (risksError) errors.push(risksError);
        
        const benefitsText = stripHtmlTags(formData.benefitsMinorEnglish);
        const benefitsError = validateInput(benefitsText, 'Benefits - Minor (English)');
        if (benefitsError) errors.push(benefitsError);
        
        const confidentialityText = stripHtmlTags(formData.confidentialityMinorEnglish);
        const confidentialityError = validateInput(confidentialityText, 'Confidentiality - Minor (English)');
        if (confidentialityError) errors.push(confidentialityError);
        
        const sharingText = stripHtmlTags(formData.sharingFindingsEnglish);
        const sharingError = validateInput(sharingText, 'Sharing Findings - Minor (English)');
        if (sharingError) errors.push(sharingError);
      }

      if (minorLanguage === 'tagalog' || minorLanguage === 'both') {
        const introText = stripHtmlTags(formData.introductionMinorTagalog);
        const introError = validateInput(introText, 'Panimula - Minor (Tagalog)');
        if (introError) errors.push(introError);
        
        const purposeText = stripHtmlTags(formData.purposeMinorTagalog);
        const purposeError = validateInput(purposeText, 'Layunin - Minor (Tagalog)');
        if (purposeError) errors.push(purposeError);
        
        const choiceText = stripHtmlTags(formData.choiceOfParticipantsTagalog);
        const choiceError = validateInput(choiceText, 'Pagpili ng Kalahok - Minor (Tagalog)');
        if (choiceError) errors.push(choiceError);
        
        const voluntarinessText = stripHtmlTags(formData.voluntarinessMinorTagalog);
        const voluntarinessError = validateInput(voluntarinessText, 'Kusang-loob - Minor (Tagalog)');
        if (voluntarinessError) errors.push(voluntarinessError);
        
        const proceduresText = stripHtmlTags(formData.proceduresMinorTagalog);
        const proceduresError = validateInput(proceduresText, 'Mga Proseso - Minor (Tagalog)');
        if (proceduresError) errors.push(proceduresError);
        
        const risksText = stripHtmlTags(formData.risksMinorTagalog);
        const risksError = validateInput(risksText, 'Mga Panganib - Minor (Tagalog)');
        if (risksError) errors.push(risksError);
        
        const benefitsText = stripHtmlTags(formData.benefitsMinorTagalog);
        const benefitsError = validateInput(benefitsText, 'Mga Benepisyo - Minor (Tagalog)');
        if (benefitsError) errors.push(benefitsError);
        
        const confidentialityText = stripHtmlTags(formData.confidentialityMinorTagalog);
        const confidentialityError = validateInput(confidentialityText, 'Kumpidensyal - Minor (Tagalog)');
        if (confidentialityError) errors.push(confidentialityError);
        
        const sharingText = stripHtmlTags(formData.sharingFindingsTagalog);
        const sharingError = validateInput(sharingText, 'Pagbabahagi - Minor (Tagalog)');
        if (sharingError) errors.push(sharingError);
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowErrorModal(true);
      return false;
    }

    return true;
  };

 useEffect(() => {
  setIsClient(true);
  
  const savedStep2 = localStorage.getItem('step2Data');
  if (savedStep2) {
    try {
      setStep2Data(JSON.parse(savedStep2));
    } catch (error) {
      console.error('Error loading Step 2 data:', error);
    }
  }

  const savedStep3 = localStorage.getItem('step3Data');
  if (savedStep3) {
    try {
      setStep3Data(JSON.parse(savedStep3));
    } catch (error) {
      console.error('Error loading Step 3 data:', error);
    }
  }

  const saved = localStorage.getItem('step4Data');
  if (saved) {
    try {
      const parsedData = JSON.parse(saved);
      if (parsedData.consentType) setConsentType(parsedData.consentType);
      if (parsedData.adultLanguage) setAdultLanguage(parsedData.adultLanguage);
      if (parsedData.minorLanguage) setMinorLanguage(parsedData.minorLanguage);
      
      // ✅ Use spreading with defaults to ensure no undefined values
      if (parsedData.formData) {
        setFormData(prev => ({
          ...prev, // Keep all existing empty strings as defaults
          ...Object.fromEntries(
            Object.entries(parsedData.formData).filter(([_, v]) => v !== undefined && v !== null)
          ) // Only override with defined values
        }));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }
}, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isClient) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const dataToSave = {
        consentType,
        adultLanguage,
        minorLanguage,
        formData
      };
      localStorage.setItem('step4Data', JSON.stringify(dataToSave));
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [consentType, adultLanguage, minorLanguage, formData, isClient]);

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    const dataToSave = {
      consentType,
      adultLanguage,
      minorLanguage,
      formData
    };
    localStorage.setItem('step4Data', JSON.stringify(dataToSave));
    router.push('/researchermodule/submissions/new/step5');
  };

  const handleBack = () => {
    const dataToSave = {
      consentType,
      adultLanguage,
      minorLanguage,
      formData
    };
    localStorage.setItem('step4Data', JSON.stringify(dataToSave));
    router.push('/researchermodule/submissions/new/step3');
  };

  const showAdultForm = consentType === 'adult' || consentType === 'both';
  const showMinorForm = consentType === 'minor' || consentType === 'both';

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center py-12">
          <div className="text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Loading...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      
      <ErrorModal 
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errors={validationErrors}
      />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Enhanced Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <button
                onClick={handleBack}
                className="w-12 h-12 bg-white border-2 border-[#071139]/20 rounded-full flex items-center justify-center hover:bg-[#071139] hover:border-[#071139] hover:shadow-lg transition-all duration-300 group"
                aria-label="Go back to previous page"
              >
                <ArrowLeft size={20} className="text-[#071139] group-hover:text-[#F7D117] transition-colors duration-300" />
              </button>
              
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-[#071139] to-[#003366] text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>4</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Informed Consent / Assent Form
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Complete the appropriate consent form based on your participant type
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-[#F7D117] to-[#B8860B] h-3 transition-all duration-500 rounded-full shadow-lg"
                style={{ width: '50%' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Step 4 of 8
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                50% Complete
              </span>
            </div>
          </div>

          {/* Enhanced Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <form className="space-y-6 sm:space-y-8">
              {/* Instructions */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-5 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <AlertCircle size={20} className="text-blue-500" />
                  Instructions
                </h4>
                <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Please select whether your research involves <strong>adult participants</strong>, <strong>minors (children 12 to under 15 years old)</strong>, or <strong>both</strong>. The form will adjust based on your selection. All fields should be completed thoroughly to ensure compliance with ethical research standards.
                </p>
              </div>

              {/* Consent Type Selection */}
              <div>
                <RadioGroup
                  label="Select Participant Type"
                  options={[
                    { value: 'adult', label: 'Adult Participants Only (Informed Consent Form)' },
                    { value: 'minor', label: 'Minors/Children 12-15 years old Only (Informed Assent Form)' },
                    { value: 'both', label: 'Both Adult and Minor Participants' }
                  ]}
                  selected={consentType}
                  onChange={(val) => {
                    setConsentType(val as 'adult' | 'minor' | 'both');
                    if (val !== 'adult' && val !== 'both') setAdultLanguage('');
                    if (val !== 'minor' && val !== 'both') setMinorLanguage('');
                  }}
                  required
                />
              </div>

                            {/* Adult Consent Form */}
              {showAdultForm && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-l-4 border-blue-500 p-4 sm:p-5 rounded-r-lg">
                    <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Informed Consent Form (Adult Participants)
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Select the language(s) you will provide for adult participants.
                    </p>
                  </div>

                  {/* Language Selection for Adults */}
                  <div>
                    <RadioGroup
                      label="Select Language for Adult Consent Form"
                      options={[
                        { value: 'english', label: 'English Only' },
                        { value: 'tagalog', label: 'Tagalog Only' },
                        { value: 'both', label: 'Both English and Tagalog' }
                      ]}
                      selected={adultLanguage}
                      onChange={(val) => setAdultLanguage(val as 'english' | 'tagalog' | 'both')}
                      required
                    />
                  </div>

                  {adultLanguage && (
                    <>
                      {/* HEADER SECTION */}
                      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 sm:p-5 rounded-r-lg">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base mb-1 uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Header Information
                        </h5>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          This section appears at the top of your consent form
                        </p>
                      </div>

                      {/* Participant Group Identity */}
                  <div>
  <label 
    htmlFor="participantGroupIdentity"
    className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
    style={{ fontFamily: 'Metropolis, sans-serif' }}
  >
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
      <FileText size={16} className="text-[#F7D117]" />
    </div>
    Informed Consent Form for: <span className="text-red-500">*</span>
  </label>
  <input
    id="participantGroupIdentity"
    type="text"
    value={formData.participantGroupIdentity}
    onChange={(e) => setFormData({...formData, participantGroupIdentity: e.target.value})}
    placeholder="e.g., clients, patients, community leaders, service providers"
    className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] transition-all duration-300 hover:border-gray-400"
    style={{ fontFamily: 'Metropolis, sans-serif' }}
    required
  />
  <p className="text-xs text-gray-600 mt-2 flex items-start gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-blue-500" />
    Identity of the particular group of individuals in the project for whom this consent is intended
  </p>
</div>

{/* Display Project and Researcher Information from Step 2 */}
{step2Data && (
  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
    <h6 className="font-bold text-[#071139] text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      <FileText size={18} className="text-[#071139]" />
      Project and Researcher Information (from Step 2)
    </h6>
    <div className="space-y-4 text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      {/* Principal Investigator */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="mb-2"><strong className="text-[#071139]">[Name of Principal Investigator]</strong></div>
        <div className="mb-3 text-[#071139]">
          {step2Data.researcherFirstName} {step2Data.researcherMiddleName} {step2Data.researcherLastName}
        </div>
        <div className="mb-2"><strong className="text-[#071139]">[Name of Organization]</strong></div>
        <div className="mb-3 text-[#071139]">{step2Data.institution || 'N/A'}</div>
        <div className="mb-2"><strong className="text-[#071139]">[Contact Number and Email]</strong></div>
        <div className="text-[#071139]">{step2Data.mobileNo || 'N/A'} | {step2Data.email || 'N/A'}</div>
      </div>
      
      {/* Project Title */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <strong className="text-[#071139]">[Name of Project and Research]</strong>
        <div className="mt-2 text-[#071139]">{step2Data.title || 'Not provided'}</div>
      </div>
    </div>
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-xs text-blue-700 flex items-start gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        This information will automatically appear at the top of your consent form.
      </p>
    </div>
  </div>
)}

                      {/* PART I: INFORMATION SHEET Header */}
                      <div className="bg-gradient-to-r from-[#071139]/10 to-blue-100/50 border-l-4 border-[#071139] p-4 sm:p-5 rounded-r-lg mt-8">
                        <h5 className="font-bold text-[#071139] text-base sm:text-lg uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Part I: Information Sheet
                        </h5>
                      </div>

                      {/* 1. Introduction */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                          Introduction
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Introduction (English Version)"
                            value={formData.introductionEnglish}
                            onChange={(val) => setFormData({...formData, introductionEnglish: val})}
                            helperText="Briefly introduce the proponent and concerned organization, emphasize that this is an invitation to participate in a study/research and that they can take time to reflect on whether they want to participate or not. Assure the participant that they do not understand some of the words or concepts, that these will be explained and that they can ask questions at any time."
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Panimula (Tagalog Version)"
                            value={formData.introductionTagalog}
                            onChange={(val) => setFormData({...formData, introductionTagalog: val})}
                            helperText="Ipakilala ang mga mananaliksik at organisasyon, at ipahayag na ito ay isang imbitasyon na lumahok sa pag-aaral."
                            required
                          />
                        )}
                      </div>

                      {/* 2. Purpose of the Research */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                          Purpose of the Research
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Purpose (English Version)"
                            value={formData.purposeEnglish}
                            onChange={(val) => setFormData({...formData, purposeEnglish: val})}
                            helperText="Explain the research question in ordinary, non-technical terms. Use local and simplified words rather than scientific terms and professional jargon. Consider local beliefs and knowledge when deciding how best to provide the information."
                            maxWords={500}
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Layunin ng Pananaliksik (Tagalog Version)"
                            value={formData.purposeTagalog}
                            onChange={(val) => setFormData({...formData, purposeTagalog: val})}
                            helperText="Ipaliwanag ang layunin ng pananaliksik sa simpleng wika."
                            maxWords={500}
                            required
                          />
                        )}
                      </div>

                      {/* 3. Type of Research Intervention */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                          Type of Research Intervention
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Research Intervention (English Version)"
                            value={formData.researchInterventionEnglish}
                            onChange={(val) => setFormData({...formData, researchInterventionEnglish: val})}
                            helperText="Briefly state the type of intervention that will be undertaken. This will be expanded upon in the procedures section but it may be helpful and less confusing to the participant if they know from the very beginning whether, for example, the research involves a vaccine, an interview, a questionnaire, or a series of finger pricks."
                            maxWords={300}
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Uri ng Interbensyon (Tagalog Version)"
                            value={formData.researchInterventionTagalog}
                            onChange={(val) => setFormData({...formData, researchInterventionTagalog: val})}
                            helperText="Banggitin ang uri ng interbensyon na gagawin sa pag-aaral."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 4. Participant Selection */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">4</span>
                          Participant Selection
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Participant Selection (English Version)"
                            value={formData.participantSelectionEnglish}
                            onChange={(val) => setFormData({...formData, participantSelectionEnglish: val})}
                            helperText="Indicate why you have chosen this person to participate in this research. People wonder why they have been chosen and may be fearful, confused or concerned."
                            maxWords={300}
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagpili ng Kalahok (Tagalog Version)"
                            value={formData.participantSelectionTagalog}
                            onChange={(val) => setFormData({...formData, participantSelectionTagalog: val})}
                            helperText="Ipaliwanag kung bakit napili ang taong ito bilang kalahok sa pananaliksik."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 5. Voluntary Participation */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">5</span>
                          Voluntary Participation
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Voluntary Participation (English Version)"
                            value={formData.voluntaryParticipationEnglish}
                            onChange={(val) => setFormData({...formData, voluntaryParticipationEnglish: val})}
                            helperText="Indicate clearly that they can choose to participate or not. State, only if it is applicable, that they will still receive all the services they usually do if they choose not to participate."
                            maxWords={300}
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Kusang-loob na Paglahok (Tagalog Version)"
                            value={formData.voluntaryParticipationTagalog}
                            onChange={(val) => setFormData({...formData, voluntaryParticipationTagalog: val})}
                            helperText="Ipahayag nang malinaw na ang paglahok ay kusang-loob at maaaring tumanggi o umurong anumang oras."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 6. Procedures */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">6</span>
                          Procedures
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Procedures (English Version)"
                            value={formData.proceduresEnglish}
                            onChange={(val) => setFormData({...formData, proceduresEnglish: val})}
                            helperText="Provide a brief introduction to the format of the research study and explain the type of questions that participants are likely to be asked."
                            maxWords={500}
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Pamamaraan (Tagalog Version)"
                            value={formData.proceduresTagalog}
                            onChange={(val) => setFormData({...formData, proceduresTagalog: val})}
                            helperText="Ipaliwanag ang format ng pag-aaral at kung ano ang gagawin ng mga kalahok."
                            maxWords={500}
                            required
                          />
                        )}
                      </div>

                      {/* 7. Duration */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7</span>
                          Duration
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Duration (English Version)"
                            value={formData.durationEnglish}
                            onChange={(val) => setFormData({...formData, durationEnglish: val})}
                            helperText="Include a statement about the time commitments of the research for the participant including both the duration of the research and follow-up, if relevant."
                            maxWords={200}
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Tagal ng Pag-aaral (Tagalog Version)"
                            value={formData.durationTagalog}
                            onChange={(val) => setFormData({...formData, durationTagalog: val})}
                            helperText="Ipahayag ang tagal ng paglahok sa pananaliksik."
                            maxWords={200}
                            required
                          />
                        )}
                      </div>

                      {/* 8. Risks */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">8</span>
                          Risks
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Risks (English Version)"
                            value={formData.risksEnglish}
                            onChange={(val) => setFormData({...formData, risksEnglish: val})}
                            helperText="Explain and describe any risks that can be anticipated or that are possible. The risks depend upon the nature and type of qualitative intervention."
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Panganib (Tagalog Version)"
                            value={formData.risksTagalog}
                            onChange={(val) => setFormData({...formData, risksTagalog: val})}
                            helperText="Ilarawan ang anumang mga panganib o abala na maaaring maranasan ng mga kalahok."
                            required
                          />
                        )}
                      </div>

                      {/* 9. Benefits */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">9</span>
                          Benefits
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Benefits (English Version)"
                            value={formData.benefitsEnglish}
                            onChange={(val) => setFormData({...formData, benefitsEnglish: val})}
                            helperText="Benefits may be divided into benefits to the individual, benefits to the community in which the individual resides, and benefits to society as a whole."
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Benepisyo (Tagalog Version)"
                            value={formData.benefitsTagalog}
                            onChange={(val) => setFormData({...formData, benefitsTagalog: val})}
                            helperText="Ilarawan ang mga benepisyo para sa kalahok, komunidad, at lipunan."
                            required
                          />
                        )}
                      </div>

                      {/* 10. Reimbursements */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">10</span>
                          Reimbursements
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Reimbursements (English Version)"
                            value={formData.reimbursementsEnglish}
                            onChange={(val) => setFormData({...formData, reimbursementsEnglish: val})}
                            helperText="State clearly that the participants will not receive payments beyond reimbursements for expenses incurred because of their participation."
                            maxWords={200}
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Kabayaran (Tagalog Version)"
                            value={formData.reimbursementsTagalog}
                            onChange={(val) => setFormData({...formData, reimbursementsTagalog: val})}
                            helperText="Ipahayag kung makakatanggap ng anumang kabayaran ang kalahok."
                            maxWords={200}
                            required
                          />
                        )}
                      </div>

                      {/* 11. Confidentiality */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">11</span>
                          Confidentiality
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Confidentiality (English Version)"
                            value={formData.confidentialityEnglish}
                            onChange={(val) => setFormData({...formData, confidentialityEnglish: val})}
                            helperText="Explain how the research team will maintain the confidentiality of data with respect to both information about the participant and information that the participant shares."
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagiging Kumpidensyal (Tagalog Version)"
                            value={formData.confidentialityTagalog}
                            onChange={(val) => setFormData({...formData, confidentialityTagalog: val})}
                            helperText="Ipaliwanag kung paano papanatilihing kumpidensyal ang impormasyon ng mga kalahok."
                            required
                          />
                        )}
                      </div>

                      {/* 12. Sharing the Results */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">12</span>
                          Sharing the Results
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Sharing Results (English Version)"
                            value={formData.sharingResultsEnglish}
                            onChange={(val) => setFormData({...formData, sharingResultsEnglish: val})}
                            helperText="If there is a plan and a timeline for the sharing of information, include the details. The participant may also be informed that the research findings will be shared more broadly."
                            maxWords={300}
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagbabahagi ng mga Resulta (Tagalog Version)"
                            value={formData.sharingResultsTagalog}
                            onChange={(val) => setFormData({...formData, sharingResultsTagalog: val})}
                            helperText="Ipaliwanag kung paano at kailan ibabahagi ang mga resulta ng pag-aaral."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 13. Right to Refuse or Withdraw */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">13</span>
                          Right to Refuse or Withdraw
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Right to Refuse or Withdraw (English Version)"
                            value={formData.rightToRefuseEnglish}
                            onChange={(val) => setFormData({...formData, rightToRefuseEnglish: val})}
                            helperText="Reiterate that participation is voluntary and includes the right to withdraw. Tailor this section to ensure that it fits for the group for whom one is seeking consent."
                            maxWords={300}
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Karapatan na Tumanggi o Umurong (Tagalog Version)"
                            value={formData.rightToRefuseTagalog}
                            onChange={(val) => setFormData({...formData, rightToRefuseTagalog: val})}
                            helperText="Ipahayag muli na ang paglahok ay kusang-loob at may karapatang umurong anumang oras."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 14. Who to Contact */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">14</span>
                          Who to Contact
                        </h5>
                        
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Who to Contact (English Version)"
                            value={formData.whoToContactEnglish}
                            onChange={(val) => setFormData({...formData, whoToContactEnglish: val})}
                            helperText="Provide the name and contact information of someone who is involved, informed and accessible. State also the name of the local REC that has approved the proposal."
                            maxWords={300}
                            required
                          />
                        )}

                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Sino ang Makikipag-ugnayan (Tagalog Version)"
                            value={formData.whoToContactTagalog}
                            onChange={(val) => setFormData({...formData, whoToContactTagalog: val})}
                            helperText="Ibigay ang pangalan at contact information ng mga taong maaaring lapitan para sa mga katanungan."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* Conforme Section */}
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 sm:p-5 rounded-r-lg mt-8">
                        <h6 className="font-bold text-[#071139] text-sm mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Conforme:
                        </h6>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Researcher information and signatures
                        </p>
                      </div>

                      {step3Data && step3Data.signatures && step3Data.signatures.length > 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
                          <div className="space-y-6">
                            {step3Data.signatures.map((sig: any, index: number) => (
                              <div key={index} className="border-b border-gray-300 pb-6 last:border-b-0">
                                <div className="bg-white p-5 rounded-lg shadow-sm">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <p className="text-xs font-semibold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                        Print Name of Researcher:
                                      </p>
                                      <p className="text-sm text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                        {sig.name || '________________________'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                        Date: [MM/DD/YYYY]
                                      </p>
                                      <p className="text-sm text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                        {sig.date ? new Date(sig.date).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}) : '_____________________'}
                                      </p>
                                    </div>
                                  </div>
                                  {sig.signatureDataUrl && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      <p className="text-xs font-semibold text-[#071139] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                        Signature of Researcher:
                                      </p>
                                      <div className="border-2 border-gray-300 rounded-lg p-3 bg-white inline-block shadow-sm">
                                        <img 
                                          src={sig.signatureDataUrl} 
                                          alt={`Signature of ${sig.name}`}
                                          className="max-h-16"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-700 flex items-start gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                              These signatures from Step 3 will be included in your consent form.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-yellow-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              No signatures found from Step 3. Please ensure you complete Step 3 before finalizing this form.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Minor Assent Form */}
              {showMinorForm && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-l-4 border-purple-500 p-4 sm:p-5 rounded-r-lg">
                    <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Informed Assent Form (For Minors 12-15 years old)
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Select the language(s) you will provide for minor participants.
                    </p>
                  </div>

                  {/* Language Selection for Minors */}
                  <div>
                    <RadioGroup
                      label="Select Language for Minor Assent Form"
                      options={[
                        { value: 'english', label: 'English Only' },
                        { value: 'tagalog', label: 'Tagalog Only' },
                        { value: 'both', label: 'Both English and Tagalog' }
                      ]}
                      selected={minorLanguage}
                      onChange={(val) => setMinorLanguage(val as 'english' | 'tagalog' | 'both')}
                      required
                    />
                  </div>

                  {minorLanguage && (
                    <>
                      {/* PART 1: INFORMATION SHEET */}
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 border-l-4 border-[#FFD700] p-4 sm:p-5 rounded-r-lg">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          PART 1: INFORMATION SHEET
                        </h5>
                      </div>

                      {/* 1. Introduction */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                          Introduction
                        </h5>
                        
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Introduction (English Version)"
                            value={formData.introductionMinorEnglish}
                            onChange={(val) => setFormData({...formData, introductionMinorEnglish: val})}
                            helperText="Provide a brief description of the study, state the procedure, and explain the parental consent requirement. Use simple, child-friendly language."
                            maxWords={400}
                            required
                          />
                        )}

                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Panimula (Tagalog Version)"
                            value={formData.introductionMinorTagalog}
                            onChange={(val) => setFormData({...formData, introductionMinorTagalog: val})}
                            helperText="Magbigay ng maikling paglalarawan ng pag-aaral. Gumamit ng simple na wika na nauunawaan ng mga bata."
                            maxWords={400}
                            required
                          />
                        )}
                      </div>

                      {/* 2. Purpose of Research */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                          Purpose of Research
                        </h5>
                        
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Purpose (English Version)"
                            value={formData.purposeMinorEnglish}
                            onChange={(val) => setFormData({...formData, purposeMinorEnglish: val})}
                            helperText="Explain the purpose of research in simple terms that children can understand."
                            maxWords={300}
                            required
                          />
                        )}

                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Layunin (Tagalog Version)"
                            value={formData.purposeMinorTagalog}
                            onChange={(val) => setFormData({...formData, purposeMinorTagalog: val})}
                            helperText="Ipaliwanag ang layunin ng pananaliksik sa simpleng wika."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 3. Choice of Participants */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">3</span>
                          Choice of Participants
                        </h5>
                        
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Choice of Participants (English Version)"
                            value={formData.choiceOfParticipantsEnglish}
                            onChange={(val) => setFormData({...formData, choiceOfParticipantsEnglish: val})}
                            helperText="Explain why the participants of the study were chosen."
                            maxWords={200}
                            required
                          />
                        )}

                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagpili ng mga Kalahok (Tagalog Version)"
                            value={formData.choiceOfParticipantsTagalog}
                            onChange={(val) => setFormData({...formData, choiceOfParticipantsTagalog: val})}
                            helperText="Ipaliwanag kung bakit napili ang mga kalahok."
                            maxWords={200}
                            required
                          />
                        )}
                      </div>

                      {/* 4. Voluntariness of Participation */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">4</span>
                          Voluntariness of Participation
                        </h5>
                        
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Voluntariness (English Version)"
                            value={formData.voluntarinessMinorEnglish}
                            onChange={(val) => setFormData({...formData, voluntarinessMinorEnglish: val})}
                            helperText="State clearly that the choice to participate is voluntary and their decision not to participate might be over-ridden by parental consent."
                            maxWords={300}
                            required
                          />
                        )}

                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Kusang-loob na Paglahok (Tagalog Version)"
                            value={formData.voluntarinessMinorTagalog}
                            onChange={(val) => setFormData({...formData, voluntarinessMinorTagalog: val})}
                            helperText="Ipahayag na ang paglahok ay kusang-loob."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 5. Procedures */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">5</span>
                          Procedures
                        </h5>
                        
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Procedures (English Version)"
                            value={formData.proceduresMinorEnglish}
                            onChange={(val) => setFormData({...formData, proceduresMinorEnglish: val})}
                            helperText="Explain the procedures in simple terms."
                            maxWords={400}
                            required
                          />
                        )}

                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Proseso (Tagalog Version)"
                            value={formData.proceduresMinorTagalog}
                            onChange={(val) => setFormData({...formData, proceduresMinorTagalog: val})}
                            helperText="Ipaliwanag ang mga proseso sa simpleng wika."
                            maxWords={400}
                            required
                          />
                        )}
                      </div>

                      {/* 6. Risk and Inconveniences */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">6</span>
                          Risk and Inconveniences
                        </h5>
                        
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Risks (English Version)"
                            value={formData.risksMinorEnglish}
                            onChange={(val) => setFormData({...formData, risksMinorEnglish: val})}
                            helperText="Describe what has been found that causes worry and how you, as a researcher, ensure that it will be prevented from happening."
                            maxWords={300}
                            required
                          />
                        )}

                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Panganib (Tagalog Version)"
                            value={formData.risksMinorTagalog}
                            onChange={(val) => setFormData({...formData, risksMinorTagalog: val})}
                            helperText="Ilarawan ang mga panganib at kung paano ito maiiwasan."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 7. Possible Benefits */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">7</span>
                          Possible Benefits for the Participants
                        </h5>
                        
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Benefits (English Version)"
                            value={formData.benefitsMinorEnglish}
                            onChange={(val) => setFormData({...formData, benefitsMinorEnglish: val})}
                            helperText="Describe any benefits to the child (and to others)."
                            maxWords={300}
                            required
                          />
                        )}

                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Benepisyo (Tagalog Version)"
                            value={formData.benefitsMinorTagalog}
                            onChange={(val) => setFormData({...formData, benefitsMinorTagalog: val})}
                            helperText="Ilarawan ang mga benepisyo para sa bata."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 8. Confidentiality */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">8</span>
                          Confidentiality
                        </h5>
                        
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Confidentiality (English Version)"
                            value={formData.confidentialityMinorEnglish}
                            onChange={(val) => setFormData({...formData, confidentialityMinorEnglish: val})}
                            helperText="State the limits and the scope of confidentiality of this research."
                            maxWords={300}
                            required
                          />
                        )}

                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagiging Kumpidensyal (Tagalog Version)"
                            value={formData.confidentialityMinorTagalog}
                            onChange={(val) => setFormData({...formData, confidentialityMinorTagalog: val})}
                            helperText="Ipahayag ang saklaw ng pagiging kumpidensyal."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 9. Sharing the Findings */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-[#071139] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">9</span>
                          Sharing the Findings
                        </h5>
                        
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Sharing Findings (English Version)"
                            value={formData.sharingFindingsEnglish}
                            onChange={(val) => setFormData({...formData, sharingFindingsEnglish: val})}
                            helperText="Explain how the research findings will be shared in which confidential information will remain confidential."
                            maxWords={200}
                            required
                          />
                        )}

                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagbabahagi ng mga Natuklasan (Tagalog Version)"
                            value={formData.sharingFindingsTagalog}
                            onChange={(val) => setFormData({...formData, sharingFindingsTagalog: val})}
                            helperText="Ipaliwanag kung paano ibabahagi ang mga natuklasan."
                            maxWords={200}
                            required
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Navigation Buttons INSIDE FORM - Matching Step 3 */}
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
                  className="w-full sm:w-auto group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Proceed to next step"
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
    </div>
  );
}
