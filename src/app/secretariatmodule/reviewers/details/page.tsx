'use client';

import { Suspense } from 'react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReviewerDetailsContent from './ReviewerDetailsContent';

export default function SecretariatReviewerDetailsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
        </div>
      </DashboardLayout>
    }>
      <ReviewerDetailsContent />
    </Suspense>
  );
}
