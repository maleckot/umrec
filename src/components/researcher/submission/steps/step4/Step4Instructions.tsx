'use client';
import { AlertCircle } from 'lucide-react';

export default function Step4Instructions() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-5 rounded-r-lg">
      <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <AlertCircle size={20} className="text-blue-500 flex-shrink-0" />
        Instructions
      </h4>
      <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Please select whether your research involves <strong>adult participants</strong>, <strong>minors (children 12 to under 15 years old)</strong>, or <strong>both</strong>. The form will adjust based on your selection. All fields should be completed thoroughly to ensure compliance with ethical research standards.
      </p>
    </div>
  );
}
