// components/submission/ReviewField.tsx
'use client';

interface ReviewFieldProps {
  label: string;
  value: string | number;
  fullWidth?: boolean;
}

const ReviewField: React.FC<ReviewFieldProps> = ({ label, value, fullWidth = false }) => {
  return (
    <div className={fullWidth ? '' : ''}>
      <p className="text-xs text-[#64748B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {label}
      </p>
      <p className="text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {value}
      </p>
    </div>
  );
};

export default ReviewField;
