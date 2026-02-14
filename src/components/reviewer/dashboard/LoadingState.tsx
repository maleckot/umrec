'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <NavbarRoles role="reviewer" />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#101C50] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#101C50] font-bold animate-pulse" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Loading Dashboard...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
