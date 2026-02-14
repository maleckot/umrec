'use client';

import { Shield, Edit } from 'lucide-react';

interface Props {
  data: any;
  onEdit: () => void;
  stripHtml: (html: string) => string;
}

const ProtocolSection = ({ data, onEdit, stripHtml }: Props) => {
  return (
    <div className="bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-xl p-4 sm:p-6 border-l-4 border-orange-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
            <Shield size={20} className="text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Research Protocol (Revised)
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
      <div>
        <p className="text-xs sm:text-sm text-gray-500 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Protocol Summary</p>
        <p className="text-sm sm:text-base text-[#071139] font-medium line-clamp-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {stripHtml(data?.formData?.introduction || '')}...
        </p>
      </div>
    </div>
  );
};

export default ProtocolSection;
