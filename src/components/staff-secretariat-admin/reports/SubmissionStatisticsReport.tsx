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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#101C50] mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium text-sm tracking-wide">LOADING DATA...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
        <p className="text-gray-500 font-medium">No data available for this period.</p>
      </div>
    );
  }

  const { submissionStats, classificationData, collegeData, reviewerPerformance } = data;

  // Map classification data with colors
  const classificationChartData = classificationData.map((item: any, index: number) => {
    const colors = ['#101C50', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
    return { ...item, color: colors[index % colors.length] };
  });

  // Map college data with colors
  const collegeChartData = collegeData.slice(0, 5).map((item: any, index: number) => {
    const colors = ['#101C50', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
    return { ...item, color: colors[index % colors.length] };
  });

  if (collegeData.length > 5) {
    const othersCount = collegeData.slice(5).reduce((sum: number, item: any) => sum + item.value, 0);
    collegeChartData.push({ name: 'Others', value: othersCount, color: '#E5E7EB' });
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          label="Total Submissions"
          value={submissionStats.total}
          bgColor="bg-blue-50"
          textColor="text-blue-900"
        />
        <StatCard
          label="Approved"
          value={submissionStats.approved}
          bgColor="bg-emerald-50"
          textColor="text-emerald-900"
        />
        <StatCard
          label="Under Revision"
          value={submissionStats.underRevision}
          bgColor="bg-amber-50"
          textColor="text-amber-900"
        />
        <StatCard
          label="In Review"
          value={submissionStats.inReview}
          bgColor="bg-indigo-50"
          textColor="text-indigo-900"
        />
      </div>

      {/* Pie Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {classificationChartData.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <AnimatedPieChart
              title="Submissions by Classification"
              description="Distribution of submissions across research classifications"
              data={classificationChartData}
            />
          </div>
        )}
        {collegeChartData.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <AnimatedPieChart
              title="Submissions by College"
              description="Top colleges submitting research proposals"
              data={collegeChartData}
            />
          </div>
        )}
      </div>

      {/* Reviewer Performance Section */}
      {reviewerPerformance.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Reviewer Performance</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          
          <ReviewerHighlightCards reviewers={reviewerPerformance} />
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
               <h3 className="text-base font-bold text-[#101C50]">Detailed Performance Metrics</h3>
             </div>
             <ReviewerPerformanceTable reviewers={reviewerPerformance} />
          </div>
        </div>
      )}
    </div>
  );
}
