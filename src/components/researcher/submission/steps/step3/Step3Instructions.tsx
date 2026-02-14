'use client';
import { FileText } from 'lucide-react';

export default function Step3Instructions() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
          <FileText size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-[#071139] text-base sm:text-lg mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Instructions to the Researcher
          </h4>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            To ensure a thorough and efficient review process, completely accomplish this form. Include all relevant information to facilitate a comprehensive review by the Ethics committee. <strong className="text-red-600">Do not write "N/A" - provide actual research details for all fields.</strong>
          </p>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs sm:text-sm font-semibold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Available Formatting Options:
            </p>
            <ul className="text-xs sm:text-sm text-gray-700 space-y-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              <li>• <strong>Text formatting:</strong> Bold, italic, underline, lists (bullet/numbered)</li>
              <li>• <strong>Alignment & indentation:</strong> Align text left/center/right/justify, adjust indentation</li>
              <li>• <strong>Media uploads:</strong> Upload images and tables per section</li>
              <li>• <strong>Auto-save:</strong> Your progress is automatically saved every few seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
