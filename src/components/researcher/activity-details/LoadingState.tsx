'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';

const LoadingState = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
      <NavbarRoles role="researcher" />
      <div className="flex-grow flex items-center justify-center mt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50] mx-auto mb-4"></div>
          <p className="text-gray-800 font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Loading activity details...
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoadingState;
