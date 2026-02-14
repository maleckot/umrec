'use client';

import AttentionCard from '@/components/staff-secretariat-admin/AttentionCard';

interface Props {
  submissions: any[];
  onItemClick: (submission: any) => void;
}

const AttentionItemsList = ({ submissions, onItemClick }: Props) => {
  
  // Helpers for Due Dates
  const DEFAULT_DUE_DAYS = 7;
  const DUE_SOON_DAYS = 2;

  const toDateSafe = (value: any) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

  const formatShortDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getDueMeta = (submission: any) => {
    const baseDate = toDateSafe(submission.dueDate) 
      ?? toDateSafe(submission.submittedAt) 
      ?? toDateSafe(submission.date);

    if (!baseDate) return { due: null as Date | null, overdue: false, dueSoon: false };

    const due = submission.dueDate ? baseDate : addDays(baseDate, DEFAULT_DUE_DAYS);

    const now = new Date();
    now.setHours(0,0,0,0);
    const dueTime = new Date(due);
    dueTime.setHours(0,0,0,0);

    const msLeft = dueTime.getTime() - now.getTime();
    const overdue = msLeft < 0;
    const dueSoon = !overdue && msLeft <= DUE_SOON_DAYS * 24 * 60 * 60 * 1000;

    return { due, overdue, dueSoon };
  };

  return (
    // Restored the original container styling
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#101C50] mb-4 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Requires Attention
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">{submissions?.length || 0}</span>
        </h2>
        
        <div className="space-y-4">
            {(!submissions || submissions.length === 0) ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No submissions requiring attention.</p>
                </div>
            ) : (
                submissions.map((submission: any) => {
                    const { due, overdue, dueSoon } = getDueMeta(submission);
                    const cardProps = {
                      key: submission.id,
                      id: submission.id,
                      title: submission.title,
                      type: submission.status, // Original code used 'type'
                      date: submission.submittedAt,
                      dueDate: due ? formatShortDate(due) : undefined,
                      isOverdue: overdue,
                      isDueSoon: dueSoon,
                      onClick: () => onItemClick(submission)
                    };
                    
                    // Casting to any to ensure it renders despite TS errors with external component props
                    return <AttentionCard {...(cardProps as any)} />;
                })
            )}
        </div>
    </div>
  );
};

export default AttentionItemsList;
