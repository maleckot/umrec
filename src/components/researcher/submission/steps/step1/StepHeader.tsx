'use client';
import { ArrowLeft } from 'lucide-react';

interface StepHeaderProps {
  onBack: () => void;
}

export default function StepHeader({ onBack }: StepHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="w-12 h-12 bg-white border-2 border-[#071139]/20 rounded-full flex items-center justify-center hover:bg-[#071139] hover:border-[#071139] hover:shadow-lg transition-all duration-300 group"
          aria-label="Go back to previous page"
        >
          <ArrowLeft size={20} className="text-[#071139] group-hover:text-[#F7D117] transition-colors duration-300" />
        </button>
        
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 bg-gradient-to-br from-[#071139] to-[#003366] text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
            <span style={{ fontFamily: 'Metropolis, sans-serif' }}>1</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Researcher Details
            </h1>
            <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Ensure all requested details are filled out accurately
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-[#F7D117] to-[#B8860B] h-3 transition-all duration-500 rounded-full shadow-lg"
          style={{ width: '12.5%' }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Step 1 of 8
        </span>
        <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          12% Complete
        </span>
      </div>
    </div>
  );
}
