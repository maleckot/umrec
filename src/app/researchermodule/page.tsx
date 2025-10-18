// app/researchermodule/dashboard/page.tsx
'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getResearcherSubmissions } from '@/app/actions/researcher/getResearcherSubmissions';

interface Document {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string | null;
  fileSize: number;
  isApproved?: boolean | null;
  needsRevision?: boolean;
  revisionComment?: string | null;
}

interface Submission {
  id: string;
  submission_id: string;
  title: string;
  status: string;
  submitted_at: string;
  documents: Document[];
}
 // Add this helper function near the top of your component, after the interfaces
    const getTimelineStage = (status: string) => {
      // Normalize status to lowercase and handle underscores
      const normalizedStatus = status?.toLowerCase().replace(/ /g, '_');

      switch (normalizedStatus) {
        case 'pending':
          return 1; // Document Verification stage

        case 'under_classification':
          return 2; // Initial Screening stage

        case 'classified':
        case 'reviewer_assignment':
          return 3; // Ethics Review stage (waiting)

        case 'under_review':
        case 'in_review':
          return 4; // Ethics Review stage (active)

        case 'under_revision':
        case 'needs_revision':
          return 5; // Revisions stage

        case 'review_complete':
        case 'completed':
          return 6; // Final Approval stage (pending)

        case 'approved':
          return 7; // Final Approval stage (complete)

        default:
          return 1; // Default to first stage
      }
    };

