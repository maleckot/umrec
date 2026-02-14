'use client';

import { Building2, Mail, Phone, Edit2 } from 'lucide-react';

interface Props {
  reviewer: any;
  reviewerCode: string;
  isEditingCode: boolean;
  setReviewerCode: (val: string) => void;
  setIsEditingCode: (val: boolean) => void;
  onSaveCode: () => void;
}

const ProfileHeaderCard = ({ reviewer, reviewerCode, isEditingCode, setReviewerCode, setIsEditingCode, onSaveCode }: Props) => {
  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        
        {/* User Info */}
        <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0 shadow-md border-4 border-white ring-1 ring-gray-100">
            <span className="text-white text-2xl sm:text-3xl font-bold">
              {reviewer.name.charAt(0)}
            </span>
          </div>
          
          <div className="flex-1 pt-1 w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#101C50] mb-2 leading-tight" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {reviewer.name}
            </h1>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600 mb-4 font-medium">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-gray-400 flex-shrink-0" />
                <span className="font-bold text-gray-700">{reviewer.college || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400 flex-shrink-0" />
                <span className="break-all font-bold text-gray-700">{reviewer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400 flex-shrink-0" />
                <span className="font-bold text-gray-700">{reviewer.phone || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviewer Code Box */}
        <div className="flex-shrink-0 bg-gray-50 rounded-xl p-4 border border-gray-200 w-full lg:w-auto min-w-[200px]">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reviewer Code</p>
          
          {isEditingCode ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={reviewerCode}
                onChange={(e) => setReviewerCode(e.target.value)}
                className="w-full px-3 py-2 text-lg font-bold text-[#101C50] border border-blue-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-center"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={onSaveCode} className="flex-1 bg-[#101C50] text-white text-xs font-bold py-1.5 rounded hover:bg-opacity-90">Save</button>
                <button onClick={() => { setIsEditingCode(false); setReviewerCode(reviewer.code); }} className="flex-1 bg-white border border-gray-300 text-gray-600 text-xs font-bold py-1.5 rounded hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <span className="text-2xl font-bold text-[#101C50] tracking-tight">{reviewerCode}</span>
              <button 
                onClick={() => setIsEditingCode(true)}
                className="p-1.5 text-gray-400 hover:text-[#101C50] hover:bg-white rounded-lg transition-all"
              >
                <Edit2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
