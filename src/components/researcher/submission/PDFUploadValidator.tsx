// components/submission/PDFUploadValidator.tsx
'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PDFUploadValidatorProps {
  label: string;
  description?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  validationKeywords: string[]; // Keywords to check in PDF filename or content
  required?: boolean;
}

const PDFUploadValidator: React.FC<PDFUploadValidatorProps> = ({
  label,
  description,
  value,
  onChange,
  validationKeywords,
  required = false
}) => {
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validatePDF = (file: File): boolean => {
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file only.');
      setValidationStatus('invalid');
      return false;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be less than 10MB.');
      setValidationStatus('invalid');
      return false;
    }

    // Check filename for keywords (basic validation)
    const fileName = file.name.toLowerCase();
    const hasKeyword = validationKeywords.some(keyword => 
      fileName.includes(keyword.toLowerCase())
    );

    if (!hasKeyword && validationKeywords.length > 0) {
      setErrorMessage(`Document name should contain one of: ${validationKeywords.join(', ')}`);
      setValidationStatus('invalid');
      return false;
    }

    setValidationStatus('valid');
    setErrorMessage('');
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const isValid = validatePDF(file);
      if (isValid) {
        onChange(file);
      } else {
        onChange(null);
      }
    } else {
      onChange(null);
      setValidationStatus('idle');
      setErrorMessage('');
    }
  };

  const handleRemove = () => {
    onChange(null);
    setValidationStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-semibold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {/* Description */}
      {description && (
        <p className="text-xs text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {description}
        </p>
      )}

      {/* Upload Area */}
      <div className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        validationStatus === 'valid' ? 'border-green-500 bg-green-50' :
        validationStatus === 'invalid' ? 'border-red-500 bg-red-50' :
        'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
      }`}>
        {!value ? (
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className={`w-12 h-12 mb-3 ${
              validationStatus === 'invalid' ? 'text-red-400' : 'text-gray-400'
            }`} strokeWidth={1.5} />
            <p className="text-sm font-semibold text-[#1E293B] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Click to upload PDF
            </p>
            <p className="text-xs text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              PDF files only (Max 10MB)
            </p>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <FileText className={`w-10 h-10 flex-shrink-0 ${
                validationStatus === 'valid' ? 'text-green-600' : 'text-red-600'
              }`} strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1E293B] truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {value.name}
                </p>
                <p className="text-xs text-[#64748B] mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-4 px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Validation Status */}
      {validationStatus === 'valid' && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={2} />
          <p className="text-sm font-semibold text-green-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Document validated successfully!
          </p>
        </div>
      )}

      {validationStatus === 'invalid' && (
        <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Invalid Document
            </p>
            <p className="text-xs text-red-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Validation Hint */}
      {validationKeywords.length > 0 && validationStatus === 'idle' && (
        <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div className="flex-1">
            <p className="text-xs text-blue-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <strong>Tip:</strong> Your document filename should contain keywords like: {validationKeywords.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploadValidator;
