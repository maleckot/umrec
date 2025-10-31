// app/researchermodule/submissions/revision/step3/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, FileText, AlertCircle, X, Plus, User, PenTool, Users, MessageSquare } from 'lucide-react';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { FileUpload } from '@/components/researcher/submission/FormComponents';
import { saveStep3Data } from '@/app/actions/lib/saveStep3';

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
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
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

// Revision Comment Box Component
const RevisionCommentBox: React.FC<{ comments: string }> = ({ comments }) => {
  return (
    <div className="mb-6 sm:mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Reviewer Comments
          </h3>
          <p className="text-amber-800 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {comments}
          </p>
        </div>
      </div>
    </div>
  );
};

interface ResearcherSignature {
  id: string;
  name: string;
  signature: File | null;
}

export default function RevisionStep3() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  const [revisionComments] = useState('Please expand the introduction section to provide more context about your research. Also ensure all methodology sections are clearly detailed with specific procedures.');
  // ✅ FETCH RESEARCH PROTOCOL DATA + IMAGES + RESEARCHER SIGNATURES
  useEffect(() => {
    const fetchResearchProtocol = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const submissionId = searchParams.get('id');

      if (!submissionId) return;

      try {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();

        // ✅ Fetch from research_protocols table
        const { data: protocolData, error } = await supabase
          .from('research_protocols')
          .select('*')
          .eq('submission_id', submissionId)
          .single();

        if (error) {
          console.warn('Research protocol not found:', error.message);
          return;
        }

        if (protocolData) {
          console.log('📋 Loaded research protocol data:', protocolData);

          const replaceImagePathsWithSignedUrls = async (htmlContent: string) => {
            if (!htmlContent) return htmlContent;

            let modifiedContent = htmlContent;
            const pathRegex = /(?:src|href)=["']([a-f0-9\-]+\/protocol-images\/[^"']+)["']/g;

            const matches = Array.from(htmlContent.matchAll(pathRegex));
            console.log(`🔄 Fixing ${matches.length} storage paths to signed URLs`);

            for (const match of matches) {
              const storagePath = match[1];
              try {
                const { data: urlData } = await supabase.storage
                  .from('research-documents')
                  .createSignedUrl(storagePath, 3600);

                if (urlData?.signedUrl) {
                  modifiedContent = modifiedContent.replace(storagePath, urlData.signedUrl);
                }
              } catch (err) {
                console.warn('Failed to sign URL:', storagePath);
              }
            }

            return modifiedContent;
          };

          // ✅ Replace all image paths with signed URLs
          const introduction = await replaceImagePathsWithSignedUrls(protocolData.introduction);
          const background = await replaceImagePathsWithSignedUrls(protocolData.background);
          const problemStatement = await replaceImagePathsWithSignedUrls(protocolData.problem_statement);
          const scopeDelimitation = await replaceImagePathsWithSignedUrls(protocolData.scope_delimitation);
          const literatureReview = await replaceImagePathsWithSignedUrls(protocolData.literature_review);
          const methodology = await replaceImagePathsWithSignedUrls(protocolData.methodology);
          const population = await replaceImagePathsWithSignedUrls(protocolData.population);
          const samplingTechnique = await replaceImagePathsWithSignedUrls(protocolData.sampling_technique);
          const researchInstrument = await replaceImagePathsWithSignedUrls(protocolData.research_instrument);
          const statisticalTreatment = await replaceImagePathsWithSignedUrls(protocolData.statistical_treatment);

          const references = await replaceImagePathsWithSignedUrls(protocolData.research_references);

          console.log('📚 References loaded:', references);

          setFormData(prev => ({
            ...prev,
            title: protocolData.title || prev.title,
            introduction,
            background,
            problemStatement,
            scopeDelimitation,
            literatureReview,
            methodology,
            population,
            samplingTechnique,
            researchInstrument,
            ethicalConsideration: protocolData.ethical_consideration || '',
            statisticalTreatment,
            references,
          }));

          if (protocolData.researchers && Array.isArray(protocolData.researchers)) {
            const researchersWithSignatures = await Promise.all(
              protocolData.researchers.map(async (r: any) => {
                let displaySignature = null;

                // ✅ Try to create signed URL from path
                if (r.signaturePath && typeof r.signaturePath === 'string') {
                  try {
                    const { data: urlData } = await supabase.storage
                      .from('research-documents')
                      .createSignedUrl(r.signaturePath, 3600);
                    displaySignature = urlData?.signedUrl || null;
                    console.log(`✅ Created signed URL for ${r.name}`);
                  } catch (err) {
                    console.warn('Failed to create signed URL:', err);
                    displaySignature = r.signatureBase64 || null;
                  }
                } else if (r.signatureBase64) {
                  // Fallback to base64
                  displaySignature = r.signatureBase64;
                }

                return {
                  id: r.id || crypto.randomUUID(),
                  name: r.name || '',
                  signature: displaySignature,  // ✅ Set the SIGNED URL!
                  signaturePath: r.signaturePath,
                  signatureBase64: r.signatureBase64
                };
              })
            );

            console.log('👥 Researchers loaded:', researchersWithSignatures);
            setResearchers(researchersWithSignatures);
            isInitialMount.current = false;  // ✅ Mark as loaded
          }
        }
      } catch (error) {
        console.error('Error fetching research protocol:', error);
      }
    };

    if (isInitialMount.current) {
      fetchResearchProtocol();
    }
  }, []);
  // Load saved data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('revisionStep3Data');

      // Only load from localStorage if it's a FRESH visit (not fetched from DB)
      if (saved && isInitialMount.current) {
        try {
          const parsedData = JSON.parse(saved);
          if (parsedData.formData && Object.keys(parsedData.formData).length > 0) {
            setFormData({ ...parsedData.formData });

            if (parsedData.researchers && Array.isArray(parsedData.researchers)) {
              setResearchers(parsedData.researchers.map((r: any) => ({
                id: r.id || '1',
                name: r.name || '',
                signature: r.signature || null,
                signaturePath: r.signaturePath || null,
                signatureBase64: r.signatureBase64 || null // ✅ Also keep in localStorage
              })));
            }
          }
        } catch (error) {
          console.error('Error loading saved data:', error);
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
      localStorage.setItem('revisionStep3Data', JSON.stringify(dataToSave));
      console.log('💾 Revision Step 3 auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, researchers]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    const errorMessages: string[] = [];

    // Validate Title
    const titleError = validateInput(formData.title, 'Title of the Study');
    if (titleError) {
      newErrors.title = titleError;
      errorMessages.push(titleError);
    }

    // Validate Introduction
    const introText = stripHtmlTags(formData.introduction);
    const introError = validateInput(introText, 'Introduction');
    if (introError) {
      newErrors.introduction = introError;
      errorMessages.push(introError);
    }

    // Validate Background
    const backgroundText = stripHtmlTags(formData.background);
    const backgroundError = validateInput(backgroundText, 'Background of the Study');
    if (backgroundError) {
      newErrors.background = backgroundError;
      errorMessages.push(backgroundError);
    }

    // Validate Problem Statement
    const problemText = stripHtmlTags(formData.problemStatement);
    const problemError = validateInput(problemText, 'Statement of the Problem/Objectives');
    if (problemError) {
      newErrors.problemStatement = problemError;
      errorMessages.push(problemError);
    }

    // Validate Scope and Delimitation
    const scopeText = stripHtmlTags(formData.scopeDelimitation);
    const scopeError = validateInput(scopeText, 'Scope and Delimitation');
    if (scopeError) {
      newErrors.scopeDelimitation = scopeError;
      errorMessages.push(scopeError);
    }

    // Validate Literature Review
    const literatureText = stripHtmlTags(formData.literatureReview);
    const literatureError = validateInput(literatureText, 'Related Literature & Studies');
    if (literatureError) {
      newErrors.literatureReview = literatureError;
      errorMessages.push(literatureError);
    }

    // Validate Methodology
    const methodologyText = stripHtmlTags(formData.methodology);
    const methodologyError = validateInput(methodologyText, 'Research Methodology');
    if (methodologyError) {
      newErrors.methodology = methodologyError;
      errorMessages.push(methodologyError);
    }

    // Validate Population
    const populationText = stripHtmlTags(formData.population);
    const populationError = validateInput(populationText, 'Population/Respondents/Sample Size');
    if (populationError) {
      newErrors.population = populationError;
      errorMessages.push(populationError);
    }

    // Validate Sampling Technique
    const samplingText = stripHtmlTags(formData.samplingTechnique);
    const samplingError = validateInput(samplingText, 'Sampling Technique/Criteria of Participants');
    if (samplingError) {
      newErrors.samplingTechnique = samplingError;
      errorMessages.push(samplingError);
    }

    // Validate Research Instrument
    const instrumentText = stripHtmlTags(formData.researchInstrument);
    const instrumentError = validateInput(instrumentText, 'Research Instrument and Validation');
    if (instrumentError) {
      newErrors.researchInstrument = instrumentError;
      errorMessages.push(instrumentError);
    }

    // Validate Ethical Consideration
    const ethicalText = stripHtmlTags(formData.ethicalConsideration);
    const ethicalError = validateInput(ethicalText, 'Ethical Consideration');
    if (ethicalError) {
      newErrors.ethicalConsideration = ethicalError;
      errorMessages.push(ethicalError);
    }

    // Validate Statistical Treatment
    const statisticalText = stripHtmlTags(formData.statisticalTreatment);
    const statisticalError = validateInput(statisticalText, 'Statistical Treatment of Data/Data Analysis');
    if (statisticalError) {
      newErrors.statisticalTreatment = statisticalError;
      errorMessages.push(statisticalError);
    }

    // Validate References
    const referencesText = stripHtmlTags(formData.references);
    const referencesError = validateInput(referencesText, 'References');
    if (referencesError) {
      newErrors.references = referencesError;
      errorMessages.push(referencesError);
    }

    // Validate Researchers
    researchers.forEach((researcher, index) => {
      const nameError = validateInput(researcher.name, `Team Member ${index + 1} Name`, true);
      if (nameError) {
        newErrors[`researcher_name_${researcher.id}`] = nameError;
        errorMessages.push(`Team Member ${index + 1}: ${nameError}`);
      }

      if (!researcher.signature) {
        const sigError = `Team Member ${index + 1}: Signature is required`;
        newErrors[`researcher_signature_${researcher.id}`] = sigError;
        errorMessages.push(sigError);
      }
    });

    // If there are errors, show modal and scroll to first error
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorList(errorMessages);
      setShowErrorModal(true);

      const firstErrorField = Object.keys(newErrors)[0];
      let elementId = firstErrorField;

      // Map error keys to element IDs
      const fieldMapping: Record<string, string> = {
        'title': 'study-title',
        'introduction': 'introduction-editor',
        'background': 'background-editor',
        'problemStatement': 'problem-statement-editor',
        'scopeDelimitation': 'scope-delimitation-editor',
        'literatureReview': 'literature-review-editor',
        'methodology': 'methodology-editor',
        'population': 'population-editor',
        'samplingTechnique': 'sampling-technique-editor',
        'researchInstrument': 'research-instrument-editor',
        'ethicalConsideration': 'ethical-consideration-editor',
        'statisticalTreatment': 'statistical-treatment-editor',
        'references': 'references-editor',
      };

      if (fieldMapping[firstErrorField]) {
        elementId = fieldMapping[firstErrorField];
      } else if (firstErrorField.startsWith('researcher_name_')) {
        const researcherId = firstErrorField.replace('researcher_name_', '');
        elementId = `researcher-name-${researcherId}`;
      } else if (firstErrorField.startsWith('researcher_signature_')) {
        const researcherId = firstErrorField.replace('researcher_signature_', '');
        elementId = `researcher-signature-${researcherId}`;
      }

      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          element.focus();
        }, 500);
      }

      return;
    }

    // ✅ All validations passed - clear errors
    setErrors({});

    try {
      const submissionId = new URLSearchParams(window.location.search).get('id') || '';

      if (!submissionId) {
        alert('❌ Error: No submission ID found');
        return;
      }

      // ✅ UPLOAD SIGNATURES TO STORAGE (matching getSubmissionActivity pattern)
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('❌ User not authenticated');
        return;
      }

      const uploadedResearchers = await Promise.all(
        researchers.map(async (r) => {
          // If signature is a File (new upload), save it to storage
          if (r.signature instanceof File) {
            const fileName = `${r.id}-${Date.now()}-signature`;
            const { data, error } = await supabase.storage
              .from('research-documents')
              .upload(`signatures/${submissionId}/${fileName}`, r.signature);

            if (error) {
              console.error('Signature upload error:', error);
              return { ...r, signature: r.signature }; // Keep old if fails
            }

            console.log('✅ Signature uploaded to:', data.path);
            // ✅ Store as PATH (like getSubmissionActivity), not base64
            return {
              ...r,
              signature: data.path
            };
          } else if (typeof r.signature === 'string') {
            // Already a path or URL - keep as is
            return r;
          } else {
            // null or undefined
            return r;
          }
        })
      );

      console.log('✅ Researchers with signatures:', uploadedResearchers);

      // ✅ Call saveStep3Data with uploaded signatures (paths only)
      const result = await saveStep3Data({
        submissionId,
        formData: {
          title: formData.title,
          introduction: formData.introduction,
          background: formData.background,
          problemStatement: formData.problemStatement,
          scopeDelimitation: formData.scopeDelimitation,
          literatureReview: formData.literatureReview,
          methodology: formData.methodology,
          population: formData.population,
          samplingTechnique: formData.samplingTechnique,
          researchInstrument: formData.researchInstrument,
          ethicalConsideration: formData.ethicalConsideration,
          statisticalTreatment: formData.statisticalTreatment,
          references: formData.references,
        },
        researchers: uploadedResearchers // ✅ Paths only
      });

      if (result.success) {
        console.log('✅ Step 3 saved successfully!');
        alert('✅ Changes saved successfully!');
        router.push('/researchermodule');
      } else {
        console.error('❌ Save failed:', result.error);
        alert('❌ Failed to save: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error saving:', error);
      alert('❌ Error saving to database');
    }
  };


  const handleBack = () => {
    router.push('/researchermodule');
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
                {/* ORANGE STEP NUMBER CIRCLE */}
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>3</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Research Protocol - Revision
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Review and update the requested details based on feedback
                  </p>
                </div>
              </div>
            </div>

            {/* ORANGE PROGRESS BAR */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 transition-all duration-500 rounded-full shadow-lg"
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
            {/* Revision Comment Box */}
            <RevisionCommentBox comments={revisionComments} />

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
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
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${errors.title
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  II. Introduction <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Provide a brief introduction to the study which includes an overview of the study.
                </p>
                <div id="introduction-editor" className={`${errors.introduction ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                  <RichTextEditor
                    label=""
                    value={formData.introduction}
                    onChange={(value) => setFormData({ ...formData, introduction: value })}
                    placeholder="Enter your introduction here..."
                  />
                </div>
                {errors.introduction && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.introduction}
                  </p>
                )}
              </div>

              {/* III. Background of the Study */}
              <div>
                <label
                  htmlFor="background-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  III. Background of the Study <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Include the reason for embarking on the study, the historical background of the study, and the research gap.
                </p>
                <div id="background-editor" className={`${errors.background ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                  <RichTextEditor
                    label=""
                    value={formData.background}
                    onChange={(value) => setFormData({ ...formData, background: value })}
                    placeholder="Enter the background of your study..."
                  />
                </div>
                {errors.background && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.background}
                  </p>
                )}
              </div>

              {/* IV. Statement of the Problem/Objectives */}
              <div>
                <label
                  htmlFor="problem-statement-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  IV. Statement of the Problem/Objectives of the Study <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Include the general and specific research problems/objectives of the study.
                </p>
                <div id="problem-statement-editor" className={`${errors.problemStatement ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                  <RichTextEditor
                    label=""
                    value={formData.problemStatement}
                    onChange={(value) => setFormData({ ...formData, problemStatement: value })}
                    placeholder="Enter your problem statement and objectives..."
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  V. Scope and Delimitation <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Provide the locale, topic, and respondent inclusions and the exclusions.
                </p>
                <div id="scope-delimitation-editor" className={`${errors.scopeDelimitation ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                  <RichTextEditor
                    label=""
                    value={formData.scopeDelimitation}
                    onChange={(value) => setFormData({ ...formData, scopeDelimitation: value })}
                    placeholder="Enter the scope and delimitation of your study..."
                  />
                </div>
                {errors.scopeDelimitation && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.scopeDelimitation}
                  </p>
                )}
              </div>

              {/* VI. Related Literature & Studies */}
              <div>
                <label
                  htmlFor="literature-review-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  VI. Related Literature & Studies <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Write the related literature and studies that support the objectives/problem.
                </p>
                <div id="literature-review-editor" className={`${errors.literatureReview ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                  <RichTextEditor
                    label=""
                    value={formData.literatureReview}
                    onChange={(value) => setFormData({ ...formData, literatureReview: value })}
                    placeholder="Enter related literature and studies..."
                  />
                </div>
                {errors.literatureReview && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.literatureReview}
                  </p>
                )}
              </div>

              {/* VII. Research Methodology */}
              <div>
                <label
                  htmlFor="methodology-editor"
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-[#F7D117]" />
                  </div>
                  VII. Research Methodology <span className="text-red-500">*</span>
                </label>
                <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Indicate the research design of the study.
                </p>
                <div id="methodology-editor" className={`${errors.methodology ? 'ring-2 ring-red-500 rounded-xl' : ''}`}>
                  <RichTextEditor
                    label=""
                    value={formData.methodology}
                    onChange={(value) => setFormData({ ...formData, methodology: value })}
                    placeholder="Enter your research methodology..."
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
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
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
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
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg flex items-center justify-center font-bold shadow-md">
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
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
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
                            className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${errors[`researcher_name_${researcher.id}`]
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
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                              <PenTool size={14} className="text-[#F7D117]" />
                            </div>
                            Signature <span className="text-red-500">*</span>
                          </label>
                          <p className="text-xs sm:text-sm text-gray-600 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Upload a scanned copy or digital signature (PNG, JPG, or PDF format, max 5MB)
                          </p>

                          {/* ✅ Just pass the value - FileUpload handles everything! */}
                          <div className={errors[`researcher_signature_${researcher.id}`] ? 'border-2 border-red-500 rounded-xl p-2' : ''}>
                            <FileUpload
                              label=""
                              value={researcher.signature}  // Pass existing signature
                              onChange={(file) => updateResearcher(researcher.id, 'signature', file)}
                              accept="image/*,.pdf"
                              helperText=""
                              required
                            />
                          </div>

                          {researcher.signature &&
                            typeof researcher.signature === 'string' &&
                            !String(researcher.signature).startsWith('data:') &&
                            !String(researcher.signature).startsWith('data:') && (
                              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-emerald-700 font-medium text-sm">✓ Signature loaded from database</span>
                              </div>
                            )}

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

              {/* SINGLE ORANGE SAVE BUTTON */}
              <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Save changes"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-50"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
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