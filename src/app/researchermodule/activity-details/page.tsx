// app/researchermodule/activity-details/page.tsx
'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import Breadcrumbs from '@/components/researcher-reviewer/Breadcrumbs';
import BackButton from '@/components/researcher-reviewer/BackButton';
import ActivityInfoCard from '@/components/researcher/ActivityInfoCard';
import PreviewCard from '@/components/researcher-reviewer/PreviewCard';
import RevisionCard from '@/components/researcher/RevisionCard';
import ResubmitButton from '@/components/researcher/ResubmitButton';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSubmissionActivity } from '@/app/actions/researcher/getSubmissionActivity';

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
}

export default function ActivityDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');
  const docId = searchParams.get('docId');

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [submissionData, setSubmissionData] = useState({
    dateSubmitted: '',
    status: '',
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
          filteredDocs = result.documents.filter(doc => doc.id.toString() === docId);
        }
        
        setDocuments(filteredDocs);
        const selected = filteredDocs[0] || null;
        setSelectedDocument(selected);
        
        setSubmissionData({
          title: result.submission.title,
          submissionId: result.submission.submissionId,
          dateSubmitted: formatDate(result.submission.submittedAt),
          status: getStatusLabel(result.submission.status),
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'new_submission': 'Under Review',
      'awaiting_classification': 'Under Initial Review',
      'needs_revision': 'Requires Revision',
      'under_review': 'Under Ethics Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
    };
    return statusMap[status] || status;
  };

  const getDocumentTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'consolidated_application': 'Consolidated Application',
      'research_instrument': 'Research Instrument',
      'endorsement_letter': 'Endorsement Letter',
      'proposal_defense': 'Proposal Defense',
      'application_form': 'Application Form',
      'research_protocol': 'Research Protocol',
      'consent_form': 'Consent Form',
    };
    return typeMap[type] || type;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleResubmit = () => {
    const documentTypeToStep: { [key: string]: string } = {
      'application_form': 'step2',
      'research_protocol': 'step3',
      'consent_form': 'step4',
      'research_instrument': 'step5',
      'proposal_defense': 'step6',
      'endorsement_letter': 'step7',
    };

    if (selectedDocument && selectedDocument.needsRevision) {
      const step = documentTypeToStep[selectedDocument.fileType] || 'step1';
      router.push(`/researchermodule/submissions/new/${step}?mode=revision&id=${activityId}`);
    } else {
      router.push(`/researchermodule/submissions/new/step1`);
    }
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/researchermodule' },
    { label: 'Activity Details' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
        <NavbarRoles role="researcher" />
        <div className="flex-grow flex items-center justify-center mt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50] mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading activity details...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
      <NavbarRoles role="researcher" />

      <div className="flex-grow py-8 px-6 md:px-12 lg:px-20 mt-24">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
          
          <BackButton label="Activity Details" href="/researchermodule" />

          <div className="mb-6">
            <h1 
              className="text-3xl font-bold" 
              style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}
            >
              {submissionData.title}
            </h1>
            <p 
              className="text-gray-600 mt-2" 
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Submission ID: {submissionData.submissionId}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ActivityInfoCard
                dateSubmitted={submissionData.dateSubmitted}
                status={submissionData.status}
                receivedForReview="UMREC Review Committee"
                revisionCount={submissionData.revisionCount}
              />
            </div>

            {/* Right Column - Documents and Preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Document Info Card */}
              {selectedDocument && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="font-bold text-lg text-[#101C50] mb-1" 
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        {getDocumentTypeLabel(selectedDocument.fileType)}
                      </h3>
                      <p 
                        className="text-sm text-gray-500" 
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        {selectedDocument.fileName} • {formatFileSize(selectedDocument.fileSize)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Preview */}
              {selectedDocument ? (
                <PreviewCard 
                  fileUrl={selectedDocument.fileUrl} 
                  filename={selectedDocument.fileName} 
                />
              ) : (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-500 text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    No document available for preview
                  </p>
                </div>
              )}

              {submissionData.needsRevision && submissionData.revisionMessage && (
                <RevisionCard
                  message={submissionData.revisionMessage}
                  isVisible={submissionData.needsRevision}
                />
              )}

              {submissionData.needsRevision && (
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
