'use client';

import { Calendar, AlertCircle, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Review } from '@/app/reviewermodule/reviews/ReviewsPageContent';

interface ReviewsListProps {
  reviews: Review[];
  totalReviews: number;
  onAction: (id: string) => void;
  searchActive: boolean;
}

const ReviewsList = ({ reviews, totalReviews, onAction, searchActive }: ReviewsListProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Expedited': return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200';
      case 'Full Review': return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200';
      case 'Exempt': return 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600';
      case 'Overdue': return 'text-red-600';
      case 'Pending': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Overdue': return <XCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100/50">
        
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b-2 border-gray-200">
                <th className="text-left px-6 py-5 text-xs font-extrabold uppercase tracking-wider w-[35%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>Research Title</th>
                <th className="text-center px-4 py-5 text-xs font-extrabold uppercase tracking-wider w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>Category</th>
                <th className="text-center px-4 py-5 text-xs font-extrabold uppercase tracking-wider w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>Assigned</th>
                <th className="text-center px-4 py-5 text-xs font-extrabold uppercase tracking-wider w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>Due Date</th>
                <th className="text-center px-4 py-5 text-xs font-extrabold uppercase tracking-wider w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>Status</th>
                <th className="text-center px-4 py-5 text-xs font-extrabold uppercase tracking-wider w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={review.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent transition-all duration-200 group" style={{ animationDelay: `${index * 50}ms` }}>
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-gray-800 leading-relaxed group-hover:text-[#101C50] transition-colors" style={{ fontFamily: 'Metropolis, sans-serif' }}>{review.title}</p>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex justify-center">
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${getCategoryColor(review.category)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>{review.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <p className="text-sm text-gray-700 font-medium flex items-center justify-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {review.assignedDate}
                    </p>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <p className="text-sm text-gray-700 font-medium flex items-center justify-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      {review.dueDate}
                    </p>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-1.5 text-sm font-bold ${getStatusColor(review.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {getStatusIcon(review.status)}
                        {review.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onAction(review.id)}
                        className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all ${
                          review.status === 'Completed' ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-[#101C50] to-[#1a2d70]'
                        }`}
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        {review.status === 'Completed' ? 'View Review' : 'Start Review'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden p-4 sm:p-6 space-y-4 sm:space-y-5">
          {reviews.map((review, index) => (
            <div key={review.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl border border-gray-200/50 transition-all duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>Research Title</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>{review.title}</p>
                </div>
                <div>
                  <span className={`inline-flex px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${getCategoryColor(review.category)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>{review.category}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/80 rounded-xl p-3 border border-gray-200/50">
                    <p className="text-xs text-gray-500 mb-1.5 font-bold uppercase tracking-wider flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      <Calendar className="w-3.5 h-3.5" /> Assigned
                    </p>
                    <p className="text-sm text-gray-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>{review.assignedDate}</p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-3 border border-gray-200/50">
                    <p className="text-xs text-gray-500 mb-1.5 font-bold uppercase tracking-wider flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      <AlertCircle className="w-3.5 h-3.5" /> Due Date
                    </p>
                    <p className="text-sm text-gray-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>{review.dueDate}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <span className={`inline-flex items-center gap-2 text-sm font-bold ${getStatusColor(review.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {getStatusIcon(review.status)}
                    {review.status}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="w-full">
                    <button
                        onClick={() => onAction(review.id)}
                        className={`w-full px-5 py-2.5 text-white text-xs font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all ${
                          review.status === 'Completed' ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-[#101C50] to-[#1a2d70]'
                        }`}
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        {review.status === 'Completed' ? 'View Review' : 'Start Review'}
                      </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {reviews.length === 0 && (
          <div className="text-center py-16 sm:py-20 px-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>No Reviews Found</h3>
            <p className="text-gray-500 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {searchActive
                ? 'Try adjusting your search or filter criteria'
                : 'You have no review assignments at this time'
              }
            </p>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {reviews.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Showing <span className="font-bold text-[#101C50]">{reviews.length}</span> of <span className="font-bold text-[#101C50]">{totalReviews}</span> review{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </>
  );
};

export default ReviewsList;
