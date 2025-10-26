// app/researchermodule/submissions/revision/step7/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, AlertCircle, MessageSquare, Upload, FileText, Mail, CheckCircle } from 'lucide-react';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';

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

export default function RevisionStep7() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const [revisionComments] = useState(
    'The endorsement letter must include specific mention of the revisions made to the research protocol. Please provide an updated endorsement letter from your adviser that acknowledges the changes and confirms their support for the revised version. The letter should be dated after the revision feedback was received.'
  );

  useEffect(() => {
    const saved = localStorage.getItem('revisionStep7Data');
    if (saved) {
      const parsedData = JSON.parse(saved);
      if (parsedData.fileName) {
        // File reference exists but actual file needs to be re-uploaded
        console.log('Previous file:', parsedData.fileName);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a valid endorsement letter document.');
      return;
    }

    // Convert file to base64 and store in sessionStorage
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem('revisionStep7File', reader.result as string);

      const dataToSave = {
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };
      localStorage.setItem('revisionStep7Data', JSON.stringify(dataToSave));
      console.log('💾 Revision Step 7 data saved');
      router.push('/researchermodule/submissions/revision/step8');
    };
    reader.readAsDataURL(file);
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/revision/step6');
  };

  const isNextDisabled = file === null;

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
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>7</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Endorsement Letter from Research Adviser - Revision
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Upload an updated endorsement letter for your revised protocol
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 transition-all duration-500 rounded-full shadow-lg"
                style={{ width: '87.5%' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Step 7 of 8
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                87.5% Complete
              </span>
            </div>
          </div>

          {/* Enhanced Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Reviewer Comments Box */}
            <RevisionCommentBox comments={revisionComments} />

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Instructions */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-base sm:text-lg mb-3 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <AlertCircle size={20} className="text-orange-500" />
                  Instructions for Revised Endorsement
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span>Upload an <strong>updated endorsement letter</strong> from your research adviser that specifically addresses the revisions made</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span>The letter must be <strong>dated after the revision feedback</strong> was received</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span><strong>Scanned copies are allowed</strong> - ensure the document is clear and readable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span>File must be in <strong>PDF format</strong> and not exceed <strong>10MB</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span>Letter must be addressed to the UMREC Chairperson</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span>Letter should acknowledge that revisions have been reviewed and approved by the adviser</span>
                  </li>
                </ul>
              </div>

              {/* Upload Component */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#071139] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Updated Endorsement Letter
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Official letter from your research adviser endorsing your revised research protocol
                    </p>
                  </div>
                </div>
                
                <PDFUploadValidator
                  label="Updated Endorsement Letter"
                  description="Official letter from your research adviser endorsing your revised research protocol for ethics re-review. The letter should confirm adviser approval of all revisions made."
                  value={file}
                  onChange={setFile}
                  validationKeywords={['endorsement', 'letter', 'adviser', 'recommendation', 'revision']}
                  required
                />
              </div>

              {/* Letter Format Guide */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-3 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <FileText size={18} className="text-orange-600" />
                  Letter Should Be Addressed To:
                </h4>
                <div className="bg-white p-4 rounded-lg border-2 border-orange-200 shadow-sm">
                  <p className="text-xs sm:text-sm font-semibold text-[#071139] leading-relaxed break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Prof. MARK PHILIP C. PADERAN, M.A. LIT.<br />
                    <span className="text-gray-600">Chairperson</span><br />
                    <span className="text-gray-600">University of Makati Research Ethics Committee</span>
                  </p>
                </div>
              </div>

              {/* Content Requirements for Revision */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-3 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <CheckCircle size={18} className="text-orange-500" />
                  Revised Endorsement Letter Must Include:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
                    <span>Research title (updated if changed)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
                    <span>Researcher(s) name(s) and affiliation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
                    <span><strong>Statement acknowledging the revisions made</strong> to the research protocol</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
                    <span><strong>Confirmation that the adviser has reviewed and approved the revisions</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
                    <span>Renewed endorsement and recommendation for ethics re-review</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
                    <span>Adviser's signature, name, and designation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
                    <span><strong>Date of updated endorsement</strong> (must be recent)</span>
                  </li>
                </ul>
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
    </div>
  );
}
