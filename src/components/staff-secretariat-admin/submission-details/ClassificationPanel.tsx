'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, Info, Sparkles, Clock } from 'lucide-react';

interface ClassificationPanelProps {
  systemSuggestedCategory?: 'Exempted' | 'Expedited' | 'Full Review';
  aiConfidence?: number;
  aiClassifiedAt?: string;
  aiMethod?: string;
  onSave: (category: 'Exempted' | 'Expedited' | 'Full Review') => void;
}

export default function ClassificationPanel({ 
  systemSuggestedCategory = 'Expedited',
  aiConfidence,
  aiClassifiedAt,
  aiMethod,
  onSave 
}: ClassificationPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Exempted' | 'Expedited' | 'Full Review' | null>(null);
  const [showModal, setShowModal] = useState(false);

  // --- NEW: Helper to calculate dates ---
  const getTurnaroundDetails = (category: string) => {
    let days = 0;
    if (category === 'Exempted') days = 7;
    else if (category === 'Expedited') days = 14;
    else if (category === 'Full Review') days = 30;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    return { 
        days, 
        dateStr: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
    };
  };

  const categories = [
    {
      value: 'Exempted' as const,
      title: 'Exempted',
      description: 'For submissions that qualify for exemption',
      color: 'blue',
      reviewers: 0,
      days: 7, // Standard TAT
    },
    {
      value: 'Expedited' as const,
      title: 'Expedited',
      description: 'For submissions that are eligible for expedited review procedures',
      color: 'yellow',
      reviewers: 3,
      days: 14, // Standard TAT
    },
    {
      value: 'Full Review' as const,
      title: 'Full Review',
      description: 'For submissions that require complete committee review',
      color: 'red',
      reviewers: 5, // Corrected from 10 to 5 based on your logic usually
      days: 30, // Standard TAT
    },
  ];

  const handleCategorySelect = (category: 'Exempted' | 'Expedited' | 'Full Review') => {
    setSelectedCategory(category);
  };

  const handleSaveClick = () => {
    if (selectedCategory) {
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    if (selectedCategory) {
      onSave(selectedCategory);
    }
  };

  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-600 hover:bg-blue-700';
      case 'yellow': return 'bg-yellow-600 hover:bg-yellow-700';
      case 'red': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#101C50] p-4 lg:p-6">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Category Details 
          </h3>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {systemSuggestedCategory && aiConfidence ? (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-500 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Sparkles size={24} className="text-blue-700 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    System Suggested Category
                  </p>
                  <p className="text-2xl font-bold text-blue-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {systemSuggestedCategory}
                  </p>
                  {aiClassifiedAt && (
                    <p className="text-xs text-blue-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Classified on {new Date(aiClassifiedAt).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info size={24} className="text-blue-700 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    System-Selected Category: <b>System classification pending...</b>
                  </p>
                  <p className="text-2xl font-bold text-blue-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {systemSuggestedCategory}
                  </p>
                  <p className="text-xs text-blue-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    The System classification is being processed. Please select a category manually.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {aiConfidence ? 'Confirm or override AI suggestion:' : 'Select a review category for this submission:'}
            </p>
            
            <div className="space-y-3">
              {categories.map((category) => {
                const turnAround = getTurnaroundDetails(category.value);
                return (
                    <button
                        key={category.value}
                        onClick={() => handleCategorySelect(category.value)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedCategory === category.value
                            ? `border-${category.color}-600 ${getCategoryColor(category.color)} text-white`
                            : 'border-gray-300 bg-gray-700 text-white hover:border-gray-400'
                        } ${
                        systemSuggestedCategory === category.value && aiConfidence
                            ? 'ring-2 ring-blue-400 ring-offset-2'
                            : ''
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <h4 className="text-base font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                {category.title}
                                </h4>
                                {systemSuggestedCategory === category.value && aiConfidence && (
                                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                    System Recommended
                                </span>
                                )}
                            </div>
                            {selectedCategory === category.value && (
                                <CheckCircle size={20} className="text-white" />
                            )}
                        </div>
                        <p className="text-xs opacity-90 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {category.description}
                        </p>
                        
                        {/* --- NEW: Turnaround Time Badge in Card --- */}
                        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/20">
                            {category.reviewers > 0 && (
                                <span className="text-xs font-semibold opacity-90 flex items-center gap-1">
                                    <span className="bg-white/20 px-1.5 py-0.5 rounded">
                                        {category.reviewers} Reviewers
                                    </span>
                                </span>
                            )}
                            <span className="text-xs font-semibold opacity-90 flex items-center gap-1">
                                <Clock size={12} />
                                <span className="bg-white/20 px-1.5 py-0.5 rounded">
                                    {category.days} Days Turnaround
                                </span>
                            </span>
                        </div>
                    </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-gray-500 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition-colors"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Back
            </button>
            <button
              onClick={handleSaveClick}
              disabled={!selectedCategory}
              className="flex-1 px-6 py-2.5 bg-[#101C50] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Save and Continue
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(3, 2, 17, 0.91)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={32} className="text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Confirm Classification
              </h3>
            </div>

            <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              You are about to classify this submission as:
            </p>

            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 mb-6">
              <p className="text-2xl font-bold text-blue-900 text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {selectedCategory}
              </p>
              
              {/* --- NEW: Turnaround Time Info in Modal --- */}
              <div className="flex justify-center items-center gap-4 mt-3 pt-3 border-t border-blue-200">
                  <div className="text-center">
                     <p className="text-xs text-blue-600 uppercase font-bold">Review Period</p>
                     <p className="text-sm font-bold text-blue-900">{getTurnaroundDetails(selectedCategory).days} Days</p>
                  </div>
                  <div className="h-6 w-px bg-blue-300"></div>
                  <div className="text-center">
                     <p className="text-xs text-blue-600 uppercase font-bold">Expected Due Date</p>
                     <p className="text-sm font-bold text-blue-900">{getTurnaroundDetails(selectedCategory).dateStr}</p>
                  </div>
              </div>

              {selectedCategory !== systemSuggestedCategory && aiConfidence && (
                <p className="text-xs text-amber-700 text-center mt-3 bg-amber-50 py-1 rounded" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  ⚠️ Differs from AI suggestion: {systemSuggestedCategory}
                </p>
              )}
            </div>

            <p className="text-xs text-gray-600 mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Once confirmed, this submission will be sent to staff for reviewer assignment.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(false)}
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
