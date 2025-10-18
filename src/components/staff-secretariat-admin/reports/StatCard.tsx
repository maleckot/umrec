// components/staff-secretariat-admin/reports/StatCard.tsx
'use client';

interface StatCardProps {
  label: string;
  value: number | string;
  bgColor: string;
  textColor: string;
  isTime?: boolean;
}

export default function StatCard({ label, value, bgColor, textColor, isTime = false }: StatCardProps) {
  const formattedValue = typeof value === 'number' && !isTime 
    ? value.toLocaleString() 
    : value;

  return (
    <div className={`${bgColor} rounded-xl p-4 sm:p-6 border-2 border-gray-200 transition-transform hover:scale-105`}>
      <p 
        className={`text-xs sm:text-sm font-semibold ${textColor} mb-2 sm:mb-3`}
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        {label}
      </p>
      <p 
        className={`text-2xl sm:text-3xl md:text-4xl font-bold ${textColor}`}
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        {formattedValue}
      </p>
    </div>
  );
}
