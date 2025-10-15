// components/admin/reviewers/ReviewerStatsCards.tsx
'use client';

interface ReviewerStatsCardsProps {
  availability: string;
  status: string;
  activeReviews: number;
}

export default function ReviewerStatsCards({ availability, status, activeReviews }: ReviewerStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {/* Availability */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Availability
        </p>
        <p className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {availability}
        </p>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Status
        </p>
        <p className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {status}
        </p>
      </div>

      {/* Active Reviews */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Active Reviews
        </p>
        <p className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {activeReviews}
        </p>
      </div>
    </div>
  );
}
