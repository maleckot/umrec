// app/researchermodule/submissions/revision/step6/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RevisionStepLayout from '@/components/researcher/revision/RevisionStepLayout';
import RevisionCommentBox from '@/components/researcher/revision/RevisionCommentBox';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';

export default function RevisionStep6() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const [revisionComments] = useState(
    'The proposal defense certification document is not clearly legible. Please provide a higher quality scan with all signatures and stamps visible. Ensure the date of defense and panel recommendations are clearly readable.'
  );

  useEffect(() => {
    const saved = localStorage.getItem('revisionStep6Data');
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
      alert('Please upload a valid proposal defense certification document.');
      return;
    }

    // Convert file to base64 and store in sessionStorage
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem('revisionStep6File', reader.result as string);

      const dataToSave = {
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };
      localStorage.setItem('revisionStep6Data', JSON.stringify(dataToSave));
      console.log('💾 Revision Step 6 data saved');
      router.push('/researchermodule/submissions/revision/step7');
    };
    reader.readAsDataURL(file);
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/revision/step5');
  };

  const isNextDisabled = file === null;

  return (
    <RevisionStepLayout
      stepNumber={6}
      title="Proposal Defense Certification"
      description="Upload an updated or clearer version of your certification."
      onBack={handleBack}
    >
      <RevisionCommentBox comments={revisionComments} />

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Instructions */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-base sm:text-lg mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Instructions
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>Upload a <strong>one-page</strong> proposal defense certification or evaluation with improved quality</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span><strong>High-quality scans are required</strong> - ensure all text, signatures, and stamps are clear and readable</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>File must be in <strong>PDF format</strong> and not exceed <strong>10MB</strong></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>Document must contain <strong>all required signatures</strong> and official stamps/seals clearly visible</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>Ensure the defense date and any panel recommendations are legible</span>
            </li>
          </ul>
        </div>

        {/* Upload Component */}
        <PDFUploadValidator
          label="Proposal Defense Certification/Evaluation"
          description="Upload a clear, high-quality scan of your one-page certification showing your proposal defense has been completed and approved. Address all quality issues mentioned in the feedback."
          value={file}
          onChange={setFile}
          validationKeywords={['defense', 'certification', 'evaluation', 'approval']}
          required
        />

        {/* Important Note */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            For Student Researchers
          </h4>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            This document certifies that you have successfully defended your research proposal before a panel. 
            It should include the date of defense, panel members' signatures, and any recommendations or conditions 
            for proceeding with the study.
          </p>
          <p className="text-xs sm:text-sm text-amber-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            If the previous submission was rejected due to poor quality, please ensure this updated version meets all clarity requirements. Contact your research adviser if you need assistance obtaining a clearer copy.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold order-2 sm:order-1"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isNextDisabled}
            className="w-full sm:w-auto px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold cursor-pointer order-1 sm:order-2"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {isNextDisabled ? 'Upload Required' : 'Next'}
          </button>
        </div>
      </form>
    </RevisionStepLayout>
  );
}
