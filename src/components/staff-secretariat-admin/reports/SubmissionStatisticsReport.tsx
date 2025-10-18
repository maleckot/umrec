// components/staff-secretariat-admin/reports/SubmissionStatisticsReport.tsx
'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/staff-secretariat-admin/reports/StatCard';
import AnimatedPieChart from '@/components/staff-secretariat-admin/reports/AnimatedPieChart';
import ReviewerPerformanceTable from '@/components/staff-secretariat-admin/reports/ReviewerPerformanceTable';
import ReviewerHighlightCards from '@/components/staff-secretariat-admin/reports/ReviewerHighlightCards';
import { getReportsData } from '@/app/actions/getReportsData';

interface SubmissionStatisticsReportProps {
  dateRange: string;
}

export default function SubmissionStatisticsReport({ dateRange }: SubmissionStatisticsReportProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  const loadReportsData = async () => {
    setLoading(true);
    const result = await getReportsData(dateRange);
    
    if (result.success) {
      setData(result);
    } else {
      console.error('Failed to load reports:', result.error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          No data available
        </p>
      </div>
    );
  }

  const { submissionStats, classificationData, collegeData, reviewerPerformance } = data;

  // Map classification data with colors
  const classificationChartData = classificationData.map((item: any, index: number) => {
    const colors = ['#003366', '#87CEEB', '#F7D117', '#E0C8A0', '#B8860B'];
    return {
      ...item,
      color: colors[index % colors.length],
    };
  });

  // Map college data with colors
  const collegeChartData = collegeData.slice(0, 5).map((item: any, index: number) => {
    const colors = ['#003366', '#87CEEB', '#F7D117', '#E0C8A0', '#B8860B'];
    return {
      ...item,
      color: colors[index % colors.length],
    };
  });

  // Add "Others" if there are more than 5 colleges
  if (collegeData.length > 5) {
    const othersCount = collegeData.slice(5).reduce((sum: number, item: any) => sum + item.value, 0);
    collegeChartData.push({
      name: 'Others',
      value: othersCount,
      color: '#C9E4F5',
    });
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Submissions"
          value={submissionStats.total}
          bgColor="bg-[#C9E4F5]"
          textColor="text-[#003366]"
        />
        <StatCard
          label="Approved"
          value={submissionStats.approved}
          bgColor="bg-[#87CEEB]"
          textColor="text-[#003366]"
        />
        <StatCard
          label="Under Revision"
          value={submissionStats.underRevision}
          bgColor="bg-[#F7D117]"
          textColor="text-[#003366]"
        />
        <StatCard
          label="In Review"
          value={submissionStats.inReview}
          bgColor="bg-[#E0C8A0]"
          textColor="text-[#003366]"
        />
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classificationChartData.length > 0 && (
          <AnimatedPieChart
            title="Submissions by Classification"
            description="Distribution of submissions across research classifications"
            data={classificationChartData}
          />
        )}
        {collegeChartData.length > 0 && (
          <AnimatedPieChart
            title="Submissions by College"
            description="Top colleges submitting research proposals"
            data={collegeChartData}
          />
        )}
      </div>

      {/* Reviewer Highlights & Performance */}
      {reviewerPerformance.length > 0 && (
        <>
          <ReviewerHighlightCards reviewers={reviewerPerformance} />
          <ReviewerPerformanceTable reviewers={reviewerPerformance} />
        </>
      )}
    </div>
  );
}
