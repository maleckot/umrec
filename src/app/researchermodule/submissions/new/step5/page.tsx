// app/researchermodule/submissions/new/step5/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';

export default function Step5ResearchInstrument() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    setIsClient(true);
    
    const saved = localStorage.getItem('step5Data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        if (parsedData.fileName) {
          // File reference exists in localStorage
          console.log('Previously uploaded file:', parsedData.fileName);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
    
    isInitialMount.current = false;
  }, []);

  const handleNext = () => {
    if (!file) {
      alert('Please upload a valid research instrument document.');
      return;
    }

    // Convert file to base64 and store in sessionStorage
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem('step5File', reader.result as string);
      
      const dataToSave = {
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString()
      };
      localStorage.setItem('step5Data', JSON.stringify(dataToSave));
      router.push('/researchermodule/submissions/new/step6');
    };
    reader.readAsDataURL(file);
  };

  const handleBack = () => {
    // Save current state before going back
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem('step5File', reader.result as string);
        const dataToSave = {
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString()
        };
        localStorage.setItem('step5Data', JSON.stringify(dataToSave));
        router.push('/researchermodule/submissions/new/step4');
      };
      reader.readAsDataURL(file);
    } else {
      router.push('/researchermodule/submissions/new/step4');
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center py-12">
          <div className="text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Loading...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>5</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Validated Research Instrument
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Upload your validated survey form or questionnaire
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-[#F7D117] to-[#B8860B] h-3 transition-all duration-500 rounded-full shadow-lg"
                style={{ width: '62.5%' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Step 5 of 8
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                62.5% Complete
              </span>
            </div>
          </div>

          {/* Enhanced Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            <form className="space-y-6 sm:space-y-8">
              {/* Instructions */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-5 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <AlertCircle size={20} className="text-blue-500" />
                  Instructions
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500 font-bold">•</span>
                    <span>Upload your <strong>validated research instrument</strong> (survey form or questionnaire)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500 font-bold">•</span>
                    <span>File must be in <strong>PDF format</strong> and not exceed <strong>10MB</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500 font-bold">•</span>
                    <span>Ensure the document includes all survey questions, scales, and measurement tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500 font-bold">•</span>
                    <span>The document will be validated before you can proceed</span>
                  </li>
                </ul>
              </div>

              {/* Upload Component */}
              <PDFUploadValidator
                label="Research Instrument Document"
                description="Upload your validated survey form, questionnaire, or other research measurement tools."
                value={file}
                onChange={setFile}
                validationKeywords={['survey', 'questionnaire', 'instrument', 'form']}
                required
              />

              {/* Requirements Checklist */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 border-l-4 border-[#FFD700] p-4 sm:p-5 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Document Requirements Checklist
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700] font-bold">✓</span>
                    <span>All survey questions or measurement items are included</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700] font-bold">✓</span>
                    <span>Demographic or participant information section is present</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700] font-bold">✓</span>
                    <span>Instructions for participants are clear and complete</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700] font-bold">✓</span>
                    <span>Document has been validated by adviser or expert</span>
                  </li>
                </ul>
              </div>

              {/* Navigation Buttons INSIDE FORM - Matching Step 3 & 4 */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto px-10 sm:px-12 py-3 sm:py-4 bg-gray-200 text-[#071139] rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Go back to previous step"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Previous Step
                  </span>
                </button>
                
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!file}
                  className={`w-full sm:w-auto group relative px-10 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl transition-all duration-300 overflow-hidden ${
                    file 
                      ? 'bg-gradient-to-r from-[#071139] to-[#003366] text-white hover:from-[#003366] hover:to-[#071139] hover:shadow-2xl hover:scale-105' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Proceed to next step"
                >
                  {file && (
                    <span className="absolute inset-0 bg-gradient-to-r from-[#F7D117] via-white/10 to-[#F7D117] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></span>
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Next Step
                    <svg className={`w-5 h-5 ${file ? 'group-hover:translate-x-1' : ''} transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  );
}
