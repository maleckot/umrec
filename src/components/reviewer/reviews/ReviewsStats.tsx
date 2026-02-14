'use client';

import { Tag, CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
}

const ReviewsStats = ({ stats }: StatsProps) => {
  return (
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
  );
};

export default ReviewsStats;
