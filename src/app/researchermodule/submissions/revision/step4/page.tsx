// app/researchermodule/submissions/revision/step4/page.tsx
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, FileText, AlertCircle, X, Info, MessageSquare } from 'lucide-react';
import RichTextEditor from '@/components/researcher/submission/RichTextEditor';
import { createClient } from '@/utils/supabase/client';
import { saveStep4Data } from '@/app/actions/lib/saveStep4';
import { RadioGroup } from '@/components/researcher/submission/FormComponents';

// ✅ Error Modal Component (keep your existing one)
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

// ✅ Revision Comment Box Component (Simplified version, adjust as needed)
const RevisionCommentBox: React.FC<{ comments: string }> = ({ comments }) => {
  const reviewers = comments.split('---').filter(r => r.trim());

  return (
    <div className="mb-6 sm:mb-8 space-y-4">
      {reviewers.map((review, idx) => (
        <div key={idx} className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-sm">{idx + 1}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-amber-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Reviewer {idx + 1} Comments
              </h3>
              <div className="space-y-2 text-sm text-amber-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {review
                  .split('\n')
                  .filter(line => line.trim())
                  .map((line, lineIdx) => (
                    <p key={lineIdx} className="leading-relaxed">
                      {line.replace(/\*\*/g, '').trim()}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ✅ Tooltip Component (keep your existing one)
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)} // Accessibility
        onBlur={() => setShow(false)}  // Accessibility
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

function RevisionStep4Content() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ GET PARAMS
  const submissionId = searchParams.get('id');
  const docId = searchParams.get('docId');
  const docType = searchParams.get('docType');

  // ✅ DEFINE REVISION MODE
  const isQuickRevision = !!docId && docType === 'consent_form';

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const [revisionComments, setRevisionComments] = useState('');
  const [step3Data, setStep3Data] = useState<any>(null); // For signatures
  const [consentType, setConsentType] = useState<'adult' | 'minor' | 'both' | ''>('');
  const [adultLanguage, setAdultLanguage] = useState<'english' | 'tagalog' | 'both' | ''>('');
  const [minorLanguage, setMinorLanguage] = useState<'english' | 'tagalog' | 'both' | ''>('');

  // For Step 2 info display
  const [step2Info, setStep2Info] = useState({
    title: '',
    projectLeader: '',
    email: '',
    organization: '',
    college: '',
  });

  const [formData, setFormData] = useState({
    participantGroupIdentity: '',
    contactPerson: '',
    contactNumber: '',
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
  });

  // ✅ HELPER FUNCTIONS (Validation, etc.)
  const stripHtmlTags = (html: string | undefined): string => {
    if (!html) return '';
    if (typeof document === 'undefined') return html; // Guard for server-side
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
    if (!consentType) errors.push('Please select participant type');

    if (consentType === 'adult' || consentType === 'both') {
      if (!adultLanguage) errors.push('Please select language for adult consent form');
      const participantError = validateInput(formData.participantGroupIdentity, 'Participant Group Identity');
      if (participantError) errors.push(participantError);

      if (adultLanguage === 'english' || adultLanguage === 'both') {
        errors.push(...[
          validateInput(stripHtmlTags(formData.introductionEnglish), 'Introduction (English)'),
          validateInput(stripHtmlTags(formData.purposeEnglish), 'Purpose (English)'),
          validateInput(stripHtmlTags(formData.researchInterventionEnglish), 'Research Intervention (English)'),
          validateInput(stripHtmlTags(formData.participantSelectionEnglish), 'Participant Selection (English)'),
          validateInput(stripHtmlTags(formData.voluntaryParticipationEnglish), 'Voluntary Participation (English)'),
          validateInput(stripHtmlTags(formData.proceduresEnglish), 'Procedures (English)'),
          validateInput(stripHtmlTags(formData.durationEnglish), 'Duration (English)'),
          validateInput(stripHtmlTags(formData.risksEnglish), 'Risks (English)'),
          validateInput(stripHtmlTags(formData.benefitsEnglish), 'Benefits (English)'),
          validateInput(stripHtmlTags(formData.reimbursementsEnglish), 'Reimbursements (English)'),
          validateInput(stripHtmlTags(formData.confidentialityEnglish), 'Confidentiality (English)'),
          validateInput(stripHtmlTags(formData.sharingResultsEnglish), 'Sharing Results (English)'),
          validateInput(stripHtmlTags(formData.rightToRefuseEnglish), 'Right to Refuse or Withdraw (English)'),
          validateInput(stripHtmlTags(formData.whoToContactEnglish), 'Who to Contact (English)'),
        ].filter(Boolean) as string[]);
      }
      if (adultLanguage === 'tagalog' || adultLanguage === 'both') {
         errors.push(...[
          validateInput(stripHtmlTags(formData.introductionTagalog), 'Panimula (Tagalog)'),
          validateInput(stripHtmlTags(formData.purposeTagalog), 'Layunin ng Pananaliksik (Tagalog)'),
          validateInput(stripHtmlTags(formData.researchInterventionTagalog), 'Uri ng Interbensyon (Tagalog)'),
          validateInput(stripHtmlTags(formData.participantSelectionTagalog), 'Pagpili ng Kalahok (Tagalog)'),
          validateInput(stripHtmlTags(formData.voluntaryParticipationTagalog), 'Kusang-loob na Paglahok (Tagalog)'),
          validateInput(stripHtmlTags(formData.proceduresTagalog), 'Mga Pamamaraan (Tagalog)'),
          validateInput(stripHtmlTags(formData.durationTagalog), 'Tagal ng Pag-aaral (Tagalog)'),
          validateInput(stripHtmlTags(formData.risksTagalog), 'Mga Panganib (Tagalog)'),
          validateInput(stripHtmlTags(formData.benefitsTagalog), 'Mga Benepisyo (Tagalog)'),
          validateInput(stripHtmlTags(formData.reimbursementsTagalog), 'Kabayaran (Tagalog)'),
          validateInput(stripHtmlTags(formData.confidentialityTagalog), 'Pagiging Kumpidensyal (Tagalog)'),
          validateInput(stripHtmlTags(formData.sharingResultsTagalog), 'Pagbabahagi ng mga Resulta (Tagalog)'),
          validateInput(stripHtmlTags(formData.rightToRefuseTagalog), 'Karapatan na Tumanggi o Umurong (Tagalog)'),
          validateInput(stripHtmlTags(formData.whoToContactTagalog), 'Sino ang Makikipag-ugnayan (Tagalog)'),
        ].filter(Boolean) as string[]);
      }
    }

    if (consentType === 'minor' || consentType === 'both') {
      if (!minorLanguage) errors.push('Please select language for minor assent form');

      if (minorLanguage === 'english' || minorLanguage === 'both') {
        errors.push(...[
          validateInput(stripHtmlTags(formData.introductionMinorEnglish), 'Introduction - Minor (English)'),
          validateInput(stripHtmlTags(formData.purposeMinorEnglish), 'Purpose - Minor (English)'),
          validateInput(stripHtmlTags(formData.choiceOfParticipantsEnglish), 'Choice of Participants - Minor (English)'),
          validateInput(stripHtmlTags(formData.voluntarinessMinorEnglish), 'Voluntariness - Minor (English)'),
          validateInput(stripHtmlTags(formData.proceduresMinorEnglish), 'Procedures - Minor (English)'),
          validateInput(stripHtmlTags(formData.risksMinorEnglish), 'Risks - Minor (English)'),
          validateInput(stripHtmlTags(formData.benefitsMinorEnglish), 'Benefits - Minor (English)'),
          validateInput(stripHtmlTags(formData.confidentialityMinorEnglish), 'Confidentiality - Minor (English)'),
          validateInput(stripHtmlTags(formData.sharingFindingsEnglish), 'Sharing Findings - Minor (English)'),
        ].filter(Boolean) as string[]);
      }
      if (minorLanguage === 'tagalog' || minorLanguage === 'both') {
        errors.push(...[
          validateInput(stripHtmlTags(formData.introductionMinorTagalog), 'Panimula - Minor (Tagalog)'),
          validateInput(stripHtmlTags(formData.purposeMinorTagalog), 'Layunin - Minor (Tagalog)'),
          validateInput(stripHtmlTags(formData.choiceOfParticipantsTagalog), 'Pagpili ng Kalahok - Minor (Tagalog)'),
          validateInput(stripHtmlTags(formData.voluntarinessMinorTagalog), 'Kusang-loob - Minor (Tagalog)'),
          validateInput(stripHtmlTags(formData.proceduresMinorTagalog), 'Mga Proseso - Minor (Tagalog)'),
          validateInput(stripHtmlTags(formData.risksMinorTagalog), 'Mga Panganib - Minor (Tagalog)'),
          validateInput(stripHtmlTags(formData.benefitsMinorTagalog), 'Mga Benepisyo - Minor (Tagalog)'),
          validateInput(stripHtmlTags(formData.confidentialityMinorTagalog), 'Kumpidensyal - Minor (Tagalog)'),
          validateInput(stripHtmlTags(formData.sharingFindingsTagalog), 'Pagbabahagi - Minor (Tagalog)'),
        ].filter(Boolean) as string[]);
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowErrorModal(true);
      return false;
    }
    return true;
  };

  // ✅ FULLY REVISED useEffect
useEffect(() => {
  setIsClient(true);

  if (!submissionId) {
    alert('No submission ID found. Redirecting to dashboard.');
    router.push('/researchermodule/submissions');
    return;
  }

  const fetchData = async () => {
    setLoading(true);
    setLoadingComments(true);
    const supabase = createClient();

    try {
      // --- 1. FETCH COMMENTS (branched logic) ---
      if (isQuickRevision) {
        // ✅ QUICK REVISION: Try document_verifications FIRST, then fall back to submission_comments
        console.log(`Quick Revision Mode: Fetching feedback for ${submissionId}`);
        
        let feedbackFound = false;

        // Try to get from document_verifications first (if docId available)
        if (docId) {
          try {
            const { data: verification } = await supabase
              .from('document_verifications')
              .select('feedback_comment')
              .eq('document_id', docId)
              .single();

            if (verification?.feedback_comment) {
              console.log('✅ Found feedback in document_verifications');
              setRevisionComments(verification.feedback_comment);
              feedbackFound = true;
            }
          } catch (err) {
            console.warn('⚠️ No verification feedback found for docId:', docId);
          }
        }

        // If no document_verifications feedback, try submission_comments
        if (!feedbackFound) {
          try {
            const { data: unresolved_comments, error } = await supabase
              .from('submission_comments')
              .select('comment_text, created_at')
              .eq('submission_id', submissionId)
              .eq('is_resolved', false)
              .order('created_at', { ascending: false });

            if (error) {
              console.warn('⚠️ No unresolved comments found:', error);
              setRevisionComments('No specific feedback provided. Please review the document for any general improvements.');
            } else if (unresolved_comments && unresolved_comments.length > 0) {
              console.log(`📝 Found ${unresolved_comments.length} unresolved submission comments`);
              const allComments = unresolved_comments
                .map((comment, index) => {
                  return `**Comment ${index + 1}:**\n${comment.comment_text}\n`;
                })
                .join('\n---\n');
              setRevisionComments(allComments);
            } else {
              setRevisionComments('No specific feedback provided. Please review the document for any general improvements.');
            }
          } catch (err) {
            console.error('Error fetching submission comments:', err);
            setRevisionComments('Unable to load reviewer feedback.');
          }
        }
      } else {
        // ✅ FULL REVISION: Get comments from the main 'reviews' table
        console.log(`Full Revision Mode: Fetching comments for submissionId ${submissionId}`);
        const { data: reviews } = await supabase
          .from('reviews')
          .select(
            'icf_recommendation, icf_disapproval_reasons, icf_ethics_recommendation, icf_technical_suggestions'
          )
          .eq('submission_id', submissionId)
          .eq('status', 'submitted');

        if (reviews && reviews.length > 0) {
          const allComments = reviews
            .map((review, index) => {
              let text = `**Reviewer ${index + 1} (Informed Consent Form):**\n`;
              if (review.icf_recommendation) text += `\n📋 **Recommendation:** ${review.icf_recommendation}\n`;
              if (review.icf_disapproval_reasons) text += `❌ **Disapproval Reasons:** ${review.icf_disapproval_reasons}\n`;
              if (review.icf_ethics_recommendation) text += `⚖️ **Ethics Recommendation:** ${review.icf_ethics_recommendation}\n`;
              if (review.icf_technical_suggestions) text += `💡 **Technical Suggestions:** ${review.icf_technical_suggestions}\n`;
              return text;
            })
            .join('\n---\n');
          setRevisionComments(allComments);
        } else {
          setRevisionComments('No reviewer comments available for the consent form.');
        }
      }
      setLoadingComments(false);

      // --- 2. FETCH ALL FORM DATA FROM DATABASE ---
      
      // Fetch Step 2 Data (from application_forms for details)
      const { data: step2DataRaw } = await supabase
        .from('application_forms') 
        .select('title, researcher_first_name, researcher_last_name, project_leader_email, institution, college')
        .eq('submission_id', submissionId)
        .single();

      if (step2DataRaw) {
        setStep2Info({
          title: step2DataRaw.title || 'Not provided',
          projectLeader: `${step2DataRaw.researcher_first_name || ''} ${step2DataRaw.researcher_last_name || ''}`.trim(),
          email: step2DataRaw.project_leader_email || '',
          organization: step2DataRaw.institution || 'N/A',
          college: step2DataRaw.college || 'N/A',
        });
      }
      
      // Fetch Step 3 Data (Signatures)
      const { data: step3DataRaw } = await supabase
          .from('researcher_declarations')
          .select('signatures')
          .eq('submission_id', submissionId)
          .single();

      if (step3DataRaw) {
          setStep3Data(step3DataRaw);
      }

      // Fetch Step 4 Data (Consent Form)
      const { data: consentData } = await supabase
        .from('consent_forms')
        .select('*')
        .eq('submission_id', submissionId)
        .single();

      if (consentData) {
        console.log('📋 Loaded consent form:', consentData);
        setConsentType(consentData.consent_type || 'adult');
        if (consentData.adult_consent?.adultLanguage) {
          setAdultLanguage(consentData.adult_consent.adultLanguage);
        }
        if (consentData.minor_assent?.minorLanguage) {
          setMinorLanguage(consentData.minor_assent.minorLanguage);
        }

        setFormData(prev => ({
          ...prev,
          participantGroupIdentity: consentData.informed_consent_for || '',
          contactPerson: consentData.contact_person || '',
          contactNumber: consentData.contact_number || '',

          ...(consentData.adult_consent && {
            introductionEnglish: consentData.adult_consent.introductionEnglish || '',
            introductionTagalog: consentData.adult_consent.introductionTagalog || '',
            purposeEnglish: consentData.adult_consent.purposeEnglish || '',
            purposeTagalog: consentData.adult_consent.purposeTagalog || '',
            researchInterventionEnglish: consentData.adult_consent.researchInterventionEnglish || '',
            researchInterventionTagalog: consentData.adult_consent.researchInterventionTagalog || '',
            participantSelectionEnglish: consentData.adult_consent.participantSelectionEnglish || '',
            participantSelectionTagalog: consentData.adult_consent.participantSelectionTagalog || '',
            voluntaryParticipationEnglish: consentData.adult_consent.voluntaryParticipationEnglish || '',
            voluntaryParticipationTagalog: consentData.adult_consent.voluntaryParticipationTagalog || '',
            proceduresEnglish: consentData.adult_consent.proceduresEnglish || '',
            proceduresTagalog: consentData.adult_consent.proceduresTagalog || '',
            durationEnglish: consentData.adult_consent.durationEnglish || '',
            durationTagalog: consentData.adult_consent.durationTagalog || '',
            risksEnglish: consentData.adult_consent.risksEnglish || '',
            risksTagalog: consentData.adult_consent.risksTagalog || '',
            benefitsEnglish: consentData.adult_consent.benefitsEnglish || '',
            benefitsTagalog: consentData.adult_consent.benefitsTagalog || '',
            reimbursementsEnglish: consentData.adult_consent.reimbursementsEnglish || '',
            reimbursementsTagalog: consentData.adult_consent.reimbursementsTagalog || '',
            confidentialityEnglish: consentData.adult_consent.confidentialityEnglish || '',
            confidentialityTagalog: consentData.adult_consent.confidentialityTagalog || '',
            sharingResultsEnglish: consentData.adult_consent.sharingResultsEnglish || '',
            sharingResultsTagalog: consentData.adult_consent.sharingResultsTagalog || '',
            rightToRefuseEnglish: consentData.adult_consent.rightToRefuseEnglish || '',
            rightToRefuseTagalog: consentData.adult_consent.rightToRefuseTagalog || '',
            whoToContactEnglish: consentData.adult_consent.whoToContactEnglish || '',
            whoToContactTagalog: consentData.adult_consent.whoToContactTagalog || '',
          }),

          ...(consentData.minor_assent && {
            introductionMinorEnglish: consentData.minor_assent.introductionMinorEnglish || '',
            introductionMinorTagalog: consentData.minor_assent.introductionMinorTagalog || '',
            purposeMinorEnglish: consentData.minor_assent.purposeMinorEnglish || '',
            purposeMinorTagalog: consentData.minor_assent.purposeMinorTagalog || '',
            choiceOfParticipantsEnglish: consentData.minor_assent.choiceOfParticipantsEnglish || '',
            choiceOfParticipantsTagalog: consentData.minor_assent.choiceOfParticipantsTagalog || '',
            voluntarinessMinorEnglish: consentData.minor_assent.voluntarinessMinorEnglish || '',
            voluntarinessMinorTagalog: consentData.minor_assent.voluntarinessMinorTagalog || '',
            proceduresMinorEnglish: consentData.minor_assent.proceduresMinorEnglish || '',
            proceduresMinorTagalog: consentData.minor_assent.proceduresMinorTagalog || '',
            risksMinorEnglish: consentData.minor_assent.risksMinorEnglish || '',
            risksMinorTagalog: consentData.minor_assent.risksMinorTagalog || '',
            benefitsMinorEnglish: consentData.minor_assent.benefitsMinorEnglish || '',
            benefitsMinorTagalog: consentData.minor_assent.benefitsMinorTagalog || '',
            confidentialityMinorEnglish: consentData.minor_assent.confidentialityMinorEnglish || '',
            confidentialityMinorTagalog: consentData.minor_assent.confidentialityMinorTagalog || '',
            sharingFindingsEnglish: consentData.minor_assent.sharingFindingsEnglish || '',
            sharingFindingsTagalog: consentData.minor_assent.sharingFindingsTagalog || '',
          })
        }));
      }
    } catch (err) {
      console.error('Error fetching submission data:', err);
      alert('Failed to load submission data.');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [submissionId, docId, isQuickRevision, router]);


  // ✅ UNIFIED SUBMIT HANDLER
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Validation failed, modal is shown
    }
    
    setSaving(true);
    
    // This is the complete data payload for this step
    const formDataToSave = {
      consentType,
      adultLanguage,
      minorLanguage,
      ...formData
    };

    try {
      if (isQuickRevision) {
        // --- QUICK REVISION PATH ---
        console.log('Submitting quick revision to server...');
        if (!submissionId) throw new Error("Submission ID is missing");

        const result = await saveStep4Data({
          submissionId,
          formData: formDataToSave
        });

        if (result.success) {
          alert('✅ Revisions saved successfully!');
          router.push(`/researchermodule/activity-details?id=${submissionId}`); // Go to details page
        } else {
          alert(`❌ Error: ${result.error}`);
        }
      } else {
        // --- FULL REVISION PATH ---
        console.log('Saving to localStorage and moving to step 5...');
        // Save to localStorage to pass to the next step
        localStorage.setItem('revisionStep4Data', JSON.stringify(formDataToSave));
        router.push(`/researchermodule/submissions/revision/step5?id=${submissionId}`);
      }
    } catch (err: any) {
      alert(`A critical error occurred: ${err.message}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ✅ UPDATED BACK HANDLER
  const handleBack = () => {
    if (isQuickRevision) {
      router.push(`/researchermodule/activity-details?id=${submissionId}`);
    } else {
      // You might want to auto-save to localStorage here too, but for now, just navigate
      router.push(`/researchermodule/submissions/revision/step3?id=${submissionId}`);
    }
  };

  const showAdultForm = consentType === 'adult' || consentType === 'both';
  const showMinorForm = consentType === 'minor' || consentType === 'both';

  // Loading state
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#071139] mx-auto mb-4"></div>
            <p className="text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Loading form data...</p>
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
                onClick={handleBack} // ✅ USE UPDATED HANDLER
                className="w-12 h-12 bg-white border-2 border-[#071139]/20 rounded-full flex items-center justify-center hover:bg-[#071139] hover:border-[#071139] hover:shadow-lg transition-all duration-300 group"
                aria-label="Go back"
              >
                <ArrowLeft size={20} className="text-[#071139] group-hover:text-[#F7D117] transition-colors duration-300" />
              </button>

              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>4</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {/* ✅ CONDITIONAL TITLE */}
                    Informed Consent / Assent - {isQuickRevision ? 'Quick Revision' : 'Revision'}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {/* ✅ CONDITIONAL SUBTITLE */}
                    {isQuickRevision
                      ? 'Update the consent form based on feedback and submit.'
                      : 'Complete the consent form based on your participant type.'}
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ CONDITIONAL PROGRESS BAR */}
            {!isQuickRevision && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 transition-all duration-500 rounded-full shadow-lg"
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
              </>
            )}
          </div>

          {/* Enhanced Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Reviewer Comments Box */}
            {loadingComments ? (
              <div className="mb-6 sm:mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : (
              revisionComments && <RevisionCommentBox comments={revisionComments} />
            )}

            <form className="space-y-6 sm:space-y-8">
              {/* Instructions */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-5 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <AlertCircle size={20} className="text-orange-500" />
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

              {/* ✅ ADULT FORM - Shows if adult selected */}
              {showAdultForm && (
                <div className="space-y-6 sm:space-y-8 pt-4 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-500 p-4 sm:p-5 rounded-r-lg">
                    <h4 className="font-bold text-[#071139] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Informed Consent Form (Adult Participants)
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Select the language(s) you will provide for adult participants.
                    </p>
                  </div>

                  {/* ADULT LANGUAGE SELECTION */}
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
                      {/* PARTICIPANT GROUP IDENTITY */}
                      <div>
                        <label
                          htmlFor="participantGroupIdentity"
                          className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]"
                          style={{ fontFamily: 'Metropolis, sans-serif' }}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                            <FileText size={16} className="text-white" />
                          </div>
                          Informed Consent Form for: <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="participantGroupIdentity"
                          type="text"
                          value={formData.participantGroupIdentity}
                          onChange={(e) => setFormData({ ...formData, participantGroupIdentity: e.target.value })}
                          placeholder="e.g., clients, patients, community leaders"
                          className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none text-[#071139] transition-all duration-300 hover:border-gray-400"
                          style={{ fontFamily: 'Metropolis, sans-serif' }}
                          required
                        />
                        <p className="text-xs text-gray-600 mt-2 flex items-start gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-orange-500" />
                          Identity of the particular group of individuals for whom this consent is intended.
                        </p>
                      </div>

                      {/* Display Project and Researcher Information from Step 2 */}
                      {step2Info.title && (
                        <div className="bg-orange-50/30 border border-orange-200 rounded-xl p-4 sm:p-6">
                          <h6 className="font-bold text-[#071139] text-sm mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-orange-600" />
                            Project and Researcher Information (from Step 2)
                          </h6>
                          <div className="space-y-3 text-xs sm:text-sm text-gray-700">
                            {/* ... (Your existing Step 2 Info display) ... */}
                            <div>
                              <p className="font-semibold text-[#071139]">[Name of Project and Research]</p>
                              <p className="text-gray-600">{step2Info.title}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[#071139]">Project Leader</p>
                              <p className="text-gray-600">{step2Info.projectLeader}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[#071139]">Email</p>
                              <p className="text-gray-600">{step2Info.email}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[#071139]">Organization/Institution</p>
                              <p className="text-gray-600">{step2Info.organization || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-[#071139]">College</p>
                              <p className="text-gray-600">{step2Info.college || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-start gap-2">
                            <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-yellow-800">This information will automatically appear at the top of your consent form.</p>
                          </div>
                        </div>
                      )}

                      {/* PART I: INFORMATION SHEET Header */}
                      <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-600 p-4 sm:p-5 rounded-r-lg mt-8">
                        <h5 className="font-bold text-[#071139] text-base sm:text-lg uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Part I: Information Sheet
                        </h5>
                      </div>

                      {/* 1. Introduction */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">1</span>
                          Introduction
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Introduction (English Version)"
                            value={formData.introductionEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, introductionEnglish: val })}
                            helperText="Briefly introduce the proponent and organization, emphasize this is an invitation..."
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Panimula (Tagalog Version)"
                            value={formData.introductionTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, introductionTagalog: val })}
                            helperText="Ipakilala ang mga mananaliksik at organisasyon..."
                            required
                          />
                        )}
                      </div>

                      {/* 2. Purpose of the Research */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">2</span>
                          Purpose of the Research
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Purpose (English Version)"
                            value={formData.purposeEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, purposeEnglish: val })}
                            helperText="Explain the research question in ordinary, non-technical terms..."
                            maxWords={500}
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Layunin ng Pananaliksik (Tagalog Version)"
                            value={formData.purposeTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, purposeTagalog: val })}
                            helperText="Ipaliwanag ang layunin ng pananaliksik sa simpleng wika."
                            maxWords={500}
                            required
                          />
                        )}
                      </div>

                      {/* 3. Type of Research Intervention */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">3</span>
                          Type of Research Intervention
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Research Intervention (English Version)"
                            value={formData.researchInterventionEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, researchInterventionEnglish: val })}
                            helperText="Briefly state the type of intervention (e.g., interview, questionnaire...)"
                            maxWords={300}
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Uri ng Interbensyon (Tagalog Version)"
                            value={formData.researchInterventionTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, researchInterventionTagalog: val })}
                            helperText="Banggitin ang uri ng interbensyon na gagawin sa pag-aaral."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 4. Participant Selection */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">4</span>
                          Participant Selection
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Participant Selection (English Version)"
                            value={formData.participantSelectionEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, participantSelectionEnglish: val })}
                            helperText="Indicate why you have chosen this person to participate..."
                            maxWords={300}
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagpili ng Kalahok (Tagalog Version)"
                            value={formData.participantSelectionTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, participantSelectionTagalog: val })}
                            helperText="Ipaliwanag kung bakit napili ang taong ito bilang kalahok."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 5. Voluntary Participation */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">5</span>
                          Voluntary Participation
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Voluntary Participation (English Version)"
                            value={formData.voluntaryParticipationEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, voluntaryParticipationEnglish: val })}
                            helperText="Indicate clearly that they can choose to participate or not..."
                            maxWords={300}
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Kusang-loob na Paglahok (Tagalog Version)"
                            value={formData.voluntaryParticipationTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, voluntaryParticipationTagalog: val })}
                            helperText="Ipahayag nang malinaw na ang paglahok ay kusang-loob..."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>
                      
                      {/* 6. Procedures */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">6</span>
                          Procedures
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Procedures (English Version)"
                            value={formData.proceduresEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, proceduresEnglish: val })}
                            helperText="Provide a brief introduction to the format of the research study..."
                            maxWords={500}
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Pamamaraan (Tagalog Version)"
                            value={formData.proceduresTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, proceduresTagalog: val })}
                            helperText="Ipaliwanag ang format ng pag-aaral at kung ano ang gagawin..."
                            maxWords={500}
                            required
                          />
                        )}
                      </div>

                      {/* 7. Duration */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">7</span>
                          Duration
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Duration (English Version)"
                            value={formData.durationEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, durationEnglish: val })}
                            helperText="Include a statement about the time commitments..."
                            maxWords={200}
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Tagal ng Pag-aaral (Tagalog Version)"
                            value={formData.durationTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, durationTagalog: val })}
                            helperText="Ipahayag ang tagal ng paglahok sa pananaliksik."
                            maxWords={200}
                            required
                          />
                        )}
                      </div>

                      {/* 8. Risks */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">8</span>
                          Risks
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Risks (English Version)"
                            value={formData.risksEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, risksEnglish: val })}
                            helperText="Explain and describe any risks that can be anticipated..."
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Panganib (Tagalog Version)"
                            value={formData.risksTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, risksTagalog: val })}
                            helperText="Ilarawan ang anumang mga panganib o abala na maaaring maranasan."
                            required
                          />
                        )}
                      </div>

                      {/* 9. Benefits */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">9</span>
                          Benefits
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Benefits (English Version)"
                            value={formData.benefitsEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, benefitsEnglish: val })}
                            helperText="Benefits may be divided into benefits to the individual, community, and society..."
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Benepisyo (Tagalog Version)"
                            value={formData.benefitsTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, benefitsTagalog: val })}
                            helperText="Ilarawan ang mga benepisyo para sa kalahok, komunidad, at lipunan."
                            required
                          />
                        )}
                      </div>

                      {/* 10. Reimbursements */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">10</span>
                          Reimbursements
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Reimbursements (English Version)"
                            value={formData.reimbursementsEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, reimbursementsEnglish: val })}
                            helperText="State clearly that participants will not receive payments beyond reimbursements..."
                            maxWords={200}
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Kabayaran (Tagalog Version)"
                            value={formData.reimbursementsTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, reimbursementsTagalog: val })}
                            helperText="Ipahayag kung makakatanggap ng anumang kabayaran ang kalahok."
                            maxWords={200}
                            required
                          />
                        )}
                      </div>

                      {/* 11. Confidentiality */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">11</span>
                          Confidentiality
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Confidentiality (English Version)"
                            value={formData.confidentialityEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, confidentialityEnglish: val })}
                            helperText="Explain how the research team will maintain the confidentiality of data..."
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagiging Kumpidensyal (Tagalog Version)"
                            value={formData.confidentialityTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, confidentialityTagalog: val })}
                            helperText="Ipaliwanag kung paano papanatilihing kumpidensyal ang impormasyon."
                            required
                          />
                        )}
                      </div>

                      {/* 12. Sharing the Results */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">12</span>
                          Sharing the Results
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Sharing Results (English Version)"
                            value={formData.sharingResultsEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, sharingResultsEnglish: val })}
                            helperText="If there is a plan and a timeline for sharing information, include details..."
                            maxWords={300}
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagbabahagi ng mga Resulta (Tagalog Version)"
                            value={formData.sharingResultsTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, sharingResultsTagalog: val })}
                            helperText="Ipaliwanag kung paano at kailan ibabahagi ang mga resulta."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 13. Right to Refuse or Withdraw */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">13</span>
                          Right to Refuse or Withdraw
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Right to Refuse or Withdraw (English Version)"
                            value={formData.rightToRefuseEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, rightToRefuseEnglish: val })}
                            helperText="Reiterate that participation is voluntary..."
                            maxWords={300}
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Karapatan na Tumanggi o Umurong (Tagalog Version)"
                            value={formData.rightToRefuseTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, rightToRefuseTagalog: val })}
                            helperText="Ipahayag muli na ang paglahok ay kusang-loob..."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 14. Who to Contact */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">14</span>
                          Who to Contact
                        </h5>
                        {(adultLanguage === 'english' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Who to Contact (English Version)"
                            value={formData.whoToContactEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, whoToContactEnglish: val })}
                            helperText="Provide the name and contact information of someone involved and accessible..."
                            maxWords={300}
                            required
                          />
                        )}
                        {(adultLanguage === 'tagalog' || adultLanguage === 'both') && (
                          <RichTextEditor
                            label="Sino ang Makikipag-ugnayan (Tagalog Version)"
                            value={formData.whoToContactTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, whoToContactTagalog: val })}
                            helperText="Ibigay ang pangalan at contact information ng mga taong maaaring lapitan."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* Conforme Section (from Step 3) */}
                      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-5 rounded-r-lg mt-8">
                        <h6 className="font-bold text-[#071139] text-sm mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Conforme:
                        </h6>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Researcher information and signatures (from Step 3)
                        </p>
                      </div>

                      {step3Data && step3Data.signatures && step3Data.signatures.length > 0 ? (
                        <div className="bg-orange-50/30 border border-orange-200 rounded-xl p-4 sm:p-6">
                          <div className="space-y-6">
                            {step3Data.signatures.map((sig: any, index: number) => (
                              <div key={index} className="border-b border-orange-200 pb-6 last:border-b-0">
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
                                        {sig.date ? new Date(sig.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '_____________________'}
                                      </p>
                                    </div>
                                  </div>
                                  {sig.signatureDataUrl && (
                                    <div className="mt-4 pt-4 border-t border-orange-200">
                                      <p className="text-xs font-semibold text-[#071139] mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                        Signature of Researcher:
                                      </p>
                                      <div className="border-2 border-orange-300 rounded-lg p-3 bg-white inline-block shadow-sm">
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
                          <div className="mt-4 p-3 bg-orange-100 rounded-lg border border-orange-300">
                            <p className="text-xs text-orange-800 flex items-start gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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
                              No signatures found from Step 3. This data will be populated from your Step 3 submission.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* ✅ MINOR FORM - Shows if minor selected */}
              {showMinorForm && (
                <div className="space-y-6 sm:space-y-8 pt-4 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-l-4 border-orange-500 p-4 sm:p-5 rounded-r-lg">
                    <h4 className="font-bold text-[#071139] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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
                      <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-600 p-4 sm:p-5 rounded-r-lg">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          PART 1: INFORMATION SHEET
                        </h5>
                      </div>

                      {/* 1. Introduction (Minor) */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">1</span>
                          Introduction
                        </h5>
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Introduction (English Version)"
                            value={formData.introductionMinorEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, introductionMinorEnglish: val })}
                            helperText="Provide a brief description of the study... Use simple, child-friendly language."
                            maxWords={400}
                            required
                          />
                        )}
                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Panimula (Tagalog Version)"
                            value={formData.introductionMinorTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, introductionMinorTagalog: val })}
                            helperText="Magbigay ng maikling paglalarawan ng pag-aaral... Gumamit ng simple na wika."
                            maxWords={400}
                            required
                          />
                        )}
                      </div>

                      {/* 2. Purpose of Research (Minor) */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">2</span>
                          Purpose of Research
                        </h5>
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Purpose (English Version)"
                            value={formData.purposeMinorEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, purposeMinorEnglish: val })}
                            helperText="Explain the purpose of research in simple terms children can understand."
                            maxWords={300}
                            required
                          />
                        )}
                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Layunin (Tagalog Version)"
                            value={formData.purposeMinorTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, purposeMinorTagalog: val })}
                            helperText="Ipaliwanag ang layunin ng pananaliksik sa simpleng wika."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 3. Choice of Participants (Minor) */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">3</span>
                          Choice of Participants
                        </h5>
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Choice of Participants (English Version)"
                            value={formData.choiceOfParticipantsEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, choiceOfParticipantsEnglish: val })}
                            helperText="Explain why the participants of the study were chosen."
                            maxWords={200}
                            required
                          />
                        )}
                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagpili ng mga Kalahok (Tagalog Version)"
                            value={formData.choiceOfParticipantsTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, choiceOfParticipantsTagalog: val })}
                            helperText="Ipaliwanag kung bakit napili ang mga kalahok."
                            maxWords={200}
                            required
                          />
                        )}
                      </div>

                      {/* 4. Voluntariness of Participation (Minor) */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">4</span>
                          Voluntariness of Participation
                        </h5>
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Voluntariness (English Version)"
                            value={formData.voluntarinessMinorEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, voluntarinessMinorEnglish: val })}
                            helperText="State clearly that the choice to participate is voluntary..."
                            maxWords={300}
                            required
                          />
                        )}
                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Kusang-loob na Paglahok (Tagalog Version)"
                            value={formData.voluntarinessMinorTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, voluntarinessMinorTagalog: val })}
                            helperText="Ipahayag na ang paglahok ay kusang-loob."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 5. Procedures (Minor) */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">5</span>
                          Procedures
                        </h5>
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Procedures (English Version)"
                            value={formData.proceduresMinorEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, proceduresMinorEnglish: val })}
                            helperText="Explain the procedures in simple terms."
                            maxWords={400}
                            required
                          />
                        )}
                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Proseso (Tagalog Version)"
                            value={formData.proceduresMinorTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, proceduresMinorTagalog: val })}
                            helperText="Ipaliwanag ang mga proseso sa simpleng wika."
                            maxWords={400}
                            required
                          />
                        )}
                      </div>

                      {/* 6. Risk and Inconveniences (Minor) */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">6</span>
                          Risk and Inconveniences
                        </h5>
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Risks (English Version)"
                            value={formData.risksMinorEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, risksMinorEnglish: val })}
                            helperText="Describe what has been found that causes worry and how you will prevent it."
                            maxWords={300}
                            required
                          />
                        )}
                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Panganib (Tagalog Version)"
                            value={formData.risksMinorTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, risksMinorTagalog: val })}
                            helperText="Ilarawan ang mga panganib at kung paano ito maiiwasan."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 7. Possible Benefits (Minor) */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">7</span>
                          Possible Benefits
                        </h5>
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Benefits (English Version)"
                            value={formData.benefitsMinorEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, benefitsMinorEnglish: val })}
                            helperText="Describe any benefits to the child (and to others)."
                            maxWords={300}
                            required
                          />
                        )}
                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Mga Benepisyo (Tagalog Version)"
                            value={formData.benefitsMinorTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, benefitsMinorTagalog: val })}
                            helperText="Ilarawan ang mga benepisyo para sa bata."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 8. Confidentiality (Minor) */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">8</span>
                          Confidentiality
                        </h5>
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Confidentiality (English Version)"
                            value={formData.confidentialityMinorEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, confidentialityMinorEnglish: val })}
                            helperText="State the limits and the scope of confidentiality."
                            maxWords={300}
                            required
                          />
                        )}
                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagiging Kumpidensyal (Tagalog Version)"
                            value={formData.confidentialityMinorTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, confidentialityMinorTagalog: val })}
                            helperText="Ipahayag ang saklaw ng pagiging kumpidensyal."
                            maxWords={300}
                            required
                          />
                        )}
                      </div>

                      {/* 9. Sharing the Findings (Minor) */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-[#071139] text-sm sm:text-base flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md">9</span>
                          Sharing the Findings
                        </h5>
                        {(minorLanguage === 'english' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Sharing Findings (English Version)"
                            value={formData.sharingFindingsEnglish}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, sharingFindingsEnglish: val })}
                            helperText="Explain how the research findings will be shared..."
                            maxWords={200}
                            required
                          />
                        )}
                        {(minorLanguage === 'tagalog' || minorLanguage === 'both') && (
                          <RichTextEditor
                            label="Pagbabahagi ng mga Natuklasan (Tagalog Version)"
                            value={formData.sharingFindingsTagalog}
                            hideImageUpload={true}
                            onChange={(val) => setFormData({ ...formData, sharingFindingsTagalog: val })}
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

              {/* ✅ UNIFIED SUBMIT BUTTON */}
              <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label={isQuickRevision ? "Submit revision" : "Save and continue"}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-50"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {/* ✅ CONDITIONAL BUTTON TEXT */}
                        {isQuickRevision ? 'Save Changes' : 'Save & Continue'}
                      </>
                    )}
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

// ✅ Default export with Suspense wrapper
export default function RevisionStep4() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    }>
      <RevisionStep4Content />
    </Suspense>
  );
}