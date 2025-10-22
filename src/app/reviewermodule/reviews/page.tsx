// app/reviewermodule/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { Search, Filter } from 'lucide-react';
import { getReviewerAssignments } from '@/app/actions/reviewer/getReviewerAssignments';

interface Review {
  id: string;
  title: string;
  category: string;
  assignedDate: string;
  dueDate: string;
  status: 'Completed' | 'Overdue' | 'Pending';
}

export default function ReviewsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Submissions');
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const result = await getReviewerAssignments();
      
      if (result.success) {
        setReviews(result.assignments || []);
      } else {
        console.error('Failed to load assignments:', result.error);
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Expedited':
        return 'bg-blue-100 text-blue-800';
      case 'Full Review':
        return 'bg-amber-100 text-amber-800';
      case 'Exempt':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600';
      case 'Overdue':
        return 'text-red-600';
      case 'Pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActionButton = (status: string, id: string) => {
    if (status === 'Completed') {
      return (
        <button
          onClick={() => router.push(`/reviewermodule/reviews/details?id=${id}`)}
          className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          View Review
        </button>
      );
    }
    return (
      <button
        onClick={() => router.push(`/reviewermodule/reviews/details?id=${id}`)}
        className="px-4 py-2 bg-[#101C50] text-white text-xs font-semibold rounded-lg hover:bg-[#0d1640] transition-colors cursor-pointer"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Start Review
      </button>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All Submissions' || review.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="flex items-center justify-center pt-24 md:pt-28 lg:pt-32 pb-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50] mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading reviews...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            Reviews
          </h1>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#101C50] focus:outline-none text-[#101C50]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full md:w-auto pl-12 pr-8 py-3 border-2 border-gray-300 rounded-lg focus:border-[#101C50] focus:outline-none text-[#101C50] cursor-pointer appearance-none"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <option>All Submissions</option>
                  <option>Completed</option>
                  <option>Overdue</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews Table/List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="text-left px-6 py-4 text-xs font-bold w-[35%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                      TITLE
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-bold w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                      CATEGORY
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-bold w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                      ASSIGNED DATE
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-bold w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                      DUE DATE
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-bold w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                      STATUS
                    </th>
                    <th className="text-center px-4 py-4 text-xs font-bold w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {review.title}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(review.category)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {review.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {review.assignedDate}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {review.dueDate}
                      </td>
                      <td className={`px-4 py-4 text-center text-sm font-semibold ${getStatusColor(review.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {review.status}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          {getActionButton(review.status, review.id)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {review.title}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(review.category)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {review.category}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Assigned Date</p>
                      <p className="text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>{review.assignedDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>Due Date</p>
                      <p className="text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>{review.dueDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${getStatusColor(review.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {review.status}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    {getActionButton(review.status, review.id)}
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  No reviews found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
