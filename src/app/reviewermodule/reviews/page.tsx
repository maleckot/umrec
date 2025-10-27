// app/reviewermodule/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { Search, Filter, Calendar, Tag, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
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
        return 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200';
      case 'Full Review':
        return 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200';
      case 'Exempt':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600';
      case 'Overdue':
        return 'text-red-600';
      case 'Pending':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Overdue':
        return <XCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActionButton = (status: string, id: string) => {
    if (status === 'Completed') {
      return (
        <button
          onClick={() => router.push(`/reviewermodule/reviews/details?id=${id}`)}
          className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          View Review
        </button>
      );
    }
    return (
      <button
        onClick={() => router.push(`/reviewermodule/reviews/details?id=${id}`)}
        className="px-5 py-2.5 bg-gradient-to-r from-[#101C50] to-[#1a2d70] text-white text-xs font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
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

  // Statistics
  const stats = {
    total: reviews.length,
    completed: reviews.filter(r => r.status === 'Completed').length,
    pending: reviews.filter(r => r.status === 'Pending').length,
    overdue: reviews.filter(r => r.status === 'Overdue').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
        <NavbarRoles role="reviewer" />
        <div className="flex items-center justify-center pt-24 md:pt-28 lg:pt-32 pb-8">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#101C50]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#101C50] border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-700 text-lg font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading reviews...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] via-[#F0F4F8] to-[#E8EEF3]">
      <NavbarRoles role="reviewer" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pb-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Title with Modern Design */}
          <div className="mb-8 sm:mb-10 animate-fadeIn">
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#101C50] via-[#1a2d70] to-[#101C50] bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              My Reviews
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full"></div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8">
            {/* Total Reviews */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Total
                </p>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#101C50] to-[#1a2d70] rounded-xl flex items-center justify-center">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stats.total}
              </p>
            </div>

            {/* Completed */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-green-100/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Completed
                </p>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stats.completed}
              </p>
            </div>

            {/* Pending */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-amber-100/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Pending
                </p>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stats.pending}
              </p>
            </div>

            {/* Overdue */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border border-red-100/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Overdue
                </p>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {stats.overdue}
              </p>
            </div>
          </div>

          {/* Search and Filter Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 shadow-xl mb-8 border border-gray-100/50">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              {/* Search Input */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#101C50] transition-colors" />
                <input
                  type="text"
                  placeholder="Search by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/10 focus:outline-none text-[#101C50] text-sm sm:text-base transition-all shadow-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative group sm:w-64">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#101C50] transition-colors pointer-events-none" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 sm:py-4 border-2 border-gray-200 rounded-2xl focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/10 focus:outline-none text-[#101C50] font-semibold text-sm sm:text-base cursor-pointer appearance-none bg-white transition-all shadow-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <option>All Submissions</option>
                  <option>Completed</option>
                  <option>Overdue</option>
                  <option>Pending</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Filter Indicator */}
            {(searchQuery || filterStatus !== 'All Submissions') && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Active filters:
                </span>
                {searchQuery && (
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:bg-blue-200 rounded-full p-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {filterStatus !== 'All Submissions' && (
                  <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Status: {filterStatus}
                    <button onClick={() => setFilterStatus('All Submissions')} className="hover:bg-amber-200 rounded-full p-0.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Reviews Table/List */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100/50">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b-2 border-gray-200">
                    <th className="text-left px-6 py-5 text-xs font-extrabold uppercase tracking-wider w-[35%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>
                      Research Title
                    </th>
                    <th className="text-center px-4 py-5 text-xs font-extrabold uppercase tracking-wider w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>
                      Category
                    </th>
                    <th className="text-center px-4 py-5 text-xs font-extrabold uppercase tracking-wider w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>
                      Assigned
                    </th>
                    <th className="text-center px-4 py-5 text-xs font-extrabold uppercase tracking-wider w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>
                      Due Date
                    </th>
                    <th className="text-center px-4 py-5 text-xs font-extrabold uppercase tracking-wider w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>
                      Status
                    </th>
                    <th className="text-center px-4 py-5 text-xs font-extrabold uppercase tracking-wider w-[13%]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50', letterSpacing: '0.5px' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review, index) => (
                    <tr 
                      key={review.id} 
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent transition-all duration-200 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-5">
                        <p className="text-sm font-semibold text-gray-800 leading-relaxed group-hover:text-[#101C50] transition-colors" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {review.title}
                        </p>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex justify-center">
                          <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${getCategoryColor(review.category)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {review.category}
                          </span>
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
                          {getActionButton(review.status, review.id)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 sm:p-6 space-y-4 sm:space-y-5">
              {filteredReviews.map((review, index) => (
                <div 
                  key={review.id} 
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl border border-gray-200/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Research Title
                      </p>
                      <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {review.title}
                      </p>
                    </div>

                    {/* Category Badge */}
                    <div>
                      <span className={`inline-flex px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${getCategoryColor(review.category)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {review.category}
                      </span>
                    </div>

                    {/* Dates Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-white/80 rounded-xl p-3 border border-gray-200/50">
                        <p className="text-xs text-gray-500 mb-1.5 font-bold uppercase tracking-wider flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <Calendar className="w-3.5 h-3.5" />
                          Assigned
                        </p>
                        <p className="text-sm text-gray-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {review.assignedDate}
                        </p>
                      </div>
                      <div className="bg-white/80 rounded-xl p-3 border border-gray-200/50">
                        <p className="text-xs text-gray-500 mb-1.5 font-bold uppercase tracking-wider flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          <AlertCircle className="w-3.5 h-3.5" />
                          Due Date
                        </p>
                        <p className="text-sm text-gray-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {review.dueDate}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="pt-2">
                      <span className={`inline-flex items-center gap-2 text-sm font-bold ${getStatusColor(review.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {getStatusIcon(review.status)}
                        {review.status}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <div className="w-full">
                        {getActionButton(review.status, review.id)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredReviews.length === 0 && (
              <div className="text-center py-16 sm:py-20 px-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Search className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  No Reviews Found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {searchQuery || filterStatus !== 'All Submissions' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'You have no review assignments at this time'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Results Summary */}
          {filteredReviews.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Showing <span className="font-bold text-[#101C50]">{filteredReviews.length}</span> of <span className="font-bold text-[#101C50]">{reviews.length}</span> review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
