'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Building2, Edit2, Award, FileText, ExternalLink, Download, ChevronDown } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ReviewerStatsCards from '@/components/staff-secretariat-admin/reviewers/ReviewerStatsCards';
import ReviewerReviewsTable from '@/components/staff-secretariat-admin/reviewers/ReviewerReviewsTable';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';
import { getReviewerDetails } from '@/app/actions/secretariat-staff/getReviewerDetails';
import { updateReviewerCode } from '@/app/actions/secretariat-staff/updateReviewerCode';
import { updateReviewerExpertise } from '@/app/actions/secretariat-staff/updateReviewerExpertise';

type TabType = 'current' | 'history' | 'expertise' | 'certificates';

function ReviewerDetailsContent() {
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
    
    if (result.success) {
      setReviewerData(result);
      setReviewerCode(result.reviewer?.code || '');
      
      const reviewerAny = result.reviewer as any;
      const areasString = reviewerAny?.areasOfExpertise || reviewerAny?.expertiseAreas || '';
      const areasArray = areasString ? 
        (typeof areasString === 'string' ? areasString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : areasString) 
        : [];
      setExpertiseAreas(areasArray);
    } else {
      console.error('Failed to load reviewer:', result.error);
    }
    setLoading(false);
  };

  const handleSaveCode = async () => {
    if (!reviewerId) return;

    const result = await updateReviewerCode(reviewerId, reviewerCode);
    
    if (result.success) {
      console.log('✅ Code updated successfully');
      setIsEditingCode(false);
      loadReviewerDetails();
    } else {
      console.error('Failed to update code:', result.error);
      alert('Failed to update reviewer code');
    }
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
    if (!reviewerId) {
      alert('Reviewer ID not found');
      return;
    }

    const expertiseString = expertiseAreas.join(', ');
    const result = await updateReviewerExpertise(reviewerId, expertiseString);
    
    if (result.success) {
      console.log('✅ Expertise updated');
      setIsEditingExpertise(false);
      loadReviewerDetails();
    } else {
      alert('Failed to update expertise: ' + result.error);
    }
  };

  const handleReviewClick = (id: string) => {
    router.push(`/staffmodule/submissions/details?id=${id}`);
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
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewer Details" activeNav="reviewers">
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
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Reviewer not found
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const { reviewer, currentReviews, reviewHistory } = reviewerData;

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
    <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewer Details" activeNav="reviewers">
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => router.push('/staffmodule/reviewers')}
          className="flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Back to Reviewers</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>

      {/* Reviewer Header */}
      <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left side - Reviewer Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-white sm:w-8 sm:h-8" />
            </div>
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {reviewer.name}
              </h1>
              <div className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="flex-shrink-0 sm:w-4 sm:h-4" />
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="flex-shrink-0 sm:w-4 sm:h-4" />
                  <span className="break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Reviewer Code */}
          <div className="text-left lg:text-right border-t lg:border-t-0 pt-3 lg:pt-0">
            <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Reviewer Code
            </p>
            {isEditingCode ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="text"
                  value={reviewerCode}
                  onChange={(e) => setReviewerCode(e.target.value)}
                  className="w-full sm:w-20 px-2 py-1 text-2xl sm:text-3xl font-bold text-gray-900 border-2 border-blue-500 rounded text-center"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleSaveCode}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 whitespace-nowrap"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setReviewerCode(reviewer.code);
                      setIsEditingCode(false);
                    }}
                    className="flex-1 sm:flex-none px-3 py-1.5 bg-gray-300 text-gray-700 text-xs sm:text-sm rounded hover:bg-gray-400 whitespace-nowrap"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {reviewerCode}
                </p>
                <button
                  onClick={() => setIsEditingCode(true)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 size={16} className="text-gray-600 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <ReviewerStatsCards
        availability={reviewer.availability}
        reviewStatus={reviewer.reviewStatus}
        activeReviews={reviewer.activeReviews}
      />

      {/* College Information */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <Building2 size={18} className="text-gray-600 flex-shrink-0 sm:w-5 sm:h-5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-600 mb-0.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              College/Department
            </p>
            <p className="text-xs sm:text-sm font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {reviewer.college}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section with Responsive Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Mobile Dropdown for Tabs */}
        <div className="md:hidden p-4 border-b border-gray-100">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
            View Section
          </label>
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabType)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10 font-bold"
            >
              <option value="current">Current Reviews ({currentReviews.length})</option>
              <option value="history">Review History ({reviewHistory.length})</option>
              <option value="expertise">Expertise</option>
              <option value="certificates">Certificates ({certificates.length})</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:block border-b border-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 min-w-[120px] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'current'
                  ? 'text-[#101C50] border-b-2 border-[#101C50] bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Current Reviews ({currentReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 min-w-[120px] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'text-[#101C50] border-b-2 border-[#101C50] bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Review History ({reviewHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('expertise')}
              className={`flex-1 min-w-[120px] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'expertise'
                  ? 'text-[#101C50] border-b-2 border-[#101C50] bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <span className="flex items-center gap-2 justify-center">
                <Award size={14} className="sm:w-4 sm:h-4" />
                Expertise
              </span>
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 min-w-[120px] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'certificates'
                  ? 'text-[#101C50] border-b-2 border-[#101C50] bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <span className="flex items-center gap-2 justify-center">
                <FileText size={14} className="sm:w-4 sm:h-4" />
                Certificates ({certificates.length})
              </span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-3 sm:p-4 lg:p-6">
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
                <h3 className="text-base sm:text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Areas of Expertise
                </h3>
                {!isEditingExpertise && (
                  <button
                    onClick={() => setIsEditingExpertise(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <Edit2 size={14} className="sm:w-4 sm:h-4" />
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
                      className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-xs sm:text-sm text-gray-900"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    />
                    <button
                      onClick={handleAddExpertise}
                      className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 whitespace-nowrap"
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
                        <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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
                      className="px-4 sm:px-6 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-700"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        const reviewerAny = reviewer as any;
                        const areasString = reviewerAny?.areasOfExpertise || reviewerAny?.expertiseAreas || '';
                        const areasArray = areasString ? 
                          (typeof areasString === 'string' ? areasString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : areasString) 
                          : [];
                        setExpertiseAreas(areasArray);
                        setIsEditingExpertise(false);
                        setExpertiseInput('');
                      }}
                      className="px-4 sm:px-6 py-2 bg-gray-300 text-gray-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-400"
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
                          className="px-3 py-2 bg-blue-100 text-blue-900 rounded-lg text-xs sm:text-sm font-semibold"
                          style={{ fontFamily: 'Metropolis, sans-serif' }}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award size={40} className="text-gray-300 mx-auto mb-3 sm:w-12 sm:h-12" />
                      <p className="text-gray-500 text-xs sm:text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Certificates
              </h3>

              {certificates.length > 0 ? (
                <div className="space-y-3">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={16} className="text-blue-600 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          style={{ fontFamily: 'Metropolis, sans-serif' }}
                        >
                          <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadCertificate(cert)}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg hover:bg-gray-300 transition-colors"
                          style={{ fontFamily: 'Metropolis, sans-serif' }}
                        >
                          <Download size={14} className="sm:w-4 sm:h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText size={40} className="text-gray-300 mx-auto mb-3 sm:w-12 sm:h-12" />
                  <p className="text-gray-500 text-xs sm:text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    No certificates uploaded yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
    </DashboardLayout>
  );
}

export default function ReviewerDetailsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="staff" roleTitle="Staff" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <ReviewerDetailsContent />
    </Suspense>
  );
}
