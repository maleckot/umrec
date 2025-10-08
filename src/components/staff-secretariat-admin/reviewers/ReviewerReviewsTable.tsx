// components/staff-secretariat-admin/reviewers/ReviewerReviewsTable.tsx
'use client';

import { FileText } from 'lucide-react';

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
  onReviewClick: (reviewId: string) => void;
}

export default function ReviewerReviewsTable({ reviews, type, onReviewClick }: ReviewerReviewsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'text-purple-700 bg-purple-50';
      case 'Overdue':
        return 'text-red-700 bg-red-50';
      case 'Review Complete':
        return 'text-green-700 bg-green-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Title
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {type === 'current' ? 'Due Date' : 'Completed Date'}
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center">
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    No {type === 'current' ? 'current reviews' : 'review history'} found.
                  </p>
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr
                  key={review.id}
                  onClick={() => onReviewClick(review.id)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <FileText size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-900 line-clamp-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {review.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {type === 'current' ? review.dueDate : review.completedDate}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(review.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {review.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {reviews.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              No {type === 'current' ? 'current reviews' : 'review history'} found.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              onClick={() => onReviewClick(review.id)}
              className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-blue-500 cursor-pointer transition-all"
            >
              <div className="flex items-start gap-2 mb-2">
                <FileText size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-900 line-clamp-2 flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {review.title}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {type === 'current' ? 'Due Date' : 'Completed'}
                  </p>
                  <p className="text-xs font-semibold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {type === 'current' ? review.dueDate : review.completedDate}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(review.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {review.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
