// components/RevisionCard.tsx
'use client';

import { AlertCircle } from 'lucide-react';

interface RevisionCardProps {
  message: string;
  isVisible: boolean;
}

const RevisionCard: React.FC<RevisionCardProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-red-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <AlertCircle size={20} className="text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold mb-2 text-red-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Revision Required
          </h3>
          <p className="text-sm md:text-base text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevisionCard;
