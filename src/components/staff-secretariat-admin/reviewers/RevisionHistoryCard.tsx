// components/staff-secretariat-admin/reviewers/RevisionHistoryCard.tsx
'use client';

import { History, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import ReviewerAssessmentCard from './ReviewerAssessmentCard';

interface Revision {
  id: number;
  versionNumber: number;
  submittedDate: string;
  reviewedDate: string;
  decision: string;
  ethicsReviewRecommendation: string;
  technicalSuggestions: string;
}

interface RevisionHistoryCardProps {
  revisionHistory: Revision[];
  reviewerName: string;
}

export default function RevisionHistoryCard({
  revisionHistory,
  reviewerName,
}: RevisionHistoryCardProps) {
  const [expandedVersions, setExpandedVersions] = useState<number[]>([]);

  const toggleVersion = (versionId: number) => {
    setExpandedVersions(prev =>
      prev.includes(versionId)
        ? prev.filter(id => id !== versionId)
        : [...prev, versionId]
    );
  };

  // Sort by version number descending (most recent first)
  const sortedHistory = [...revisionHistory].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-amber-500 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <History size={20} className="text-white flex-shrink-0 sm:w-6 sm:h-6" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Revision History
            </h3>
            <p className="text-xs sm:text-sm text-white/90" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {sortedHistory.length} version{sortedHistory.length !== 1 ? 's' : ''} of this submission
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          {sortedHistory.map((revision, index) => {
            const isExpanded = expandedVersions.includes(revision.id);
            const isLatest = index === 0;

            return (
              <div key={revision.id} className="relative">
                {/* Timeline Line */}
                {index !== sortedHistory.length - 1 && (
                  <div className="absolute left-4 sm:left-6 top-12 sm:top-14 bottom-0 w-0.5 bg-gray-300"></div>
                )}

                {/* Version Card */}
                <div className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-3 sm:top-4 w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                    isLatest ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    <span className="text-white text-xs sm:text-sm font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      V{revision.versionNumber}
                    </span>
                  </div>

                  {/* Version Details */}
                  <div className="ml-10 sm:ml-16">
                    <div
                      onClick={() => toggleVersion(revision.id)}
                      className="bg-gray-50 rounded-lg p-3 sm:p-4 border-2 border-gray-200 hover:border-blue-500 cursor-pointer transition-all"
                    >
                      <div className="flex items-start sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Version Title */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <h4 className="text-sm sm:text-base font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              Version {revision.versionNumber}
                            </h4>
                            {isLatest && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded whitespace-nowrap">
                                Current
                              </span>
                            )}
                          </div>

                          {/* Dates */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                            <div className="truncate">
                              <span className="font-semibold">Submitted:</span> {revision.submittedDate}
                            </div>
                            <div className="truncate">
                              <span className="font-semibold">Reviewed:</span> {revision.reviewedDate}
                            </div>
                          </div>

                          {/* Decision Badge */}
                          <div className="mt-2">
                            <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                              revision.decision === 'Approved with No Revision' ? 'bg-green-100 text-green-800' :
                              revision.decision === 'Approved with Minor Revision/s' ? 'bg-blue-100 text-blue-800' :
                              revision.decision === 'Major Revision/s' ? 'bg-yellow-100 text-yellow-800' :
                              revision.decision === 'Resubmission Required' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {revision.decision}
                            </span>
                          </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                          ) : (
                            <ChevronDown size={18} className="text-gray-600 sm:w-5 sm:h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Assessment Details */}
                    {isExpanded && (
                      <div className="mt-4">
                        <ReviewerAssessmentCard
                          reviewerName={reviewerName}
                          reviewerCode="201"
                          status="Complete"
                          submittedDate={revision.reviewedDate}
                          decision={revision.decision}
                          ethicsReviewRecommendation={revision.ethicsReviewRecommendation}
                          technicalSuggestions={revision.technicalSuggestions}
                          isCurrentVersion={false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
