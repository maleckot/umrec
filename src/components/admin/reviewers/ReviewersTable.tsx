// components/admin/reviewers/ReviewersTable.tsx
'use client';

interface Reviewer {
  id: string;
  name: string;
  availability: string;
  reviewStatus: string;
  activeReviews: number | string;
}

interface ReviewersTableProps {
  reviewers: Reviewer[];
  onRowClick: (reviewer: Reviewer) => void;
}

export default function ReviewersTable({ reviewers, onRowClick }: ReviewersTableProps) {
  if (reviewers.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-sm sm:text-base text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          No reviewers found
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#101C50] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Reviewer
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Availability
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Review Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Active Reviews
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviewers.map((reviewer) => (
              <tr
                key={reviewer.id}
                onClick={() => onRowClick(reviewer)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {reviewer.name}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {reviewer.availability}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {reviewer.reviewStatus}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {reviewer.activeReviews}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {reviewers.map((reviewer) => (
          <div
            key={reviewer.id}
            onClick={() => onRowClick(reviewer)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {reviewer.name}
              </h3>
              <span className="ml-2 px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full whitespace-nowrap" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {reviewer.activeReviews} Reviews
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Availability:</span>
                <span className="font-medium text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.availability}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Status:</span>
                <span className="font-medium text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.reviewStatus}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
