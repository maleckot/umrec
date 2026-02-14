'use client';

import { Suspense } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import ActivityDetailsContent from './ActivityDetailsContent';

export default function ActivityDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
          <NavbarRoles role="researcher" />
          <div className="flex-grow flex items-center justify-center mt-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
          </div>
          <Footer />
        </div>
      }
    >
      <ActivityDetailsContent />
    </Suspense>
  );
}
