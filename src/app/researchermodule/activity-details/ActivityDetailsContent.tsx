'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSubmissionActivity } from '@/app/actions/researcher/getSubmissionActivity';

// Layout Components
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import Breadcrumbs from '@/components/researcher-reviewer/Breadcrumbs';
import BackButton from '@/components/researcher-reviewer/BackButton';

// Feature Components
import HeaderSection from '@/components/researcher/activity-details/HeaderSection';
import ActivitySidebar from '@/components/researcher/activity-details/ActivitySidebar';
import DocumentInfoCard from '@/components/researcher/activity-details/DocumentInfoCard';
import PreviewSection from '@/components/researcher/activity-details/PreviewSection';
import RevisionNoticeCard from '@/components/researcher/activity-details/RevisionNoticeCard';
import ResubmitAction from '@/components/researcher/activity-details/ResubmitAction';
import LoadingState from '@/components/researcher/activity-details/LoadingState';

// Types
interface Document {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  isApproved?: boolean | null;
  needsRevision?: boolean;
  revisionComment?: string | null;
  revisionCount?: number;
}

interface Comment {
  id: string;
  commentText: string;
  createdAt: string;
}

export default function ActivityDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');
  const docId = searchParams.get('docId');

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [submissionComments, setSubmissionComments] = useState<Comment[]>([]);
  
  const [submissionData, setSubmissionData] = useState({
    dateSubmitted: '',
    status: '',
    rawStatus: '',
    submissionId: '',
    title: '',
    revisionCount: 0,
    needsRevision: false,
    revisionMessage: '',
  });

  useEffect(() => {
    if (activityId) {
      loadActivityData();
    }
  }, [activityId, docId]);

  const loadActivityData = async () => {
    if (!activityId) return;

    setLoading(true);
    try {
      const result = await getSubmissionActivity(activityId);

      if (result.success && result.submission && result.revisionInfo) {
        let filteredDocs = result.documents;

        if (docId) {
          filteredDocs = result.documents.filter((doc: Document) => doc.id.toString() === docId);
        }

        setDocuments(filteredDocs);
        const selected = filteredDocs[0] || null;
        setSelectedDocument(selected);
        setSubmissionComments(result.submissionComments || []);

        setSubmissionData({
          title: result.submission.title,
          submissionId: result.submission.submissionId,
          dateSubmitted: formatDate(result.submission.submittedAt),
          status: getStatusLabel(result.submission.status),
          rawStatus: result.submission.status,
          revisionCount: result.revisionInfo.revisionCount,
          needsRevision: selected?.needsRevision || false,
          revisionMessage: selected?.revisionComment || result.revisionInfo.message,
        });
      } else {
        alert(result.error || 'Failed to load activity');
        router.push('/researchermodule');
      }
    } catch (error) {
      console.error('Error loading activity:', error);
      alert('Failed to load activity details');
    } finally {
      setLoading(false);
    }
  };

  // Logic Helpers
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      new_submission: 'Under Review',
      awaiting_classification: 'Under Initial Review',
      needs_revision: 'Requires Revision',
      under_revision: 'Requires Revision',
      under_review: 'Under Ethics Review',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return statusMap[status] || status;
  };

  const handleResubmit = () => {
    // Direct routing to the new single-step revision page based on logic
    // Mapping removed as user indicated "no longer for steps" logic, but retained specific routing if needed
    // Assuming standard redirection to revision hub:
    const documentTypeToStep: { [key: string]: string } = {
      consolidated_application: 'step1',
      application_form: 'step2',
      research_protocol: 'step3',
      consent_form: 'step4',
      research_instrument: 'step5',
      proposal_defense: 'step6',
      endorsement_letter: 'step7',
    };

    if (selectedDocument && selectedDocument.needsRevision) {
      const step = documentTypeToStep[selectedDocument.fileType] || 'step1';
      if (selectedDocument.fileType === 'consolidated_application') {
        router.push(`/researchermodule/submissions/revision/${step}?mode=revision&id=${activityId}`);
      } else {
        router.push(`/researchermodule/submissions/revision/${step}?mode=revision&id=${activityId}&docId=${selectedDocument.id}&docType=${selectedDocument.fileType}`);
      }
    } else {
       // Fallback logic
       const firstRejectedDoc = documents.find(doc => doc.needsRevision);
       if (firstRejectedDoc) {
          const step = documentTypeToStep[firstRejectedDoc.fileType] || 'step1';
          router.push(`/researchermodule/submissions/revision/${step}?mode=revision&id=${activityId}&docId=${firstRejectedDoc.id}&docType=${firstRejectedDoc.fileType}`);
       } else {
          router.push(`/researchermodule/submissions/revision/step1?mode=revision&id=${activityId}`);
       }
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/researchermodule' },
    { label: 'Activity Details' },
  ];

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
      <NavbarRoles role="researcher" />

      <div className="flex-grow py-8 px-6 md:px-12 lg:px-20 mt-24">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
          <BackButton label="Activity Details" href="/researchermodule" />

          <HeaderSection 
            title={submissionData.title} 
            submissionId={submissionData.submissionId} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <ActivitySidebar 
                dateSubmitted={submissionData.dateSubmitted}
                status={submissionData.status}
                revisionCount={selectedDocument?.revisionCount || 0}
              />
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-2 space-y-6">
              
              <DocumentInfoCard selectedDocument={selectedDocument} />

              <PreviewSection 
                selectedDocument={selectedDocument} 
              />

              {/* Revision Logic Block */}
              {selectedDocument && (
                 (selectedDocument.fileType === 'consolidated_application'
                  ? (submissionData.rawStatus === 'under_revision' || submissionData.rawStatus === 'needs_revision')
                  : selectedDocument.isApproved === false) && (
                    <RevisionNoticeCard 
                      submissionComments={submissionComments}
                      selectedDocument={selectedDocument}
                    />
                  )
              )}

              <ResubmitAction 
                selectedDocument={selectedDocument}
                rawStatus={submissionData.rawStatus}
                onResubmit={handleResubmit}
              />
              
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