export default function ResearcherDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState({ active: 0, pending: 0, needsRevision: 0 });
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadSubmissions();
  }, []);

  // Calculate stats whenever submissions change
  useEffect(() => {
    if (submissions.length > 0) {
      const calculatedStats = {
        active: submissions.filter(s =>
          !['Approved', 'Rejected', 'Withdrawn'].includes(s.status)
        ).length,

        pending: submissions.filter(s => {
          const hasPendingDocs = s.documents?.some(doc =>
            doc.isApproved === null && doc.needsRevision !== true
          );
          return hasPendingDocs || s.status === 'Under Review';
        }).length,

        needsRevision: submissions.filter(s => {
          const hasRejectedDocs = s.documents?.some(doc =>
            doc.needsRevision === true
          );
          return hasRejectedDocs || s.status === 'Under Revision';
        }).length,
      };

      setStats(calculatedStats);
    }
  }, [submissions]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const result = await getResearcherSubmissions();

      if (result.success) {
        setSubmissions(result.submissions || []);
        setCurrentSubmission(result.currentSubmission || null);
      } else {
        console.error('Failed to load submissions:', result.error);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (activeTab === 'all') return true;

    if (activeTab === 'revision') {
      const hasRejectedDocs = submission.documents?.some(doc => doc.needsRevision === true);
      return hasRejectedDocs;
    }

    if (activeTab === 'pending') {
      const hasPendingDocs = submission.documents?.some(doc => doc.isApproved === null);
      return hasPendingDocs || submission.status === 'under_review';
    }

    if (activeTab === 'approved') {
      const allApproved = submission.documents?.every(doc => doc.isApproved === true);
      return allApproved || submission.status === 'approved';
    }

    return true;
  });

  const getDocumentTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8EEF3]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center pt-24 md:pt-28 lg:pt-32 pb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50] mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading your submissions...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8EEF3]">
      <NavbarRoles role="researcher" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            Researcher Dashboard
          </h1>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm border-2 border-[#101C50]">

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
              {/* Active Submissions */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#101C50] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-0.5 sm:mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Active Submissions</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                    {stats.active}
                  </p>
                </div>
              </div>

              {/* Pending Review */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#101C50] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-0.5 sm:mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Pending Review</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                    {stats.pending}
                  </p>
                </div>
              </div>

              {/* Requires Revision */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-[#101C50] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-0.5 sm:mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Requires Revision</p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                    {stats.needsRevision}
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-6 sm:my-8 border-gray-300" />


            {/* Current Submission Status */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                Current Submission Status
              </h2>

              {currentSubmission ? (
                <div className="relative">
                  {(() => {
                    const stage = getTimelineStage(currentSubmission.status);

                    return (
                      <div className="space-y-8">
                        {/* Document Verification */}
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${stage >= 1 ? 'bg-[#101C50]' : 'border-2 border-gray-300 bg-white'
                              }`}>
                              <svg className={`w-6 h-6 ${stage >= 1 ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-300"></div>
                          </div>
                          <div className="flex-1 pt-2">
                            <h3 className={`font-bold text-lg ${stage >= 1 ? 'text-[#101C50]' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              Document Verification
                            </h3>
                            <p className={`text-base ${stage >= 1 ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {stage === 1 ? 'Checking submitted documents' : 'Documents verified'}
                            </p>
                            {stage >= 1 && (
                              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {formatDate(currentSubmission.submitted_at)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Initial Screening */}
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${stage >= 2 ? 'bg-[#101C50]' : stage === 1 ? 'border-2 border-[#101C50] bg-white animate-pulse' : 'border-2 border-gray-300 bg-white'
                              }`}>
                              <svg className={`w-6 h-6 ${stage >= 2 ? 'text-white' : stage === 1 ? 'text-[#101C50]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-300"></div>
                          </div>
                          <div className="flex-1 pt-2">
                            <h3 className={`font-bold text-lg ${stage >= 2 ? 'text-[#101C50]' : stage === 1 ? 'text-[#101C50]' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              Initial Screening
                            </h3>
                            <p className={`text-base ${stage >= 2 ? 'text-gray-600' : stage === 1 ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {stage === 2 ? 'Classifying research paper' : stage > 2 ? 'Classification complete' : 'Awaiting verification'}
                            </p>
                          </div>
                        </div>

                        {/* Ethics Review */}
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${stage >= 4 ? 'bg-[#101C50]' : [2, 3].includes(stage) ? 'border-2 border-[#101C50] bg-white animate-pulse' : 'border-2 border-gray-300 bg-white'
                              }`}>
                              <svg className={`w-6 h-6 ${stage >= 4 ? 'text-white' : [2, 3].includes(stage) ? 'text-[#101C50]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </div>
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-300"></div>
                          </div>
                          <div className="flex-1 pt-2">
                            <h3 className={`font-bold text-lg ${stage >= 3 ? 'text-[#101C50]' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              Ethics Review
                            </h3>
                            <p className={`text-base ${stage >= 3 ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {stage === 3 ? 'Waiting for reviewer assignment' : stage === 4 ? 'Under review by ethics committee' : stage > 4 ? 'Review complete' : 'Awaiting classification'}
                            </p>
                          </div>
                        </div>

                        {/* Revisions */}
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${stage >= 5 ? 'bg-[#101C50]' : stage === 4 ? 'border-2 border-[#101C50] bg-white' : 'border-2 border-gray-300 bg-white'
                              }`}>
                              <svg className={`w-6 h-6 ${stage >= 5 ? 'text-white' : stage === 4 ? 'text-[#101C50]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-300"></div>
                          </div>
                          <div className="flex-1 pt-2">
                            <h3 className={`font-bold text-lg ${stage >= 5 ? 'text-[#101C50]' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              Revisions
                            </h3>
                            <p className={`text-base ${stage >= 5 ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {stage === 5 ? 'Revising submission based on feedback' : stage > 5 ? 'Revisions completed' : 'Awaiting review completion'}
                            </p>
                          </div>
                        </div>

                        {/* Final Approval */}
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${stage === 7 ? 'bg-green-600' : stage === 6 ? 'border-2 border-[#101C50] bg-white animate-pulse' : 'border-2 border-gray-300 bg-white'
                              }`}>
                              <svg className={`w-6 h-6 ${stage === 7 ? 'text-white' : stage === 6 ? 'text-[#101C50]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 pt-2">
                            <h3 className={`font-bold text-lg ${stage === 7 ? 'text-green-600' : stage === 6 ? 'text-[#101C50]' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              Final Approval
                            </h3>
                            <p className={`text-base ${stage >= 6 ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {stage === 7 ? 'Certificate of approval issued' : stage === 6 ? 'Awaiting final approval' : 'Awaiting review completion'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    No active submission
                  </p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                Recent Activity
              </h2>

              {/* Dropdown for mobile, Tabs for desktop */}
              <div className="mb-6">
                {/* Mobile Dropdown */}
                <div className="md:hidden">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-[#101C50] font-medium focus:outline-none focus:border-[#101C50]"
                    style={{ fontFamily: 'Metropolis, sans-serif', backgroundColor: '#f9fafb' }}
                  >
                    <option value="all">All Activities</option>
                    <option value="revision">Needs Revision</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>

                {/* Desktop Tabs */}
                <div className="hidden md:flex gap-4 border-b border-gray-300">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 text-base font-medium transition-colors whitespace-nowrap ${activeTab === 'all'
                      ? 'border-b-2 border-[#101C50] text-[#101C50]'
                      : 'text-gray-600 hover:text-[#101C50]'
                      }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    All Activities
                  </button>
                  <button
                    onClick={() => setActiveTab('revision')}
                    className={`px-4 py-2 text-base font-medium transition-colors whitespace-nowrap ${activeTab === 'revision'
                      ? 'border-b-2 border-[#101C50] text-[#101C50]'
                      : 'text-gray-600 hover:text-[#101C50]'
                      }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Needs Revision
                  </button>
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 text-base font-medium transition-colors whitespace-nowrap ${activeTab === 'pending'
                      ? 'border-b-2 border-[#101C50] text-[#101C50]'
                      : 'text-gray-600 hover:text-[#101C50]'
                      }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setActiveTab('approved')}
                    className={`px-4 py-2 text-base font-medium transition-colors whitespace-nowrap ${activeTab === 'approved'
                      ? 'border-b-2 border-[#101C50] text-[#101C50]'
                      : 'text-gray-600 hover:text-[#101C50]'
                      }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Approved
                  </button>
                </div>
              </div>

              {/* Activity List */}
              <div className="space-y-3 sm:space-y-4">
                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-gray-500 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      No submissions found
                    </p>
                  </div>
                ) : (
                  filteredSubmissions.map((submission) => {
                    const nonConsolidatedDocs = submission.documents?.filter(
                      doc => doc.fileType !== 'consolidated_application'
                    ) || [];

                    if (nonConsolidatedDocs.length === 0) {
                      return null;
                    }

                    const docsToShow = activeTab === 'revision'
                      ? nonConsolidatedDocs.filter(doc => doc.needsRevision === true)
                      : nonConsolidatedDocs;

                    if (docsToShow.length === 0) {
                      return null;
                    }

                    return docsToShow.map((doc) => {
                      const docNeedsRevision = doc.needsRevision === true;

                      const docStatusInfo = docNeedsRevision
                        ? {
                          buttonText: 'Revise',
                          buttonColor: 'bg-[#8B0000] hover:bg-[#6b0000]',
                          description: doc.revisionComment || 'Revisions requested by the committee'
                        }
                        : {
                          buttonText: 'View',
                          buttonColor: 'bg-[#101C50] hover:bg-[#0d1640]',
                          description: 'Document verified'
                        };

                      return (
                        <div
                          key={`${submission.id}-${doc.id}`}
                          className="bg-gray-50 rounded-lg p-4 sm:p-5 md:p-6 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-base sm:text-lg text-[#101C50] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {getDocumentTypeLabel(doc.fileType)}
                              </h4>
                              <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {docStatusInfo.description}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                Submitted: {formatDate(submission.submitted_at)} • {formatFileSize(doc.fileSize)}
                              </p>
                            </div>
                            <button
                              onClick={() => router.push(`/researchermodule/activity-details?id=${submission.id}&docId=${doc.id}`)}
                              className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 text-white text-sm sm:text-base rounded-full transition-colors cursor-pointer flex-shrink-0 ${docStatusInfo.buttonColor}`}
                              style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                            >
                              {docStatusInfo.buttonText}
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
