// app/researchermodule/submissions/new/step1/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react'; 
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, User, Mail, Phone, Users, Building, AlertCircle, X } from 'lucide-react';

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
        const parsedData = JSON.parse(saved);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading Step 1 data:', error);
      }
    }
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (isInitialMount.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('step1Data', JSON.stringify(formData));
      console.log('💾 Step 1 auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData]);

  // Validation function to check for invalid inputs
  const validateInput = (value: string, fieldName: string): string | null => {
    const trimmedValue = value.trim().toLowerCase();
    
    // Check if empty
    if (!trimmedValue) {
      return `${fieldName} is required`;
    }

    // Check for "N/A" or variations
    const naVariations = ['n/a', 'na', 'n.a', 'n.a.', 'not applicable', 'none'];
    if (fieldName !== 'Co-Authors' && naVariations.includes(trimmedValue)) {
      return `${fieldName} cannot be "N/A"`;
    }

    // Check for irrelevant phrases
    const irrelevantPhrases = [
      'i dont know',
      "i don't know",
      'idk',
      'working in progress',
      'work in progress',
      'wip',
      'tbd',
      'to be determined',
      'later',
      'soon',
      'testing',
      'test',
      'asdf',
      'qwerty',
      '123',
      'abc',
      'unknown',
      'temp',
      'temporary'
    ];

    if (irrelevantPhrases.some(phrase => trimmedValue.includes(phrase))) {
      return `${fieldName} contains invalid text. Please provide accurate information`;
    }

    // Check minimum length (at least 3 characters for most fields)
    if (fieldName !== 'Middle Name' && trimmedValue.length < 3) {
      return `${fieldName} must be at least 3 characters`;
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorList(Object.values(newErrors));
      setShowErrorModal(true);
      
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    // Clear errors and proceed
    setErrors({});
    localStorage.setItem('step1Data', JSON.stringify(formData));
    
    // Route based on organization type
    if (formData.organization === 'external') {
      router.push('/researchermodule/submissions/new/step2-external');
    } else {
      router.push('/researchermodule/submissions/new/step2');
    }
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new');
  };

  // Clear error when user starts typing
  const handleInputChange = (field: string, value: string) => {
    setFormData({...formData, [field]: value});
    if (errors[field]) {
      setErrors({...errors, [field]: ''});
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
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>1</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Researcher Details
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Ensure all requested details are filled out accurately
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-[#F7D117] to-[#B8860B] h-3 transition-all duration-500 rounded-full shadow-lg"
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
          </div>

          {/* Enhanced Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Title of Project - Enhanced */}
              <div>
                <label 
                  htmlFor="title" 
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
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
                  aria-required="true"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {errors.title && (
                  <p id="title-error" className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.title}
                  </p>
                )}
              </div>

              {/* Project Leader Full Name - Enhanced */}
              <div>
                <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
                    <User size={16} className="text-[#F7D117]" />
                  </div>
                  Project Leader Full Name <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="projectLeaderLastName" className="sr-only">Last Name</label>
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
                      aria-required="true"
                      aria-invalid={!!errors.projectLeaderLastName}
                    />
                    {errors.projectLeaderLastName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        <AlertCircle size={12} /> {errors.projectLeaderLastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="projectLeaderFirstName" className="sr-only">First Name</label>
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
                      aria-required="true"
                      aria-invalid={!!errors.projectLeaderFirstName}
                    />
                    {errors.projectLeaderFirstName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        <AlertCircle size={12} /> {errors.projectLeaderFirstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="projectLeaderMiddleName" className="sr-only">Middle Name (Optional)</label>
                    <input
                      id="projectLeaderMiddleName"
                      type="text"
                      placeholder="Middle Name (Optional)"
                      value={formData.projectLeaderMiddleName}
                      onChange={(e) => handleInputChange('projectLeaderMiddleName', e.target.value)}
                      className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] transition-all duration-300 hover:border-gray-400"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                      aria-required="false"
                    />
                  </div>
                </div>
              </div>

              {/* Email and Contact - Enhanced */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    htmlFor="projectLeaderEmail" 
                    className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
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
                    aria-required="true"
                    aria-invalid={!!errors.projectLeaderEmail}
                  />
                  {errors.projectLeaderEmail && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
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
                    aria-required="true"
                    aria-invalid={!!errors.projectLeaderContact}
                  />
                  {errors.projectLeaderContact && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      <AlertCircle size={16} /> {errors.projectLeaderContact}
                    </p>
                  )}
                </div>
              </div>

              {/* Co-Authors - Enhanced */}
              <div>
                <label 
                  htmlFor="coAuthors" 
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
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
                  aria-required="true"
                  aria-invalid={!!errors.coAuthors}
                />
                {errors.coAuthors && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} /> {errors.coAuthors}
                  </p>
                )}
              </div>

              {/* Organization - Enhanced */}
              <div>
                <label 
                  htmlFor="organization" 
                  className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
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
                  aria-required="true"
                >
                  <option value="internal">Internal (UMak)</option>
                  <option value="external">External</option>
                </select>
              </div>

              {/* Enhanced Navigation Button */}
              <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
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

      {/* Custom Error Modal - No more browser alerts! */}
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
        errors={errorList}
      />
    </div>
  );
}
