import { AlertCircle } from 'lucide-react';

export default function QualityRequirements() {
  return (
    <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-600 p-4 sm:p-6 rounded-r-lg">
      <h4 className="font-bold text-[#071139] mb-3 text-sm sm:text-base flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <AlertCircle size={18} className="text-orange-600" />
        Quality Requirements
      </h4>
      <ul className="space-y-2 text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <li className="flex items-start">
          <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
          <span>All text is legible and clear (no blurry or pixelated areas)</span>
        </li>
        <li className="flex items-start">
          <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
          <span>All signatures are clearly visible and authentic</span>
        </li>
        <li className="flex items-start">
          <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
          <span>Official stamps or seals are visible and readable</span>
        </li>
        <li className="flex items-start">
          <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
          <span>Defense date is clearly shown</span>
        </li>
        <li className="flex items-start">
          <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
          <span>Panel recommendations or approval status is readable</span>
        </li>
      </ul>
    </div>
  );
}
