// components/StatCard.tsx
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {label}
        </p>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
        {value}
      </p>
    </div>
  );
}
