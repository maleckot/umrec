'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import ReviewerDashboardContent from './ReviewerDashboardContent';

export default function ReviewerDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <NavbarRoles role="reviewer" />
      <div className="flex-grow pt-32 pb-16 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto w-full">
        <ReviewerDashboardContent />
      </div>
      <Footer />
    </div>
  );
}
