'use client';

import { Suspense } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import RevisionStep8Content from './RevisionStep8Content';

export default function RevisionStep8Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    }>
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <RevisionStep8Content />
        <Footer />
      </div>

    </Suspense>
  );
}
