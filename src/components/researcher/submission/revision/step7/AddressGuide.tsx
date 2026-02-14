import { FileText } from 'lucide-react';

const AddressGuide: React.FC = () => {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
      <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-3 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <FileText size={18} className="text-orange-600" />
        Letter Should Be Addressed To:
      </h4>
      <div className="bg-white p-4 rounded-lg border-2 border-orange-200 shadow-sm">
        <p className="text-xs sm:text-sm font-semibold text-[#071139] leading-relaxed break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Prof. MARK PHILIP C. PADERAN, M.A. LIT.<br />
          <span className="text-gray-700">Chairperson</span><br />
          <span className="text-gray-700">University of Makati Research Ethics Committee</span>
        </p>
      </div>
    </div>
  );
};

export default AddressGuide;
