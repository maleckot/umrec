// app/adminmodule/reviewers/details/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Award, Building2, FileText, Edit2, ExternalLink, Download } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReviewerStatsCards from '@/components/admin/reviewers/ReviewerStatsCards';
import ReviewerReviewsTable from '@/components/admin/reviewers/ReviewerReviewsTable';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';
import { getReviewerDetails } from '@/app/actions/admin/reviewer/getAdminReviewerDetails';
import { deleteReviewer } from '@/app/actions/admin/reviewer/deleteReviewer';
import { Suspense } from 'react';

type TabType = 'current' | 'history' | 'expertise' | 'certificates';
function ReviewerDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewerId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [loading, setLoading] = useState(true);
  const [reviewerData, setReviewerData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditingExpertise, setIsEditingExpertise] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState('');
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);

  // Document viewer state
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    if (reviewerId) {
      loadReviewerDetails();
    }
  }, [reviewerId]);

  const loadReviewerDetails = async () => {
    if (!reviewerId) return;

    setLoading(true);
    const result = await getReviewerDetails(reviewerId);

    if (result.success && result.reviewer) {
      setReviewerData(result);

      // ✅ Safe type checking
      const areasString = result.reviewer.areasOfExpertise || '';
      const areasArray = typeof areasString === 'string' && areasString
        ? areasString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        : Array.isArray(areasString)
          ? areasString
          : [];

      setExpertiseAreas(areasArray);
    } else {
      console.error('Failed to load reviewer:', result.error);
    }
    setLoading(false);
  };


  const handleReviewClick = (submissionId: string) => {
    router.push(`/adminmodule/submissions/details?id=${submissionId}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewerId) return;

    const result = await deleteReviewer(reviewerId);

    if (result.success) {
      router.push('/adminmodule/reviewers');
    } else {
      alert('Failed to delete reviewer: ' + result.error);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleAddExpertise = () => {
    const trimmed = expertiseInput.trim();
    if (trimmed && !expertiseAreas.includes(trimmed)) {
      setExpertiseAreas([...expertiseAreas, trimmed]);
      setExpertiseInput('');
    }
  };

  const handleRemoveExpertise = (index: number) => {
    setExpertiseAreas(expertiseAreas.filter((_, i) => i !== index));
  };

  const handleSaveExpertise = async () => {
    // Convert array back to comma-separated string for backend
    const expertiseString = expertiseAreas.join(', ');
    console.log('Saving expertise:', expertiseString);
    setIsEditingExpertise(false);
    // TODO: await updateReviewerExpertise(reviewerId, expertiseString);
  };

  const handleViewCertificate = (cert: any) => {
    setSelectedDocument({
      name: cert.name,
      url: cert.fileUrl
    });
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
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading reviewer details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!reviewerData || !reviewerData.reviewer) {
    return (
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Reviewer not found
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const { reviewer, currentReviews, reviewHistory } = reviewerData;

  // Mock certificates data - replace with actual data from API
  const certificates = [
    {
      id: '1',
      name: 'Research Ethics Certificate',
      uploadDate: 'Oct 15, 2024',
      fileUrl: 'https://example.com/certificate1.pdf',
      fileSize: '2.4 MB'
    },
    {
      id: '2',
      name: 'PhD in Computer Science',
      uploadDate: 'Sep 10, 2024',
      fileUrl: 'https://example.com/certificate2.pdf',
      fileSize: '1.8 MB'
    }
  ];

  return (
    <>
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Reviewer Details" activeNav="reviewers">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => router.push('/adminmodule/reviewers')}
            className="flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Reviewers</span>
          </button>
        </div>

        {/* Reviewer Header */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-white sm:w-10 sm:h-10" />
            </div>
            <div className="flex-1 min-w-0 w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {reviewer.name}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                {/* Phone */}
                <div className="flex items-center gap-2">
                  <Phone size={16} className="flex-shrink-0" />
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.phone}</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2">
                  <Mail size={16} className="flex-shrink-0" />
                  <span className="break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.email}</span>
                </div>

                {/* College */}
                <div className="flex items-start gap-2 sm:col-span-2">
                  <Building2 size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>College: </span>
                    <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.college}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <ReviewerStatsCards
          availability={reviewer.availability}
          status={reviewer.reviewStatus}
          activeReviews={reviewer.activeReviews}
        />

        {/* Reviews Section with Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max">
              <button
                onClick={() => setActiveTab('current')}
                className={`flex-1 min-w-[140px] px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'current'
                    ? 'text-[#101C50] border-b-2 border-[#101C50] bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Current Reviews ({currentReviews.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 min-w-[140px] px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'history'
                    ? 'text-[#101C50] border-b-2 border-[#101C50] bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Review History ({reviewHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('expertise')}
                className={`flex-1 min-w-[140px] px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'expertise'
                    ? 'text-[#101C50] border-b-2 border-[#101C50] bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <span className="flex items-center gap-2 justify-center">
                  <Award size={16} />
                  Expertise
                </span>
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`flex-1 min-w-[140px] px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'certificates'
                    ? 'text-[#101C50] border-b-2 border-[#101C50] bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <span className="flex items-center gap-2 justify-center">
                  <FileText size={16} />
                  Certificates ({certificates.length})
                </span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-4 sm:p-6">
            {/* Current Reviews Tab */}
            {activeTab === 'current' && (
              <ReviewerReviewsTable
                reviews={currentReviews}
                type="current"
                onReviewClick={handleReviewClick}
              />
            )}

            {/* Review History Tab */}
            {activeTab === 'history' && (
              <ReviewerReviewsTable
                reviews={reviewHistory}
                type="history"
                onReviewClick={handleReviewClick}
              />
            )}

            {/* Expertise Tab */}
            {activeTab === 'expertise' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Areas of Expertise
                  </h3>
                  {!isEditingExpertise && (
                    <button
                      onClick={() => setIsEditingExpertise(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                  )}
                </div>

                {isEditingExpertise ? (
                  <div className="space-y-4">
                    {/* Add New Expertise */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise()}
                        placeholder="Add area of expertise..."
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm text-gray-900"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      />
                      <button
                        onClick={handleAddExpertise}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 whitespace-nowrap"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        Add
                      </button>
                    </div>

                    {/* Expertise List */}
                    <div className="flex flex-wrap gap-2">
                      {expertiseAreas.map((area, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-900 rounded-lg"
                        >
                          <span className="text-sm font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {area}
                          </span>
                          <button
                            onClick={() => handleRemoveExpertise(index)}
                            className="text-blue-700 hover:text-blue-900 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Save/Cancel Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveExpertise}
                        className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          const areasString = reviewer.areasOfExpertise || '';
                          const areasArray = typeof areasString === 'string' && areasString
                            ? areasString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
                            : Array.isArray(areasString)
                              ? areasString
                              : [];
                          setExpertiseAreas(areasArray);
                          setIsEditingExpertise(false);
                          setExpertiseInput('');
                        }}
                        className="px-6 py-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-400"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        Cancel
                      </button>

                    </div>
                  </div>
                ) : (
                  <div>
                    {expertiseAreas.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {expertiseAreas.map((area, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-blue-100 text-blue-900 rounded-lg text-sm font-semibold"
                            style={{ fontFamily: 'Metropolis, sans-serif' }}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award size={48} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          No expertise areas added yet
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Certificates
                </h3>

                {certificates.length > 0 ? (
                  <div className="space-y-3">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={20} className="text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {cert.name}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500 mt-1">
                              <span style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                Uploaded: {cert.uploadDate}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {cert.fileSize}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewCertificate(cert)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            style={{ fontFamily: 'Metropolis, sans-serif' }}
                          >
                            <ExternalLink size={16} />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadCertificate(cert)}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                            style={{ fontFamily: 'Metropolis, sans-serif' }}
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      No certificates uploaded yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <div className="flex justify-end">
          <button
            onClick={handleDeleteClick}
            className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-semibold flex items-center gap-2"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Reviewer
          </button>
        </div>
      </DashboardLayout>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <div className="mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Delete Reviewer
              </h3>
              <p className="text-sm text-gray-600 text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Are you sure you want to delete <strong>{reviewer.name}</strong>? This action cannot be undone and will permanently remove all associated data.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <DocumentViewerModal
          isOpen={showDocumentViewer}
          onClose={() => {
            setShowDocumentViewer(false);
            setSelectedDocument(null);
          }}
          documentUrl={selectedDocument.url}
          documentName={selectedDocument.name}
        />
      )}
    </>
  );
}
export default function ReviewerDetailsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <ReviewerDetailsContent />
    </Suspense>
  );
}