// app/adminmodule/researchers/details/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, Building2, GraduationCap, Calendar, BookOpen } from 'lucide-react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import ResearcherStatsCards from '@/components/admin/researchers/ResearcherStatsCards';
import ResearcherSubmissionsTable from '@/components/admin/researchers/ResearcherSubmissionsTable';

export default function ResearcherDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const researcherId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [researcherData, setResearcherData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (researcherId) {
      loadResearcherDetails();
    }
  }, [researcherId]);

  const loadResearcherDetails = async () => {
    setLoading(true);
    // TODO: Replace with actual API call
    const mockData = {
      researcher: {
        id: researcherId,
        name: 'Jeon Wonwoo',
        phone: '09994455353',
        email: 'email123@umak.edu.ph',
        gender: 'Male',
        studentNumber: '2021-1234567',
        yearLevel: '4th Year',
        section: 'CS-4A',
        university: 'University of Makati',
        degree: 'Bachelor of Science in Computer Science',
        coAuthors: 'Kim Mingyu, Junhui Wen, Minghao Xu',
        organization: 'External',
        progress: 'New Submission',
        college: 'CCIS'
      },
      submissions: [
        {
          id: '1',
          title: 'UMREConnect: An AI-Powered Web Application for Document Management Using Classification Algorithms',
          submittedDate: '2 hours ago',
          status: 'New Submission'
        }
      ]
    };
    
    setResearcherData(mockData);
    setLoading(false);
  };

  const handleSubmissionClick = (id: string) => {
    router.push(`/adminmodule/submissions/details?id=${id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: API call to delete researcher
    console.log('Deleting researcher:', researcherId);
    setShowDeleteModal(false);
    router.push('/adminmodule/researchers');
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
            <span>Researcher</span>
          </button>
        </div>

        {/* Researcher Header */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#101C50] flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-white sm:w-10 sm:h-10" />
            </div>
            <div className="flex-1 min-w-0 w-full">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {researcher.name}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="flex-shrink-0" />
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="flex-shrink-0" />
                  <span className="break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="flex-shrink-0" />
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.gender}</span>
                </div>
                {researcher.studentNumber && (
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} className="flex-shrink-0" />
                    <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.studentNumber}</span>
                  </div>
                )}
                {researcher.yearLevel && (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="flex-shrink-0" />
                    <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.yearLevel}</span>
                  </div>
                )}
                {researcher.section && (
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="flex-shrink-0" />
                    <span style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.section}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <ResearcherStatsCards
          organization={researcher.organization}
          progress={researcher.progress}
          college={researcher.college}
        />

        {/* University & Degree Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <Building2 size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  University
                </p>
                <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {researcher.university}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <GraduationCap size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Degree
                </p>
                <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {researcher.degree}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Co-Authors */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Co-Authors
          </p>
          <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {researcher.coAuthors}
          </p>
        </div>

        {/* Submission Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Submission Details
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            <ResearcherSubmissionsTable
              submissions={submissions}
              onSubmissionClick={handleSubmissionClick}
            />
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
            Delete Researcher
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
                Delete Researcher
              </h3>
              <p className="text-sm text-gray-600 text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Are you sure you want to delete <strong>{researcher.name}</strong>? This action cannot be undone and will permanently remove all associated data.
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
    </>
  );
}
