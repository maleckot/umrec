// app/researchermodule/activity-details/page.tsx
'use client';

import NavbarRoles from '@/components/NavbarRoles';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import BackButton from '@/components/BackButton';
import FileCard from '@/components/researcher/FileCard';
import ActivityInfoCard from '@/components/researcher/ActivityInfoCard';
import PreviewCard from '@/components/PreviewCard';
import RevisionCard from '@/components/researcher/RevisionCard';
import ResubmitButton from '@/components/researcher/ResubmitButton';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ActivityDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');

  // Example data - in real app, fetch based on ID
  const [activityData, setActivityData] = useState({
    filename: 'Application Form Ethics Review.pdf',
    fileType: 'PDF File',
    fileUrl: '/path/to/your/file.pdf', // Replace with actual file URL
    dateSubmitted: 'July 8, 2025',
    status: 'Under Review', // Can be: "Under Review", "Requires Revision", "Approved", etc.
    receivedForReview: 'Dr. Juan Dela Cruz',
    revisionCount: 0,
    needsRevision: false, // Set to false by default
    revisionMessage: '',
  });

  useEffect(() => {
    // Fetch activity data based on activityId and determine if revision is needed
    if (activityId) {
      console.log('Loading activity:', activityId);
      
      // Example: Simulate different statuses based on ID
      if (activityId === '3' || activityId === '4') {
        // IDs 3 and 4 need revision
        setActivityData({
          filename: activityId === '3' ? 'Application Form Ethics Review.pdf' : 'Informed Consent Form.pdf',
          fileType: 'PDF File',
          fileUrl: '/path/to/your/file.pdf',
          dateSubmitted: 'July 8, 2025',
          status: 'Requires Revision',
          receivedForReview: 'Dr. Juan Dela Cruz',
          revisionCount: 1,
          needsRevision: true,
          revisionMessage: 'For the full ethical review to commence, it is essential that [Specific Section/Issue Name] be addressed and revised accordingly.',
        });
      } else {
        // IDs 1, 2, 5 are just for viewing
        setActivityData({
          filename: 'Title of the project.pdf',
          fileType: 'PDF File',
          fileUrl: '/path/to/your/file.pdf',
          dateSubmitted: 'July 8, 2025',
          status: activityId === '5' ? 'Approved' : 'Under Review',
          receivedForReview: 'Dr. Juan Dela Cruz',
          revisionCount: 0,
          needsRevision: false,
          revisionMessage: '',
        });
      }
    }
  }, [activityId]);

  const handleResubmit = () => {
    console.log('Resubmit clicked');
    router.push('/researcher/submission');
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/researchermodule' },
    { label: 'Activity Details' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
      <NavbarRoles role="researcher" />

      <div className="flex-grow py-8 px-6 md:px-12 lg:px-20 mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />
          
          <BackButton label="Activity Details" href="/researchermodule" />

          {/* File Card */}
          <div className="mb-6">
            <FileCard
              filename={activityData.filename}
              fileType={activityData.fileType}
              fileUrl={activityData.fileUrl}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Activity Info */}
            <div className="lg:col-span-1">
              <ActivityInfoCard
                dateSubmitted={activityData.dateSubmitted}
                status={activityData.status}
                receivedForReview={activityData.receivedForReview}
                revisionCount={activityData.revisionCount}
              />
            </div>

            {/* Right Column - Preview and Conditional Revision */}
            <div className="lg:col-span-2 space-y-6">
              <PreviewCard fileUrl={activityData.fileUrl} filename={activityData.filename} />

              {/* Revision Card - Only show if needs revision */}
              {activityData.needsRevision && (
                <RevisionCard
                  message={activityData.revisionMessage}
                  isVisible={activityData.needsRevision}
                />
              )}

              {/* Resubmit Button - Only show if needs revision */}
              {activityData.needsRevision && (
                <ResubmitButton onClick={handleResubmit} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
