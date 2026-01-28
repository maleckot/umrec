'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getResearcherSubmissions } from '@/app/actions/researcher/getResearcherSubmissions';
import { Download, FileCheck, Clock, BookOpen, ExternalLink, Eye } from 'lucide-react';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';

// Keep all your interfaces and helper functions exactly the same
interface Document {
  id: number;
  fileName: string;
  fileType: string;
  displayTitle?: string; 
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
  certificateUrl?: string | null;
  form0011Url?: string | null;
  form0012Url?: string | null;
  approvalDate?: string | null;
}

const getTimelineStage = (status: string) => {
  const normalizedStatus = status?.toLowerCase().replace(/ /g, '_');

  switch (normalizedStatus) {
    case 'pending': return 1;
    case 'under_classification': case 'needs_revision': return 2;
    case 'classified': case 'reviewer_assignment': return 3;
    case 'under_review': case 'in_review': return 4;
    case 'under_revision': return 5;
    case 'completed': case 'approved': return 6;
    case 'review_complete': return 7;
    default: return 1;
  }
};

const handleDownload = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
    window.open(url, '_blank');
  }
};

export default function ResearcherDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState({ active: 0, pending: 0, needsRevision: 0 });
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(0);
  const router = useRouter();

  // Document viewer modal states
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerDocument, setViewerDocument] = useState<{ name: string; url: string } | null>(null);

  // --- PHREB HANDLERS ---
  const handleDownloadPHREB_Guidelines = () => {
    const link = document.createElement('a');
    link.href = '/resources/NEGRIHP.pdf'; 
    link.download = 'NEGRIHP_2022.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewPHREB_Guidelines = () => {
    setViewerDocument({
      name: 'National Ethical Guidelines (2022)',
      url: '/resources/NEGRIHP.pdf'
    });
    setIsViewerOpen(true);
  };

  const handleDownloadPHREB_Workbook = () => {
    const link = document.createElement('a');
    link.href = '/resources/phreb.pdf';
    link.download = 'PHREB_2020.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewPHREB_Workbook = () => {
    setViewerDocument({
      name: 'PHREB Standard Operating Procedures (2020)',
      url: '/resources/phreb.pdf'
    });
    setIsViewerOpen(true);
  };
  // ---------------------------

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    if (submissions.length > 0) {
      const calculatedStats = {
        active: submissions.filter(s => !['Approved', 'Rejected', 'Withdrawn'].includes(s.status)).length,
        pending: submissions.filter(s => {
          const hasPendingDocs = s.documents?.some(doc => doc.isApproved === null && !doc.needsRevision) ?? true;
          return hasPendingDocs || s.status === 'Under Review';
        }).length,
        needsRevision: submissions.filter(s => {
          const hasRejectedDocs = s.documents?.some(doc => doc.needsRevision === true);
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
        setSubmissions(result.submissions);
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
      return hasRejectedDocs || submission.status === 'Under Revision';
    }
    if (activeTab === 'pending') {
      if (submission.status === 'review_complete') return false;
      const hasPendingDocs = submission.documents?.some(doc => doc.isApproved === null);
      return hasPendingDocs || submission.status === 'under_review';
    }
    if (activeTab === 'approved') {
      const allApproved = submission.documents?.every(doc => doc.isApproved === true);
      return allApproved || submission.status === 'review_complete';
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
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewDocument = (docName: string, docUrl: string | null) => {
    if (!docUrl) return;
    setViewerDocument({ name: docName, url: docUrl });
    setIsViewerOpen(true);
  };

  const submissionsAwaitingOrApproved = submissions.filter(s => getTimelineStage(s.status) >= 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center pt-24 md:pt-28 lg:pt-32 pb-8">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 blur-2xl bg-[#101C50]/20 rounded-full animate-pulse"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#101C50] mx-auto mb-4"></div>
            </div>
            <p className="text-gray-700 font-medium text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading your dashboard...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Header */}
          <div className="mb-6 sm:mb-8 pl-2 sm:pl-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 relative inline-block" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
              Researcher Dashboard
              <div className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-[#101C50] to-[#F0E847] rounded-full"></div>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Track and manage your research submissions
            </p>
          </div>

          {/* Unified Reference Materials Container */}
          <div className="mb-8 rounded-2xl bg-[#101C50] text-white p-5 sm:p-8 relative overflow-hidden shadow-xl">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F0E847]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              {/* Container Header */}
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <BookOpen className="text-[#F0E847] w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Reference Materials
                  </h2>
                  <p className="text-xs text-white/60 font-medium">
                    Essential guidelines and procedures for your research
                  </p>
                </div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                
                {/* File Item 1: PHREB Guidelines */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 group">
                   <div className="w-12 h-12 rounded-lg bg-[#F0E847]/10 flex items-center justify-center flex-shrink-0 text-[#F0E847] group-hover:scale-110 transition-transform">
                      <span className="text-xs font-bold">2022</span>
                   </div>
                   
                   <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-white leading-tight mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        National Ethical Guidelines
                      </h3>
                      <p className="text-xs text-white/60 mb-3 sm:mb-0">
                        PHREB 2022 Edition
                      </p>
                   </div>

                   <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                         onClick={handleViewPHREB_Guidelines}
                         className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-[#F0E847] text-white hover:text-[#101C50] font-bold text-xs transition-colors"
                         title="View Document"
                      >
                         <Eye size={16} /> <span className="sm:hidden">View</span>
                      </button>
                      <button 
                         onClick={handleDownloadPHREB_Guidelines}
                         className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#F0E847] hover:bg-[#d9d240] text-[#101C50] font-bold text-xs transition-colors shadow-sm"
                         title="Download Document"
                      >
                         <Download size={16} /> <span className="sm:hidden">Download</span>
                      </button>
                   </div>
                </div>

                {/* File Item 2: SOP */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 group">
                   <div className="w-12 h-12 rounded-lg bg-[#F0E847]/10 flex items-center justify-center flex-shrink-0 text-[#F0E847] group-hover:scale-110 transition-transform">
                      <span className="text-xs font-bold">2020</span>
                   </div>
                   
                   <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-white leading-tight mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Standard Operating Procedures
                      </h3>
                      <p className="text-xs text-white/60 mb-3 sm:mb-0">
                        PHREB Manual (SOP)
                      </p>
                   </div>

                   <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                         onClick={handleViewPHREB_Workbook}
                         className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-[#F0E847] text-white hover:text-[#101C50] font-bold text-xs transition-colors"
                         title="View Document"
                      >
                         <Eye size={16} /> <span className="sm:hidden">View</span>
                      </button>
                      <button 
                         onClick={handleDownloadPHREB_Workbook}
                         className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#F0E847] hover:bg-[#d9d240] text-[#101C50] font-bold text-xs transition-colors shadow-sm"
                         title="Download Document"
                      >
                         <Download size={16} /> <span className="sm:hidden">Download</span>
                      </button>
                   </div>
                </div>

              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-200">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
              <div className="group bg-gradient-to-br from-white to-[#E0C8A0]/10 rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-[#003366] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#003366] to-[#004080] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-0.5 sm:mb-1 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Active Submissions</p>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#003366] to-[#004080] bg-clip-text text-transparent" style={{ fontFamily: 'Metropolis, sans-serif' }}>{stats.active}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-white to-[#87CEEB]/10 rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-[#87CEEB] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#87CEEB] to-[#6BB6D9] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-0.5 sm:mb-1 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Pending Review</p>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#87CEEB] to-[#6BB6D9] bg-clip-text text-transparent" style={{ fontFamily: 'Metropolis, sans-serif' }}>{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-white to-[#F7D117]/10 rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-[#F7D117] hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F7D117] to-[#B8860B] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-0.5 sm:mb-1 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Requires Revision</p>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F7D117] to-[#B8860B] bg-clip-text text-transparent" style={{ fontFamily: 'Metropolis, sans-serif' }}>{stats.needsRevision}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6 sm:my-8"></div>

            {/* Certificate Documents */}
            {submissionsAwaitingOrApproved.length > 0 && (
              <div className="mb-8 sm:mb-12">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                  <span className="w-1 h-6 sm:h-7 md:h-8 bg-gradient-to-b from-[#101C50] to-[#F0E847] rounded-full"></span>
                  Certificates & Documents
                </h2>
                
                <div className="space-y-3 sm:space-y-4">
                  {submissionsAwaitingOrApproved.map(submission => {
                    const certificatesReleased = submission.certificateUrl || submission.form0011Url || submission.form0012Url;

                    return (
                      <div key={submission.id} 
                        className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 shadow-md hover:shadow-lg transition-all duration-300 ${
                          certificatesReleased 
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 hover:border-blue-500' 
                            : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400 hover:border-yellow-500'
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                            certificatesReleased 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                              : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                          }`}>
                            {certificatesReleased 
                              ? <FileCheck size={20} className="text-white sm:w-6 sm:h-6" />
                              : <Clock size={20} className="text-white sm:w-6 sm:h-6" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-base sm:text-lg font-bold mb-1 truncate ${
                              certificatesReleased ? 'text-blue-900' : 'text-yellow-900'
                            }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {submission.title}
                            </h3>
                            <p className={`text-xs sm:text-sm ${
                              certificatesReleased ? 'text-blue-800' : 'text-yellow-800'
                            }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {certificatesReleased 
                                ? `Approved on ${submission.approvalDate ? formatDate(submission.approvalDate) : formatDate(submission.submitted_at)}`
                                : "Review completed. Awaiting certificate release from secretariat."
                              }
                            </p>
                          </div>
                        </div>

                        {certificatesReleased ? (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                            {submission.certificateUrl && (
                              <button 
                                onClick={() => handleDownload(submission.certificateUrl!, 'Certificate_of_Approval.pdf')}
                                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer"
                                style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                              >
                                <Download size={16} className="sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm">Certificate of Approval</span>
                              </button>
                            )}
                            {submission.form0011Url && (
                              <button 
                                onClick={() => handleDownload(submission.form0011Url!, 'Form_0011.pdf')}
                                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer"
                                style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                              >
                                <Download size={16} className="sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm">Form 0011</span>
                              </button>
                            )}
                            {submission.form0012Url && (
                              <button 
                                onClick={() => handleDownload(submission.form0012Url!, 'Form_0012.pdf')}
                                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer"
                                style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                              >
                                <Download size={16} className="sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm">Form 0012</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="bg-yellow-100/80 border border-yellow-300 rounded-xl p-3 sm:p-4">
                            <p className="text-xs sm:text-sm text-yellow-900 text-center font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              <strong>Pending Release:</strong> The secretariat will release your approval documents shortly.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Current Submission Status */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                <span className="w-1 h-6 sm:h-7 md:h-8 bg-gradient-to-b from-[#101C50] to-[#F0E847] rounded-full"></span>
                Current Submission Status
              </h2>

              {(() => {
                const activeSubmissions = submissions.filter(s => getTimelineStage(s.status) < 8);

                if (activeSubmissions.length === 0) {
                  return (
                    <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm sm:text-base text-gray-500 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        No active submissions
                      </p>
                    </div>
                  );
                }

                const renderTimeline = (submission: Submission) => {
                  const stage = getTimelineStage(submission.status);

                  return (
                    <div className="space-y-4 sm:space-y-6 md:space-y-8">
                      {/* Document Verification */}
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                        <div className="relative">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative z-10 shadow-lg transition-all duration-300 ${stage >= 1 ? 'bg-gradient-to-br from-[#101C50] to-[#1a2d6e]' : 'border-2 border-gray-300 bg-white'}`}>
                            <svg className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stage >= 1 ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="absolute top-8 sm:top-10 md:top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-10 sm:h-12 md:h-16 bg-gray-300"></div>
                        </div>
                        <div className="flex-1 pt-1 sm:pt-1.5 md:pt-2">
                          <h3 className={`font-bold text-sm sm:text-base md:text-lg ${stage >= 1 ? 'text-[#101C50]' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Document Verification
                          </h3>
                          <p className={`text-xs sm:text-sm md:text-base ${stage >= 1 ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {stage === 1 ? 'Checking submitted documents' : 'Documents verified'}
                          </p>
                          {stage >= 1 && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {formatDate(submission.submitted_at)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Initial Screening */}
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                        <div className="relative">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative z-10 shadow-lg transition-all duration-300 ${stage >= 2 ? 'bg-gradient-to-br from-[#101C50] to-[#1a2d6e]' : stage === 1 ? 'border-2 border-[#101C50] bg-white animate-pulse' : 'border-2 border-gray-300 bg-white'}`}>
                            <svg className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stage >= 2 ? 'text-white' : stage === 1 ? 'text-[#101C50]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div className="absolute top-8 sm:top-10 md:top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-10 sm:h-12 md:h-16 bg-gray-300"></div>
                        </div>
                        <div className="flex-1 pt-1 sm:pt-1.5 md:pt-2">
                          <h3 className={`font-bold text-sm sm:text-base md:text-lg ${stage >= 2 ? 'text-[#101C50]' : stage === 1 ? 'text-[#101C50]' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Initial Screening
                          </h3>
                          <p className={`text-xs sm:text-sm md:text-base ${stage >= 2 ? 'text-gray-600' : stage === 1 ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {stage === 2 ? 'Classifying research paper' : stage > 2 ? 'Classification complete' : 'Awaiting verification'}
                          </p>
                        </div>
                      </div>

                      {/* Ethics Review */}
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                        <div className="relative">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative z-10 shadow-lg transition-all duration-300 ${stage >= 4 ? 'bg-gradient-to-br from-[#101C50] to-[#1a2d6e]' : [2, 3].includes(stage) ? 'border-2 border-[#101C50] bg-white animate-pulse' : 'border-2 border-gray-300 bg-white'}`}>
                            <svg className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stage >= 4 ? 'text-white' : [2, 3].includes(stage) ? 'text-[#101C50]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div className="absolute top-8 sm:top-10 md:top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-10 sm:h-12 md:h-16 bg-gray-300"></div>
                        </div>
                        <div className="flex-1 pt-1 sm:pt-1.5 md:pt-2">
                          <h3 className={`font-bold text-sm sm:text-base md:text-lg ${stage >= 3 ? 'text-[#101C50]' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Ethics Review
                          </h3>
                          <p className={`text-xs sm:text-sm md:text-base ${stage >= 3 ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {stage === 3 ? 'Waiting for reviewer assignment' : stage === 4 ? 'Under review by ethics committee' : stage > 4 ? 'Review complete' : 'Awaiting classification'}
                          </p>
                        </div>
                      </div>

                      {/* Revisions */}
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                        <div className="relative">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative z-10 shadow-lg transition-all duration-300 ${stage >= 5 ? 'bg-gradient-to-br from-[#101C50] to-[#1a2d6e]' : stage === 4 ? 'border-2 border-[#101C50] bg-white' : 'border-2 border-gray-300 bg-white'}`}>
                            <svg className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stage >= 5 ? 'text-white' : stage === 4 ? 'text-[#101C50]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </div>
                          <div className="absolute top-8 sm:top-10 md:top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-10 sm:h-12 md:h-16 bg-gray-300"></div>
                        </div>
                        <div className="flex-1 pt-1 sm:pt-1.5 md:pt-2">
                          <h3 className={`font-bold text-sm sm:text-base md:text-lg ${stage >= 5 ? 'text-[#101C50]' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Revisions
                          </h3>
                          <p className={`text-xs sm:text-sm md:text-base ${stage >= 5 ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {stage === 5 ? 'Revising submission based on feedback' : stage > 5 ? 'Revisions completed' : 'Awaiting review completion'}
                          </p>
                        </div>
                      </div>

                      {/* Final Approval */}
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                        <div className="relative">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative z-10 shadow-lg transition-all duration-300 ${stage === 7 ? 'bg-gradient-to-br from-green-500 to-green-600' : stage === 6 ? 'border-2 border-[#101C50] bg-white animate-pulse' : 'border-2 border-gray-300 bg-white'}`}>
                            <svg className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stage === 7 ? 'text-white' : stage === 6 ? 'text-[#101C50]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 pt-1 sm:pt-1.5 md:pt-2">
                          <h3 className={`font-bold text-sm sm:text-base md:text-lg ${stage === 7 ? 'text-green-600' : stage === 6 ? 'text-[#101C50]' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Final Approval
                          </h3>
                          <p className={`text-xs sm:text-sm md:text-base ${stage >= 6 ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {stage === 7 ? 'Certificate of approval issued' : stage === 6 ? 'Awaiting final approval' : 'Awaiting review completion'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                };

                if (activeSubmissions.length === 1) {
                  return <div className="relative">{renderTimeline(activeSubmissions[0])}</div>;
                }

                const selectedSubmission = activeSubmissions[selectedSubmissionIndex];

                return (
                  <div>
                    <div className="mb-4 sm:mb-6 overflow-x-auto">
                      <div className="flex gap-2 min-w-max pb-2">
                        {activeSubmissions.map((submission, index) => (
                          <button
                            key={submission.id}
                            onClick={() => setSelectedSubmissionIndex(index)}
                            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base font-medium rounded-xl transition-all duration-300 whitespace-nowrap shadow-sm ${selectedSubmissionIndex === index
                              ? 'bg-gradient-to-r from-[#101C50] to-[#1a2d6e] text-white shadow-md scale-105'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow'
                              }`}
                            style={{ fontFamily: 'Metropolis, sans-serif' }}
                          >
                            {submission.title.length > 30 ? `${submission.title.substring(0, 30)}...` : submission.title}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">{renderTimeline(selectedSubmission)}</div>
                  </div>
                );
              })()}
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                <span className="w-1 h-6 sm:h-7 md:h-8 bg-gradient-to-b from-[#101C50] to-[#F0E847] rounded-full"></span>
                Recent Activity
              </h2>

              <div className="mb-4 sm:mb-6">
                <div className="md:hidden">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-[#101C50] text-sm font-medium focus:outline-none focus:border-[#101C50] focus:ring-2 focus:ring-[#101C50]/20 bg-white shadow-sm"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <option value="all">All Activities</option>
                    <option value="revision">Needs Revision</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>

                <div className="hidden md:flex gap-2 bg-gray-100 p-1 rounded-xl">
                  {['all', 'revision', 'pending', 'approved'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                        activeTab === tab
                          ? 'bg-gradient-to-r from-[#101C50] to-[#1a2d6e] text-white shadow-md'
                          : 'text-gray-600 hover:text-[#101C50] hover:bg-white/50'
                      }`}
                      style={{ fontFamily: 'Metropolis, sans-serif', textTransform: 'capitalize' }}
                    >
                      {tab === 'all' ? 'All Activities' : tab.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500 text-xs sm:text-sm md:text-base font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      No submissions found
                    </p>
                  </div>
                ) : (
                  filteredSubmissions.map(submission => {
                    const docsToDisplay = (
                      ['approved', 'under_review', 'review_complete', 'under_revision'].includes(submission.status.toLowerCase().replace(/ /g, '_')) 
                    ) ? submission.documents : submission.documents?.filter(doc => doc.fileType !== 'consolidated_application');

                    if (!docsToDisplay || docsToDisplay.length === 0) return null;

                    const docsToShow = activeTab === 'revision'
                      ? docsToDisplay.filter(doc => doc.needsRevision === true)
                      : docsToDisplay;

                    if (docsToShow.length === 0) return null;

                    return docsToShow.map(doc => {
                      const docNeedsRevision = doc.fileType === 'consolidated_application' 
                        ? submission.status === 'Under Revision' 
                        : doc.needsRevision === true;

                      const docStatusInfo = docNeedsRevision ? {
                        buttonText: 'Revise',
                        buttonColor: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
                        description: 'Revisions requested by UMREC.'
                      } : {
                        buttonText: 'View',
                        buttonColor: 'bg-gradient-to-r from-[#101C50] to-[#1a2d6e] hover:from-[#1a2d6e] hover:to-[#101C50]',
                        description: doc.isApproved ? 'Approved by ethics committee.' : 'Pending review and approval.'
                      };

                      return (
                        <div key={`${submission.id}-${doc.id}`} className="group bg-white rounded-xl border border-gray-200 hover:border-[#101C50] shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="flex items-center p-3 sm:p-4 gap-3 sm:gap-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300 ${
                              docNeedsRevision 
                                ? 'bg-red-50 text-red-500 group-hover:scale-110' 
                                : 'bg-blue-50 text-[#101C50] group-hover:scale-110'
                            }`}>
                              {doc.fileType === 'consolidated_application' ? (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                <div>
                                  <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                    {doc.fileType === 'consolidated_application' ? submission.title : (doc.displayTitle || getDocumentTypeLabel(doc.fileType))}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-500 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                      {submission.title.substring(0, 40)}{submission.title.length > 40 ? '...' : ''}
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                      {formatFileSize(doc.fileSize)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-1 sm:mt-0">
                                  {docNeedsRevision && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">
                                      Action Required
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-400 hidden sm:inline-block">
                                    {formatDate(submission.submitted_at)}
                                  </span>
                                </div>
                              </div>
                            </div>

                             <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleViewDocument(doc.fileName, doc.fileUrl)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-[#101C50] hover:bg-gray-100 transition-colors"
                                  title="Preview Document"
                                >
                                  <Eye size={18} />
                                </button>
                                
                                <button 
                                  onClick={() => {
                                    if (docNeedsRevision && doc.fileType === 'consolidated_application') {
                                      router.push(`/researcher/module/edit-submission/${submission.id}`);
                                    } else if (doc.fileUrl) {
                                      handleDownload(doc.fileUrl, doc.fileName);
                                    }
                                  }}
                                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 ${docStatusInfo.buttonColor} min-w-[70px] sm:min-w-[80px] text-center`}
                                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                                >
                                  {docStatusInfo.buttonText}
                                </button>
                             </div>
                          </div>

                          {docNeedsRevision && doc.revisionComment && (
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                              <div className="bg-red-50 rounded-lg p-3 text-xs sm:text-sm text-red-700 border border-red-100 flex gap-2 items-start">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                  <span className="font-bold block mb-0.5">Reviewer Feedback:</span>
                                  {doc.revisionComment}
                                </div>
                              </div>
                            </div>
                          )}
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
      
      {/* Document Viewer Modal */}
      {viewerDocument && (
        <DocumentViewerModal
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setViewerDocument(null);
          }}
          documentName={viewerDocument.name}
          documentUrl={viewerDocument.url}
        />
      )}
    </div>
  );
}
