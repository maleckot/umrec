import { Building, Edit } from 'lucide-react';

interface EthicsReviewProps {
  step2: any;
  onEdit: () => void;
}

export default function EthicsReviewSection({ step2, onEdit }: EthicsReviewProps) {
  
  const formatTypeOfStudy = (typeOfStudy: string[], typeOfStudyOthers?: string) => {
    if (!typeOfStudy || typeOfStudy.length === 0) return 'N/A';
    const formattedTypes = typeOfStudy.map(type => {
      if (type.toLowerCase() === 'others' && typeOfStudyOthers) {
        return `Others: ${typeOfStudyOthers}`;
      }
      return type;
    });
    return formattedTypes.join(', ');
  };

  return (
    <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
            <Building size={20} className="text-[#F7D117]" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Application for Ethics Review
          </h2>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] text-white rounded-lg hover:bg-[#003366] transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <Edit size={16} />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Study Site Type</p>
          <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {step2?.studySiteType || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Type of Study</p>
          <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {formatTypeOfStudy(step2?.typeOfStudy, step2?.typeOfStudyOthers)}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Study Duration</p>
          <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {step2?.startDate || 'N/A'} to {step2?.endDate || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Number of Participants</p>
          <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {step2?.numParticipants || 'N/A'}
          </p>
        </div>

        {/* Study Team Members (Step 2) */}
        {(step2?.coResearchers?.length > 0 || step2?.technicalAdvisers?.length > 0) && (
           <div className="md:col-span-2 mt-2 bg-white/50 p-3 rounded-lg border border-gray-200">
             <p className="text-xs sm:text-sm text-gray-700 font-bold mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>Additional Team</p>
             {step2?.coResearchers?.length > 0 && step2.coResearchers[0].name && (
               <div className="mb-2">
                 <span className="text-xs font-bold text-[#071139] block mb-1">Co-Researchers:</span>
                 {step2.coResearchers.map((cr: any, idx: number) => (
                   <span key={idx} className="text-sm text-[#071139] block ml-2">• {cr.name}</span>
                 ))}
               </div>
             )}
             {step2?.technicalAdvisers?.length > 0 && step2.technicalAdvisers[0].name && (
               <div>
                 <span className="text-xs font-bold text-[#071139] block mb-1">Technical Advisers:</span>
                 {step2.technicalAdvisers.map((ta: any, idx: number) => (
                   <span key={idx} className="text-sm text-[#071139] block ml-2">• {ta.name}</span>
                 ))}
               </div>
             )}
           </div>
        )}
      </div>
    </div>
  );
}
