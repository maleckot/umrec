'use client';

import { useState, useEffect, useRef } from 'react'; 
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';

// IMPORTING FROM THE NEW FOLDER STRUCTURE
import ErrorModal from '@/components/researcher/submission/shared/ErrorModal';
import StepHeader from '@/components/researcher/submission/steps/step1/StepHeader';
import Step1Form from '@/components/researcher/submission/steps/step1/Step1Form';

export default function Step1ResearcherDetails() {
  const router = useRouter();
  const isInitialMount = useRef(true); 
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null); 
  
  const [formData, setFormData] = useState({
    title: '',
    projectLeaderFirstName: '',
    projectLeaderMiddleName: '',
    projectLeaderLastName: '',
    projectLeaderEmail: '',
    projectLeaderContact: '',
    coAuthors: '',
    organization: 'internal',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorList, setErrorList] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('step1Data');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading Step 1 data:', error);
      }
    }
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (isInitialMount.current) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('step1Data', JSON.stringify(formData));
      console.log('💾 Step 1 auto-saved');
    }, 1000);

    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [formData]);

  const validateInput = (value: string, fieldName: string): string | null => {
    const trimmedValue = value.trim().toLowerCase();
    if (!trimmedValue) return `${fieldName} is required`;

    const naVariations = ['n/a', 'na', 'n.a', 'n.a.', 'not applicable', 'none'];
    if (fieldName !== 'Co-Authors' && naVariations.includes(trimmedValue)) return `${fieldName} cannot be "N/A"`;

    const irrelevantPhrases = ['i dont know', "i don't know", 'idk', 'working in progress', 'work in progress', 'wip', 'tbd', 'to be determined', 'later', 'soon', 'testing', 'test', 'asdf', 'qwerty', '123', 'abc', 'unknown', 'temp', 'temporary'];
    if (irrelevantPhrases.some(phrase => trimmedValue.includes(phrase))) return `${fieldName} contains invalid text. Please provide accurate information`;

    if (fieldName !== 'Middle Name' && trimmedValue.length < 3) return `${fieldName} must be at least 3 characters`;
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const fields = [
       { key: 'title', label: 'Project Title' },
       { key: 'projectLeaderFirstName', label: 'First Name' },
       { key: 'projectLeaderLastName', label: 'Last Name' },
       { key: 'projectLeaderEmail', label: 'Email' },
       { key: 'projectLeaderContact', label: 'Contact Number' }
    ];

    fields.forEach(({ key, label }) => {
       const err = validateInput(formData[key as keyof typeof formData], label);
       if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorList(Object.values(newErrors));
      setShowErrorModal(true);
      const firstErrorField = Object.keys(newErrors)[0];
      // Slight delay to ensure DOM update before scroll
      setTimeout(() => {
        document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    setErrors({});
    localStorage.setItem('step1Data', JSON.stringify(formData));
    
    if (formData.organization === 'external') {
      router.push('/researchermodule/submissions/new/step2-external');
    } else {
      router.push('/researchermodule/submissions/new/step2');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value});
    if (errors[field]) setErrors({...errors, [field]: ''});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <StepHeader onBack={() => router.push('/researchermodule/submissions/new')} />
          <Step1Form 
             formData={formData} 
             errors={errors} 
             handleInputChange={handleInputChange} 
             handleSubmit={handleSubmit} 
          />
        </div>
      </div>

      <Footer />
      <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errors={errorList} />
    </div>
  );
}
