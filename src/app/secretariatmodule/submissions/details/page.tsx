// app/secretariatmodule/submissions/details/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import SubmissionHeader from '@/components/staff-secretariat-admin/submission-details/SubmissionHeader';
import TabNavigation from '@/components/staff-secretariat-admin/submission-details/TabNavigation';
import ConsolidatedDocument from '@/components/staff-secretariat-admin/submission-details/ConsolidatedDocument';
import ClassificationPanel from '@/components/staff-secretariat-admin/submission-details/ClassificationPanel';
import SubmissionSidebar from '@/components/staff-secretariat-admin/submission-details/SubmissionSidebar';
import HistoryTab from '@/components/staff-secretariat-admin/submission-details/HistoryTab';
import { getClassificationDetails } from '@/app/actions/secretariat-staff/getClassificationDetails';
import { saveClassification } from '@/app/actions/secretariat-staff/secretariat/saveClassification';

export default function SecretariatSubmissionDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'history'>('overview');
  const [revisionComments, setRevisionComments] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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
      } else {
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
      description: 'All documents verified and consolidated by staff',
    },
    {
      id: 3,
      title: 'Under Classification',
      date: data.consolidatedDocument ? formatDate(data.consolidatedDocument.uploadedAt) : 'N/A',
      icon: 'classification' as const,
      isCurrent: true,
      description: 'Waiting for secretariat to classify the submission',
    },
  ] : [];

  const handleSubmitComment = async () => {
    if (!revisionComments.trim()) {
      alert('Please enter a comment before submitting.');
      return;
    }

    if (!submissionId) return;

    setIsSubmittingComment(true);
    try {
      // Add your API call here to save the revision comment
      // Example: await saveRevisionComment(submissionId, revisionComments);
      
      console.log('Submitting revision comment:', revisionComments);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Revision comment submitted successfully!');
      // Optionally reload data or update UI
      // setRevisionComments(''); // Clear after submission if needed
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit revision comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleClassificationSave = async (category: 'Exempted' | 'Expedited' | 'Full Review') => {
    if (!submissionId) return;

    try {
      const result = await saveClassification(submissionId, category, revisionComments);

      console.log('Classification saved:', category);
      
      if (result.success) {
        // Navigate based on category
        if (category === 'Exempted') {
          router.push(`/secretariatmodule/submissions/exempted?id=${submissionId}`);
        } else {
          router.push(`/secretariatmodule/submissions/assign-reviewers?id=${submissionId}&category=${category}`);
        }
      } else {
        alert(`Failed to save classification: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving classification:', error);
      alert('Failed to save classification');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
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
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Submission not found
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Submission Details" activeNav="submissions">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/secretariatmodule/submissions')}
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

      {/* Conditional Grid */}
      <div className={activeTab === 'overview' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        {/* Main Content */}
        <div className={activeTab === 'overview' ? 'lg:col-span-2 space-y-6' : 'w-full'}>
          {activeTab === 'overview' && (
            <>
              {data.consolidatedDocument ? (
                <ConsolidatedDocument
                  title="Documents"
                  description="Please ensure the research paper is thoroughly classified before assigning it to a reviewer."
                  consolidatedDate={formatDate(data.consolidatedDocument.uploadedAt)}
                  fileUrl={data.consolidatedDocument.url}
                  originalDocuments={data.originalDocuments.map((doc: any) => doc.name)}
                />
              ) : (
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Consolidated document is being generated...
                  </p>
                </div>
              )}

              {/* Revision Comments Section */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Comments for Revision
                </h3>
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Add any comments or feedback regarding revisions needed before classification. This will be visible to the researcher.
                </p>
                <textarea
                  value={revisionComments}
                  onChange={(e) => setRevisionComments(e.target.value)}
                  placeholder="Enter your comments here... (e.g., Please update the methodology section, Add missing references, Clarify research objectives)"
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                  style={{ fontFamily: 'Metropolis, sans-serif', minHeight: '120px' }}
                  maxLength={1000}
                  disabled={isSubmittingComment}
                />

                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {revisionComments.length} / 1000 characters
                  </p>
                  <div className="flex gap-2">
                    {revisionComments.length > 0 && (
                      <button
                        onClick={() => setRevisionComments('')}
                        className="text-sm text-gray-600 hover:text-gray-800 font-medium px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                        disabled={isSubmittingComment}
                      >
                        Clear
                      </button>
                    )}
                    <button
                      onClick={handleSubmitComment}
                      disabled={!revisionComments.trim() || isSubmittingComment}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold text-sm"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      {isSubmittingComment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Comment
                        </>
                      )}
                    </button>
                  </div>
                </div>
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
              <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                No reviews available yet. Please classify the submission first.
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
                reviewDue: 'TBD',
                decisionTarget: 'TBD',
              }}
              statusMessage="This submission has been verified and consolidated. Awaiting classification."
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
