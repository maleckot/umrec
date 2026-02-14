import { FileText, Edit } from 'lucide-react';

interface ResearcherDetailsProps {
  data: any;
  onEdit: () => void;
}

export default function ResearcherDetailsSection({ data, onEdit }: ResearcherDetailsProps) {
  return (
    <div className="bg-gradient-to-r from-[#071139]/5 to-[#003366]/5 rounded-xl p-4 sm:p-6 border-l-4 border-[#071139]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#071139] to-[#003366] rounded-lg flex items-center justify-center">
            <FileText size={20} className="text-[#F7D117]" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Researcher Details
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
          <p className="text-xs sm:text-sm text-gray-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Project Title</p>
          <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {data?.protocolTitle || data?.title || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Project Leader</p>
          <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {data?.principalInvestigator || `${data?.projectLeaderFirstName || ''} ${data?.projectLeaderLastName || ''}`.trim() || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Email</p>
          <p className="text-sm sm:text-base text-[#071139] font-medium break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {data?.emailAddress || data?.projectLeaderEmail || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-700 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Organization</p>
          <p className="text-sm sm:text-base text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {data?.organization || data?.position || 'N/A'}
          </p>
        </div>

        {data?.coInvestigators && data.coInvestigators.length > 0 && (
          <div className="md:col-span-2 mt-2">
            <p className="text-xs sm:text-sm text-gray-700 font-bold mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>Co-Investigators</p>
            <div className="space-y-1 bg-white/50 p-3 rounded-lg border border-gray-200">
              {data.coInvestigators.map((ci: any, index: number) => (
                <p key={index} className="text-sm text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  • {ci.name} ({ci.email})
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
