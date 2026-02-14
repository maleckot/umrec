'use client';

import { Suspense } from 'react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ResolveConflictContent from './ResolveConflictContent';

export default function ResolveConflictPage() {
  return (
    <Suspense fallback={
        <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Resolve Conflict" activeNav="submissions">
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
            </div>
        </DashboardLayout>
    }>
      <ResolveConflictContent />
    </Suspense>
  );
}
