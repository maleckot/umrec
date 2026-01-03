'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Building2, Edit2, Award, FileText, ExternalLink, Download, Save, X, ChevronDown } from 'lucide-react';
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
      setReviewerCode(result.reviewer.code);
      
      const reviewerAny = result.reviewer as any;
      const areasString = reviewerAny.areasOfExpertise || reviewerAny.expertiseAreas || '';
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

  const handleReviewClick = (reviewId: string) => {
    router.push(`/secretariatmodule/submissions/details?id=${reviewId}`);
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
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50] mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium tracking-wide text-sm">LOADING PROFILE...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!reviewerData || !reviewerData.reviewer) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 font-medium">Reviewer not found</p>
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
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
      <div className="max-w-[1600px] mx-auto w-full pb-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/secretariatmodule/reviewers')}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#101C50] transition-colors uppercase tracking-wider"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <ArrowLeft size={16} />
            Back to Reviewers List
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            
            {/* User Info */}
            <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0 shadow-md border-4 border-white ring-1 ring-gray-100">
                <span className="text-white text-2xl sm:text-3xl font-bold">
                  {reviewer.name.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1 pt-1 w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#101C50] mb-2 leading-tight" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {reviewer.name}
                </h1>
                
                <div className="flex flex-col sm:flex-row flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="font-medium">{reviewer.college || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="break-all">{reviewer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400 flex-shrink-0" />
                    <span>{reviewer.phone || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviewer Code Box */}
            <div className="flex-shrink-0 bg-gray-50 rounded-xl p-4 border border-gray-200 w-full lg:w-auto min-w-[200px]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reviewer Code</p>
              
              {isEditingCode ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={reviewerCode}
                    onChange={(e) => setReviewerCode(e.target.value)}
                    className="w-full px-3 py-2 text-lg font-bold text-[#101C50] border border-blue-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-center"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveCode} className="flex-1 bg-[#101C50] text-white text-xs font-bold py-1.5 rounded hover:bg-opacity-90">Save</button>
                    <button onClick={() => { setIsEditingCode(false); setReviewerCode(reviewer.code); }} className="flex-1 bg-white border border-gray-300 text-gray-600 text-xs font-bold py-1.5 rounded hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-2xl font-bold text-[#101C50] tracking-tight">{reviewerCode}</span>
                  <button 
                    onClick={() => setIsEditingCode(true)}
                    className="p-1.5 text-gray-400 hover:text-[#101C50] hover:bg-white rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <ReviewerStatsCards
            availability={reviewer.availability}
            reviewStatus={reviewer.reviewStatus}
            activeReviews={reviewer.activeReviews}
          />
        </div>

        {/* Responsive Content Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
          
          {/* Mobile Tab Dropdown */}
          <div className="md:hidden p-4 border-b border-gray-100 bg-gray-50/50">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">View Section</label>
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as TabType)}
                className="w-full appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-[#101C50] focus:border-[#101C50] block p-3 pr-10 font-semibold"
              >
                <option value="current">Current Reviews ({currentReviews.length})</option>
                <option value="history">Review History ({reviewHistory.length})</option>
                <option value="expertise">Expertise & Skills</option>
                <option value="certificates">Certificates ({certificates.length})</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:block border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-8 py-5 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'current'
                    ? 'border-[#101C50] text-[#101C50] bg-gray-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Current Reviews <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{currentReviews.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-8 py-5 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'history'
                    ? 'border-[#101C50] text-[#101C50] bg-gray-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                History <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{reviewHistory.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('expertise')}
                className={`px-8 py-5 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'expertise'
                    ? 'border-[#101C50] text-[#101C50] bg-gray-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Expertise
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`px-8 py-5 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'certificates'
                    ? 'border-[#101C50] text-[#101C50] bg-gray-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Certificates
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-0">
            {activeTab === 'current' && (
              <ReviewerReviewsTable
                reviews={currentReviews}
                type="current"
                onReviewClick={handleReviewClick}
              />
            )}

            {activeTab === 'history' && (
              <ReviewerReviewsTable
                reviews={reviewHistory}
                type="history"
                onReviewClick={handleReviewClick}
              />
            )}

            {activeTab === 'expertise' && (
              <div className="p-4 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#101C50] mb-1">Areas of Expertise</h3>
                    <p className="text-sm text-gray-500">Manage the specialized fields for this reviewer.</p>
                  </div>
                  {!isEditingExpertise && (
                    <button
                      onClick={() => setIsEditingExpertise(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#101C50] text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                  )}
                </div>

                {isEditingExpertise ? (
                  <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200 max-w-3xl">
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <input
                        type="text"
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise()}
                        placeholder="Type a skill and press Enter..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#101C50]/20 focus:border-[#101C50] outline-none text-sm"
                      />
                      <button
                        onClick={handleAddExpertise}
                        className="px-6 py-3 bg-[#101C50] text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 min-h-[100px] bg-white p-4 rounded-lg border border-gray-200">
                      {expertiseAreas.length === 0 && <p className="text-gray-400 text-sm italic">No expertise areas added yet.</p>}
                      {expertiseAreas.map((area, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
                          <span className="text-sm font-semibold">{area}</span>
                          <button onClick={() => handleRemoveExpertise(index)} className="text-blue-400 hover:text-blue-700">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveExpertise}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#101C50] text-white text-sm font-bold rounded-lg hover:bg-opacity-90 shadow-sm transition-all"
                      >
                        <Save size={16} /> Save Changes
                      </button>
                      <button
                        onClick={() => {
                          const reviewerAny = reviewerData?.reviewer as any;
                          const areasString = reviewerAny?.areasOfExpertise || reviewerAny?.expertiseAreas || '';
                          const areasArray = areasString ? 
                            (typeof areasString === 'string' ? areasString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : areasString) 
                            : [];
                          setExpertiseAreas(areasArray);
                          setIsEditingExpertise(false);
                          setExpertiseInput('');
                        }}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50/30 p-4 md:p-6 rounded-xl border border-gray-100">
                    {expertiseAreas.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {expertiseAreas.map((area, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-white text-[#101C50] rounded-lg border border-gray-200 shadow-sm text-sm font-semibold"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 opacity-50">
                        <Award size={48} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm font-medium">No expertise areas listed.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="p-4 md:p-8">
                <h3 className="text-lg font-bold text-[#101C50] mb-6">Certificates & Documents</h3>
                {certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex flex-col p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white group"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={24} className="text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[#101C50] mb-1 truncate">{cert.name}</p>
                            <p className="text-xs text-gray-500">Uploaded on {cert.uploadDate}</p>
                            <p className="text-xs text-gray-400 mt-1">{cert.fileSize}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleViewCertificate(cert)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-[#101C50] bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <ExternalLink size={14} /> View
                          </button>
                          <button
                            onClick={() => handleDownloadCertificate(cert)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-blue-600 bg-blue-50/50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Download size={14} /> Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <FileText size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No certificates uploaded yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

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

export default function SecretariatReviewerDetailsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Reviewer Details" activeNav="reviewers">
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
        </div>
      </DashboardLayout>
    }>
      <ReviewerDetailsContent />
    </Suspense>
  );
}
