'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Building2, GraduationCap, Calendar, BookOpen, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ResearcherStatsCards from '@/components/admin/researchers/ResearcherStatsCards';
import ResearcherSubmissionsTable from '@/components/admin/researchers/ResearcherSubmissionsTable';
import { getResearcherDetails } from '@/app/actions/admin/getAdminResearcherDetails';
import { deleteResearcher } from '@/app/actions/admin/deleteResearcher';

function ResearcherDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const researcherId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [researcherData, setResearcherData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (researcherId) {
      loadResearcherDetails();
    }
  }, [researcherId]);

  const loadResearcherDetails = async () => {
    if (!researcherId) return;
    
    setLoading(true);
    const result = await getResearcherDetails(researcherId);
    
    if (result.success) {
      setResearcherData({
        researcher: result.researcher,
        submissions: result.submissions,
      });
    } else {
      console.error('Failed to load researcher:', result.error);
    }
    
    setLoading(false);
  };

  const handleSubmissionClick = (id: string) => {
    router.push(`/adminmodule/submissions/details?id=${id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!researcherId) return;
    
    setDeleting(true);
    const result = await deleteResearcher(researcherId);

    if (result.success) {
      router.push('/adminmodule/researchers');
    } else {
      alert('Failed to delete researcher: ' + result.error);
    }
    
    setDeleting(false);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Researcher Details" activeNav="researchers">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading researcher details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!researcherData || !researcherData.researcher) {
    return (
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Researcher Details" activeNav="researchers">
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Researcher not found
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const { researcher, submissions } = researcherData;

  return (
    <>
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Researcher Details" activeNav="researchers">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => router.push('/adminmodule/researchers')}
            className="flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-700 hover:text-blue-900 transition-colors"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            <span>Back to Researchers</span>
          </button>
        </div>

        {/* Researcher Header */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-white sm:w-10 sm:h-10" />
            </div>
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {researcher.name}
                  </h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="flex-shrink-0 text-gray-400" />
                      <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="flex-shrink-0 text-gray-400" />
                      <span className="break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="flex-shrink-0 text-gray-400" />
                      <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.gender}</span>
                    </div>
                    {researcher.studentNumber && (
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="flex-shrink-0 text-gray-400" />
                        <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.studentNumber}</span>
                      </div>
                    )}
                    {researcher.yearLevel && (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="flex-shrink-0 text-gray-400" />
                        <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.yearLevel}</span>
                      </div>
                    )}
                    {researcher.section && (
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="flex-shrink-0 text-gray-400" />
                        <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.section}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Delete Button */}
                <button
                  onClick={handleDeleteClick}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold border border-red-100 flex-shrink-0 h-10"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <Trash2 size={16} />
                  Delete Researcher
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          <ResearcherStatsCards
            organization={researcher.organization}
            college={researcher.college}
            totalSubmissions={submissions.length}
          />
        </div>

        {/* Academic Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-start gap-4 transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
              <Building2 size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                University
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {researcher.university}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-start gap-4 transition-shadow hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
              <GraduationCap size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Degree Program
              </p>
              <p className="text-sm sm:text-base font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {researcher.degree}
              </p>
            </div>
          </div>
        </div>

        {/* Submissions Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Submission History
            </h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
              {submissions.length}
            </span>
          </div>

          <div className="p-0">
            <ResearcherSubmissionsTable
              submissions={submissions}
              onSubmissionClick={handleSubmissionClick}
            />
          </div>
        </div>

        {/* Mobile Delete Button */}
        <div className="lg:hidden mt-6">
          <button
            onClick={handleDeleteClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-bold border border-red-100"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <Trash2 size={18} />
            Delete Researcher
          </button>
        </div>
      </DashboardLayout>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transform transition-all scale-100">
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Delete Researcher
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Are you sure you want to delete <span className="font-bold text-gray-800">{researcher.name}</span>? This action cannot be undone and will remove all associated data.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 shadow-lg shadow-red-200"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ResearcherDetailsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Researcher Details" activeNav="researchers">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <ResearcherDetailsContent />
    </Suspense>
  );
}
