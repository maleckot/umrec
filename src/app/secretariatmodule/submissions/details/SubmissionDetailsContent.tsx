'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import ClassificationPanel from '@/components/staff-secretariat-admin/submission-details/ClassificationPanel';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import RevisionRequestPanel from '@/components/secretariat/submission-details/RevisionRequestPanel'; // Extracted

import { getClassificationDetails } from '@/app/actions/secretariat-staff/getClassificationDetails';
import { saveClassification } from '@/app/actions/secretariat-staff/secretariat/saveClassification';
import { saveRevisionComment } from '@/app/actions/secretariat-staff/saveRevisionComment';

export default function SubmissionDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [revisionComments, setRevisionComments] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [revisionChecklist, setRevisionChecklist] = useState({
    researchProtocol: false, consentForm: false, researchInstrument: false,
    endorsementLetter: false, proposalDefense: false, applicationForm: false,
  });

  // --- Helpers ---
  const calculateDueDate = (category: string, startDate: string | Date = new Date()) => {
    const daysMap: { [key: string]: number } = { 'Exempted': 7, 'Expedited': 14, 'Full Review': 30 };
    const date = new Date(startDate);
    date.setDate(date.getDate() + (daysMap[category] || 0));
    return date;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getFullName = () => {
    if (!data?.submission) return '';
    const { firstName, middleName, lastName } = data.submission.projectLeader;
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  };

  // --- Data Loading ---
  useEffect(() => {
    if (submissionId) loadData();
  }, [submissionId]);

  const loadData = async () => {
    if (!submissionId) return;
    setLoading(true);
    try {
      const result = await getClassificationDetails(submissionId);
      if (result.success) setData(result);
      else {
        alert(result.error || 'Failed to load submission');
        router.push('/secretariatmodule/submissions');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleChecklistChange = (field: keyof typeof revisionChecklist) => {
    setRevisionChecklist(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleRequestRevision = async () => {
    const selectedItems = Object.entries(revisionChecklist).filter(([_, checked]) => checked).map(([key]) => key);
    if (selectedItems.length === 0) return alert('Please select at least one document that needs revision');
    if (!revisionComments.trim()) return alert('Please provide specific feedback about what needs to be revised');
    if (!submissionId) return;

    setIsSubmittingComment(true);
    try {
      const result = await saveRevisionComment(submissionId, revisionComments, revisionChecklist);
      if (result.success) {
        alert('Revision request sent successfully! Researcher will be notified.');
        router.push('/secretariatmodule/submissions');
      } else alert(`Failed to request revision: ${result.error}`);
    } catch (error) { console.error(error); alert('Failed to request revision'); }
    finally { setIsSubmittingComment(false); }
  };

  const handleClassificationSave = async (category: 'Exempted' | 'Expedited' | 'Full Review') => {
    if (!submissionId) return;
    const calculatedDueDate = calculateDueDate(category);
    try {
      const result = await saveClassification(submissionId, category, revisionComments, calculatedDueDate);
      if (result.success) {
        category === 'Exempted' 
          ? router.push(`/secretariatmodule/submissions/exempted?id=${submissionId}`)
          : router.push(`/secretariatmodule/submissions/assign-reviewers?id=${submissionId}&category=${category}`);
      } else alert(`Failed to save classification: ${result.error}`);
    } catch (error) { console.error(error); alert('Failed to save classification'); }
  };

  const historyEvents = data ? [
    { id: 1, title: 'Submission Received', date: formatDate(data.submission.submittedAt), icon: 'submission' as const },
    { id: 2, title: 'Document Verification Complete', date: data.consolidatedDocument ? formatDate(data.consolidatedDocument.uploadedAt) : 'N/A', icon: 'verification' as const, description: 'All documents verified and consolidated by staff' },
    { id: 3, title: 'Under Classification', date: data.consolidatedDocument ? formatDate(data.consolidatedDocument.uploadedAt) : 'N/A', icon: 'classification' as const, isCurrent: true, description: 'Waiting for secretariat to classify the submission' },
  ] : [];

  if (loading) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data?.submission) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
        <div className="text-center py-12 text-gray-600">Submission not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
      <div className="mb-6">
        <button
          onClick={() => router.push('/secretariatmodule/submissions')}
          className="flex items-center gap-2 text-base font-bold text-[#101C50] hover:text-blue-900 transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <ArrowLeft size={20} /> Back to Submissions
        </button>
      </div>

      <SubmissionHeader
        title={data.submission.title}
        submittedBy={getFullName()}
        submittedDate={formatDate(data.submission.submittedAt)}
        coAuthors={data.submission.coAuthors || 'N/A'}
        submissionId={data.submission.submissionId}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        
        {/* Main Content */}
        <div className={activeTab === 'overview' ? 'lg:col-span-2 space-y-6' : 'w-full'}>
          {activeTab === 'overview' && (
            <>
              {data.consolidatedDocument ? (
                <ConsolidatedDocument
                  title="Documents"
                  description="Review the consolidated submission. If revision is needed, select the documents below and provide feedback."
                  consolidatedDate={formatDate(data.consolidatedDocument.uploadedAt)}
                  fileUrl={data.consolidatedDocument.url}
                  originalDocuments={data.originalDocuments.map((doc: any) => doc.name)}
                />
              ) : (
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-gray-500 font-medium">Consolidated document is being generated...</p>
                </div>
              )}

              <RevisionRequestPanel 
                checklist={revisionChecklist}
                comments={revisionComments}
                isSubmitting={isSubmittingComment}
                onChecklistChange={handleChecklistChange}
                onCommentsChange={setRevisionComments}
                onClear={() => {
                  setRevisionChecklist({
                    researchProtocol: false, consentForm: false, researchInstrument: false,
                    endorsementLetter: false, proposalDefense: false, applicationForm: false,
                  });
                  setRevisionComments('');
                }}
                onSubmit={handleRequestRevision}
              />

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <p className="text-sm text-gray-500 font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>OR</p>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <ClassificationPanel
                systemSuggestedCategory={data.submission.aiSuggestedClassification || "Expedited"}
                aiConfidence={data.submission.aiClassificationConfidence}
                aiClassifiedAt={data.submission.aiClassifiedAt}
                aiMethod={data.submission.aiClassificationMethod}
                onSave={handleClassificationSave}
              />
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <p className="text-gray-500 font-medium">No reviews available yet. Please classify the submission first.</p>
            </div>
          )}

          {activeTab === 'history' && <HistoryTab events={historyEvents} />}
        </div>

        {/* Sidebar */}
        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Under Classification"
              details={{
                submissionDate: formatDate(data.submission.submittedAt),
                reviewersRequired: 0,
                reviewersAssigned: 0,
              }}
              authorInfo={{
                name: getFullName(),
                organization: data.submission.organization || 'N/A',
                school: 'University of Makati',
                college: data.submission.college || 'N/A',
                email: data.submission.projectLeader.email,
              }}
              timeline={{
                submitted: formatDate(data.submission.submittedAt),
                reviewDue: 'Pending Classification',
                decisionTarget: 'Pending Classification',
              }}
              statusMessage="This submission has been verified and consolidated. Awaiting classification."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
