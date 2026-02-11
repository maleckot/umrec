'use client';
import { useState } from 'react';

interface MissionVisionProps {
  mission: string;
  vision: string;
}

export default function MissionVisionSection({ mission, vision }: MissionVisionProps) {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision'>('mission');

  return (
    <>
      <div className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-32 bg-[#050B24]">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
            {/* Tab Buttons */}
            <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <div className="inline-flex w-full sm:w-auto rounded-lg bg-white/5 p-1 backdrop-blur-sm border border-white/10">
                <button 
                  onClick={() => setActiveTab('mission')} 
                  className={`flex-1 sm:flex-none px-3 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 rounded-lg text-xs sm:text-sm md:text-base lg:text-xl font-semibold transition-all duration-300 ${activeTab === 'mission' ? 'bg-gradient-to-r from-[#D3CC50] to-[#F0E847] text-[#050B24] shadow-lg' : 'text-white hover:bg-white/10'}`}
                >
                  Mission
                </button>
                <button 
                  onClick={() => setActiveTab('vision')} 
                  className={`flex-1 sm:flex-none px-3 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 rounded-lg text-xs sm:text-sm md:text-base lg:text-xl font-semibold transition-all duration-300 ${activeTab === 'vision' ? 'bg-gradient-to-r from-[#D3CC50] to-[#F0E847] text-[#050B24] shadow-lg' : 'text-white hover:bg-white/10'}`}
                >
                  Vision
                </button>
              </div>
            </div>

            {/* Content Card */}
            <div className="relative" style={{ minHeight: '280px' }}>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-10 border border-white/10 shadow-2xl hover-lift animate-in fade-in duration-500">
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D3CC50] to-[#F0E847] flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-[#050B24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-2xl lg:text-4xl font-bold text-[#F0E847]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {activeTab === 'mission' ? 'Our Mission' : 'Our Vision'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm md:text-base lg:text-xl leading-relaxed text-justify text-white/90 whitespace-pre-line">
                  {activeTab === 'mission' ? mission : vision}
                </p>
              </div>
            </div>
        </div>
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>
      
      {/* Local styles for this component's specific animations if needed, 
          though most are utility classes or global styles now */}
      <style jsx>{`
        .hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); }
        @media (max-width: 768px) {
          .hover-lift:hover { transform: translateY(-3px); }
        }
      `}</style>
    </>
  );
}
