// app/researchermodule/submissions/revision/step5/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RevisionStepLayout from '@/components/researcher/revision/RevisionStepLayout';
import RevisionCommentBox from '@/components/researcher/revision/RevisionCommentBox';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';

export default function RevisionStep5() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const [revisionComments] = useState(
    'The research instrument needs to include clearer instructions for participants. Please add demographic questions at the beginning and ensure all Likert scale items are properly formatted. The validation certificate should be included or referenced.'
  );

  useEffect(() => {
    const saved = localStorage.getItem('revisionStep5Data');
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
      alert('Please upload a valid research instrument document.');
      return;
    }

    // Convert file to base64 and store in sessionStorage
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem('revisionStep5File', reader.result as string);

      const dataToSave = {
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };
      localStorage.setItem('revisionStep5Data', JSON.stringify(dataToSave));
      console.log('💾 Revision Step 5 data saved');
      router.push('/researchermodule/submissions/revision/step6');
    };
    reader.readAsDataURL(file);
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions/revision/step4');
  };

  const isNextDisabled = file === null;

  return (
    <RevisionStepLayout
      stepNumber={5}
      title="Validated Research Instrument"
      description="Review and upload your updated research instrument."
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
              <span>Upload your <strong>updated and validated research instrument</strong> (survey form or questionnaire) based on reviewer feedback</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>File must be in <strong>PDF format</strong> and not exceed <strong>10MB</strong></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>Ensure the document includes all survey questions, scales, and measurement tools with requested improvements</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>Address all specific feedback provided by the reviewer regarding your instrument</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>The document will be validated before you can proceed</span>
            </li>
          </ul>
        </div>

        {/* Upload Component */}
        <PDFUploadValidator
          label="Research Instrument Document"
          description="Upload your revised and validated survey form, questionnaire, or other research measurement tools. Ensure all requested changes have been incorporated."
          value={file}
          onChange={setFile}
          validationKeywords={['survey', 'questionnaire', 'instrument', 'form']}
          required
        />

        {/* Requirements Checklist */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Revision Requirements Checklist
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span>All survey questions or measurement items are included and updated</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span>Demographic or participant information section is present and complete</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span>Instructions for participants are clear, complete, and revised per feedback</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span>Document has been re-validated by adviser or expert after revisions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span>All specific comments from the reviewer have been addressed</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span>Formatting, scales, and response options are clearly presented</span>
            </li>
          </ul>
        </div>

        {/* Important Note */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] mb-2 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Important Note:
          </h4>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Make sure your revised research instrument directly addresses all the feedback provided by the reviewer. If you made significant changes to the structure or content, consider including a summary of changes at the beginning of your document or in a cover page. This will help expedite the re-review process.
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-amber-100 border-l-4 border-amber-600 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] mb-2 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            What Happens After Upload?
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-700 font-bold">1.</span>
              <span>Your document will be validated for format and size requirements</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-700 font-bold">2.</span>
              <span>The file will be securely stored with your revised submission</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-700 font-bold">3.</span>
              <span>You can proceed to upload additional supporting documents</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-700 font-bold">4.</span>
              <span>The reviewer will assess whether all requested changes have been properly implemented</span>
            </li>
          </ul>
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
