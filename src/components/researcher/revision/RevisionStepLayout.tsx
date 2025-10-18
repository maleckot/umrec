// components/researcher/revision/RevisionStepLayout.tsx
'use client';

import { ReactNode } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RevisionStepLayoutProps {
  stepNumber: number;
  title: string;
  description: string;
  children: ReactNode;
  onBack: () => void;
  totalSteps?: number;
}

export default function RevisionStepLayout({
  stepNumber,
  title,
  description,
  children,
  onBack,
  totalSteps = 8,
}: RevisionStepLayoutProps) {
  const progressPercentage = (stepNumber / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#E8EEF3]">
      <NavbarRoles role="researcher" />
      
      <div className="pt-24 md:pt-28 lg:pt-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Revision Badge */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-400 px-4 py-2 rounded-full">
              <svg 
                className="w-5 h-5 text-amber-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <span className="font-bold text-amber-800 text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                REVISION REQUIRED
              </span>
            </div>
          </div>

          {/* Back Button, Step Number, and Title */}
          <div className="mb-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-6">
              <button
                onClick={onBack}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer flex-shrink-0"
              >
                <ArrowLeft size={18} className="text-[#1E293B] sm:w-5 sm:h-5" />
              </button>
              
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0">
                {stepNumber}
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#1E293B] break-words leading-tight" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {title} (Revision)
                </h1>
                <p 
                  className="text-xs sm:text-sm text-[#475569] mt-1 break-words" 
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {description}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white rounded-full h-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-2 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Step {stepNumber} of {totalSteps}
              </span>
              <span className="text-xs font-semibold text-[#64748B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 md:p-12">
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
