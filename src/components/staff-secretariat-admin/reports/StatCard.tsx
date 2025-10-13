// components/staff-secretariat-admin/reports/StatCard.tsx
'use client';

interface StatCardProps {
  label: string;
  value: number | string;
  bgColor: string;
  textColor?: string;
  isTime?: boolean;
}

export default function StatCard({ label, value, bgColor, textColor = 'text-[#003366]', isTime = false }: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-4 sm:p-6 border border-gray-200`}>
      <p 
        className="text-xs sm:text-sm text-gray-700 mb-2" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        {label}
      </p>
      <p 
        className={`text-2xl sm:text-3xl font-bold ${textColor}`}
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        {isTime ? value : typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
