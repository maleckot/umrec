'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { Save } from 'lucide-react';
import { getResubmissionData } from '@/app/actions/researcher/getResubmissionData';
import { submitResubmission } from '@/app/actions/researcher/submitResubmission';

// UPDATED IMPORTS HERE
import ResubmissionHeader from '@/components/researcher/submission/resubmission/ResubmissionHeader';
import GeneralInfoSection from '@/components/researcher/submission/resubmission/GeneralInfoSection';
import RevisionsListSection from '@/components/researcher/submission/resubmission/RevisionsListSection';
import SignatureSection from '@/components/researcher/submission/resubmission/SignatureSection';

// --- Interfaces ---
interface ResubmissionFormData {
  titleOfStudy: string;
  versionNumber: string;
  umrecCode: string;
  studySite: string;
  nameOfResearcher: string;
  coResearchers: string[]; 
  telNo: string;
  mobileNo: string;
  faxNo: string;
  email: string;
  institution: string;
  addressOfInstitution: string;
}

interface RevisionRow {
  id: number;
  recommendation: string;
  response: string;
  pageNumber: string;
}

function ResubmissionFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  // Form State
  const [formData, setFormData] = useState<ResubmissionFormData>({
    titleOfStudy: '',
    versionNumber: new Date().toISOString().split('T')[0],
    umrecCode: '',
    studySite: 'UMak',
    nameOfResearcher: '',
    coResearchers: [''],
    telNo: '',
    mobileNo: '',
    faxNo: '',
    email: '',
    institution: '',
    addressOfInstitution: '',
  });

  const [revisionRows, setRevisionRows] = useState<RevisionRow[]>([
    { id: 1, recommendation: '', response: '', pageNumber: '' }
  ]);

  // Load Data
  useEffect(() => {
    if (activityId) {
      loadActivityData();
    } else {
      setLoading(false);
    }
  }, [activityId]);

  const loadActivityData = async () => {
    if (!activityId) return;
    setLoading(true);
    try {
      const result = await getResubmissionData(activityId);
      
      if (result.success) {
        if (result.formData) {
          setFormData(result.formData);
        }
        
        if (result.revisionRows && result.revisionRows.length > 0) {
          setRevisionRows(result.revisionRows);
        }
      } else {
        console.error('Failed to load data:', result.error);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleCoResearcherChange = (index: number, value: string) => {
    const updatedCoResearchers = [...formData.coResearchers];
    updatedCoResearchers[index] = value;
    setFormData(prev => ({ ...prev, coResearchers: updatedCoResearchers }));
  };

  const addCoResearcher = () => {
    setFormData(prev => ({ ...prev, coResearchers: [...prev.coResearchers, ''] }));
  };

  const removeCoResearcher = (index: number) => {
    if (formData.coResearchers.length > 1) {
      const updatedCoResearchers = formData.coResearchers.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, coResearchers: updatedCoResearchers }));
    }
  };

  const handleRowChange = (id: number, field: keyof RevisionRow, value: string) => {
    setRevisionRows(prev => prev.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const addRow = () => {
    setRevisionRows(prev => [
      ...prev, 
      { id: Date.now(), recommendation: '', response: '', pageNumber: '' }
    ]);
  };

  const removeRow = (id: number) => {
    if (revisionRows.length > 1) {
      setRevisionRows(prev => prev.filter(row => row.id !== id));
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    setSignatureImage(null);
  };

  const handleSubmit = async () => {
    if (emailError || !formData.email) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!signatureImage) {
      alert('Please upload your signature before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!activityId) return;

      const result = await submitResubmission(activityId, formData, revisionRows);

      if (result.success) {
        alert('Resubmission Submitted Successfully!');
        router.push('/researchermodule');
      } else {
        alert('Failed to submit: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-orange-500 mx-auto mb-4"></div>
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

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-12">
        <div className="max-w-[1200px] mx-auto">
          
          <ResubmissionHeader onBack={handleBack} />

          <div className="space-y-8">
            <GeneralInfoSection 
                formData={formData}
                handleInputChange={handleInputChange}
                handleNumberChange={handleNumberChange}
                handleEmailChange={handleEmailChange}
                handleCoResearcherChange={handleCoResearcherChange}
                addCoResearcher={addCoResearcher}
                removeCoResearcher={removeCoResearcher}
                emailError={emailError}
            />

            <RevisionsListSection 
                revisionRows={revisionRows}
                handleRowChange={handleRowChange}
                addRow={addRow}
                removeRow={removeRow}
            />

            <SignatureSection 
                signatureImage={signatureImage}
                handleSignatureUpload={handleSignatureUpload}
                removeSignature={removeSignature}
            />

            {/* Footer Action */}
            <div className="flex justify-end pt-4 pb-12 px-4 sm:px-0">
               <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Submit Revisions
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ResubmissionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResubmissionFormContent />
    </Suspense>
  );
}
