// components/staff-secretariat-admin/submission-details/ReviewerAssignment.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

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
  onAssign: (selectedReviewers: string[]) => void;
}

const PANELS = [
  {
    id: 'panel1',
    name: 'Panel 1 - Science, Technology, Engineering, Food Science, and Math',
    code: 'Panel 1'
  },
  {
    id: 'panel2',
    name: 'Panel 2 - Social Development, Economics, Public Policy and Administration, Humanities and Arts, Business',
    code: 'Panel 2'
  },
  {
    id: 'panel3',
    name: 'Panel 3 - Health, Sciences, and Its Allied Disciplines',
    code: 'Panel 3'
  },
  {
    id: 'panel4',
    name: 'Panel 4 - UMREC Officers',
    code: 'Panel 4'
  }
];

export default function ReviewerAssignment({ category, reviewers, maxReviewers, onAssign }: ReviewerAssignmentProps) {
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [selectedPanels, setSelectedPanels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState<'panel' | 'individual'>('individual');

  // Filter reviewers based on search query
  const filteredReviewers = reviewers.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group reviewers by panel
  const reviewersByPanel = filteredReviewers.reduce((acc, reviewer) => {
    if (!acc[reviewer.panel]) {
      acc[reviewer.panel] = [];
    }
    acc[reviewer.panel].push(reviewer);
    return acc;
  }, {} as Record<string, Reviewer[]>);

  // Handle panel selection
  const handlePanelToggle = (panelCode: string) => {
    const panelReviewers = reviewersByPanel[panelCode] || [];
    const panelReviewerIds = panelReviewers.map(r => r.id);
    
    const isPanelSelected = selectedPanels.includes(panelCode);
    
    if (isPanelSelected) {
      setSelectedPanels(prev => prev.filter(p => p !== panelCode));
      setSelectedReviewers(prev => prev.filter(id => !panelReviewerIds.includes(id)));
    } else {
      setSelectedPanels(prev => [...prev, panelCode]);
      setSelectedReviewers(prev => {
        const newSelected = [...prev];
        panelReviewerIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
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

  // Update panel checkboxes based on individual selections
  useEffect(() => {
    if (assignmentMode === 'panel') {
      const newSelectedPanels: string[] = [];
      
      Object.entries(reviewersByPanel).forEach(([panelCode, panelReviewers]) => {
        const panelReviewerIds = panelReviewers.map(r => r.id);
        const allSelected = panelReviewerIds.every(id => selectedReviewers.includes(id));
        
        if (allSelected && panelReviewerIds.length > 0) {
          newSelectedPanels.push(panelCode);
        }
      });
      
      setSelectedPanels(newSelectedPanels);
    }
  }, [selectedReviewers, assignmentMode]);

  const handleSaveClick = () => {
    if (selectedReviewers.length > 0) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    onAssign(selectedReviewers);
    setShowConfirmModal(false);
  };

  const getSelectedReviewerDetails = () => {
    return reviewers.filter(r => selectedReviewers.includes(r.id));
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
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Assign Reviewers ({category})
          </h3>
          
          <p className="text-white text-sm mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Select reviewers to assign this submission (Maximum: {maxReviewers} reviewers):
          </p>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Reviewers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 bg-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={18} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {/* Assignment Mode Toggle */}
          <div className="mb-4 flex gap-3">
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
                        className="mr-3 cursor-pointer"
                        disabled={!selectedReviewers.includes(reviewer.id) && selectedReviewers.length >= maxReviewers}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {reviewer.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 ml-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
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

          {/* Panel Assignment Mode */}
          {assignmentMode === 'panel' && (
            <div className="space-y-4 mb-4">
              {PANELS.map(panel => {
                const panelReviewers = reviewersByPanel[panel.code] || [];
                const isPanelSelected = selectedPanels.includes(panel.code);
                
                return (
                  <div key={panel.id} className="border-2 border-gray-300 rounded-lg p-4">
                    {/* Panel Header with Checkbox */}
                    <div
                      className="flex items-start gap-3 mb-3 cursor-pointer"
                      onClick={() => handlePanelToggle(panel.code)}
                    >
                      <input
                        type="checkbox"
                        checked={isPanelSelected}
                        onChange={() => {}}
                        className="mt-1 cursor-pointer"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {panel.name}
                        </h4>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {panelReviewers.length} reviewer(s) available
                        </p>
                      </div>
                    </div>

                    {/* Panel Reviewers List */}
                    {panelReviewers.length > 0 && (
                      <div className="ml-7 space-y-1 border-t border-gray-200 pt-2">
                        {panelReviewers.map(reviewer => (
                          <div key={reviewer.id} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-xs">
                            <span className="text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {reviewer.name}
                            </span>
                            <span className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {reviewer.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-xs text-gray-600 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {selectedReviewers.length} reviewer{selectedReviewers.length !== 1 ? 's' : ''} selected
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedReviewers([]);
                setSelectedPanels([]);
              }}
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

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
              <ul className="space-y-2">
                {getSelectedReviewerDetails().map((reviewer) => (
                  <li key={reviewer.id} className="text-sm font-medium text-gray-800 flex items-center justify-between gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      {reviewer.name}
                    </div>
                    <span className="text-xs text-gray-500">{reviewer.code}</span>
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
