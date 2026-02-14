'use client';

import { Building, Edit, CheckCircle } from 'lucide-react';

interface Props {
  data: any;
  onEdit: () => void;
  formatTypeOfStudy: (types: string[], others?: string) => string;
}

const ApplicationReviewSection = ({ data, onEdit, formatTypeOfStudy }: Props) => {
  const step2 = data.step2 || {};
  
  return (
    <div className="bg-gradient-to-r from-orange-500/5 to-orange-600/5 rounded-xl p-4 sm:p-6 border-l-4 border-orange-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
            <Building size={20} className="text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Application for Ethics Review (Revised)
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
          <p className="text-xs sm:text-sm text-gray-500 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Study Site Type</p>
          <p className="text-sm sm:text-base text-[#071139] font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {step2.studySiteType || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Type of Study</p>
          <p className="text-sm sm:text-base text-[#071139] font-bold break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {formatTypeOfStudy(step2.typeOfStudy, step2.typeOfStudyOthers)}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Study Duration</p>
          <p className="text-sm sm:text-base text-[#071139] font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {step2.startDate || 'N/A'} to {step2.endDate || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Number of Participants</p>
          <p className="text-sm sm:text-base text-[#071139] font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {step2.numParticipants || 'N/A'}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs sm:text-sm text-gray-500 font-bold mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>Uploaded Documents</p>
          <div className="space-y-1">
            <p className="text-sm text-[#071139] font-bold flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <CheckCircle size={16} className={data.step5?.fileName ? 'text-green-600' : 'text-gray-400'} />
              Research Instrument: {data.step5?.fileName ? '✓ Uploaded' : '✗ Not Uploaded'}
            </p>
            <p className="text-sm text-[#071139] font-bold flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <CheckCircle size={16} className={data.step6?.fileName ? 'text-green-600' : 'text-gray-400'} />
              Proposal Defense Certification: {data.step6?.fileName ? '✓ Uploaded' : '✗ Not Uploaded'}
            </p>
            <p className="text-sm text-[#071139] font-bold flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <CheckCircle size={16} className={data.step7?.fileName ? 'text-green-600' : 'text-gray-400'} />
              Endorsement Letter: {data.step7?.fileName ? '✓ Uploaded' : '✗ Not Uploaded'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReviewSection;
