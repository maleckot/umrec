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
  // Generate unique ID from label
  const selectId = `select-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div className="w-full">
      <label 
        htmlFor={selectId}
        className="block text-[10px] sm:text-xs font-semibold text-[#003366] mb-0.5 sm:mb-1" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full h-[34px] sm:h-[38px] appearance-none px-2 sm:px-3 pr-7 sm:pr-8 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent text-xs sm:text-sm font-medium text-[#003366] bg-white cursor-pointer transition-all duration-200"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          aria-label={label}
          aria-required={required}
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
