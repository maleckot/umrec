// app/researchermodule/submissions/new/step7/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubmissionStepLayout from '@/components/researcher/submission/SubmissionStepLayout';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';

export default function Step7EndorsementLetter() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('step7Data');
    if (saved) {
      const parsedData = JSON.parse(saved);
      if (parsedData.fileName) {
        // File restoration logic
      }
    }
  }, []);

  const handleNext = () => {
    if (!file) {
      alert('Please upload a valid endorsement letter.');
      return;
    }

    const dataToSave = {
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString()
    };
    localStorage.setItem('step7Data', JSON.stringify(dataToSave));
    router.push('/researchermodule/submissions/new/step8');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new/step6');
  };

  const isNextDisabled = file === null;

  return (
    <SubmissionStepLayout
      stepNumber={7}
      title="Endorsement Letter from Research Adviser"
      description="Upload the official endorsement letter from your research adviser."
      onBack={handleBack}
      onNext={handleNext}
      isNextDisabled={isNextDisabled}
      totalSteps={8}
    >
      <form className="space-y-8">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-base sm:text-lg mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Instructions
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Upload an <strong>endorsement letter</strong> from your research adviser</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span><strong>Scanned copies are allowed</strong> - ensure the document is clear and readable</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>File must be in <strong>PDF format</strong> and not exceed <strong>10MB</strong></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Letter must be addressed to the UMREC Chairperson</span>
            </li>
          </ul>
        </div>

        {/* Upload Component */}
        <PDFUploadValidator
          label="Endorsement Letter"
          description="Official letter from your research adviser endorsing your research protocol for ethics review."
          value={file}
          onChange={setFile}
          validationKeywords={['endorsement', 'letter', 'adviser', 'recommendation']}
          required
        />

        {/* Letter Format Guide */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Letter Should Be Addressed To:
          </h4>
          <div className="bg-white p-4 rounded-lg border border-yellow-200">
            <p className="text-sm font-semibold text-[#1E293B] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Prof. MARK PHILIP C. PADERAN, M.A. LIT.<br />
              <span className="text-[#64748B]">Chairperson</span><br />
              <span className="text-[#64748B]">University of Makati Research Ethics Committee</span>
            </p>
          </div>
        </div>

        {/* Content Requirements */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Letter Should Include:
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Research title and brief description</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Researcher(s) name(s) and affiliation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Adviser's endorsement and recommendation for ethics review</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Adviser's signature, name, and designation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Date of endorsement</span>
            </li>
          </ul>
        </div>
      </form>
    </SubmissionStepLayout>
  );
}
