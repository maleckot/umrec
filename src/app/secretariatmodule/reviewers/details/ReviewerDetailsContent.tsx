'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Edit2 } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReviewerStatsCards from '@/components/staff-secretariat-admin/reviewers/ReviewerStatsCards';
import ReviewerReviewsTable from '@/components/staff-secretariat-admin/reviewers/ReviewerReviewsTable';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';
import ProfileHeaderCard from '@/components/secretariat/reviewers/ProfileHeaderCard'; 
import TabNavigation from '@/components/secretariat/reviewers/TabNavigation'; 
import ExpertiseTab from '@/components/secretariat/reviewers/ExpertiseTab'; 
import CertificatesTab from '@/components/secretariat/reviewers/CertificatesTab'; 
import { getReviewerDetails } from '@/app/actions/secretariat-staff/getReviewerDetails';
import { updateReviewerCode } from '@/app/actions/secretariat-staff/updateReviewerCode';
import { updateReviewerExpertise } from '@/app/actions/secretariat-staff/updateReviewerExpertise';

type TabType = 'current' | 'history' | 'expertise' | 'certificates';

export default function ReviewerDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewerId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [reviewerCode, setReviewerCode] = useState('');
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [isEditingExpertise, setIsEditingExpertise] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState('');
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewerData, setReviewerData] = useState<any>(null);
  
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    if (reviewerId) loadReviewerDetails();
  }, [reviewerId]);

  const loadReviewerDetails = async () => {
    if (!reviewerId) return;
    setLoading(true);
    const result = await getReviewerDetails(reviewerId);
    if (result.success && result.reviewer) {
      setReviewerData(result);
      setReviewerCode(result.reviewer.code);
      const reviewerAny = result.reviewer as any;
      const areasString = reviewerAny.areasOfExpertise || reviewerAny.expertiseAreas || '';
      const areasArray = areasString ? (typeof areasString === 'string' ? areasString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : areasString) : [];
      setExpertiseAreas(areasArray);
    } else console.error('Failed to load reviewer:', result.error);
    setLoading(false);
  };

  const handleSaveCode = async () => {
    if (!reviewerId) return;
    const result = await updateReviewerCode(reviewerId, reviewerCode);
    if (result.success) {
      setIsEditingCode(false);
      loadReviewerDetails();
    } else alert('Failed to update reviewer code');
  };

  const handleSaveExpertise = async () => {
    if (!reviewerId) return alert('Reviewer ID not found');
    const expertiseString = expertiseAreas.join(', ');
    const result = await updateReviewerExpertise(reviewerId, expertiseString);
    if (result.success) {
      setIsEditingExpertise(false);
      loadReviewerDetails();
    } else alert('Failed to update expertise: ' + result.error);
  };

  const handleViewCertificate = (cert: any) => {
    setSelectedDocument({ name: cert.name, url: cert.fileUrl });
    setShowDocumentViewer(true);
  };

  const handleDownloadCertificate = (cert: any) => {
    const link = document.createElement('a');
    link.href = cert.fileUrl;
    link.download = cert.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50] mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium tracking-wide text-sm">LOADING PROFILE...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!reviewerData || !reviewerData.reviewer) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 font-medium">Reviewer not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const { reviewer, currentReviews, reviewHistory } = reviewerData;
  const certificates = [
    { id: '1', name: 'Research Ethics Certificate', uploadDate: 'Oct 15, 2024', fileUrl: 'https://example.com/certificate1.pdf', fileSize: '2.4 MB' },
    { id: '2', name: 'PhD in Computer Science', uploadDate: 'Sep 10, 2024', fileUrl: 'https://example.com/certificate2.pdf', fileSize: '1.8 MB' }
  ];

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
      <div className="max-w-[1600px] mx-auto w-full pb-8">
        
        <div className="mb-6">
          <button
            onClick={() => router.push('/secretariatmodule/reviewers')}
            className="flex items-center gap-2 text-sm font-bold text-[#101C50] hover:text-blue-900 transition-colors uppercase tracking-wider"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <ArrowLeft size={16} /> Back to Reviewers List
          </button>
        </div>

        <ProfileHeaderCard 
            reviewer={reviewer}
            reviewerCode={reviewerCode}
            isEditingCode={isEditingCode}
            setReviewerCode={setReviewerCode}
            setIsEditingCode={setIsEditingCode}
            onSaveCode={handleSaveCode}
        />

        <div className="mb-8">
          <ReviewerStatsCards
            availability={reviewer.availability}
            reviewStatus={reviewer.reviewStatus}
            activeReviews={reviewer.activeReviews}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
          
          <TabNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            counts={{
                current: currentReviews.length,
                history: reviewHistory.length,
                certificates: certificates.length
            }}
          />

          <div className="p-0">
            {activeTab === 'current' && (
              <ReviewerReviewsTable
                reviews={currentReviews}
                type="current"
                onReviewClick={(id) => router.push(`/secretariatmodule/submissions/details?id=${id}`)}
              />
            )}

            {activeTab === 'history' && (
              <ReviewerReviewsTable
                reviews={reviewHistory}
                type="history"
                onReviewClick={(id) => router.push(`/secretariatmodule/submissions/details?id=${id}`)}
              />
            )}

            {activeTab === 'expertise' && (
              <ExpertiseTab 
                expertiseAreas={expertiseAreas}
                setExpertiseAreas={setExpertiseAreas}
                isEditing={isEditingExpertise}
                setIsEditing={setIsEditingExpertise}
                expertiseInput={expertiseInput}
                setExpertiseInput={setExpertiseInput}
                onSave={handleSaveExpertise}
                originalData={reviewerData.reviewer}
              />
            )}

            {activeTab === 'certificates' && (
               <CertificatesTab 
                  certificates={certificates}
                  onView={handleViewCertificate}
                  onDownload={handleDownloadCertificate}
               />
            )}
          </div>
        </div>
      </div>

      {showDocumentViewer && selectedDocument && (
        <DocumentViewerModal
          isOpen={showDocumentViewer}
          onClose={() => { setShowDocumentViewer(false); setSelectedDocument(null); }}
          documentUrl={selectedDocument.url}
          documentName={selectedDocument.name}
        />
      )}
    </DashboardLayout>
  );
}
