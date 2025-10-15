// components/admin/reviewers/ReviewerReviewsTable.tsx
'use client';

interface Review {
  id: string;
  title: string;
  dueDate?: string;
  completedDate?: string;
  status: string;
}

interface ReviewerReviewsTableProps {
  reviews: Review[];
  type: 'current' | 'history';
  onReviewClick: (id: string) => void;
}

export default function ReviewerReviewsTable({ reviews, type, onReviewClick }: ReviewerReviewsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Review Complete':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-sm sm:text-base text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          No reviews found
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Title
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {type === 'current' ? 'Due Date' : 'Completed Date'}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr
                key={review.id}
                onClick={() => onReviewClick(review.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-900 line-clamp-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {review.title}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {type === 'current' ? review.dueDate : review.completedDate}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(review.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {review.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            onClick={() => onReviewClick(review.id)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-3 mb-3">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-900 flex-1 line-clamp-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {review.title}
              </p>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {type === 'current' ? 'Due Date:' : 'Completed:'}
                </span>
                <span className="font-medium text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {type === 'current' ? review.dueDate : review.completedDate}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Status:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {review.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
