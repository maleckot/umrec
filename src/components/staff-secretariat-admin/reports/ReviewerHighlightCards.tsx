// components/staff-secretariat-admin/reports/ReviewerHighlightCards.tsx
'use client';

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

interface ReviewerHighlightCardsProps {
  reviewers: Reviewer[];
}

export default function ReviewerHighlightCards({ reviewers }: ReviewerHighlightCardsProps) {
  // Calculate highlights
  const mostActive = [...reviewers].sort((a, b) => b.completedReviews - a.completedReviews)[0];
  const mostOverdue = [...reviewers].sort((a, b) => b.overdue - a.overdue)[0];
  
  // Convert avgReviewTime to days for comparison
  const parseTime = (time: string) => parseFloat(time.replace(' days', ''));
  const fastest = [...reviewers].sort((a, b) => parseTime(a.avgReviewTime) - parseTime(b.avgReviewTime))[0];
  const slowest = [...reviewers].sort((a, b) => parseTime(b.avgReviewTime) - parseTime(a.avgReviewTime))[0];

  const highlights = [
    {
      title: 'Most Active Reviewer',
      reviewer: mostActive,
      metric: `${mostActive.completedReviews} completed reviews`,
      bgColor: 'bg-[#F7D117]',
      textColor: 'text-[#003366]',
      icon: '🏆'
    },
    {
      title: 'Most Overdue Reviews',
      reviewer: mostOverdue,
      metric: `${mostOverdue.overdue} overdue submissions`,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: '⚠️'
    },
    {
      title: 'Fastest Reviewer',
      reviewer: fastest,
      metric: `Avg ${fastest.avgReviewTime}`,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: '⚡'
    },
    {
      title: 'Slowest Reviewer',
      reviewer: slowest,
      metric: `Avg ${slowest.avgReviewTime}`,
      bgColor: 'bg-[#E0C8A0]',
      textColor: 'text-[#003366]',
      icon: '🐢'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {highlights.map((highlight, index) => (
        <div
          key={index}
          className={`${highlight.bgColor} rounded-xl p-4 sm:p-5 border-2 border-gray-200 transition-transform hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-3">
            <p 
              className={`text-xs sm:text-sm font-semibold ${highlight.textColor}`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {highlight.title}
            </p>
            <span className="text-2xl">{highlight.icon}</span>
          </div>
          
          <div className="mb-2">
            <p 
              className={`text-base sm:text-lg font-bold ${highlight.textColor}`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {highlight.reviewer.name}
            </p>
            <p 
              className={`text-xs ${highlight.textColor} opacity-75`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {highlight.reviewer.code}
            </p>
          </div>
          
          <p 
            className={`text-sm font-semibold ${highlight.textColor}`}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {highlight.metric}
          </p>
        </div>
      ))}
    </div>
  );
}
