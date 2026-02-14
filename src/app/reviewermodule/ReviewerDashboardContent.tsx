'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getReviewerDashboardData } from '@/app/actions/reviewer/getReviewerDashboardData';

// Feature Components
import DashboardHeader from '@/components/reviewer/dashboard/DashboardHeader';
import StatsOverview from '@/components/reviewer/dashboard/StatsOverview';
import AssignmentsTable from '@/components/reviewer/dashboard/AssignmentsTable';
import OverdueSection from '@/components/reviewer/dashboard/OverdueSection';
import ReferenceMaterials from '@/components/reviewer/dashboard/ReferenceMaterials';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';
import LoadingState from '@/components/reviewer/dashboard/LoadingState';

// Types
export type TabType = 'all' | 'expedited' | 'full';

export default function ReviewerDashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [overdueActiveTab, setOverdueActiveTab] = useState<TabType>('all');
  const [viewingDocument, setViewingDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const result = await getReviewerDashboardData();
      if (result.success) {
        setDashboardData(result);
      } else {
        console.error('Failed to load dashboard data:', result.error);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    newAssignments: dashboardData?.stats.newAssignments || 0,
    overdueReviews: dashboardData?.stats.overdueReviews || 0,
    completedReviews: dashboardData?.stats.completedReviews || 0,
  };

  // Filter Logic
  const filterData = (data: any[], tab: TabType) => {
    if (!data) return [];
    if (tab === 'all') return data;
    const filterTerm = tab === 'expedited' ? 'expedited' : 'full review';
    return data.filter((a: any) => a.category?.toLowerCase().includes(filterTerm));
  };

  const filteredAssignments = filterData(dashboardData?.newAssignments, activeTab);
  const filteredOverdueReviews = filterData(dashboardData?.overdueReviews, overdueActiveTab);

  const handleViewSubmission = (assignment: any) => {
    router.push(`/reviewermodule/reviews/details?id=${assignment.submissionId}`);
  };

  // Document Handlers
  const handleViewDocument = (name: string, url: string) => {
    setViewingDocument({ name, url });
  };

  if (loading) return <LoadingState />;

  return (
    <>
      <DashboardHeader />
      
      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left Column (Assignments & Overdue) */}
        <div className="lg:col-span-2 flex flex-col gap-8 lg:h-full">
          <AssignmentsTable 
            assignments={filteredAssignments} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onView={handleViewSubmission} 
          />
          
          <OverdueSection 
            reviews={filteredOverdueReviews} 
            activeTab={overdueActiveTab} 
            setActiveTab={setOverdueActiveTab} 
            onView={handleViewSubmission} 
          />
        </div>

        {/* Right Column (Resources) */}
        <div className="space-y-8 w-full flex flex-col lg:h-full">
          <ReferenceMaterials onViewDocument={handleViewDocument} />
        </div>

      </div>

      {viewingDocument && (
        <DocumentViewerModal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          documentName={viewingDocument.name}
          documentUrl={viewingDocument.url}
        />
      )}
    </>
  );
}
