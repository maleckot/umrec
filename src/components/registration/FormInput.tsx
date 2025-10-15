// components/registration/FormInput.tsx
'use client';

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'date';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false
}: FormInputProps) {
  return (
    <div className="w-full">
      <label 
        className="block text-[10px] sm:text-xs font-semibold text-[#003366] mb-0.5 sm:mb-1" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full h-[34px] sm:h-[38px] px-2 sm:px-3 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent text-xs sm:text-sm font-medium text-[#003366] placeholder-gray-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      />
    </div>
  );
}
