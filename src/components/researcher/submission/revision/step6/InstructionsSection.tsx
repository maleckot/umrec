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
          <span>Upload a <strong>one-page</strong> proposal defense certification or evaluation with improved quality</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
          <span><strong>High-quality scans are required</strong> - ensure all text, signatures, and stamps are clear and readable</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
          <span>File must be in <strong>PDF format</strong> and not exceed <strong>10MB</strong></span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
          <span>Document must contain <strong>all required signatures</strong> and official stamps/seals clearly visible</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
          <span>Ensure the defense date and any panel recommendations are legible</span>
        </li>
      </ul>
    </div>
  );
}
