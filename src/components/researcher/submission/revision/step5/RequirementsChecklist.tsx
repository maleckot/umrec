import { CheckCircle } from 'lucide-react';

export default function RequirementsChecklist() {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
      <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-3 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <CheckCircle size={18} className="text-orange-500" />
        Revision Requirements Checklist
      </h4>
      <ul className="space-y-2 text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span>All survey questions or measurement items are included and updated</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span>Demographic or participant information section is present and complete</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span>Instructions for participants are clear, complete, and revised per feedback</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span>Document has been re-validated by adviser or expert after revisions</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span>All specific comments from the reviewer have been addressed</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span>Formatting, scales, and response options are clearly presented</span>
        </li>
      </ul>
    </div>
  );
}
