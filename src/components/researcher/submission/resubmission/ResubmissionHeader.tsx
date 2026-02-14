import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  onBack: () => void;
}

export default function ResubmissionHeader({ onBack }: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button 
          onClick={onBack} 
          className="w-12 h-12 bg-white border-2 border-orange-100 rounded-full flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group flex-shrink-0" 
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-orange-600 group-hover:text-orange-700 transition-colors duration-300" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Required Resubmission
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-700 font-medium ml-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Please carefully address the feedback below.
          </p>
        </div>
      </div>
    </div>
  );
}
