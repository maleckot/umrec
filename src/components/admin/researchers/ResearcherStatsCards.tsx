// components/admin/researchers/ResearcherStatsCards.tsx
'use client';

interface ResearcherStatsCardsProps {
  organization: string;
  progress: string;
  college: string;
}

export default function ResearcherStatsCards({ organization, progress, college }: ResearcherStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {/* Organization */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Organization
        </p>
        <p className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {organization}
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Progress
        </p>
        <p className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {progress}
        </p>
      </div>

      {/* College */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          College
        </p>
        <p className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {college}
        </p>
      </div>
    </div>
  );
}
