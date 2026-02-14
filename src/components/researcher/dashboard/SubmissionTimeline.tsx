'use client';
import { useState } from 'react';
import { Submission } from '@/types/researcher';

// Helper for timeline logic
const getTimelineStage = (status: string) => {
  const normalizedStatus = status?.toLowerCase().replace(/ /g, '_');
  switch (normalizedStatus) {
    case 'pending': case 'needs_revision': return 1;
    case 'under_classification': return 2;
    case 'classified': case 'reviewer_assignment': return 3;
    case 'under_review': case 'in_review': return 4;
    case 'under_revision': return 5;
    case 'completed': case 'approved': return 6;
    case 'review_complete': return 7;
    default: return 1;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
};

export default function SubmissionTimeline({ submissions }: { submissions: Submission[] }) {
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(0);
  const activeSubmissions = submissions.filter(s => getTimelineStage(s.status) < 8);

  if (activeSubmissions.length === 0) {
    return (
      <div className="mb-8 sm:mb-12">
         <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            <span className="w-1 h-6 sm:h-7 md:h-8 bg-gradient-to-b from-[#101C50] to-[#F0E847] rounded-full"></span>
            Current Submission Status
         </h2>
         <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm sm:text-base text-gray-500 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>No active submissions</p>
         </div>
      </div>
    );
  }

  const selectedSubmission = activeSubmissions[selectedSubmissionIndex];
  const stage = getTimelineStage(selectedSubmission.status);

  return (
    <div className="mb-8 sm:mb-12">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 md:mb-8 flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
        <span className="w-1 h-6 sm:h-7 md:h-8 bg-gradient-to-b from-[#101C50] to-[#F0E847] rounded-full"></span>
        Current Submission Status
      </h2>

      {/* Tab Selector for Multiple Submissions */}
      {activeSubmissions.length > 1 && (
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
      )}

      {/* Timeline Visuals */}
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
         {/* 1. Document Verification */}
         <TimelineItem 
            active={stage >= 1} 
            current={stage === 1} 
            iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            title="Document Verification"
            description={stage === 1 ? 'Checking submitted documents' : 'Documents verified'}
            date={stage >= 1 ? selectedSubmission.submitted_at : undefined}
         />

         {/* 2. Initial Screening */}
         <TimelineItem 
            active={stage >= 2} 
            current={stage === 2} 
            iconPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            title="Initial Screening"
            description={stage === 2 ? 'Classifying research paper' : stage > 2 ? 'Classification complete' : 'Awaiting verification'}
         />

         {/* 3. Ethics Review */}
         <TimelineItem 
            active={stage >= 4} // Note: Original logic had specific conditions here for active state
            current={[2, 3].includes(stage)} // Logic from original paste.txt for pulsing state
            customActiveLogic={stage >= 3} // Text color logic from paste.txt
            iconPath="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            title="Ethics Review"
            description={stage === 3 ? 'Waiting for reviewer assignment' : stage === 4 ? 'Under review by ethics committee' : stage > 4 ? 'Review complete' : 'Awaiting classification'}
         />

         {/* 4. Revisions */}
         <TimelineItem 
            active={stage >= 5} 
            current={stage === 4}
            iconPath="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            title="Revisions"
            description={stage === 5 ? 'Revising submission based on feedback' : stage > 5 ? 'Revisions completed' : 'Awaiting review completion'}
         />

         {/* 5. Final Approval */}
         <TimelineItem 
            active={stage === 7} 
            current={stage === 6}
            iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            title="Final Approval"
            description={stage === 7 ? 'Certificate of approval issued' : stage === 6 ? 'Awaiting final approval' : 'Awaiting review completion'}
            isLast={true}
            isSuccess={stage === 7}
         />
      </div>
    </div>
  );
}

// Internal Component for Timeline Item
const TimelineItem = ({ active, current, iconPath, title, description, date, isLast, isSuccess, customActiveLogic }: any) => {
   // Use custom logic if provided, otherwise default to 'active' prop
   const isTextActive = customActiveLogic !== undefined ? customActiveLogic : active;
   
   return (
    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
      <div className="relative">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative z-10 shadow-lg transition-all duration-300 ${
            isSuccess ? 'bg-gradient-to-br from-green-500 to-green-600' :
            active ? 'bg-gradient-to-br from-[#101C50] to-[#1a2d6e]' : 
            current ? 'border-2 border-[#101C50] bg-white animate-pulse' : 
            'border-2 border-gray-300 bg-white'
        }`}>
          <svg className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
              isSuccess ? 'text-white' :
              active ? 'text-white' : 
              current ? 'text-[#101C50]' : 
              'text-gray-400'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
        </div>
        {!isLast && <div className="absolute top-8 sm:top-10 md:top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-10 sm:h-12 md:h-16 bg-gray-300"></div>}
      </div>
      <div className="flex-1 pt-1 sm:pt-1.5 md:pt-2">
        <h3 className={`font-bold text-sm sm:text-base md:text-lg ${
            isSuccess ? 'text-green-600' :
            isTextActive ? 'text-[#101C50]' : 'text-gray-400'
        }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {title}
        </h3>
        <p className={`text-xs sm:text-sm md:text-base ${
            isTextActive ? 'text-gray-600' : 'text-gray-400'
        }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {description}
        </p>
        {date && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {formatDate(date)}
            </p>
        )}
      </div>
    </div>
   );
};
