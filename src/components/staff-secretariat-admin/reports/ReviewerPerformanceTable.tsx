// components/staff-secretariat-admin/reports/ReviewerPerformanceTable.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Reviewer {
  id: string;
  name: string;
  code: string;
  activeReviews: number;
  completedReviews: number;
  overdue: number;
  avgReviewTime: string;
  status: 'active' | 'overdue';
}

interface ReviewerPerformanceTableProps {
  reviewers: Reviewer[];
}

type SortOption = 'mostActive' | 'hasOverdue' | 'fastest' | 'slowest';

export default function ReviewerPerformanceTable({ reviewers }: ReviewerPerformanceTableProps) {
  const [sortBy, setSortBy] = useState<SortOption>('mostActive');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortOptions = [
    { value: 'mostActive' as const, label: 'Most Active' },
    { value: 'hasOverdue' as const, label: 'Has Overdue' },
    { value: 'fastest' as const, label: 'Fastest Reviewer' },
    { value: 'slowest' as const, label: 'Slowest Reviewer' }
  ];

  const parseTime = (time: string) => parseFloat(time.replace(' days', ''));

  const getSortedReviewers = () => {
    const sorted = [...reviewers];
    switch (sortBy) {
      case 'mostActive':
        return sorted.sort((a, b) => b.completedReviews - a.completedReviews);
      case 'hasOverdue':
        return sorted.sort((a, b) => b.overdue - a.overdue);
      case 'fastest':
        return sorted.sort((a, b) => parseTime(a.avgReviewTime) - parseTime(b.avgReviewTime));
      case 'slowest':
        return sorted.sort((a, b) => parseTime(b.avgReviewTime) - parseTime(a.avgReviewTime));
      default:
        return sorted;
    }
  };

  const sortedReviewers = getSortedReviewers();

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h3 
            className="text-base sm:text-lg font-bold text-[#003366] mb-2" 
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Reviewer Performance
          </h3>
          <p 
            className="text-xs sm:text-sm text-gray-600" 
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Detailed performance metrics for all reviewers
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-[#003366] text-white rounded-lg flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto justify-between"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <span>Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-full sm:w-48 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    sortBy === option.value ? 'bg-[#87CEEB] text-[#003366] font-semibold' : 'text-gray-700'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#003366]">
            <tr>
              <th 
                className="px-4 py-3 text-left text-sm font-semibold text-white rounded-tl-lg"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Reviewer
              </th>
              <th 
                className="px-4 py-3 text-center text-sm font-semibold text-white"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Active Reviews
              </th>
              <th 
                className="px-4 py-3 text-center text-sm font-semibold text-white"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Completed
              </th>
              <th 
                className="px-4 py-3 text-center text-sm font-semibold text-white"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Overdue
              </th>
              <th 
                className="px-4 py-3 text-center text-sm font-semibold text-white"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Avg Review Time
              </th>
              <th 
                className="px-4 py-3 text-center text-sm font-semibold text-white rounded-tr-lg"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedReviewers.map((reviewer, index) => (
              <tr key={reviewer.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3">
                  <div>
                    <p 
                      className="text-sm font-semibold text-gray-900"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      {reviewer.name}
                    </p>
                    <p 
                      className="text-xs text-gray-500"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      {reviewer.code}
                    </p>
                  </div>
                </td>
                <td 
                  className="px-4 py-3 text-center text-sm text-gray-900"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {reviewer.activeReviews}
                </td>
                <td 
                  className="px-4 py-3 text-center text-sm text-gray-900"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {reviewer.completedReviews}
                </td>
                <td className="px-4 py-3 text-center">
                  <span 
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      reviewer.overdue > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    {reviewer.overdue}
                  </span>
                </td>
                <td 
                  className="px-4 py-3 text-center text-sm text-gray-900"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {reviewer.avgReviewTime}
                </td>
                <td className="px-4 py-3 text-center">
                  <span 
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      reviewer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    {reviewer.status === 'active' ? 'Active' : 'Has Overdue'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {sortedReviewers.map((reviewer) => (
          <div key={reviewer.id} className="border-2 border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p 
                  className="font-semibold text-gray-900"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {reviewer.name}
                </p>
                <p 
                  className="text-xs text-gray-500"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {reviewer.code}
                </p>
              </div>
              <span 
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  reviewer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                {reviewer.status === 'active' ? 'Active' : 'Has Overdue'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>Active</p>
                <p className="font-semibold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.activeReviews}</p>
              </div>
              <div>
                <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>Completed</p>
                <p className="font-semibold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.completedReviews}</p>
              </div>
              <div>
                <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>Overdue</p>
                <p className="font-semibold text-red-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.overdue}</p>
              </div>
              <div>
                <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>Avg Time</p>
                <p className="font-semibold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>{reviewer.avgReviewTime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
