'use client';

import { FileText, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Under Review':
        return { color: 'text-purple-700 bg-purple-50 ring-1 ring-purple-100', icon: Clock };
      case 'Overdue':
        return { color: 'text-red-700 bg-red-50 ring-1 ring-red-100', icon: AlertCircle };
      case 'Review Complete':
        return { color: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100', icon: CheckCircle2 };
      default:
        return { color: 'text-gray-700 bg-gray-100 ring-1 ring-gray-200', icon: FileText };
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block w-full overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="py-4 pl-8 pr-4 font-bold text-xs text-gray-500 uppercase tracking-widest">
                Document Title
              </th>
              <th className="py-4 px-4 font-bold text-xs text-gray-500 uppercase tracking-widest w-48 text-center">
                {type === 'current' ? 'Due Date' : 'Completed'}
              </th>
              <th className="py-4 px-4 font-bold text-xs text-gray-500 uppercase tracking-widest w-40 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 text-center">
                   <div className="flex flex-col items-center justify-center opacity-50">
                     <FileText size={48} className="text-gray-300 mb-2" />
                     <p className="text-sm font-medium text-gray-500">No records found</p>
                   </div>
                </td>
              </tr>
            ) : (
              reviews.map((review) => {
                const status = getStatusConfig(review.status);
                const StatusIcon = status.icon;
                
                return (
                  <tr
                    key={review.id}
                    onClick={() => onReviewClick(review.id)}
                    className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    <td className="py-5 pl-8 pr-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <FileText size={16} />
                        </div>
                        <div>
                          {/* Title: Larger, Darker, Bolder */}
                          <p className="font-bold text-[#101C50] text-sm md:text-base leading-snug group-hover:text-blue-700 transition-colors mb-0.5">
                            {review.title}
                          </p>
                          {/* ID: Clean, no background, smaller text */}
                          <p className="text-xs text-gray-400 font-mono">
                            ID: {review.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {type === 'current' ? review.dueDate : review.completedDate}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${status.color}`}>
                        <StatusIcon size={12} />
                        {review.status}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Clean Cards */}
      <div className="md:hidden p-4 space-y-3 bg-gray-50/50">
        {reviews.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-gray-200 border-dashed">
             <p className="text-sm font-medium text-gray-400">No records found</p>
          </div>
        ) : (
          reviews.map((review) => {
            const status = getStatusConfig(review.status);
            return (
              <div
                key={review.id}
                onClick={() => onReviewClick(review.id)}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#101C50] leading-snug mb-0.5">
                      {review.title}
                    </p>
                    <p className="text-[11px] text-gray-400 font-mono">
                      ID: {review.id}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      {type === 'current' ? 'Due' : 'Finished'}
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {type === 'current' ? review.dueDate : review.completedDate}
                    </span>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${status.color}`}>
                    {review.status}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
