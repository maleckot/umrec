// app/researchermodule/submissions/new/step5/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SubmissionStepLayout from '@/components/researcher/submission/SubmissionStepLayout';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';

export default function Step5ResearchInstrument() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('step5Data');
    if (saved) {
      const parsedData = JSON.parse(saved);
      if (parsedData.fileName) {
        // File restoration logic
      }
    }
  }, []);

  const handleNext = () => {
    if (!file) {
      alert('Please upload a valid research instrument document.');
      return;
    }

    const dataToSave = {
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString()
    };
    localStorage.setItem('step5Data', JSON.stringify(dataToSave));
    router.push('/researchermodule/submissions/new/step6');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/new/step4');
  };

  const isNextDisabled = file === null;

  return (
    <SubmissionStepLayout
      stepNumber={5}
      title="Validated Research Instrument"
      description="Upload your validated survey form or questionnaire."
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
              <span>Upload your <strong>validated research instrument</strong> (survey form or questionnaire)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>File must be in <strong>PDF format</strong> and not exceed <strong>10MB</strong></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Ensure the document includes all survey questions, scales, and measurement tools</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
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
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Document Requirements Checklist
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>All survey questions or measurement items are included</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Demographic or participant information section is present</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Instructions for participants are clear and complete</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Document has been validated by adviser or expert</span>
            </li>
          </ul>
        </div>
      </form>
    </SubmissionStepLayout>
  );
}
