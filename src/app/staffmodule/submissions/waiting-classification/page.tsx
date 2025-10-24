'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import { getClassificationDetails } from '@/app/actions/secretariat-staff/getClassificationDetails';
import { generatePdfFromDatabase } from '@/app/actions/generatePdfFromDatabase';
import { createClient } from '@/utils/supabase/client';
import { Suspense } from 'react';

function WaitingClassificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [data, setData] = useState<any>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (submissionId) {
      loadData();
    }
  }, [submissionId]);

  const loadData = async () => {
    if (!submissionId) return;

    setLoading(true);
    try {
      const result = await getClassificationDetails(submissionId);

      if (result.success) {
        setData(result);
        
        // Check if consolidated document exists
        if (!result.consolidatedDocument) {
          // PDF doesn't exist, generate it in background
          generateConsolidatedPdf();
        }
      } else {
        alert(result.error || 'Failed to load submission');
        router.push('/staffmodule/submissions');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load submission details');
    } finally {
      setLoading(false); // Page loads regardless of PDF status
    }
  };

  const generateConsolidatedPdf = async () => {
    if (!submissionId) return;

    setGeneratingPdf(true);
    setPdfError(null);

    try {
      console.log('🔄 Generating consolidated PDF...');
      
      const pdfResult = await generatePdfFromDatabase(submissionId);

      if (!pdfResult.success) {
        throw new Error(pdfResult.error);
      }

      if (!pdfResult.pdfData) {
        throw new Error('PDF data is missing');
      }

      console.log('✅ PDF generated, uploading...');

      const supabase = createClient();
      
      // Convert base64 to Blob for client-side upload
      const base64Data = pdfResult.pdfData.split(',')[1] || pdfResult.pdfData;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

      // Upload to storage
      const fileName = `consolidated_${submissionId}_${Date.now()}.pdf`;
      const filePath = `consolidated/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(filePath, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Save to database
      const { error: docError } = await supabase
        .from('uploaded_documents')
        .insert({
          submission_id: submissionId,
          file_name: fileName,
          file_url: uploadData.path,
          document_type: 'consolidated_application',
          file_size: pdfBlob.size,
          uploaded_at: new Date().toISOString()
        });

      if (docError) {
        throw new Error(`Database save failed: ${docError.message}`);
      }

      console.log('✅ Consolidated PDF saved successfully');
      
      // Reload data to show the new PDF
      const result = await getClassificationDetails(submissionId);
      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error('❌ PDF generation error:', error);
      setPdfError(error instanceof Error ? error.message : 'Failed to generate PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFullName = () => {
    if (!data?.submission) return '';
    const { firstName, middleName, lastName } = data.submission.projectLeader;
    return [firstName, middleName, lastName].filter(Boolean).join(' ');
  };

  const historyEvents = data ? [
    {
      id: 1,
      title: 'Submission Received',
      date: formatDate(data.submission.submittedAt),
      icon: 'submission' as const,
    },
    {
      id: 2,
      title: 'Document Verification Complete',
      date: data.consolidatedDocument ? formatDate(data.consolidatedDocument.uploadedAt) : 'N/A',
      icon: 'verification' as const,
      description: 'All documents verified and consolidated into one file',
    },
    {
      id: 3,
      title: 'Waiting for Classification',
      date: data.consolidatedDocument ? formatDate(data.consolidatedDocument.uploadedAt) : 'N/A',
      icon: 'classification' as const,
      isCurrent: true,
    },
  ] : [];

  // Only show full-page loading on initial load
  if (loading) {
    return (
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading submission details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data?.submission) {
    return (
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Submission not found
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
      <div className="mb-6">
        <button
          onClick={() => router.push('/staffmodule/submissions')}
          className="flex items-center gap-2 text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <ArrowLeft size={20} />
          Back to Submissions
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
        <div className={activeTab === 'overview' ? 'lg:col-span-2' : 'w-full'}>
          {activeTab === 'overview' && (
            <>
              {/* Show loading only in the document area */}
              {generatingPdf ? (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-base font-medium text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Consolidated document is being generated...
                  </p>
                </div>
              ) : pdfError ? (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <p className="text-red-700 font-semibold mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    ❌ Failed to generate consolidated document
                  </p>
                  <p className="text-sm text-red-600 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {pdfError}
                  </p>
                  <button
                    onClick={generateConsolidatedPdf}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Retry Generation
                  </button>
                </div>
              ) : data.consolidatedDocument ? (
                <ConsolidatedDocument
                  title="Consolidated Document"
                  description="This submission has been verified and is now with the secretariat for classification."
                  consolidatedDate={formatDate(data.consolidatedDocument.uploadedAt)}
                  fileUrl={data.consolidatedDocument.url}
                  originalDocuments={data.originalDocuments.map((doc: any) => doc.name)}
                />
              ) : (
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Consolidated document not found.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                No reviews available yet. Waiting for classification.
              </p>
            </div>
          )}

          {activeTab === 'history' && <HistoryTab events={historyEvents} />}
        </div>

        {activeTab === 'overview' && (
          <div>
            <SubmissionSidebar
              status="Under Classification"
              details={{
                submissionDate: formatDate(data.submission.submittedAt),
                reviewersRequired: 5,
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
                reviewDue: 'TBD',
                decisionTarget: 'TBD',
              }}
              statusMessage="This submission has been verified and consolidated. Now with secretariat for classification."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default function WaitingClassificationPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Submission Details" activeNav="submissions">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <WaitingClassificationContent />
    </Suspense>
  );
}
