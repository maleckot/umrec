// components/staff-secretariat-admin/admin-settings/ReviewingDetails.tsx
'use client';

import { useState } from 'react';

export default function ReviewingDetails() {
  const [settings, setSettings] = useState({
    fullReviewType: 'all',
    fullReviewCustomNumber: 5,
    expeditedReviewers: 3,
    reviewDeadline: 30
  });

  const handleSave = () => {
    console.log('Saving reviewing details:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-2 border-gray-200 max-w-full overflow-hidden">
      <h2 
        className="text-base sm:text-lg md:text-xl font-bold text-[#003366] mb-2" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Reviewing Details
      </h2>
      <p 
        className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Configure review process settings
      </p>

      <div className="space-y-4 sm:space-y-6">
        {/* Review Process Settings Container */}
        <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 
            className="text-sm sm:text-base font-semibold text-[#003366] mb-3 sm:mb-4" 
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Review Process Settings
          </h3>

          {/* Review Categories */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2 sm:mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Review Categories
            </label>

            {/* Full Review */}
            <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm font-semibold text-[#003366] mb-2 sm:mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Full Review
              </p>
              <div className="space-y-2">
                <label className="flex items-start sm:items-center">
                  <input
                    type="radio"
                    name="fullReview"
                    checked={settings.fullReviewType === 'all'}
                    onChange={() => setSettings({ ...settings, fullReviewType: 'all' })}
                    className="mt-0.5 sm:mt-0 mr-2 sm:mr-3 flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    All Reviewers / Full Committee
                  </span>
                </label>
                <label className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="fullReview"
                      checked={settings.fullReviewType === 'custom'}
                      onChange={() => setSettings({ ...settings, fullReviewType: 'custom' })}
                      className="mr-2 sm:mr-3 flex-shrink-0"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Custom Number:
                    </span>
                  </div>
                  <input
                    type="number"
                    value={settings.fullReviewCustomNumber}
                    onChange={(e) => setSettings({ ...settings, fullReviewCustomNumber: Number(e.target.value) })}
                    disabled={settings.fullReviewType !== 'custom'}
                    className="w-20 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-[#003366] disabled:bg-gray-100 disabled:text-gray-500"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  />
                </label>
              </div>
            </div>

            {/* Expedited Review */}
            <div className="border-2 border-gray-300 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm font-semibold text-[#003366] mb-2 sm:mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Expedited Review
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Number of Reviewers:
                </span>
                <input
                  type="number"
                  value={settings.expeditedReviewers}
                  onChange={(e) => setSettings({ ...settings, expeditedReviewers: Number(e.target.value) })}
                  className="w-20 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-[#003366]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              </div>
            </div>
          </div>

          {/* Review Deadline */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Review Deadline (days)
            </label>
            <input
              type="number"
              value={settings.reviewDeadline}
              onChange={(e) => setSettings({ ...settings, reviewDeadline: Number(e.target.value) })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
          </div>

          {/* Review Submission Notification */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Review Submission Notification
            </p>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Thank you for submitting your review. The submission author will be notified once all reviews are complete.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
        <button
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#003366] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
