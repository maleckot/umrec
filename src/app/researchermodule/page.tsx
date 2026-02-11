'use client';

import { useState, useEffect } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';
import { getResearcherSubmissions } from '@/app/actions/researcher/getResearcherSubmissions';
import { Submission } from '@/types/researcher';
import ReferenceMaterials from '@/components/researcher/dashboard/ReferenceMaterials';
import StatsOverview from '@/components/researcher/dashboard/StatsOverview';
import CertificateSection from '@/components/researcher/dashboard/CertificateSection';
import SubmissionTimeline from '@/components/researcher/dashboard/SubmissionTimeline';
import RecentActivity from '@/components/researcher/dashboard/RecentActivity';

export default function ResearcherDashboard() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState({ active: 0, pending: 0, needsRevision: 0 });
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerDocument, setViewerDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getResearcherSubmissions();
        if (result.success) setSubmissions(result.submissions);
      } catch (error) {
        console.error('Error loading submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (submissions.length > 0) {
      setStats({
        active: submissions.filter(s => !['Approved', 'Rejected', 'Withdrawn'].includes(s.status)).length,
        pending: submissions.filter(s => (s.documents?.some(doc => doc.isApproved === null && !doc.needsRevision) ?? true) || s.status === 'Under Review').length,
        needsRevision: submissions.filter(s => (s.documents?.some(doc => doc.needsRevision === true) || s.status === 'Under Revision')).length,
      });
    }
  }, [submissions]);

  const handleViewDocument = (name: string, url: string | null) => {
    if (!url) return;
    setViewerDocument({ name, url });
    setIsViewerOpen(true);
  };

  if (loading) return <DashboardLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          <DashboardHeader />

          <ReferenceMaterials onViewDocument={handleViewDocument} />

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-200">
            <StatsOverview stats={stats} />
            
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6 sm:my-8"></div>
            
            <CertificateSection submissions={submissions} />
            <SubmissionTimeline submissions={submissions} />
            <RecentActivity submissions={submissions} onViewDocument={handleViewDocument} />
          </div>
        </div>
      </div>
      
      <Footer />
      {viewerDocument && (
        <DocumentViewerModal isOpen={isViewerOpen} onClose={() => { setIsViewerOpen(false); setViewerDocument(null); }} documentName={viewerDocument.name} documentUrl={viewerDocument.url} />
      )}
    </div>
  );
}

// Simple internal components to keep file size down
const DashboardHeader = () => (
  <div className="mb-6 sm:mb-8 pl-2 sm:pl-0">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 relative inline-block" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
      Researcher Dashboard
      <div className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-[#101C50] to-[#F0E847] rounded-full"></div>
    </h1>
    <p className="text-sm sm:text-base text-gray-600 mt-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>Track and manage your research submissions</p>
  </div>
);

const DashboardLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7] flex items-center justify-center">
    <div className="text-center">
      <div className="relative inline-block">
        <div className="absolute inset-0 blur-2xl bg-[#101C50]/20 rounded-full animate-pulse"></div>
        <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#101C50] mx-auto mb-4"></div>
      </div>
      <p className="text-gray-700 font-medium">Loading your dashboard...</p>
    </div>
  </div>
);
