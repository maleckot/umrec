// components/submission/InfoDetailRow.tsx
'use client';

import { LucideIcon } from 'lucide-react';

interface InfoDetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const InfoDetailRow: React.FC<InfoDetailRowProps> = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start space-x-3">
      <Icon className="w-5 h-5 text-[#3B82F6] flex-shrink-0 mt-0.5" strokeWidth={2} />
      <div className="flex-1">
        <p className="text-xs text-[#64748B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {label}
        </p>
        <p className="text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default InfoDetailRow;
