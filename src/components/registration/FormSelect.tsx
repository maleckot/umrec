// components/registration/FormSelect.tsx
'use client';

import { ChevronDown } from 'lucide-react';

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false
}: FormSelectProps) {
  return (
    <div className="w-full">
      <label 
        className="block text-[10px] sm:text-xs font-semibold text-[#003366] mb-0.5 sm:mb-1" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full h-[34px] sm:h-[38px] appearance-none px-2 sm:px-3 pr-7 sm:pr-8 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent text-xs sm:text-sm font-medium text-[#003366] bg-transparent cursor-pointer"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[#003366] pointer-events-none" />
      </div>
    </div>
  );
}
