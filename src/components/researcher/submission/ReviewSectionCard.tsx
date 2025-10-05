// components/submission/ReviewSectionCard.tsx
'use client';

import { Edit } from 'lucide-react';
import { ReactNode } from 'react';

interface ReviewSectionCardProps {
  title: string;
  stepNumber: number;
  onEdit: () => void;
  children: ReactNode;
}

const ReviewSectionCard: React.FC<ReviewSectionCardProps> = ({
  title,
  stepNumber,
  onEdit,
  children
}) => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] p-4 flex items-center justify-between">
        <h3 className="text-white font-bold text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Step {stepNumber}: {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center space-x-2 px-3 py-1.5 bg-white text-[#3B82F6] rounded-lg hover:bg-blue-50 transition-colors text-xs font-semibold"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <Edit size={14} />
          <span>Edit</span>
        </button>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default ReviewSectionCard;
