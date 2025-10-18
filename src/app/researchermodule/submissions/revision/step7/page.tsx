// app/researchermodule/submissions/revision/step7/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RevisionStepLayout from '@/components/researcher/revision/RevisionStepLayout';
import RevisionCommentBox from '@/components/researcher/revision/RevisionCommentBox';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';

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
    <RevisionStepLayout
      stepNumber={7}
      title="Endorsement Letter from Research Adviser"
      description="Upload an updated endorsement letter for your revised protocol."
      onBack={handleBack}
    >
      <RevisionCommentBox comments={revisionComments} />

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Instructions */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-base sm:text-lg mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Instructions for Revised Endorsement
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>Upload an <strong>updated endorsement letter</strong> from your research adviser that specifically addresses the revisions made</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>The letter must be <strong>dated after the revision feedback</strong> was received</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span><strong>Scanned copies are allowed</strong> - ensure the document is clear and readable</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>File must be in <strong>PDF format</strong> and not exceed <strong>10MB</strong></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>Letter must be addressed to the UMREC Chairperson</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">•</span>
              <span>Letter should acknowledge that revisions have been reviewed and approved by the adviser</span>
            </li>
          </ul>
        </div>

        {/* Upload Component */}
        <PDFUploadValidator
          label="Updated Endorsement Letter"
          description="Official letter from your research adviser endorsing your revised research protocol for ethics re-review. The letter should confirm adviser approval of all revisions made."
          value={file}
          onChange={setFile}
          validationKeywords={['endorsement', 'letter', 'adviser', 'recommendation', 'revision']}
          required
        />

        {/* Letter Format Guide */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Letter Should Be Addressed To:
          </h4>
          <div className="bg-white p-4 rounded-lg border-2 border-amber-200">
            <p className="text-xs sm:text-sm font-semibold text-[#1E293B] leading-relaxed break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Prof. MARK PHILIP C. PADERAN, M.A. LIT.<br />
              <span className="text-[#64748B]">Chairperson</span><br />
              <span className="text-[#64748B]">University of Makati Research Ethics Committee</span>
            </p>
          </div>
        </div>

        {/* Content Requirements for Revision */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 sm:p-6 rounded-lg">
          <h4 className="font-bold text-[#1E293B] text-sm sm:text-base mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Revised Endorsement Letter Must Include:
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span>Research title (updated if changed)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span>Researcher(s) name(s) and affiliation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span><strong>Statement acknowledging the revisions made</strong> to the research protocol</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span><strong>Confirmation that the adviser has reviewed and approved the revisions</strong></span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span>Renewed endorsement and recommendation for ethics re-review</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span>Adviser's signature, name, and designation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 flex-shrink-0 text-amber-600 font-bold">✓</span>
              <span><strong>Date of updated endorsement</strong> (must be recent)</span>
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
