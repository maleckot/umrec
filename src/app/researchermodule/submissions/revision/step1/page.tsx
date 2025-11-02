// app/researchermodule/submissions/revision/step1/page.tsx
'use client';

import { useState, useEffect, useRef, Suspense } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, User, Mail, Phone, Users, Building, AlertCircle, X, MessageSquare } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

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

  // ✅ Check if this is quick revision mode (has docId and docType)
  const isQuickRevision = !!searchParams.get('docId') && searchParams.get('docType') === 'consolidated_application';

  // ✅ Fetch submission data from Supabase
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

          // Load revision comments
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

  // Auto-save to localStorage (only in multi-step mode)
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

  // Validation function
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

  // ✅ HANDLE SUBMIT - TWO MODES
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    // Validate all fields
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

    // ✅ QUICK REVISION: Save directly to database
    if (isQuickRevision && submissionId) {
      setUploading(true);
      const supabase = createClient();
      
      try {
        // Update submission data
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

        // ✅ Check status: If all document verifications are null → "pending", else → "needs_revision"
        console.log('🔍 Checking document verification status...');

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

          console.log(`📊 Status update: ${newStatus}`);

          const { error: statusError } = await supabase
            .from('research_submissions')
            .update({
              status: newStatus,
              updated_at: new Date().toISOString(),
            })
            .eq('id', submissionId);

          if (statusError) {
            console.error('Failed to update status:', statusError);
          } else {
            console.log(`✅ Submission status updated to: ${newStatus}`);
          }
        }

        alert('✅ Changes saved successfully! Redirecting to activity details...');
        router.push(`/researchermodule/activity-details?id=${submissionId}`);
      } catch (error) {
        console.error('Error saving changes:', error);
        alert('Failed to save changes. Please try again.');
      } finally {
        setUploading(false);
      }
    }
    // ✅ MULTI-STEP MODE: Save to localStorage and go to next step
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

  const handleInputChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value});
    if (errors[field]) {
      setErrors({...errors, [field]: ''});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Loading submission data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <button
                onClick={handleBack}
                className="w-12 h-12 bg-white border-2 border-[#003366]/20 rounded-full flex items-center justify-center hover:bg-[#071139] hover:border-[#071139] hover:shadow-lg transition-all duration-300 group"
                aria-label="Go back to previous page"
              >
                <ArrowLeft size={20} className="text-[#071139] group-hover:text-[#F7D117] transition-colors duration-300" />
              </button>
              
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>1</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Researcher Details - {isQuickRevision ? 'Quick Revision' : 'Revision'}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {isQuickRevision 
                      ? 'Update the researcher details and submit immediately'
                      : 'Review and update the requested details based on feedback'}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar - Only show in multi-step mode */}
            {!isQuickRevision && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 transition-all duration-500 rounded-full shadow-lg"
                    style={{ width: '12.5%' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Step 1 of 8
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    12% Complete
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            {revisionComments && <RevisionCommentBox comments={revisionComments} />}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Title of Project */}
              <div>
                <label 
                  htmlFor="title" 
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <User size={16} className="text-[#F7D117]" />
                  </div>
                  Title of the project <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter your project title"
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${
                    errors.title 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.title}
                  </p>
                )}
              </div>
              {/* Project Leader Full Name */}
              <div>
                <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <User size={16} className="text-[#F7D117]" />
                  </div>
                  Project Leader Full Name <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <input
                      id="projectLeaderLastName"
                      type="text"
                      placeholder="Last Name"
                      value={formData.projectLeaderLastName}
                      onChange={(e) => handleInputChange('projectLeaderLastName', e.target.value)}
                      className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${
                        errors.projectLeaderLastName
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'
                      }`}
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                      required
                    />
                    {errors.projectLeaderLastName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.projectLeaderLastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      id="projectLeaderFirstName"
                      type="text"
                      placeholder="First Name"
                      value={formData.projectLeaderFirstName}
                      onChange={(e) => handleInputChange('projectLeaderFirstName', e.target.value)}
                      className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${
                        errors.projectLeaderFirstName
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'
                      }`}
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                      required
                    />
                    {errors.projectLeaderFirstName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.projectLeaderFirstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      id="projectLeaderMiddleName"
                      type="text"
                      placeholder="Middle Name (Optional)"
                      value={formData.projectLeaderMiddleName}
                      onChange={(e) => handleInputChange('projectLeaderMiddleName', e.target.value)}
                      className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] transition-all duration-300 hover:border-gray-400"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    />
                  </div>
                </div>
              </div>

              {/* Email and Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    htmlFor="projectLeaderEmail" 
                    className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                      <Mail size={16} className="text-[#F7D117]" />
                    </div>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="projectLeaderEmail"
                    type="email"
                    value={formData.projectLeaderEmail}
                    onChange={(e) => handleInputChange('projectLeaderEmail', e.target.value)}
                    placeholder="email@example.com"
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${
                      errors.projectLeaderEmail
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'
                    }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                    required
                  />
                  {errors.projectLeaderEmail && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle size={16} /> {errors.projectLeaderEmail}
                    </p>
                  )}
                </div>
                <div>
                  <label 
                    htmlFor="projectLeaderContact" 
                    className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                      <Phone size={16} className="text-[#F7D117]" />
                    </div>
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="projectLeaderContact"
                    type="tel"
                    value={formData.projectLeaderContact}
                    onChange={(e) => handleInputChange('projectLeaderContact', e.target.value)}
                    placeholder="+63 912 345 6789"
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${
                      errors.projectLeaderContact
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'
                    }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                    required
                  />
                  {errors.projectLeaderContact && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle size={16} /> {errors.projectLeaderContact}
                    </p>
                  )}
                </div>
              </div>

              {/* Co-Authors */}
              <div>
                <label 
                  htmlFor="coAuthors" 
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <Users size={16} className="text-[#F7D117]" />
                  </div>
                  List of Co-Authors <span className="text-red-500">*</span>
                  <span className="text-gray-500 font-normal text-xs ml-2">(If none, write "N/A")</span>
                </label>
                <textarea
                  id="coAuthors"
                  value={formData.coAuthors}
                  onChange={(e) => handleInputChange('coAuthors', e.target.value)}
                  rows={4}
                  placeholder="Juan A. Dela Cruz, Jeon H. Womwoo, Choi J. Seungcheol"
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none resize-none text-[#071139] transition-all duration-300 ${
                    errors.coAuthors
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                />
                {errors.coAuthors && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.coAuthors}
                  </p>
                )}
              </div>

              {/* Organization */}
              <div>
                <label 
                  htmlFor="organization" 
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <Building size={16} className="text-[#F7D117]" />
                  </div>
                  Organization <span className="text-red-500">*</span>
                </label>
                <select
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] transition-all duration-300 hover:border-gray-400 cursor-pointer"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  required
                >
                  <option value="internal">Internal (UMak)</option>
                  <option value="external">External</option>
                </select>
              </div>

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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RevisionStep1Content />
    </Suspense>
  );
}