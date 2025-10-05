'use client';

import { Calendar, ClipboardCheck, User, RotateCcw } from 'lucide-react';

interface ActivityInfoCardProps {
  dateSubmitted: string;
  status: string;
  receivedForReview: string;
  revisionCount: number;
}

const ActivityInfoCard: React.FC<ActivityInfoCardProps> = ({
  dateSubmitted,
  status,
  receivedForReview,
  revisionCount,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      <h3 className="text-lg md:text-xl font-bold mb-6 text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Activity Information
      </h3>

      <div className="space-y-4">
        {/* Date Submitted */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar size={20} className="text-[#101C50]" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Date Submitted
            </p>
            <p className="text-sm md:text-base font-semibold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {dateSubmitted}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ClipboardCheck size={20} className="text-[#101C50]" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Status
            </p>
            <p className="text-sm md:text-base font-semibold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {status}
            </p>
          </div>
        </div>

        {/* Received for Review */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-[#101C50]" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Received for Review
            </p>
            <p className="text-sm md:text-base font-semibold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {receivedForReview}
            </p>
          </div>
        </div>

        {/* Revision Count */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <RotateCcw size={20} className="text-[#101C50]" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Revision Count
            </p>
            <p className="text-sm md:text-base font-semibold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {revisionCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityInfoCard;
