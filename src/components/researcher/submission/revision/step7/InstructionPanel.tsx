import { AlertCircle } from 'lucide-react';

const InstructionPanel: React.FC = () => {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
      <h4 className="font-bold text-[#071139] text-base sm:text-lg mb-3 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <AlertCircle size={20} className="text-orange-500" />
        Instructions for Revised Endorsement
      </h4>
      <ul className="space-y-2 text-xs sm:text-sm text-gray-800 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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
  );
};

export default InstructionPanel;
