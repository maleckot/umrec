// components/staff-secretariat-admin/reviewers/ReviewerStatsCards.tsx
'use client';

interface ReviewerStatsCardsProps {
  availability: string;
  reviewStatus: string;
  activeReviews: number;
}

export default function ReviewerStatsCards({
  availability,
  reviewStatus,
  activeReviews,
}: ReviewerStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {/* Availability Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <p className="text-xs sm:text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Availability
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {availability}
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <p className="text-xs sm:text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Status
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {reviewStatus}
        </p>
      </div>

      {/* Active Reviews Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
        <p className="text-xs sm:text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Active Reviews
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {activeReviews}
        </p>
      </div>
    </div>
  );
}
