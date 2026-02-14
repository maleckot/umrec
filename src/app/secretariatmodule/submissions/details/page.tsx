'use client';

import { Suspense } from 'react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionDetailsContent from './SubmissionDetailsContent';

export default function SecretariatSubmissionDetailsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
        </div>
      </DashboardLayout>
    }>
      <SubmissionDetailsContent />
    </Suspense>
  );
}
