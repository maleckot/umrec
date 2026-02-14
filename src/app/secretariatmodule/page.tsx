'use client';

import { Suspense } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import SecretariatDashboardContent from './SecretariatDashboardContent';

export default function SecretariatDashboard() {
  return (
    // Simple wrapper to handle suspense boundaries for client-side fetching
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
        </div>
    }>
      <SecretariatDashboardContent />
    </Suspense>
  );
}
