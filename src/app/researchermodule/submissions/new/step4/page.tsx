'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import ErrorModal from '@/components/researcher/submission/shared/ErrorModal';
import { RadioGroup } from '@/components/researcher/submission/FormComponents';
import { AlertCircle } from 'lucide-react';

// Components
import Step4Header from '@/components/researcher/submission/steps/step4/Step4Header';
import Step4Instructions from '@/components/researcher/submission/steps/step4/Step4Instructions';
import AdultConsentForm from '@/components/researcher/submission/steps/step4/AdultConsentForm';
import MinorAssentForm from '@/components/researcher/submission/steps/step4/MinorAssentForm';

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

  // Helper functions inside component
  const stripHtmlTags = (html: string | undefined): string => {
    if (!html) return '';
    if (typeof document === 'undefined') return html;
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
        const requiredEnglishFields = [
          { val: formData.introductionEnglish, name: 'Introduction (English)' },
          { val: formData.purposeEnglish, name: 'Purpose (English)' },
          { val: formData.researchInterventionEnglish, name: 'Research Intervention (English)' },
          { val: formData.participantSelectionEnglish, name: 'Participant Selection (English)' },
          { val: formData.voluntaryParticipationEnglish, name: 'Voluntary Participation (English)' },
          { val: formData.proceduresEnglish, name: 'Procedures (English)' },
          { val: formData.durationEnglish, name: 'Duration (English)' },
          { val: formData.risksEnglish, name: 'Risks (English)' },
          { val: formData.benefitsEnglish, name: 'Benefits (English)' },
          { val: formData.reimbursementsEnglish, name: 'Reimbursements (English)' },
          { val: formData.confidentialityEnglish, name: 'Confidentiality (English)' },
          { val: formData.sharingResultsEnglish, name: 'Sharing Results (English)' },
          { val: formData.rightToRefuseEnglish, name: 'Right to Refuse (English)' },
          { val: formData.whoToContactEnglish, name: 'Who to Contact (English)' },
        ];
        
        requiredEnglishFields.forEach(field => {
           const err = validateInput(stripHtmlTags(field.val), field.name);
           if (err) errors.push(err);
        });
      }
      
      if (adultLanguage === 'tagalog' || adultLanguage === 'both') {
         const requiredTagalogFields = [
          { val: formData.introductionTagalog, name: 'Panimula (Tagalog)' },
          { val: formData.purposeTagalog, name: 'Layunin (Tagalog)' },
          { val: formData.researchInterventionTagalog, name: 'Interbensyon (Tagalog)' },
          { val: formData.participantSelectionTagalog, name: 'Pagpili ng Kalahok (Tagalog)' },
          { val: formData.voluntaryParticipationTagalog, name: 'Kusang-loob na Paglahok (Tagalog)' },
          { val: formData.proceduresTagalog, name: 'Mga Pamamaraan (Tagalog)' },
          { val: formData.durationTagalog, name: 'Tagal ng Pag-aaral (Tagalog)' },
          { val: formData.risksTagalog, name: 'Mga Panganib (Tagalog)' },
          { val: formData.benefitsTagalog, name: 'Mga Benepisyo (Tagalog)' },
          { val: formData.reimbursementsTagalog, name: 'Kabayaran (Tagalog)' },
          { val: formData.confidentialityTagalog, name: 'Kumpidensyal (Tagalog)' },
          { val: formData.sharingResultsTagalog, name: 'Pagbabahagi ng Resulta (Tagalog)' },
          { val: formData.rightToRefuseTagalog, name: 'Karapatang Tumanggi (Tagalog)' },
          { val: formData.whoToContactTagalog, name: 'Sino ang Kokontakin (Tagalog)' },
        ];
        
        requiredTagalogFields.forEach(field => {
           const err = validateInput(stripHtmlTags(field.val), field.name);
           if (err) errors.push(err);
        });
      }
    }

    if (consentType === 'minor' || consentType === 'both') {
      if (!minorLanguage) {
        errors.push('Please select language for minor assent form');
      }
      
      if (minorLanguage === 'english' || minorLanguage === 'both') {
        const requiredMinorEnglish = [
            { val: formData.introductionMinorEnglish, name: 'Introduction - Minor (English)' },
            { val: formData.purposeMinorEnglish, name: 'Purpose - Minor (English)' },
            { val: formData.choiceOfParticipantsEnglish, name: 'Choice of Participants - Minor (English)' },
            { val: formData.voluntarinessMinorEnglish, name: 'Voluntariness - Minor (English)' },
            { val: formData.proceduresMinorEnglish, name: 'Procedures - Minor (English)' },
            { val: formData.risksMinorEnglish, name: 'Risks - Minor (English)' },
            { val: formData.benefitsMinorEnglish, name: 'Benefits - Minor (English)' },
            { val: formData.confidentialityMinorEnglish, name: 'Confidentiality - Minor (English)' },
            { val: formData.sharingFindingsEnglish, name: 'Sharing Findings - Minor (English)' },
        ];
        requiredMinorEnglish.forEach(field => {
            const err = validateInput(stripHtmlTags(field.val), field.name);
            if (err) errors.push(err);
        });
      }
      
      if (minorLanguage === 'tagalog' || minorLanguage === 'both') {
        const requiredMinorTagalog = [
            { val: formData.introductionMinorTagalog, name: 'Panimula - Minor (Tagalog)' },
            { val: formData.purposeMinorTagalog, name: 'Layunin - Minor (Tagalog)' },
            { val: formData.choiceOfParticipantsTagalog, name: 'Pagpili ng Kalahok - Minor (Tagalog)' },
            { val: formData.voluntarinessMinorTagalog, name: 'Kusang-loob - Minor (Tagalog)' },
            { val: formData.proceduresMinorTagalog, name: 'Mga Proseso - Minor (Tagalog)' },
            { val: formData.risksMinorTagalog, name: 'Mga Panganib - Minor (Tagalog)' },
            { val: formData.benefitsMinorTagalog, name: 'Mga Benepisyo - Minor (Tagalog)' },
            { val: formData.confidentialityMinorTagalog, name: 'Kumpidensyal - Minor (Tagalog)' },
            { val: formData.sharingFindingsTagalog, name: 'Pagbabahagi - Minor (Tagalog)' },
        ];
        requiredMinorTagalog.forEach(field => {
            const err = validateInput(stripHtmlTags(field.val), field.name);
            if (err) errors.push(err);
        });
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
        
        // Use spreading with defaults to ensure no undefined values
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
          <Step4Header onBack={handleBack} />

          {/* Enhanced Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <form className="space-y-6 sm:space-y-8" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              
              <Step4Instructions />

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
                <AdultConsentForm 
                  adultLanguage={adultLanguage}
                  setAdultLanguage={(val) => setAdultLanguage(val as '' | 'english' | 'tagalog' | 'both')}
                  formData={formData}
                  setFormData={setFormData}
                  step2Data={step2Data}
                  step3Data={step3Data}
                />
              )}

              {/* Minor Assent Form */}
              {showMinorForm && (
                 <MinorAssentForm
                  minorLanguage={minorLanguage}
                  setMinorLanguage={(val) => setMinorLanguage(val as '' | 'english' | 'tagalog' | 'both')}
                  formData={formData}
                  setFormData={setFormData}
                 />
              )}
              
              {/* Important Note */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#F7D117] p-4 sm:p-6 rounded-xl shadow-sm mt-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#F7D117] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <AlertCircle size={20} className="text-[#071139]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#071139] mb-2 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>Important Note:</h4>
                    <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Your progress is automatically saved. You can safely close or refresh this page and return later. All your data will be preserved until final submission.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t-2 border-gray-200">
                <button type="button" onClick={handleBack} className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gray-200 text-[#071139] rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105">
                  <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg> Previous Step
                  </span>
                </button>
                <button type="submit" className="w-full sm:w-auto group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#F7D117] via-white/10 to-[#F7D117] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                      Next Step <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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
