'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import ErrorModal from '@/components/researcher/submission/shared/ErrorModal';
import Step3Header from '@/components/researcher/submission/steps/step3/Step3Header'; 
import Step3Form from '@/components/researcher/submission/steps/step3/Step3Form';

interface ResearcherSignature {
  id: string;
  name: string;
  signature: File | null;
}

export default function Step3ResearchProtocol() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

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

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('step3Data');
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          if (parsedData.formData) {
            setFormData(prev => ({...prev, ...parsedData.formData}));
          }
          if (parsedData.researchers && Array.isArray(parsedData.researchers)) {
            setResearchers(parsedData.researchers.map((r: any) => ({
              id: r.id || '1',
              name: r.name || '',
              signature: null
            })));
          }
          setDataLoaded(true);
        } catch (error) {
          console.error('Error loading saved data:', error);
          setDataLoaded(true);
        }
      } else {
        const step1 = localStorage.getItem('step1Data');
        if (step1) {
          try {
            const step1Data = JSON.parse(step1);
            setFormData(prev => ({ ...prev, title: step1Data.title || '' }));
            const fullName = [step1Data.projectLeaderFirstName, step1Data.projectLeaderMiddleName, step1Data.projectLeaderLastName].filter(Boolean).join(' ').trim();
            if (fullName) setResearchers([{ id: '1', name: fullName, signature: null }]);
          } catch (e) {}
        }
        setDataLoaded(true);
      }
    }
    setTimeout(() => { isInitialMount.current = false; }, 100);
  }, []);

  useEffect(() => {
    if (isInitialMount.current || !isClient) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      const dataToSave = {
        formData,
        researchers: researchers.map(r => ({ id: r.id, name: r.name, signature: null }))
      };
      localStorage.setItem('step3Data', JSON.stringify(dataToSave));
      console.log('💾 Step 3 auto-saved');
    }, 1000);

    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [formData, researchers, isClient]);

  const stripHtmlTags = (html: string): string => {
    if (typeof document === 'undefined') return html;
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    let hasError = false;
    let firstErrorField = '';

    const requiredFields = [
      { value: formData.title, id: 'study-title', key: 'title' },
      { value: stripHtmlTags(formData.introduction), id: 'introduction-editor', key: 'introduction' },
      { value: stripHtmlTags(formData.background), id: 'background-editor', key: 'background' },
      { value: stripHtmlTags(formData.problemStatement), id: 'problem-statement-editor', key: 'problemStatement' },
      { value: stripHtmlTags(formData.scopeDelimitation), id: 'scope-delimitation-editor', key: 'scopeDelimitation' },
      { value: stripHtmlTags(formData.literatureReview), id: 'literature-review-editor', key: 'literatureReview' },
      { value: stripHtmlTags(formData.methodology), id: 'methodology-editor', key: 'methodology' },
      { value: stripHtmlTags(formData.population), id: 'population-editor', key: 'population' },
      { value: stripHtmlTags(formData.samplingTechnique), id: 'sampling-technique-editor', key: 'samplingTechnique' },
      { value: stripHtmlTags(formData.researchInstrument), id: 'research-instrument-editor', key: 'researchInstrument' },
      { value: stripHtmlTags(formData.ethicalConsideration), id: 'ethical-consideration-editor', key: 'ethicalConsideration' },
      { value: stripHtmlTags(formData.statisticalTreatment), id: 'statistical-treatment-editor', key: 'statisticalTreatment' },
      { value: stripHtmlTags(formData.references), id: 'references-editor', key: 'references' },
    ];

    for (const field of requiredFields) {
      if (!field.value || !field.value.trim()) {
        newErrors[field.key] = `Please fill out this field`;
        if (!hasError) {
          firstErrorField = field.id;
          hasError = true;
        }
      }
    }

    for (const researcher of researchers) {
      if (!researcher.name.trim()) {
        newErrors[`researcher_name_${researcher.id}`] = `Please fill out this field`;
        if (!hasError) { firstErrorField = `researcher-name-${researcher.id}`; hasError = true; }
      }
      if (!researcher.signature) {
        newErrors[`researcher_signature_${researcher.id}`] = `Please upload signature`;
        if (!hasError) { firstErrorField = `researcher-signature-${researcher.id}`; hasError = true; }
      }
    }

    if (hasError) {
      setErrors(newErrors);
      setErrorList(Object.values(newErrors));
      setShowErrorModal(true);
      if(firstErrorField) {
         const el = document.getElementById(firstErrorField);
         if(el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => el.focus(), 500); }
      }
      return;
    }

    setErrors({});
    const dataToSave = {
      formData,
      researchers: researchers.map(r => ({ id: r.id, name: r.name, signature: null }))
    };
    localStorage.setItem('step3Data', JSON.stringify(dataToSave));
    router.push('/researchermodule/submissions/new/step4');
  };

  const handleBack = () => router.push('/researchermodule/submissions/new/step2');

  const addResearcher = () => {
    const newId = (Math.max(...researchers.map(r => parseInt(r.id)), 0) + 1).toString();
    setResearchers([...researchers, { id: newId, name: '', signature: null }]);
  };

  const removeResearcher = (id: string) => {
    if (researchers.length > 1) setResearchers(researchers.filter(r => r.id !== id));
  };

  const updateResearcher = (id: string, field: 'name' | 'signature', value: any) => {
    setResearchers(researchers.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  if (!isClient) return <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <Step3Header onBack={handleBack} />
          <Step3Form
            formData={formData}
            setFormData={setFormData}
            researchers={researchers}
            errors={errors}
            dataLoaded={dataLoaded}
            addResearcher={addResearcher}
            removeResearcher={removeResearcher}
            updateResearcher={updateResearcher}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        </div>
      </div>
      <Footer />
      <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errors={errorList} />
    </div>
  );
}
