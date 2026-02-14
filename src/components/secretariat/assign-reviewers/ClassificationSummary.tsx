'use client';

import { CheckCircle } from 'lucide-react';

interface Props {
  category: string;
}

const ClassificationSummary = ({ category }: Props) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Exempted': return 'from-blue-50 to-indigo-50 border-blue-500';
      case 'Expedited': return 'from-yellow-50 to-amber-50 border-yellow-500';
      case 'Full Review': return 'from-red-50 to-rose-50 border-red-500';
      default: return 'from-gray-50 to-gray-100 border-gray-500';
    }
  };

  const getCategoryTextColor = (cat: string) => {
    switch (cat) {
      case 'Exempted': return 'text-blue-900';
      case 'Expedited': return 'text-yellow-900';
      case 'Full Review': return 'text-red-900';
      default: return 'text-gray-900';
    }
  };

  const getCategoryIconColor = (cat: string) => {
    switch (cat) {
      case 'Exempted': return 'text-blue-600';
      case 'Expedited': return 'text-yellow-600';
      case 'Full Review': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getCategoryColor(category)} border-2 rounded-xl p-6 shadow-sm`}>
      <div className="flex items-start gap-4">
        <CheckCircle size={32} className={`${getCategoryIconColor(category)} flex-shrink-0 mt-1`} />
        <div>
          <h3 className={`text-xl font-bold ${getCategoryTextColor(category)} mb-2`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Classification Summary
          </h3>
          <p className={`text-lg font-bold ${getCategoryTextColor(category)} mb-3`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Review Category: {category}
          </p>
          <p className={`text-sm font-medium ${getCategoryTextColor(category)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {category === 'Exempted' && 'This submission has been marked as Exempted from review. No reviewers will be assigned to this submission.'}
            {category === 'Expedited' && 'This submission has been marked as Expedited review. Please assign the required reviewers to proceed with the review process.'}
            {category === 'Full Review' && 'This submission has been marked as Full Review. Please assign the required reviewers to proceed with the comprehensive review process.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassificationSummary;
