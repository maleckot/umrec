// app/researchermodule/submissions/revision/step3-external-no-review/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, Upload, FileText, AlertCircle, X, MessageSquare } from 'lucide-react';

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

// File Error Modal Component
const FileErrorModal: React.FC<{ isOpen: boolean; onClose: () => void; error: string }> = ({ isOpen, onClose, error }) => {
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
                Invalid File
              </h3>
              <p className="text-red-100 text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Please upload a valid file
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

        <div className="p-6">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {error}
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Try Again
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

export default function RevisionStep3ExternalNoReview() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reviewerComments] = useState(
    'Please upload an updated Consolidated Files document if any changes have been made to your research request materials.'
  );

  const [formData, setFormData] = useState({
    uploadedFile: null as File | null,
  });

  const [fileName, setFileName] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('revisionStep3ExternalNoReviewData');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setFormData({ ...parsedData, uploadedFile: null });
      } catch (error) {
        console.error('Error loading Revision Step 3 External No Review data:', error);
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
      const dataToSave = { ...formData, uploadedFile: null };
      localStorage.setItem('revisionStep3ExternalNoReviewData', JSON.stringify(dataToSave));
      console.log('💾 Revision Step 3 External No Review auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData]);

  const validateFileName = (filename: string): boolean => {
    const lowerFileName = filename.toLowerCase();
    const hasConsolidatedFiles = lowerFileName.includes('consolidated') && lowerFileName.includes('files');
    const hasResearchRequest = lowerFileName.includes('research') && lowerFileName.includes('request');
    return hasConsolidatedFiles || hasResearchRequest;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type !== 'application/pdf') {
        setErrorMessage('Only PDF files are allowed. Please upload a PDF document.');
        setShowErrorModal(true);
        e.target.value = '';
        setFormData({ ...formData, uploadedFile: null });
        setFileName('');
        return;
      }
      
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrorMessage('File size exceeds 10 MB limit. Please upload a smaller file.');
        setShowErrorModal(true);
        e.target.value = '';
        setFormData({ ...formData, uploadedFile: null });
        setFileName('');
        return;
      }

      if (!validateFileName(file.name)) {
        setErrorMessage('Document name should contain one of: "Consolidated Files" or "Research Request". Please rename your file and try again.');
        setShowErrorModal(true);
        e.target.value = '';
        setFormData({ ...formData, uploadedFile: null });
        setFileName('');
        return;
      }
      
      setFormData({ ...formData, uploadedFile: file });
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.uploadedFile) {
      setErrorMessage('Please upload the required document before proceeding.');
      setShowErrorModal(true);
      return;
    }

    const dataToSave = { ...formData, uploadedFile: null };
    localStorage.setItem('revisionStep3ExternalNoReviewData', JSON.stringify(dataToSave));

    // Route to Step 4 summary for no review path
    router.push('/researchermodule/submissions/revision/step4-external');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/revision/step2-external');
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, uploadedFile: null });
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
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
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>3</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Non-UMak Applicants - Revision
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Research Not Yet Reviewed by External REC/Board
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 transition-all duration-500 rounded-full shadow-lg"
                style={{ width: '75%' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Step 3 of 4
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                75% Complete
              </span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Reviewer Comments Box */}
            <RevisionCommentBox comments={reviewerComments} />

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div>
                <label className="block text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Upload the <span className="font-bold">Consolidated Files for Research Request</span> <span className="text-red-500">*</span>
                </label>

                <div className="mb-3 space-y-1">
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>PDF only • Max 10 MB</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <AlertCircle size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Filename must contain: "Consolidated Files" or "Research Request"</span>
                  </div>
                </div>

                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="fileUpload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf"
                  />
                  
                  {!fileName ? (
                    <label
                      htmlFor="fileUpload"
                      className="flex flex-col items-center justify-center w-full border-2 border-dashed border-orange-300 rounded-xl p-6 sm:p-8 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
                    >
                      <Upload size={40} className="text-orange-400 mb-3 sm:mb-4" />
                      <div className="text-center">
                        <p className="text-sm sm:text-base text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          PDF file up to 10 MB
                        </p>
                        <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          Example: "Consolidated Files.pdf" or "Research Request.pdf"
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className="border-2 border-orange-500 rounded-xl p-4 bg-gradient-to-r from-orange-50 to-orange-100/50">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                            <FileText size={20} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base text-[#071139] font-medium truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {fileName}
                            </p>
                            {formData.uploadedFile && (
                              <p className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {formatFileSize(formData.uploadedFile.size)}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="ml-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 shadow-md"
                          aria-label="Remove file"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    </div>
                  )}
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

      <FileErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)} 
        error={errorMessage}
      />
    </div>
  );
}
