// components/submission/DocumentListItem.tsx
'use client';

import { FileText } from 'lucide-react';

interface DocumentListItemProps {
  title: string;
  fileName: string;
  onEdit: () => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({ title, fileName, onEdit }) => {
  return (
    <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-start space-x-3 flex-1">
        <FileText className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {title}
          </p>
          <p className="text-xs text-[#64748B] truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {fileName || 'Not uploaded'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="ml-2 text-xs text-[#3B82F6] hover:text-[#2563EB] font-semibold"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Edit
      </button>
    </div>
  );
};

export default DocumentListItem;
