'use client';

import { FileText, Calendar, AlertCircle, Tag } from 'lucide-react';

interface Props {
  submissionData: {
    title: string;
    assignedDate: string;
    dueDate: string;
    category: string;
    description: string;
  };
}

const SubmissionDetailsCard = ({ submissionData }: Props) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl mb-8 border border-gray-100/50">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#101C50] mb-6">Submission Details</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-blue-50/50 to-transparent rounded-2xl p-5 border border-blue-100/50">
            <div className="flex items-start gap-3 mb-2">
              <FileText className="w-5 h-5 text-[#101C50] mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wider">Research Title</p>
                <p className="text-base sm:text-lg text-[#101C50] font-bold leading-relaxed">{submissionData.title}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[#101C50]" />
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Assigned Date</p>
              </div>
              <p className="text-base text-[#101C50] font-semibold">{submissionData.assignedDate}</p>
            </div>
            <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#7C1100]" />
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Due Date</p>
              </div>
              <p className="text-base text-[#7C1100] font-bold">{submissionData.dueDate}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-gradient-to-br from-amber-50/50 to-transparent rounded-2xl p-5 border border-amber-100/50">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-amber-700" />
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Review Category</p>
            </div>
            <span className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 border border-amber-200">
              {submissionData.category}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t-2 border-gray-100">
        <p className="text-xs text-gray-600 mb-3 font-bold uppercase tracking-wider">Research Description</p>
        <p className="text-base text-gray-700 leading-relaxed">{submissionData.description}</p>
      </div>
    </div>
  );
};

export default SubmissionDetailsCard;
