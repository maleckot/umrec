'use client';

import ActivityInfoCard from '@/components/researcher/ActivityInfoCard';

interface Props {
  dateSubmitted: string;
  status: string;
  revisionCount: number;
}

const ActivitySidebar = ({ dateSubmitted, status, revisionCount }: Props) => {
  return (
    <ActivityInfoCard
      dateSubmitted={dateSubmitted}
      status={status}
      receivedForReview="UMREC Review Committee"
      revisionCount={revisionCount}
    />
  );
};

export default ActivitySidebar;
