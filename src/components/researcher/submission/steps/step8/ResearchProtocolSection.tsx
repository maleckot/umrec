import { Shield, FileText, Edit } from 'lucide-react';

interface ProtocolProps {
  step3: any;
  step4: any;
  onEditProtocol: () => void;
  onEditConsent: () => void;
}

export default function ResearchProtocolSection({ step3, step4, onEditProtocol, onEditConsent }: ProtocolProps) {
  
  const stripHtmlTags = (html: string) => {
    return html?.replace(/<[^>]*>/g, '').substring(0, 200) || 'N/A';
  };

  const getConsentTypeLabel = (type: string) => {
    if (type === 'adult') return 'Adult Participants';
    if (type === 'minor') return 'Minor Participants';
    if (type === 'both') return 'Both Adult and Minor Participants';
    return 'N/A';
  };

  return (
    <>
      {/* Research Protocol */}
      <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
              <Shield size={20} className="text-[#F7D117]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Research Protocol
            </h2>
          </div>
          <button
            onClick={onEditProtocol}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <Edit size={16} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Protocol Summary</p>
          <p className="text-sm sm:text-base text-[#071139] font-medium line-clamp-4 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {stripHtmlTags(step3?.formData?.introduction || '')}...
          </p>
        </div>
      </div>

      {/* Informed Consent */}
      <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-[#F7D117]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Informed Consent / Assent Form
            </h2>
          </div>
          <button
            onClick={onEditConsent}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <Edit size={16} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Participant Type</p>
          <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {getConsentTypeLabel(step4?.consentType)}
          </p>
        </div>
      </div>
    </>
  );
}
