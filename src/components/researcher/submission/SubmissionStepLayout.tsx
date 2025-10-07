// components/submission/SubmissionStepLayout.tsx
'use client';

import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft } from 'lucide-react';

interface SubmissionStepLayoutProps {
  stepNumber: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  totalSteps?: number;
}

const SubmissionStepLayout: React.FC<SubmissionStepLayoutProps> = ({
  stepNumber,
  title,
  description,
  children,
  onBack,
  onNext,
  isNextDisabled = false,
  totalSteps = 8
}) => {
  return (
    <div className="min-h-screen bg-[#DAE0E7] flex flex-col">
      <NavbarRoles role="researcher" />
      
      <div className="flex-grow py-8 px-6 md:px-12 lg:px-20 mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Back Button, Step Number, and Title */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              {/* Back Button - Only show for Step 1 */}
              {stepNumber === 1 && (
                <button
                  onClick={onBack}
                  className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={20} className="text-[#1E293B]" />
                </button>
              )}
              
              {/* Step Number */}
              <div className="w-12 h-12 bg-[#1E293B] text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                {stepNumber}
              </div>
              
              {/* Title and Description */}
              <div>
                <h1 className="text-2xl font-bold text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {title}
                </h1>
                <p className="text-sm text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {description}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#FFD700] h-2 transition-all duration-500"
                style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Step {stepNumber} of {totalSteps}
              </span>
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {Math.round((stepNumber / totalSteps) * 100)}% Complete
              </span>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12">
            {children}

            {/* Navigation Buttons */}
            <div className={`flex ${stepNumber === 1 ? 'justify-end' : 'justify-between'} pt-8 mt-8 border-t-2 border-gray-200`}>
              {stepNumber > 1 && (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-8 py-3 border-2 border-gray-300 text-[#071139] rounded-lg hover:bg-gray-50 transition-colors font-semibold cursor-pointer"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onNext}
                disabled={isNextDisabled}
                className={`px-8 py-3 rounded-lg transition-colors font-semibold ${
                  isNextDisabled 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#071139] text-[#F0E847] hover:bg-[#0F172A] cursor-pointer'
                }`}
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                {stepNumber === totalSteps ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubmissionStepLayout;
