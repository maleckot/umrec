import { FileText } from 'lucide-react';

export default function StudentGuidelines() {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
      <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <FileText size={18} className="text-orange-600" />
        For Student Researchers
      </h4>
      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        This document certifies that you have successfully defended your research proposal before a panel.
        It should include the date of defense, panel members' signatures, and any recommendations or conditions
        for proceeding with the study.
      </p>
      <p className="text-xs sm:text-sm text-orange-800 font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        If the previous submission was rejected due to poor quality, please ensure this updated version meets all clarity requirements. Contact your research adviser if you need assistance obtaining a clearer copy.
      </p>
    </div>
  );
}
