// components/staff-secretariat-admin/submission-details/ReviewerAssignment.tsx
'use client';

import { useState } from 'react';
import { Search, X, Calendar } from 'lucide-react';

interface Reviewer {
  id: string;
  name: string;
  code: string;
  panel: string;
  email?: string;
  availability?: string;
}

interface ReviewerAssignmentProps {
  category: 'Exempted' | 'Expedited' | 'Full Review';
  reviewers: Reviewer[];
  maxReviewers: number;
  reviewDueDate: string;
  onDueDateChange: (date: string) => void;
  onAssign: (selectedReviewers: string[]) => void;
}

// ✅ Panel descriptions mapping
const PANEL_DESCRIPTIONS: Record<string, string> = {
  'Panel 1': 'Panel 1 - Science, Technology, Engineering, Food Science, and Math',
  'Panel 2': 'Panel 2 - Social Development, Economics, Public Policy and Administration, Humanities and Arts, Business',
  'Panel 3': 'Panel 3 - Health, Sciences, and Its Allied Disciplines',
  'Panel 4': 'Panel 4 - UMREC Officers',
};

export default function ReviewerAssignment({ 
  category, 
  reviewers, 
  maxReviewers, 
  reviewDueDate,
  onDueDateChange,
  onAssign 
}: ReviewerAssignmentProps) {
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState<'panel' | 'individual'>('individual');

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // ✅ Dynamically extract unique panels from reviewers
  const uniquePanels = Array.from(new Set(reviewers.map(r => r.panel)))
    .filter(Boolean)
    .sort();

  // Filter reviewers based on search query
  const filteredReviewers = reviewers.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.panel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Group reviewers by panel (dynamically)
  const reviewersByPanel = filteredReviewers.reduce((acc, reviewer) => {
    const panelKey = reviewer.panel || 'Unassigned';
    if (!acc[panelKey]) {
      acc[panelKey] = [];
    }
    acc[panelKey].push(reviewer);
    return acc;
  }, {} as Record<string, Reviewer[]>);

  // ✅ Calculate which panels are fully selected (on-demand, no useEffect)
  const isPanelFullySelected = (panelName: string) => {
    const panelReviewers = reviewersByPanel[panelName] || [];
    if (panelReviewers.length === 0) return false;
    
    const panelReviewerIds = panelReviewers.map(r => r.id);
    return panelReviewerIds.every(id => selectedReviewers.includes(id));
  };

  // Handle Select All
  const handleSelectAll = () => {
    if (selectedReviewers.length === filteredReviewers.length) {
      setSelectedReviewers([]);
    } else {
      const reviewerIds = filteredReviewers.slice(0, maxReviewers).map(r => r.id);
      setSelectedReviewers(reviewerIds);
    }
  };

  // Handle panel selection
  const handlePanelToggle = (panelName: string) => {
    const panelReviewers = reviewersByPanel[panelName] || [];
    const panelReviewerIds = panelReviewers.map(r => r.id);
    
    const isPanelSelected = isPanelFullySelected(panelName);
    
    if (isPanelSelected) {
      setSelectedReviewers(prev => prev.filter(id => !panelReviewerIds.includes(id)));
    } else {
      setSelectedReviewers(prev => {
        const newSelected = [...prev];
        panelReviewerIds.forEach(id => {
          if (!newSelected.includes(id) && newSelected.length < maxReviewers) {
            newSelected.push(id);
          }
        });
        return newSelected.slice(0, maxReviewers);
      });
    }
  };

  // Handle individual reviewer selection
  const handleToggleReviewer = (reviewerId: string) => {
    if (selectedReviewers.includes(reviewerId)) {
      setSelectedReviewers(selectedReviewers.filter(id => id !== reviewerId));
    } else {
      if (selectedReviewers.length < maxReviewers) {
        setSelectedReviewers([...selectedReviewers, reviewerId]);
      }
    }
  };

  const handleSaveClick = () => {
    if (selectedReviewers.length === 0) {
      alert('Please select at least one reviewer');
      return;
    }
    
    if (!reviewDueDate) {
      alert('Please select a review due date');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    onAssign(selectedReviewers);
    setShowConfirmModal(false);
  };

  const getSelectedReviewerDetails = () => {
    return reviewers.filter(r => selectedReviewers.includes(r.id));
  };

  const allSelected = selectedReviewers.length === filteredReviewers.length && filteredReviewers.length > 0;

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
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Assign Reviewers ({category})
          </h3>
          
          {/* ✅ Due Date Section - Responsive */}
          <div className="mb-4 p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
            <label 
              htmlFor="reviewDueDate" 
              className="flex items-center gap-2 text-sm font-semibold text-white mb-2" 
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <Calendar size={16} />
              Review Due Date <span className="text-yellow-300">*</span>
            </label>
            <input
              type="date"
              id="reviewDueDate"
              value={reviewDueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              min={today}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-gray-900 bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
            <p className="text-xs sm:text-sm text-white/80 mt-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Suggested: <span className="font-semibold text-yellow-300">{category === 'Expedited' ? '14 days' : '30 days'}</span> from today
            </p>
          </div>

          <p className="text-white text-sm mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Select reviewers to assign this submission (Maximum: {maxReviewers} reviewers):
          </p>

          {/* Search Bar and Select All Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Reviewers or Panels"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={18} />
            </div>
            
            <button
              onClick={handleSelectAll}
              disabled={filteredReviewers.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                filteredReviewers.length === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : allSelected
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {allSelected 
                ? 'Deselect All' 
                : `Select All (${Math.min(filteredReviewers.length, maxReviewers)})`
              }
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {/* Assignment Mode Toggle */}
          <div className="mb-4 flex flex-wrap gap-3">
            <button
              onClick={() => setAssignmentMode('individual')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                assignmentMode === 'individual'
                  ? 'bg-[#101C50] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Assign Individually
            </button>
            <button
              onClick={() => setAssignmentMode('panel')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                assignmentMode === 'panel'
                  ? 'bg-[#101C50] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Assign by Panel
            </button>
          </div>

          {/* Individual Assignment Mode */}
          {assignmentMode === 'individual' && (
            <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto mb-4">
              {filteredReviewers.length > 0 ? (
                filteredReviewers.map((reviewer) => (
                  <div
                    key={reviewer.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 cursor-pointer"
                    onClick={() => handleToggleReviewer(reviewer.id)}
                  >
                    <div className="flex items-center flex-1">
                      <input
                        type="checkbox"
                        checked={selectedReviewers.includes(reviewer.id)}
                        onChange={() => {}}
                        className="mr-3 cursor-pointer h-4 w-4 sm:h-5 sm:w-5"
                        disabled={!selectedReviewers.includes(reviewer.id) && selectedReviewers.length >= maxReviewers}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {reviewer.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {PANEL_DESCRIPTIONS[reviewer.panel] || reviewer.panel}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 ml-3 flex-shrink-0" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {reviewer.code}
                    </span>
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
          )}

          {/* ✅ Panel Assignment Mode - DYNAMIC with descriptions */}
          {assignmentMode === 'panel' && (
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {uniquePanels.length > 0 ? (
                uniquePanels.map(panelCode => {
                  const panelReviewers = reviewersByPanel[panelCode] || [];
                  const panelDescription = PANEL_DESCRIPTIONS[panelCode] || panelCode;
                  
                  return (
                    <div key={panelCode} className="border-2 border-gray-300 rounded-lg p-3 sm:p-4">
                      <div
                        className="flex items-start gap-3 mb-3 cursor-pointer"
                        onClick={() => handlePanelToggle(panelCode)}
                      >
                        <input
                          type="checkbox"
                          checked={isPanelFullySelected(panelCode)}
                          onChange={() => {}}
                          className="mt-1 cursor-pointer h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {panelDescription}
                          </h4>
                          <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {panelReviewers.length} reviewer(s) available
                          </p>
                        </div>
                      </div>

                      {panelReviewers.length > 0 && (
                        <div className="ml-7 space-y-1 border-t border-gray-200 pt-2">
                          {panelReviewers.map(reviewer => (
                            <div key={reviewer.id} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-xs">
                              <span className="text-gray-700 truncate flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {reviewer.name}
                              </span>
                              <span className="text-gray-500 ml-2 flex-shrink-0" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {reviewer.code}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    No panels available. Reviewers need to be assigned to panels.
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-xs sm:text-sm text-gray-600 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {selectedReviewers.length} reviewer{selectedReviewers.length !== 1 ? 's' : ''} selected (Maximum: {maxReviewers})
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setSelectedReviewers([])}
              className="px-4 py-2 bg-gray-500 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Clear Selection
            </button>
            <button
              onClick={handleSaveClick}
              disabled={selectedReviewers.length === 0 || !reviewDueDate}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(3, 2, 17, 0.91)' }}> 
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Confirm Reviewer Assignment
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              You are about to assign the following reviewers to this submission:
            </p>

            {/* ✅ Due Date Display in Modal */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-blue-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Review Due Date:
              </p>
              <p className="text-sm font-bold text-blue-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {new Date(reviewDueDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-6 max-h-48 sm:max-h-60 overflow-y-auto">
              <ul className="space-y-2">
                {getSelectedReviewerDetails().map((reviewer) => (
                  <li key={reviewer.id} className="text-sm font-medium text-gray-800 flex items-center justify-between gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                      <span className="truncate">{reviewer.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{reviewer.code}</span>
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
