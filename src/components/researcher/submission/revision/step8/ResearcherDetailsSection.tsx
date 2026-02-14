'use client';

import { FileText, Edit } from 'lucide-react';

interface Props {
  data: any;
  onEdit: () => void;
}

const ResearcherDetailsSection = ({ data, onEdit }: Props) => {
  return (
    <div className="bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-xl p-4 sm:p-6 border-l-4 border-orange-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
            <FileText size={20} className="text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Researcher Details (Revised)
          </h2>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <Edit size={16} />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Project Title</p>
          <p className="text-sm sm:text-base text-[#071139] font-bold break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {data?.title || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Project Leader</p>
          <p className="text-sm sm:text-base text-[#071139] font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {`${data?.projectLeaderFirstName || ''} ${data?.projectLeaderLastName || ''}`.trim() || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Email</p>
          <p className="text-sm sm:text-base text-[#071139] font-bold break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {data?.projectLeaderEmail || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Organization</p>
          <p className="text-sm sm:text-base text-[#071139] font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {data?.organization || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResearcherDetailsSection;
