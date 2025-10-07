// components/staff-secretariat-admin/submission-details/ReviewerAssignment.tsx
'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Reviewer {
  id: number;
  name: string;
  availability: string;
}

interface ReviewerAssignmentProps {
  category: 'Exempted' | 'Expedited' | 'Full Review';
  reviewers: Reviewer[];
  maxReviewers: number;
  onAssign: (selectedReviewers: number[]) => void;
}

export default function ReviewerAssignment({ category, reviewers, maxReviewers, onAssign }: ReviewerAssignmentProps) {
  const [selectedReviewers, setSelectedReviewers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const filteredReviewers = reviewers.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleReviewer = (reviewerId: number) => {
    if (selectedReviewers.includes(reviewerId)) {
      setSelectedReviewers(selectedReviewers.filter(id => id !== reviewerId));
    } else {
      if (selectedReviewers.length < maxReviewers) {
        setSelectedReviewers([...selectedReviewers, reviewerId]);
      }
    }
  };

  const handleSaveClick = () => {
    if (selectedReviewers.length > 0) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    onAssign(selectedReviewers);
    setShowConfirmModal(false);
  };

  const getSelectedReviewerNames = () => {
    return reviewers
      .filter(r => selectedReviewers.includes(r.id))
      .map(r => r.name);
  };

  if (category === 'Exempted') {
    return (
      <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
        <div className="bg-[#101C50] p-4 lg:p-6">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Category Details
          </h3>
        </div>
        <div className="p-4 lg:p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              This submission is categorized as <span className="font-bold">Exempted</span> and does not require reviewer assignment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
        {/* Header */}
        <div className="bg-[#101C50] p-4 lg:p-6">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Assign Reviewers ({category})
          </h3>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6">
          <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Select reviewers to assign this submission (Maximum: {maxReviewers} reviewers):
          </p>

          {/* Darker Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Reviewers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={18} />
          </div>

          {/* Reviewer List */}
          <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto mb-4">
            {filteredReviewers.length > 0 ? (
              filteredReviewers.map((reviewer) => (
                <div
                  key={reviewer.id}
                  className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 cursor-pointer"
                  onClick={() => handleToggleReviewer(reviewer.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedReviewers.includes(reviewer.id)}
                    onChange={() => {}}
                    className="mr-3 cursor-pointer"
                    disabled={!selectedReviewers.includes(reviewer.id) && selectedReviewers.length >= maxReviewers}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {reviewer.name}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  No reviewers found
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-600 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {selectedReviewers.length} reviewer{selectedReviewers.length !== 1 ? 's' : ''} selected
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedReviewers([])}
              className="px-4 py-2 bg-gray-500 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Clear Selection
            </button>
            <button
              onClick={handleSaveClick}
              disabled={selectedReviewers.length === 0}
              className="px-4 py-2 bg-[#101C50] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Save and Continue
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Confirm Reviewer Assignment
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              You are about to assign the following reviewers to this submission:
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <ul className="space-y-2">
                {getSelectedReviewerNames().map((name, index) => (
                  <li key={index} className="text-sm font-medium text-gray-800 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-[#101C50] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
