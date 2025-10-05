// components/submission/FormComponents.tsx
'use client';

import React from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  type?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  helperText,
  type = 'text'
}) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    {helperText && (
      <p className="text-xs text-[#64748B] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {helperText}
      </p>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
      style={{ fontFamily: 'Metropolis, sans-serif' }}
      required={required}
    />
  </div>
);

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  helperText?: string;
  maxLength?: number;
  showWordCount?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  helperText,
  maxLength,
  showWordCount = false
}) => {
  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {helperText && (
        <p className="text-xs text-[#64748B] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {helperText}
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none resize-none text-[#1E293B]"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
        required={required}
      />
      {showWordCount && (
        <p className="text-xs text-[#64748B] mt-2 text-right" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Word Count: {wordCount} {maxLength && `/ ${maxLength}`}
        </p>
      )}
    </div>
  );
};

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  helperText
}) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    {helperText && (
      <p className="text-xs text-[#64748B] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {helperText}
      </p>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1E293B]"
      style={{ fontFamily: 'Metropolis, sans-serif' }}
      required={required}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface CheckboxGroupProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  required?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selected,
  onChange,
  required = false
}) => {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-3 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            />
            <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

interface RadioGroupProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selected,
  onChange,
  required = false
}) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold mb-3 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer">
          <input
            type="radio"
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
            className="w-5 h-5 text-[#3B82F6] border-2 border-gray-300 focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
            required={required}
          />
          <span className="ml-3 text-sm text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

interface FileUploadProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  required?: boolean;
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  value,
  onChange,
  accept = ".pdf,.doc,.docx",
  required = false,
  helperText
}) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold mb-2 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    {helperText && (
      <p className="text-xs text-[#64748B] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {helperText}
      </p>
    )}
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#3B82F6] transition-colors">
      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
        className="hidden"
        id={`file-${label}`}
        required={required}
      />
      <label htmlFor={`file-${label}`} className="cursor-pointer">
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-600 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {value.name}
            </span>
          </div>
        ) : (
          <div>
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-[#1E293B] font-semibold mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              PDF, DOC, DOCX (max 10MB)
            </p>
          </div>
        )}
      </label>
    </div>
  </div>
);
