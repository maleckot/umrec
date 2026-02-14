import { AlertCircle } from 'lucide-react';

export default function InstructionsSection() {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
      <h4 className="font-bold text-[#071139] text-base sm:text-lg mb-3 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <AlertCircle size={20} className="text-orange-500" />
        Instructions
      </h4>
      <ul className="space-y-2 text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
          <span>Upload your <strong>updated and validated research instrument</strong> (survey form or questionnaire) based on reviewer feedback</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
          <span>File must be in <strong>PDF format</strong> and not exceed <strong>10MB</strong></span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
          <span>Ensure the document includes all survey questions, scales, and measurement tools with requested improvements</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
          <span>Address all specific feedback provided by the reviewer regarding your instrument</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
          <span>The document will be validated before you can proceed</span>
        </li>
      </ul>
    </div>
  );
}
