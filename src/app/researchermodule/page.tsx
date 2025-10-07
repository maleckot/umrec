'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ADD THIS IMPORT

export default function ResearcherDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter(); // ADD THIS LINE

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#DAE0E7' }}>
      <NavbarRoles role="researcher" />
      
      {/* Added margin-top for navbar spacing */}
      <div className="flex-grow py-8 px-6 md:px-12 lg:px-20 mt-24">
        <div className="max-w-7xl mx-auto">
          {/* Added Researcher Dashboard title */}
          <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            Researcher Dashboard
          </h1>

          {/* Dashboard Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-[#101C50]">
            
            {/* Stats Overview - Increased text sizes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Active Submissions */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#101C50] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Active Submissions</p>
                  <p className="text-4xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>1</p>
                </div>
              </div>

              {/* Pending Review */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#101C50] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Pending Review</p>
                  <p className="text-4xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>1</p>
                </div>
              </div>

              {/* Requires Revision */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#101C50] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-gray-600 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Requires Revision</p>
                  <p className="text-4xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>0</p>
                </div>
              </div>
            </div>

            <hr className="my-8 border-gray-300" />

            {/* Current Submission Status - Increased text sizes */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                Current Submission Status
              </h2>

              <div className="relative">
                {/* Timeline */}
                <div className="space-y-8">
                  {/* Document Verification - Active */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[#101C50] flex items-center justify-center relative z-10">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-bold text-lg text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Document Verification</h3>
                      <p className="text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Checking submitted documents</p>
                      <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>July 8, 2025</p>
                    </div>
                  </div>

                  {/* Initial Screening - Active */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[#101C50] flex items-center justify-center relative z-10">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-bold text-lg text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Initial Screening</h3>
                      <p className="text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Classifying research paper</p>
                      <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>July 11, 2025</p>
                    </div>
                  </div>

                  {/* Ethics Review - Active */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[#101C50] flex items-center justify-center relative z-10">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-bold text-lg text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Ethics Review</h3>
                      <p className="text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Under review by ethics committee</p>
                      <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>July 24, 2025</p>
                    </div>
                  </div>

                  {/* Revisions - Inactive */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center relative z-10">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-300"></div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-bold text-lg text-gray-400" style={{ fontFamily: 'Metropolis, sans-serif' }}>Revisions</h3>
                      <p className="text-base text-gray-400" style={{ fontFamily: 'Metropolis, sans-serif' }}>Awaiting review completion</p>
                    </div>
                  </div>

                  {/* Final Approval - Inactive */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center relative z-10">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-bold text-lg text-gray-400" style={{ fontFamily: 'Metropolis, sans-serif' }}>Final Approval</h3>
                      <p className="text-base text-gray-400" style={{ fontFamily: 'Metropolis, sans-serif' }}>Certificate of approval issuance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-8 border-gray-300" />

            {/* Recent Activity - Improved Responsiveness */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                Recent Activity
              </h2>

              {/* Tabs - Responsive overflow handling */}
              <div className="flex gap-2 md:gap-4 mb-6 border-b border-gray-300 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'all'
                      ? 'border-b-2 border-[#101C50] text-[#101C50]'
                      : 'text-gray-600 hover:text-[#101C50]'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  All Activities
                </button>
                <button
                  onClick={() => setActiveTab('revision')}
                  className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'revision'
                      ? 'border-b-2 border-[#101C50] text-[#101C50]'
                      : 'text-gray-600 hover:text-[#101C50]'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Needs Revision
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'pending'
                      ? 'border-b-2 border-[#101C50] text-[#101C50]'
                      : 'text-gray-600 hover:text-[#101C50]'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'approved'
                      ? 'border-b-2 border-[#101C50] text-[#101C50]'
                      : 'text-gray-600 hover:text-[#101C50]'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Approved
                </button>
              </div>

{/* Activity List - With Cursor Pointer */}
<div className="space-y-4">
  {/* Activity Item 1 */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
      <div className="w-10 h-10 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm sm:text-base text-[#101C50] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Title of the project</h4>
        <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Your research paper has been received and is under initial review</p>
      </div>
    </div>
    <button 
      onClick={() => router.push('/researchermodule/activity-details?id=1')}
      className="px-6 sm:px-8 py-2.5 w-full sm:w-[120px] bg-[#101C50] text-white text-sm sm:text-base rounded-full hover:bg-[#0d1640] transition-colors cursor-pointer" 
      style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
    >
      View
    </button>
  </div>

  {/* Activity Item 2 */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
      <div className="w-10 h-10 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm sm:text-base text-[#101C50] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Title of the project</h4>
        <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Your research paper has been received and is under initial review</p>
      </div>
    </div>
    <button 
      onClick={() => router.push('/researchermodule/activity-details?id=2')}
      className="px-6 sm:px-8 py-2.5 w-full sm:w-[120px] bg-[#101C50] text-white text-sm sm:text-base rounded-full hover:bg-[#0d1640] transition-colors cursor-pointer" 
      style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
    >
      View
    </button>
  </div>

  {/* Activity Item 3 - Revision */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
      <div className="w-10 h-10 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm sm:text-base text-[#101C50] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Application Form Ethics Review</h4>
        <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Ethics committee has requested minor revisions</p>
      </div>
    </div>
    <button 
      onClick={() => router.push('/researchermodule/activity-details?id=3')}
      className="px-6 sm:px-8 py-2.5 w-full sm:w-[120px] bg-[#8B0000] text-white text-sm sm:text-base rounded-full hover:bg-[#6b0000] transition-colors cursor-pointer" 
      style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
    >
      Revise
    </button>
  </div>

  {/* Activity Item 4 - Revision */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
      <div className="w-10 h-10 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm sm:text-base text-[#101C50] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Informed Consent Form</h4>
        <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Ethics committee has requested minor revisions</p>
      </div>
    </div>
    <button 
      onClick={() => router.push('/researchermodule/activity-details?id=4')}
      className="px-6 sm:px-8 py-2.5 w-full sm:w-[120px] bg-[#8B0000] text-white text-sm sm:text-base rounded-full hover:bg-[#6b0000] transition-colors cursor-pointer" 
      style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
    >
      Revise
    </button>
  </div>

  {/* Activity Item 5 */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
      <div className="w-10 h-10 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm sm:text-base text-[#101C50] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Title of the project</h4>
        <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Your research paper has been approved</p>
      </div>
    </div>
    <button 
      onClick={() => router.push('/researchermodule/activity-details?id=5')}
      className="px-6 sm:px-8 py-2.5 w-full sm:w-[120px] bg-[#101C50] text-white text-sm sm:text-base rounded-full hover:bg-[#0d1640] transition-colors cursor-pointer" 
      style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
    >
      View
    </button>
  </div>
</div>


            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
