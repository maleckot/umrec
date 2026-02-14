'use client';

import { useState, useEffect, useRef, Suspense } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { createClient } from '@/utils/supabase/client';

// Import New Components
import ErrorModal from '@/components/researcher/submission/revision/step1/ErrorModal';
import ReviewerCommentBox from '@/components/researcher/submission/revision/step1/ReviewerCommentBox';
import RevisionHeader from '@/components/researcher/submission/revision/step1/RevisionHeader';
import RevisionFormFields from '@/components/researcher/submission/revision/step1/RevisionFormFields';

function RevisionStep1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const isInitialMount = useRef(true); 
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null); 
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
  const [revisionComments, setRevisionComments] = useState('');

  // Check if this is quick revision mode
  const isQuickRevision = !!searchParams.get('docId') && searchParams.get('docType') === 'consolidated_application';

  // Fetch submission data
  useEffect(() => {
    if (!submissionId) {
      alert('No submission ID found');
      router.push('/researchermodule/submissions');
      return;
    }

    const fetchSubmissionData = async () => {
      const supabase = createClient();
      
      try {
        const { data, error } = await supabase
          .from('research_submissions')
          .select('*')
          .eq('id', submissionId)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            title: data.title || '',
            projectLeaderFirstName: data.project_leader_first_name || '',
            projectLeaderMiddleName: data.project_leader_middle_name || '',
            projectLeaderLastName: data.project_leader_last_name || '',
            projectLeaderEmail: data.project_leader_email || '',
            projectLeaderContact: data.project_leader_contact || '',
            coAuthors: data.co_authors || '',
            organization: data.organization || 'internal',
          });

          // Load comments
          const commentsResult = await supabase
            .from('submission_comments')
            .select('comment_text')
            .eq('submission_id', submissionId)
            .order('created_at', { ascending: false })
            .limit(1);

          if (commentsResult.data && commentsResult.data.length > 0) {
            setRevisionComments(commentsResult.data[0].comment_text);
          } else {
            setRevisionComments('Please update the project details as requested.');
          }
        }
      } catch (error) {
        console.error('Error fetching submission data:', error);
        alert('Failed to load submission data');
      } finally {
        setLoading(false);
        isInitialMount.current = false;
      }
    };

    fetchSubmissionData();
  }, [submissionId, router]);

  // Auto-save logic
  useEffect(() => {
    if (isInitialMount.current || loading || isQuickRevision) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('revisionStep1Data', JSON.stringify(formData));
      console.log('💾 Revision Step 1 auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, loading, isQuickRevision]);

  // Validation
  const validateInput = (value: string, fieldName: string): string | null => {
    const trimmedValue = value.trim().toLowerCase();
    
    if (!trimmedValue) {
      return `${fieldName} is required`;
    }

    const naVariations = ['n/a', 'na', 'n.a', 'n.a.', 'not applicable', 'none'];
    if (fieldName !== 'Co-Authors' && naVariations.includes(trimmedValue)) {
      return `${fieldName} cannot be "N/A"`;
    }

    const irrelevantPhrases = [
      'i dont know', "i don't know", 'idk', 'working in progress', 'work in progress',
      'wip', 'tbd', 'to be determined', 'later', 'soon', 'testing', 'test',
      'asdf', 'qwerty', '123', 'abc', 'unknown', 'temp', 'temporary'
    ];

    if (irrelevantPhrases.some(phrase => trimmedValue.includes(phrase))) {
      return `${fieldName} contains invalid text. Please provide accurate information`;
    }

    if (fieldName !== 'Middle Name' && trimmedValue.length < 3) {
      return `${fieldName} must be at least 3 characters`;
    }

    return null;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value});
    if (errors[field]) {
      setErrors({...errors, [field]: ''});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    // Validate
    const titleError = validateInput(formData.title, 'Project Title');
    if (titleError) newErrors.title = titleError;

    const firstNameError = validateInput(formData.projectLeaderFirstName, 'First Name');
    if (firstNameError) newErrors.projectLeaderFirstName = firstNameError;

    const lastNameError = validateInput(formData.projectLeaderLastName, 'Last Name');
    if (lastNameError) newErrors.projectLeaderLastName = lastNameError;

    const emailError = validateInput(formData.projectLeaderEmail, 'Email');
    if (emailError) newErrors.projectLeaderEmail = emailError;

    const contactError = validateInput(formData.projectLeaderContact, 'Contact Number');
    if (contactError) newErrors.projectLeaderContact = contactError;

    const coAuthorsError = validateInput(formData.coAuthors, 'Co-Authors');
    if (coAuthorsError) newErrors.coAuthors = coAuthorsError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorList(Object.values(newErrors));
      setShowErrorModal(true);
      
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Quick Revision Mode
    if (isQuickRevision && submissionId) {
      setUploading(true);
      const supabase = createClient();
      
      try {
        const { error } = await supabase
          .from('research_submissions')
          .update({
            title: formData.title,
            project_leader_first_name: formData.projectLeaderFirstName,
            project_leader_middle_name: formData.projectLeaderMiddleName,
            project_leader_last_name: formData.projectLeaderLastName,
            project_leader_email: formData.projectLeaderEmail,
            project_leader_contact: formData.projectLeaderContact,
            co_authors: formData.coAuthors,
            organization: formData.organization,
            updated_at: new Date().toISOString(),
          })
          .eq('id', submissionId);

        if (error) throw error;

        // Update status logic
        const { data: allDocs } = await supabase
          .from('uploaded_documents')
          .select('id')
          .eq('submission_id', submissionId);

        if (allDocs && allDocs.length > 0) {
          const { data: allVerifications } = await supabase
            .from('document_verifications')
            .select('is_approved')
            .eq('submission_id', submissionId);

          const allAreNull = !allVerifications || allVerifications.every(v => v.is_approved === null);
          const newStatus = allAreNull ? 'pending' : 'needs_revision';

          await supabase
            .from('research_submissions')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', submissionId);
        }

        alert('✅ Changes saved successfully! Redirecting...');
        router.push(`/researchermodule/activity-details?id=${submissionId}`);
      } catch (error) {
        console.error('Error saving changes:', error);
        alert('Failed to save changes. Please try again.');
      } finally {
        setUploading(false);
      }
    }
    // Standard Multi-step Mode
    else {
      localStorage.setItem('revisionStep1Data', JSON.stringify(formData));
      console.log('💾 Step 1 saved to localStorage');
      setErrors({});
      alert('✅ Step 1 saved! Moving to Step 2...');
      router.push(`/researchermodule/submissions/revision/step2?mode=revision&id=${submissionId}`);
    }
  };

  const handleBack = () => {
    if (isQuickRevision && submissionId) {
      router.push(`/researchermodule/activity-details?id=${submissionId}`);
    } else {
      router.push('/researchermodule/submissions');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Loading submission data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          
          <RevisionHeader isQuickRevision={isQuickRevision} onBack={handleBack} />

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            
            {revisionComments && <ReviewerCommentBox comments={revisionComments} />}

            <form onSubmit={handleSubmit}>
              <RevisionFormFields 
                formData={formData} 
                errors={errors} 
                handleInputChange={handleInputChange} 
              />

              {/* Submit Button */}
              <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={uploading}
                  className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-50"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {uploading ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        {isQuickRevision ? 'Submit Revision' : 'Save & Continue'}
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

      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
        errors={errorList}
      />
    </div>
  );
}

export default function RevisionStep1() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-[#071139]">Loading...</p>
        </div>
      </div>
    }>
      <RevisionStep1Content />
    </Suspense>
  );
}
