'use client';

import { Calendar } from 'lucide-react';

interface Props {
  submittedFiles: any[];
  submissionTitle: string;
  onViewDocument: (name: string, url: string) => void;
}

const SubmittedFilesCard = ({ submittedFiles, submissionTitle, onViewDocument }: Props) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl mb-8 border border-gray-100/50">
      <div className="flex items-center mb-6">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Submitted Documents
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full mt-2"></div>
        </div>
      </div>

      <div className="space-y-4">
        {submittedFiles.map((file) => (
          <div key={file.id} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl border border-gray-200/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#101C50] to-[#1a2d70] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-bold text-[#101C50] mb-1 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {file.displayTitle || 'Consolidated Application - ' + submissionTitle}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <Calendar className="w-3.5 h-3.5" />
                    Uploaded: {file.time}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (file.url) {
                    onViewDocument(file.displayTitle || file.name, file.url);
                  } else {
                    alert('Document URL not available');
                  }
                }}
                className="w-full sm:w-32 px-6 py-3 rounded-2xl text-sm font-bold transition-all bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white hover:shadow-lg hover:scale-105 transform"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                View File
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmittedFilesCard;
