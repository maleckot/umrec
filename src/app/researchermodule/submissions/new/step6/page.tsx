// app/researchermodule/submissions/new/step6/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubmissionStepLayout from '@/components/researcher/submission/SubmissionStepLayout';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';

export default function Step6ProposalDefense() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('step6Data');
    if (saved) {
      const parsedData = JSON.parse(saved);
      if (parsedData.fileName) {
        // File restoration logic
      }
    }
  }, []);

  const handleNext = () => {
    if (!file) {
      alert('Please upload a valid proposal defense certification.');
      return;
    }

    const dataToSave = {
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString()
    };
    localStorage.setItem('step6Data', JSON.stringify(dataToSave));
    router.push('/researchermodule/submissions/new/step7');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new/step5');
  };

  const isNextDisabled = file === null;

  return (
    <SubmissionStepLayout
      stepNumber={6}
      title="Proposal Defense Certification"
      description="Upload your proposal defense certification or evaluation (for students)."
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
              <span>Upload a <strong>one-page</strong> proposal defense certification or evaluation</span>
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
              <span>Document should contain signatures and official stamps/seals</span>
            </li>
          </ul>
        </div>

        {/* Upload Component */}
        <PDFUploadValidator
          label="Proposal Defense Certification/Evaluation"
          description="One-page attachment showing your proposal defense has been completed and approved."
          value={file}
          onChange={setFile}
          validationKeywords={['defense', 'certification', 'evaluation', 'approval']}
          required
        />

        {/* Important Note */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            For Student Researchers
          </h4>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            This document certifies that you have successfully defended your research proposal before a panel. 
            It should include the date of defense, panel members' signatures, and any recommendations or conditions 
            for proceeding with the study. If you don't have this yet, please consult with your research adviser.
          </p>
        </div>
      </form>
    </SubmissionStepLayout>
  );
}
