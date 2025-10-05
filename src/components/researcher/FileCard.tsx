'use client';

import { FileText } from 'lucide-react';

interface FileCardProps {
  filename: string;
  fileType: string;
  fileUrl?: string;
}

const FileCard: React.FC<FileCardProps> = ({ filename, fileType, fileUrl }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-gray-200">
      <div className="w-16 h-16 bg-[#101C50] rounded-xl flex items-center justify-center flex-shrink-0">
        <FileText size={32} className="text-white" />
      </div>
      <div>
        <h3 className="text-base md:text-lg font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {filename}
        </h3>
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {fileType}
        </p>
      </div>
    </div>
  );
};

export default FileCard;
