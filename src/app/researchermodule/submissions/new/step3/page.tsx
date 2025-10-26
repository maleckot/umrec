// app/researchermodule/submissions/new/step3/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, FileText, AlertCircle, X, Plus, User, PenTool, Users } from 'lucide-react';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { FileUpload } from '@/components/researcher/submission/FormComponents';

// Custom Error Modal Component
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
        {/* Header with gradient */}
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

        {/* Error List */}
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

        {/* Footer */}
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

interface ResearcherSignature {
  id: string;
  name: string;
  signature: File | null;
}

export default function Step3ResearchProtocol() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Initialize with empty strings to prevent uncontrolled input warning
  const [formData, setFormData] = useState({
    title: '',
    introduction: '',
    background: '',
    problemStatement: '',
    scopeDelimitation: '',
    literatureReview: '',
    methodology: '',
    population: '',
    samplingTechnique: '',
    researchInstrument: '',
    ethicalConsideration: '',
    statisticalTreatment: '',
    references: '',
  });

  const [researchers, setResearchers] = useState<ResearcherSignature[]>([
    { id: '1', name: '', signature: null }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorList, setErrorList] = useState<string[]>([]);

  // Load saved data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('step3Data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          if (parsedData.formData) {
            setFormData({
              title: parsedData.formData.title || '',
              introduction: parsedData.formData.introduction || '',
              background: parsedData.formData.background || '',
              problemStatement: parsedData.formData.problemStatement || '',
              scopeDelimitation: parsedData.formData.scopeDelimitation || '',
              literatureReview: parsedData.formData.literatureReview || '',
              methodology: parsedData.formData.methodology || '',
              population: parsedData.formData.population || '',
              samplingTechnique: parsedData.formData.samplingTechnique || '',
              researchInstrument: parsedData.formData.researchInstrument || '',
              ethicalConsideration: parsedData.formData.ethicalConsideration || '',
              statisticalTreatment: parsedData.formData.statisticalTreatment || '',
              references: parsedData.formData.references || '',
            });
          }
          if (parsedData.researchers && Array.isArray(parsedData.researchers)) {
            setResearchers(parsedData.researchers.map((r: any) => ({ 
              id: r.id || '1', 
              name: r.name || '', 
              signature: null 
            })));
          }
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      } else {
        const step1 = localStorage.getItem('step1Data');
        if (step1) {
          try {
            const step1Data = JSON.parse(step1);
            setFormData(prev => ({
              ...prev,
              title: step1Data.title || ''
            }));
            
            const fullName = `${step1Data.projectLeaderFirstName || ''} ${step1Data.projectLeaderMiddleName || ''} ${step1Data.projectLeaderLastName || ''}`.trim();
            if (fullName) {
              setResearchers([{ id: '1', name: fullName, signature: null }]);
            }
          } catch (error) {
            console.error('Error loading step1 data:', error);
          }
        }
      }
    }
    isInitialMount.current = false;
  }, []);

  // Auto-save on data change
  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const dataToSave = {
        formData,
        researchers: researchers.map(r => ({ id: r.id, name: r.name, signature: null }))
      };
      localStorage.setItem('step3Data', JSON.stringify(dataToSave));
      console.log('💾 Step 3 auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, researchers]);

  // ✅ Validation function
  const validateInput = (value: string, fieldName: string, allowNA: boolean = false): string | null => {
    const trimmedValue = value.trim().toLowerCase();
    
    if (!trimmedValue) {
      return `${fieldName} is required`;
    }

    const naVariations = ['n/a', 'na', 'n.a', 'n.a.', 'not applicable', 'none'];
    if (!allowNA && naVariations.includes(trimmedValue)) {
      return `${fieldName} cannot be "N/A". Please provide actual content or research details`;
    }

    const irrelevantPhrases = [
      'i dont know', "i don't know", 'idk', 'working in progress',
      'work in progress', 'wip', 'tbd', 'to be determined',
      'later', 'soon', 'testing', 'test', 'asdf', 'qwerty',
      '123', 'abc', 'unknown', 'temp', 'temporary'
    ];

    if (irrelevantPhrases.some(phrase => trimmedValue.includes(phrase))) {
      return `${fieldName} contains invalid text. Please provide accurate information`;
    }

    if (trimmedValue.length < 10) {
      return `${fieldName} must be at least 10 characters`;
    }

    return null;
  };

  const stripHtmlTags = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

const handleNext = () => {
    const newErrors: Record<string, string> = {};
    let hasError = false;
    let firstErrorField = '';
    
    // Define all required fields
    const requiredFields = [
      { value: formData.title, name: 'Title of the Study', id: 'study-title', key: 'title' },
      { value: stripHtmlTags(formData.introduction), name: 'Introduction', id: 'introduction-editor', key: 'introduction' },
      { value: stripHtmlTags(formData.background), name: 'Background of the Study', id: 'background-editor', key: 'background' },
      { value: stripHtmlTags(formData.problemStatement), name: 'Statement of the Problem/Objectives', id: 'problem-statement-editor', key: 'problemStatement' },
      { value: stripHtmlTags(formData.scopeDelimitation), name: 'Scope and Delimitation', id: 'scope-delimitation-editor', key: 'scopeDelimitation' },
      { value: stripHtmlTags(formData.literatureReview), name: 'Related Literature & Studies', id: 'literature-review-editor', key: 'literatureReview' },
      { value: stripHtmlTags(formData.methodology), name: 'Research Methodology', id: 'methodology-editor', key: 'methodology' },
      { value: stripHtmlTags(formData.population), name: 'Population/Respondents/Sample Size', id: 'population-editor', key: 'population' },
      { value: stripHtmlTags(formData.samplingTechnique), name: 'Sampling Technique/Criteria', id: 'sampling-technique-editor', key: 'samplingTechnique' },
      { value: stripHtmlTags(formData.researchInstrument), name: 'Research Instrument', id: 'research-instrument-editor', key: 'researchInstrument' },
      { value: stripHtmlTags(formData.ethicalConsideration), name: 'Ethical Consideration', id: 'ethical-consideration-editor', key: 'ethicalConsideration' },
      { value: stripHtmlTags(formData.statisticalTreatment), name: 'Statistical Treatment/Data Analysis', id: 'statistical-treatment-editor', key: 'statisticalTreatment' },
      { value: stripHtmlTags(formData.references), name: 'References', id: 'references-editor', key: 'references' },
    ];

    // ✅ Check ALL fields and collect errors
    for (const field of requiredFields) {
      if (!field.value.trim()) {
        newErrors[field.key] = `Please fill out this field`;
        
        if (!hasError) {
          firstErrorField = field.id;
          hasError = true;
        }
      }
    }

    // ✅ Check ALL researcher fields
    for (let index = 0; index < researchers.length; index++) {
      const researcher = researchers[index];
      
      if (!researcher.name.trim()) {
        newErrors[`researcher_name_${researcher.id}`] = `Please fill out this field`;
        
        if (!hasError) {
          firstErrorField = `researcher-name-${researcher.id}`;
          hasError = true;
        }
      }
      
      if (!researcher.signature) {
        newErrors[`researcher_signature_${researcher.id}`] = `Please upload signature`;
        
        if (!hasError) {
          firstErrorField = `researcher-signature-${researcher.id}`;
          hasError = true;
        }
      }
    }

    // If there are any blank field errors, show them and scroll to first error
    if (hasError) {
      setErrors(newErrors);
      
      // Scroll to the first error field
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          element.focus();
        }, 500);
      }
      
      return; // Stop here - don't proceed to content validation
    }

    // ✅ Now validate content quality (N/A, invalid text, etc.) - only if all fields are filled
    const contentErrors: Record<string, string> = {};

    const titleError = validateInput(formData.title, 'Title of the Study');
    if (titleError) contentErrors.title = titleError;

    const introText = stripHtmlTags(formData.introduction);
    const introError = validateInput(introText, 'Introduction');
    if (introError) contentErrors.introduction = introError;

    const backgroundText = stripHtmlTags(formData.background);
    const backgroundError = validateInput(backgroundText, 'Background of the Study');
    if (backgroundError) contentErrors.background = backgroundError;

    const problemText = stripHtmlTags(formData.problemStatement);
    const problemError = validateInput(problemText, 'Statement of the Problem/Objectives');
    if (problemError) contentErrors.problemStatement = problemError;

    const scopeText = stripHtmlTags(formData.scopeDelimitation);
    const scopeError = validateInput(scopeText, 'Scope and Delimitation');
    if (scopeError) contentErrors.scopeDelimitation = scopeError;

    const literatureText = stripHtmlTags(formData.literatureReview);
    const literatureError = validateInput(literatureText, 'Related Literature & Studies');
    if (literatureError) contentErrors.literatureReview = literatureError;

    const methodologyText = stripHtmlTags(formData.methodology);
    const methodologyError = validateInput(methodologyText, 'Research Methodology');
    if (methodologyError) contentErrors.methodology = methodologyError;

    const populationText = stripHtmlTags(formData.population);
    const populationError = validateInput(populationText, 'Population/Respondents/Sample Size');
    if (populationError) contentErrors.population = populationError;

    const samplingText = stripHtmlTags(formData.samplingTechnique);
    const samplingError = validateInput(samplingText, 'Sampling Technique/Criteria of Participants');
    if (samplingError) contentErrors.samplingTechnique = samplingError;

    const instrumentText = stripHtmlTags(formData.researchInstrument);
    const instrumentError = validateInput(instrumentText, 'Research Instrument and Validation');
    if (instrumentError) contentErrors.researchInstrument = instrumentError;

    const ethicalText = stripHtmlTags(formData.ethicalConsideration);
    const ethicalError = validateInput(ethicalText, 'Ethical Consideration');
    if (ethicalError) contentErrors.ethicalConsideration = ethicalError;

    const statisticalText = stripHtmlTags(formData.statisticalTreatment);
    const statisticalError = validateInput(statisticalText, 'Statistical Treatment of Data/Data Analysis');
    if (statisticalError) contentErrors.statisticalTreatment = statisticalError;

    const referencesText = stripHtmlTags(formData.references);
    const referencesError = validateInput(referencesText, 'References');
    if (referencesError) contentErrors.references = referencesError;

    // Validate researchers content quality
    researchers.forEach((researcher, index) => {
      const nameError = validateInput(researcher.name, `Member ${index + 1} Name`, true);
      if (nameError) {
        contentErrors[`researcher_name_${researcher.id}`] = nameError;
      }
    });

    // If there are content validation errors (N/A, invalid text, etc.), show modal
    if (Object.keys(contentErrors).length > 0) {
      setErrors(contentErrors);
      setErrorList(Object.values(contentErrors));
      setShowErrorModal(true);
      
      const firstErrorField = Object.keys(contentErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    // Clear errors and proceed
    setErrors({});
    const dataToSave = {
      formData,
      researchers: researchers.map(r => ({ id: r.id, name: r.name, signature: null }))
    };
    localStorage.setItem('step3Data', JSON.stringify(dataToSave));
    router.push('/researchermodule/submissions/new/step4');
  };



  const handleBack = () => {
    router.push('/researchermodule/submissions/new/step2');
  };

  const addResearcher = () => {
    const newId = (Math.max(...researchers.map(r => parseInt(r.id)), 0) + 1).toString();
    setResearchers([...researchers, { id: newId, name: '', signature: null }]);
  };

  const removeResearcher = (id: string) => {
    if (researchers.length > 1) {
      setResearchers(researchers.filter(r => r.id !== id));
    }
  };

  const updateResearcher = async (id: string, field: 'name' | 'signature', value: string | File | null) => {
    if (field === 'signature' && value instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(value);
      reader.onload = () => {
        const base64 = reader.result as string;
        sessionStorage.setItem(`signature_${id}`, base64);
        console.log(`✅ Saved signature for researcher ${id} to sessionStorage`);
        setResearchers(researchers.map(r =>
          r.id === id ? { ...r, signature: value } : r
        ));
      };
    } else {
      setResearchers(researchers.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      
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
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>3</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Research Protocol
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Provide detailed information about your research. Use formatting tools for better presentation.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-[#F7D117] to-[#B8860B] h-3 transition-all duration-500 rounded-full shadow-lg"
                style={{ width: '37.5%' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Step 3 of 8
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                37% Complete
              </span>
            </div>
          </div>

          {/* Enhanced Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
<form className="space-y-6 sm:space-y-8">
              {/* Instructions */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#071139] text-base sm:text-lg mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Instructions to the Researcher
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      To ensure a thorough and efficient review process, completely accomplish this form. Include all relevant information to facilitate a comprehensive review by the Ethics committee. <strong className="text-red-600">Do not write "N/A" - provide actual research details for all fields.</strong>
                    </p>
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-xs sm:text-sm font-semibold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Available Formatting Options:
                      </p>
                      <ul className="text-xs sm:text-sm text-gray-700 space-y-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        <li>• <strong>Text formatting:</strong> Bold, italic, underline, lists (bullet/numbered)</li>
                        <li>• <strong>Alignment & indentation:</strong> Align text left/center/right/justify, adjust indentation</li>
                        <li>• <strong>Media uploads:</strong> Upload images and tables per section</li>
                        <li>• <strong>Auto-save:</strong> Your progress is automatically saved every few seconds</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* I. Title of the Study */}
              <div>
                <label 
                  htmlFor="study-title"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  I. Title of the Study <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Indicate the complete title of the research.
                </p>
                <input
                  id="study-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${
                    errors.title 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  placeholder="Enter your research title"
aria-required="true"

                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.title}
                  </p>
                )}
              </div>

              {/* II. Introduction */}
              <div>
                <label 
                  htmlFor="introduction-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  II. Introduction <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Provide a brief introduction to the study which includes an overview of the study.
                </p>
                <div className={errors.introduction ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.introduction}
                    onChange={(val) => setFormData({ ...formData, introduction: val })}
                    helperText=""
                    maxWords={0}
                  />
                </div>
                {errors.introduction && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.introduction}
                  </p>
                )}
              </div>

              {/* III. Background */}
              <div>
                <label 
                  htmlFor="background-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  III. Background of the Study <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Include the reason for embarking on the study, the historical background of the study, and the research gap.
                </p>
                <div className={errors.background ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.background}
                    onChange={(val) => setFormData({ ...formData, background: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.background && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.background}
                  </p>
                )}
              </div>

              {/* IV. Problem Statement */}
              <div>
                <label 
                  htmlFor="problem-statement-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  IV. Statement of the Problem/Objectives of the Study <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Include the general and specific research problems/objectives of the study.
                </p>
                <div className={errors.problemStatement ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.problemStatement}
                    onChange={(val) => setFormData({ ...formData, problemStatement: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.problemStatement && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.problemStatement}
                  </p>
                )}
              </div>

              {/* V. Scope and Delimitation */}
              <div>
                <label 
                  htmlFor="scope-delimitation-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  V. Scope and Delimitation <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Provide the locale, topic, and respondent inclusions and the exclusions.
                </p>
                <div className={errors.scopeDelimitation ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.scopeDelimitation}
                    onChange={(val) => setFormData({ ...formData, scopeDelimitation: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.scopeDelimitation && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.scopeDelimitation}
                  </p>
                )}
              </div>

              {/* VI. Literature Review */}
              <div>
                <label 
                  htmlFor="literature-review-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  VI. Related Literature & Studies <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Write the related literature and studies that support the objectives/problem.
                </p>
                <div className={errors.literatureReview ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.literatureReview}
                    onChange={(val) => setFormData({ ...formData, literatureReview: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.literatureReview && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.literatureReview}
                  </p>
                )}
              </div>

              {/* VII. Methodology */}
              <div>
                <label 
                  htmlFor="methodology-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  VII. Research Methodology <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Indicate the research design of the study.
                </p>
                <div className={errors.methodology ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.methodology}
                    onChange={(val) => setFormData({ ...formData, methodology: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.methodology && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.methodology}
                  </p>
                )}
              </div>

              {/* VIII. Population */}
              <div>
                <label 
                  htmlFor="population-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  VIII. Population, Respondents, and Sample Size for <strong>Quantitative Research</strong> / Participants for <strong>Qualitative Research</strong> <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Include the population of the study and indicate the number of respondents. Participants for Qualitative Research: Indicate the participants of the study.
                </p>
                <div className={errors.population ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.population}
                    onChange={(val) => setFormData({ ...formData, population: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.population && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.population}
                  </p>
                )}
              </div>

              {/* IX. Sampling Technique */}
              <div>
                <label 
                  htmlFor="sampling-technique-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  IX. Sampling Technique for <strong>Quantitative Research</strong> / Criteria of Participants for <strong>Qualitative Research</strong> <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Present the sampling technique for quantitative. Criteria of Participants for Qualitative Research: Write the criteria for choosing participants.
                </p>
                <div className={errors.samplingTechnique ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.samplingTechnique}
                    onChange={(val) => setFormData({ ...formData, samplingTechnique: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.samplingTechnique && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.samplingTechnique}
                  </p>
                )}
              </div>

              {/* X. Research Instrument */}
              <div>
                <label 
                  htmlFor="research-instrument-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  X. Research Instrument and Validation for <strong>Quantitative Research</strong> / Interview/FGD Questions for <strong>Qualitative Research</strong> <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Describe the details of the questionnaire or Interview/FGD Questions. Interview/FGD Questions for Qualitative Research: Describe the details of the Interview/FGD Questions.
                </p>
                <div className={errors.researchInstrument ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.researchInstrument}
                    onChange={(val) => setFormData({ ...formData, researchInstrument: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.researchInstrument && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.researchInstrument}
                  </p>
                )}
              </div>

              {/* XI. Ethical Consideration */}
              <div>
                <label 
                  htmlFor="ethical-consideration-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  XI. Ethical Consideration <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Explain the risks, benefits, mitigation of risks, inconveniences, vulnerability, data protection plan, and confidentiality of the study.
                </p>
                <div className={errors.ethicalConsideration ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.ethicalConsideration}
                    onChange={(val) => setFormData({ ...formData, ethicalConsideration: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.ethicalConsideration && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.ethicalConsideration}
                  </p>
                )}
              </div>

              {/* XII. Statistical Treatment */}
              <div>
                <label 
                  htmlFor="statistical-treatment-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  XII. Statistical Treatment of Data for <strong>Quantitative Research</strong> / Data Analysis for <strong>Qualitative Research</strong> <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Indicate the statistical tool of the study. Data Analysis for Qualitative Research: Indicate how the study will be analyzed.
                </p>
                <div className={errors.statisticalTreatment ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.statisticalTreatment}
                    onChange={(val) => setFormData({ ...formData, statisticalTreatment: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.statisticalTreatment && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.statisticalTreatment}
                  </p>
                )}
              </div>

              {/* XIII. References */}
              <div>
                <label 
                  htmlFor="references-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  XIII. References (Main Themes Only) <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Indicate the main references of the study.
                </p>
                <div className={errors.references ? 'border-2 border-red-500 rounded-xl p-1' : ''}>
                  <RichTextEditor
                    label=""
                    value={formData.references}
                    onChange={(val) => setFormData({ ...formData, references: val })}
                    helperText=""
                    maxWords={0}
                    
                  />
                </div>
                {errors.references && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.references}
                  </p>
                )}
              </div>

              {/* Accomplished By Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 sm:p-8 rounded-xl shadow-sm mt-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#071139] text-base sm:text-lg mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Accomplished By (Research Team Members)
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        All research team members must provide their printed name and signature below.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addResearcher}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <Plus size={18} />
                    Add Member
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {researchers.map((researcher, index) => (
                    <div key={researcher.id} className="bg-white p-6 sm:p-8 rounded-xl border-2 border-gray-200 relative shadow-sm hover:shadow-md transition-shadow duration-300">
                      {researchers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeResearcher(researcher.id)}
                          className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors z-10"
                          title="Remove member"
                          aria-label={`Remove member ${index + 1}`}
                        >
                          <X size={20} />
                        </button>
                      )}

                      <div className="flex items-center gap-3 mb-6 pr-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] text-white rounded-lg flex items-center justify-center font-bold shadow-md">
                          <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{index + 1}</span>
                        </div>
                        <h5 className="font-bold text-[#071139] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Member {index + 1}
                        </h5>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label 
                            htmlFor={`researcher-name-${researcher.id}`}
                            className="flex items-center gap-2 text-sm font-bold mb-3 text-[#071139]" 
                            style={{ fontFamily: 'Metropolis, sans-serif' }}
                          >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                              <User size={14} className="text-[#F7D117]" />
                            </div>
                            Printed Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id={`researcher-name-${researcher.id}`}
                            type="text"
                            value={researcher.name}
                            onChange={(e) => updateResearcher(researcher.id, 'name', e.target.value)}
                            placeholder="Enter full name"
                            className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${
                              errors[`researcher_name_${researcher.id}`]
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'
                            }`}
                            style={{ fontFamily: 'Metropolis, sans-serif' }}
                            required
                            aria-required="true"
                          />
                          {errors[`researcher_name_${researcher.id}`] && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              <AlertCircle size={16} /> {errors[`researcher_name_${researcher.id}`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label 
                            htmlFor={`researcher-signature-${researcher.id}`}
                            className="flex items-center gap-2 text-sm font-bold mb-3 text-[#071139]" 
                            style={{ fontFamily: 'Metropolis, sans-serif' }}
                          >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                              <PenTool size={14} className="text-[#F7D117]" />
                            </div>
                            Signature <span className="text-red-500">*</span>
                          </label>
                          <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Upload a scanned copy or digital signature (PNG, JPG, or PDF format, max 5MB)
                          </p>
                          <div className={errors[`researcher_signature_${researcher.id}`] ? 'border-2 border-red-500 rounded-xl p-2' : ''}>
                            <FileUpload
                              label=""
                              value={researcher.signature}
                              onChange={(file) => updateResearcher(researcher.id, 'signature', file)}
                              accept="image/*,.pdf"
                              helperText=""
                              required
                            />
                          </div>
                          {errors[`researcher_signature_${researcher.id}`] && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              <AlertCircle size={16} /> {errors[`researcher_signature_${researcher.id}`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#F7D117] p-4 sm:p-6 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#F7D117] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <AlertCircle size={20} className="text-[#071139]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#071139] mb-2 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Important Note:
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Your progress is automatically saved. You can safely close or refresh this page and return later. All your data will be preserved until final submission.
                    </p>
                  </div>
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

      {/* Custom Error Modal */}
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
        errors={errorList}
      />
    </div>
  );
}
