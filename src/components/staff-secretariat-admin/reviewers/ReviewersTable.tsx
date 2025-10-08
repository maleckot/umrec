// components/staff-secretariat-admin/reviewers/ReviewersTable.tsx
'use client';

interface Reviewer {
  id: number;
  code: string;
  name: string;
  availability: string;
  reviewStatus: string;
  activeReviews: number;
  overdueReviews: number;
}

interface ReviewersTableProps {
  reviewers: Reviewer[];
  onRowClick: (reviewer: Reviewer) => void;
}

export default function ReviewersTable({ reviewers, onRowClick }: ReviewersTableProps) {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'text-green-700';
      case 'Busy':
        return 'text-amber-700';
      case 'Unavailable':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#101C50] text-white">
              <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Reviewer
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Code
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Availability
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Review Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Active Reviews
              </th>
            </tr>
          </thead>
          <tbody>
            {reviewers.map((reviewer) => (
              <tr
                key={reviewer.id}
                onClick={() => onRowClick(reviewer)}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {reviewer.name}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {reviewer.code}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className={`text-sm font-semibold ${getAvailabilityColor(reviewer.availability)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {reviewer.availability}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {reviewer.reviewStatus}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="text-sm font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {reviewer.activeReviews}
                    {reviewer.overdueReviews > 0 && (
                      <span className="text-red-600"> ({reviewer.overdueReviews} overdue)</span>
                    )}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {reviewers.map((reviewer) => (
          <div
            key={reviewer.id}
            onClick={() => onRowClick(reviewer)}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {reviewer.name}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Code: <span className="font-semibold text-gray-900">{reviewer.code}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Availability
                </p>
                <p className={`text-sm font-semibold ${getAvailabilityColor(reviewer.availability)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {reviewer.availability}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Status
                </p>
                <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {reviewer.reviewStatus}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Active Reviews
                </p>
                <p className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {reviewer.activeReviews}
                  {reviewer.overdueReviews > 0 && (
                    <span className="text-xs text-red-600 ml-1">({reviewer.overdueReviews} overdue)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
