// components/staff-secretariat-admin/reports/SubmissionStatisticsReport.tsx
'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/staff-secretariat-admin/reports/StatCard';
import AnimatedPieChart from '@/components/staff-secretariat-admin/reports/AnimatedPieChart';
import ReviewerPerformanceTable from '@/components/staff-secretariat-admin/reports/ReviewerPerformanceTable';
import ReviewerHighlightCards from '@/components/staff-secretariat-admin/reports/ReviewerHighlightCards';

interface SubmissionStatisticsReportProps {
  dateRange: string;
}

export default function SubmissionStatisticsReport({ dateRange }: SubmissionStatisticsReportProps) {
  // Sample data - replace with API calls
  const stats = {
    total: 1876,
    approved: 1245,
    underRevision: 342,
    inReview: 289
  };

  const disciplineData = [
    { name: 'Science, Tech & Engineering', value: 450, color: '#003366' },
    { name: 'Social Development & Business', value: 380, color: '#87CEEB' },
    { name: 'Health Sciences', value: 290, color: '#F7D117' }
  ];

  const collegeData = [
    { name: 'CCIS', value: 245, color: '#003366' },
    { name: 'CLAS', value: 198, color: '#87CEEB' },
    { name: 'CBFS', value: 167, color: '#F7D117' },
    { name: 'CHK', value: 145, color: '#E0C8A0' },
    { name: 'CGPP', value: 132, color: '#B8860B' },
    { name: 'Others', value: 989, color: '#C9E4F5' }
  ];

  const reviewerPerformance = [
    {
      id: '1',
      name: 'Dr. Maria Santos',
      code: 'REC-021',
      activeReviews: 12,
      completedReviews: 56,
      overdue: 0,
      avgReviewTime: '4.2 days',
      status: 'active' as const
    },
    {
      id: '2',
      name: 'Prof. John Cruz',
      code: 'REC-022',
      activeReviews: 8,
      completedReviews: 38,
      overdue: 0,
      avgReviewTime: '4.8 days',
      status: 'active' as const
    },
    {
      id: '3',
      name: 'Dr. Ana Reyes',
      code: 'REC-023',
      activeReviews: 15,
      completedReviews: 52,
      overdue: 4,
      avgReviewTime: '6.1 days',
      status: 'overdue' as const
    },
    {
      id: '4',
      name: 'Prof. Robert Tan',
      code: 'REC-024',
      activeReviews: 10,
      completedReviews: 41,
      overdue: 1,
      avgReviewTime: '5.5 days',
      status: 'active' as const
    },
    {
      id: '5',
      name: 'Dr. Lisa Garcia',
      code: 'REC-025',
      activeReviews: 14,
      completedReviews: 45,
      overdue: 0,
      avgReviewTime: '3.8 days',
      status: 'active' as const
    },
    {
      id: '6',
      name: 'Prof. Michael Wong',
      code: 'REC-026',
      activeReviews: 6,
      completedReviews: 28,
      overdue: 5,
      avgReviewTime: '8.2 days',
      status: 'overdue' as const
    }
  ];

 return (
  <div className="space-y-6">
    {/* Stats Cards with Color Palette */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Submissions"
        value={stats.total}
        bgColor="bg-[#C9E4F5]"
        textColor="text-[#003366]"
      />
      <StatCard
        label="Approved"
        value={stats.approved}
        bgColor="bg-[#87CEEB]"
        textColor="text-[#003366]"
      />
      <StatCard
        label="Under Revision"
        value={stats.underRevision}
        bgColor="bg-[#F7D117]"
        textColor="text-[#003366]"
      />
      <StatCard
        label="In Review"
        value={stats.inReview}
        bgColor="bg-[#E0C8A0]"
        textColor="text-[#003366]"
      />
    </div>


      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedPieChart
          title="Submissions by Category"
          description="Distribution of submissions across major research areas"
          data={disciplineData}
        />
        <AnimatedPieChart
          title="Submissions by College"
          description="Top colleges submitting research proposals"
          data={collegeData}
        />
      </div>

      {/* Reviewer Highlight Cards */}
      <ReviewerHighlightCards reviewers={reviewerPerformance} />

      {/* Reviewer Performance Table */}
      <ReviewerPerformanceTable reviewers={reviewerPerformance} />
    </div>
  );
}
