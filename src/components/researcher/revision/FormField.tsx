// components/researcher/revision/FormField.tsx
'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  children: ReactNode;
}

export default function FormField({ label, required = false, helperText, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {helperText && (
          <span className="text-[#64748B] font-normal text-xs ml-2">{helperText}</span>
        )}
      </label>
      {children}
    </div>
  );
}
