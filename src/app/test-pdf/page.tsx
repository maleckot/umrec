// app/test-pdf/page.tsx
'use client';

import { useState, useEffect } from 'react';
import DownloadSubmissionPdfButton from '@/components/researcher/DownloadSubmissionPdfButton';
import { createClient } from '@/utils/supabase/client';
import { FileText, Download } from 'lucide-react';

export default function TestPdfDownloadPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in first');
        return;
      }

      const { data, error } = await supabase
        .from('research_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                PDF Download Test Page
              </h1>
              <p className="text-gray-600 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Test the PDF generation and download functionality
              </p>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-blue-900 mb-2">How to test:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>Make sure you're logged in</li>
            <li>Make sure you have submitted at least one research application</li>
            <li>Click any "Download PDF" button below</li>
            <li>The consolidated PDF will be generated and downloaded</li>
          </ol>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Submissions Found</h3>
            <p className="text-gray-500 mb-6">
              You haven't submitted any research applications yet.
            </p>
            <a
              href="/researchermodule/submissions/new/step1"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Submission
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-[#071139] px-6 py-4">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Your Submissions ({submissions.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {submission.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          submission.status === 'pending_review' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : submission.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {submission.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Submission ID:</span> {submission.submission_id}
                        </div>
                        <div>
                          <span className="font-medium">College:</span> {submission.college || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span>{' '}
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mb-4">
                        <span className="font-medium">PI:</span> {submission.project_leader_first_name} {submission.project_leader_last_name}
                      </p>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      {/* Primary Button */}
                      <DownloadSubmissionPdfButton
                        submissionId={submission.id}
                        submissionTitle={submission.title}
                        variant="primary"
                        size="md"
                      />

                      {/* Icon Button */}
                      <DownloadSubmissionPdfButton
                        submissionId={submission.id}
                        submissionTitle={submission.title}
                        variant="icon"
                      />

                      {/* Secondary Button */}
                      <DownloadSubmissionPdfButton
                        submissionId={submission.id}
                        submissionTitle={submission.title}
                        variant="secondary"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-8 bg-gray-800 text-gray-100 rounded-lg p-6">
          <h3 className="font-bold mb-3">Debug Information</h3>
          <div className="space-y-2 text-sm font-mono">
            <div><strong>Total Submissions:</strong> {submissions.length}</div>
            <div><strong>Page:</strong> /test-pdf</div>
            <div><strong>Component:</strong> DownloadSubmissionPdfButton</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/researchermodule"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Dashboard
          </a>
          <a
            href="/researchermodule/submissions/new/step1"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Submission
          </a>
        </div>
      </div>
    </div>
  );
}
