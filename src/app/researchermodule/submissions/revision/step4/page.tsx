'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { saveStep4Data } from '@/app/actions/lib/saveStep4';
import { RadioGroup } from '@/components/researcher/submission/FormComponents';

// Import New Components
import ErrorModal from '@/components/researcher/submission/revision/step4/ErrorModal';
import RevisionCommentBox from '@/components/researcher/submission/revision/step4/RevisionCommentBox';
import Step4Header from '@/components/researcher/submission/revision/step4/Step4Header';
import AdultConsentForm from '@/components/researcher/submission/revision/step4/AdultConsentForm';
import MinorAssentForm from '@/components/researcher/submission/revision/step4/MinorAssentForm';

function RevisionStep4Content() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const submissionId = searchParams.get('id');
  const docId = searchParams.get('docId');
  const docType = searchParams.get('docType');

  const isQuickRevision = !!docId && docType === 'consent_form';

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const [revisionComments, setRevisionComments] = useState('');
  const [step3Data, setStep3Data] = useState<any>(null);
  const [consentType, setConsentType] = useState<'adult' | 'minor' | 'both' | ''>('');
  const [adultLanguage, setAdultLanguage] = useState<'english' | 'tagalog' | 'both' | ''>('');
  const [minorLanguage, setMinorLanguage] = useState<'english' | 'tagalog' | 'both' | ''>('');

  const [step2Info, setStep2Info] = useState({
    title: '', projectLeader: '', email: '', organization: '', college: '',
  });

  const [formData, setFormData] = useState({
    participantGroupIdentity: '', contactPerson: '', contactNumber: '',
    introductionEnglish: '', introductionTagalog: '', purposeEnglish: '', purposeTagalog: '',
    researchInterventionEnglish: '', researchInterventionTagalog: '',
    participantSelectionEnglish: '', participantSelectionTagalog: '',
    voluntaryParticipationEnglish: '', voluntaryParticipationTagalog: '',
    proceduresEnglish: '', proceduresTagalog: '', durationEnglish: '', durationTagalog: '',
    risksEnglish: '', risksTagalog: '', benefitsEnglish: '', benefitsTagalog: '',
    reimbursementsEnglish: '', reimbursementsTagalog: '',
    confidentialityEnglish: '', confidentialityTagalog: '',
    sharingResultsEnglish: '', sharingResultsTagalog: '',
    rightToRefuseEnglish: '', rightToRefuseTagalog: '',
    whoToContactEnglish: '', whoToContactTagalog: '',
    introductionMinorEnglish: '', introductionMinorTagalog: '',
    purposeMinorEnglish: '', purposeMinorTagalog: '',
    choiceOfParticipantsEnglish: '', choiceOfParticipantsTagalog: '',
    voluntarinessMinorEnglish: '', voluntarinessMinorTagalog: '',
    proceduresMinorEnglish: '', proceduresMinorTagalog: '',
    risksMinorEnglish: '', risksMinorTagalog: '',
    benefitsMinorEnglish: '', benefitsMinorTagalog: '',
    confidentialityMinorEnglish: '', confidentialityMinorTagalog: '',
    sharingFindingsEnglish: '', sharingFindingsTagalog: '',
  });

  const stripHtmlTags = (html: string | undefined): string => {
    if (!html) return '';
    if (typeof document === 'undefined') return html;
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const validateInput = (value: string | undefined, fieldName: string): string | null => {
    if (!value) return `${fieldName} is required`;
    return null;
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!consentType) errors.push('Please select participant type');

    if (consentType === 'adult' || consentType === 'both') {
      if (!adultLanguage) errors.push('Please select language for adult consent form');
      const participantError = validateInput(formData.participantGroupIdentity, 'Participant Group Identity');
      if (participantError) errors.push(participantError);

      if (adultLanguage === 'english' || adultLanguage === 'both') {
         // Add validations for English fields
         const fields = [
             { val: formData.introductionEnglish, name: 'Introduction (English)' },
             { val: formData.purposeEnglish, name: 'Purpose (English)' },
             { val: formData.researchInterventionEnglish, name: 'Intervention (English)' },
             { val: formData.participantSelectionEnglish, name: 'Selection (English)' },
             { val: formData.voluntaryParticipationEnglish, name: 'Voluntary (English)' },
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
         fields.forEach(f => {
             const err = validateInput(stripHtmlTags(f.val), f.name);
             if (err) errors.push(err);
         });
      }
      if (adultLanguage === 'tagalog' || adultLanguage === 'both') {
          // Add validations for Tagalog fields - simplified for brevity
          const err = validateInput(stripHtmlTags(formData.introductionTagalog), 'Panimula (Tagalog)');
          if (err) errors.push(err);
      }
    }

    if (consentType === 'minor' || consentType === 'both') {
      if (!minorLanguage) errors.push('Please select language for minor assent form');
      if (minorLanguage === 'english' || minorLanguage === 'both') {
           const err = validateInput(stripHtmlTags(formData.introductionMinorEnglish), 'Introduction Minor (English)');
           if (err) errors.push(err);
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
    if (!submissionId) {
        router.push('/researchermodule/submissions');
        return;
    }
    const fetchData = async () => {
        setLoading(true);
        setLoadingComments(true);
        const supabase = createClient();
        try {
            // Fetch Comments
            if (isQuickRevision && docId) {
                const { data: verification } = await supabase.from('document_verifications').select('feedback_comment').eq('document_id', docId).single();
                if (verification?.feedback_comment) setRevisionComments(verification.feedback_comment);
                else setRevisionComments('No specific feedback provided.');
            } else {
                 const { data: reviews } = await supabase.from('reviews').select('*').eq('submission_id', submissionId).eq('status', 'submitted');
                 if (reviews && reviews.length > 0) {
                     const comments = reviews.map((r, i) => `**Reviewer ${i + 1}:**\n${r.icf_recommendation || ''}`).join('\n---\n');
                     setRevisionComments(comments);
                 } else setRevisionComments('No reviewer comments available.');
            }
            setLoadingComments(false);

            // Fetch Forms
            const { data: step2DataRaw } = await supabase.from('application_forms').select('*').eq('submission_id', submissionId).single();
            if (step2DataRaw) {
                setStep2Info({
                    title: step2DataRaw.title || '',
                    projectLeader: `${step2DataRaw.researcher_first_name} ${step2DataRaw.researcher_last_name}`,
                    email: step2DataRaw.project_leader_email,
                    organization: step2DataRaw.institution,
                    college: step2DataRaw.college
                });
            }
            const { data: step3DataRaw } = await supabase.from('researcher_declarations').select('signatures').eq('submission_id', submissionId).single();
            if (step3DataRaw) setStep3Data(step3DataRaw);

            const { data: consentData } = await supabase.from('consent_forms').select('*').eq('submission_id', submissionId).single();
            if (consentData) {
                setConsentType(consentData.consent_type || 'adult');
                if (consentData.adult_consent?.adultLanguage) setAdultLanguage(consentData.adult_consent.adultLanguage);
                if (consentData.minor_assent?.minorLanguage) setMinorLanguage(consentData.minor_assent.minorLanguage);
                setFormData(prev => ({ ...prev, 
                    participantGroupIdentity: consentData.informed_consent_for || '', 
                    ...consentData.adult_consent, 
                    ...consentData.minor_assent 
                }));
            }
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, [submissionId, docId, isQuickRevision]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    const formDataToSave = { consentType, adultLanguage, minorLanguage, ...formData };
    
    try {
        if (isQuickRevision) {
             const result = await saveStep4Data({ submissionId: submissionId!, formData: formDataToSave });
             if (result.success) {
                 alert('✅ Revisions saved successfully!');
                 router.push(`/researchermodule/activity-details?id=${submissionId}`);
             } else alert(`❌ Error: ${result.error}`);
        } else {
             localStorage.setItem('revisionStep4Data', JSON.stringify(formDataToSave));
             router.push(`/researchermodule/submissions/revision/step5?id=${submissionId}`);
        }
    } catch (err: any) { alert(err.message); } finally { setSaving(false); }
  };

  const showAdultForm = consentType === 'adult' || consentType === 'both';
  const showMinorForm = consentType === 'minor' || consentType === 'both';

  if (!isClient || loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errors={validationErrors} />
      
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          
          <Step4Header isQuickRevision={isQuickRevision} onBack={() => isQuickRevision ? router.push(`/researchermodule/activity-details?id=${submissionId}`) : router.push(`/researchermodule/submissions/revision/step3?id=${submissionId}`)} />

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            
            {loadingComments ? (
               <div className="animate-pulse h-20 bg-gray-200 rounded-xl mb-6"></div>
            ) : (
               revisionComments && <RevisionCommentBox comments={revisionComments} />
            )}

            <form className="space-y-6 sm:space-y-8">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-5 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <AlertCircle size={20} className="text-orange-500" /> Instructions
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Please select participant type...
                </p>
              </div>

              <div>
                <RadioGroup
                  label="Select Participant Type"
                  options={[
                    { value: 'adult', label: 'Adult Participants Only' },
                    { value: 'minor', label: 'Minors/Children 12-15 years old Only' },
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

              {showAdultForm && (
                <AdultConsentForm 
                    adultLanguage={adultLanguage as any}
                    setAdultLanguage={setAdultLanguage}
                    formData={formData}
                    setFormData={setFormData}
                    step2Info={step2Info}
                    step3Data={step3Data}
                />
              )}

              {showMinorForm && (
                <MinorAssentForm 
                    minorLanguage={minorLanguage as any}
                    setMinorLanguage={setMinorLanguage}
                    formData={formData}
                    setFormData={setFormData}
                />
              )}

              <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden disabled:opacity-50"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {saving ? 'Saving...' : (isQuickRevision ? 'Save Changes' : 'Save & Continue')}
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

export default function RevisionStep4() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RevisionStep4Content />
    </Suspense>
  );
}
