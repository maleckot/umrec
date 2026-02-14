'use client';

import { Suspense } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import ReviewsPageContent from './ReviewsPageContent';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
      <NavbarRoles role="reviewer" />
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pb-12">
        <div className="max-w-[1600px] mx-auto">
          <Suspense fallback={
             <div className="flex items-center justify-center min-h-[400px]">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-[#101C50]/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#101C50] border-t-transparent animate-spin"></div>
                </div>
             </div>
          }>
            <ReviewsPageContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
