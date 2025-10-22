// components/reviewer/profile/ReviewStatisticsCard.tsx
'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ReviewStatisticsCardProps {
  statistics: {
    totalReviewed: number;
    expedited: number;
    fullReview: number;
    overdue: number;
  };
}

export default function ReviewStatisticsCard({ statistics }: ReviewStatisticsCardProps) {
  const [selectedMonth, setSelectedMonth] = useState('October 2025');

  // Color palette from the image
  const COLORS = {
    darkBlue: '#1e3a8a',
    navy: '#1e40af',
    yellow: '#f59e0b',
    teal: '#14b8a6',
    cyan: '#06b6d4',
    turquoise: '#0891b2',
  };

  // Generate last 6 months
  const months = [];
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    months.push(monthYear);
  }

  // Pie chart data with new colors
  const pieData = [
    { name: 'Expedited Reviews', value: statistics.expedited, color: COLORS.teal },
    { name: 'Full Reviews', value: statistics.fullReview, color: COLORS.yellow },
    { name: 'Overdue', value: statistics.overdue, color: COLORS.darkBlue },
  ];

  // Filter out zero values to prevent empty slices
  const filteredPieData = pieData.filter(item => item.value > 0);
  const hasData = filteredPieData.length > 0;
  const total = statistics.expedited + statistics.fullReview + statistics.overdue;

  const PIE_COLORS = [COLORS.teal, COLORS.yellow, COLORS.darkBlue];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : '0.0';
      
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">{`${payload[0].value.toLocaleString()} (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  // Mobile label - inside the pie with white text, only show if percent > 5%
  const renderMobileLabel = (entry: any) => {
    const percent = entry.percent * 100;
    
    // Only show label if slice is larger than 5% to prevent overlap
    if (percent < 5) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.5;
    const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ 
          fontFamily: 'Metropolis, sans-serif',
          fontSize: '14px',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}
      >
        {`${percent.toFixed(1)}%`}
      </text>
    );
  };

  // Desktop label - outside with percentage, only show if percent > 3%
  const renderDesktopLabel = (entry: any) => {
    const percent = entry.percent * 100;
    
    // Only show label if slice is larger than 3% to prevent overlap
    if (percent < 3) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = entry.outerRadius + 30;
    const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#1E293B"
        textAnchor={x > entry.cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ 
          fontFamily: 'Metropolis, sans-serif',
          fontSize: '13px',
          fontWeight: '600'
        }}
      >
        {`${entry.name}: ${percent.toFixed(1)}%`}
      </text>
    );
  };

  // Custom legend renderer - receives payload automatically from Recharts
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : '0.0';
          
          return (
            <div key={`legend-${index}`} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-sm flex-shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {entry.value}: {entry.payload.value} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Review Statistics
        </h2>

        {/* Month Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-sm text-gray-600 whitespace-nowrap" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Period:
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#14b8a6] focus:outline-none text-sm"
            style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>

      {/* Statistics Grid with New Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Papers Reviewed - Navy */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-6 text-white">
          <p className="text-sm mb-2 opacity-90" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Total Papers Reviewed
          </p>
          <p className="text-3xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {statistics.totalReviewed.toLocaleString()}
          </p>
        </div>

        {/* Expedited Reviews - Teal */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white">
          <p className="text-sm mb-2 opacity-90" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Expedited Reviews
          </p>
          <p className="text-3xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {statistics.expedited.toLocaleString()}
          </p>
        </div>

        {/* Full Reviews - Yellow/Orange */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <p className="text-sm mb-2 opacity-90" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Full Reviews
          </p>
          <p className="text-3xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {statistics.fullReview.toLocaleString()}
          </p>
        </div>

        {/* Overdue Submissions - Cyan */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
          <p className="text-sm mb-2 opacity-90" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Overdue Submissions
          </p>
          <p className="text-3xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {statistics.overdue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Pie Chart with New Colors - Responsive */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-[#101C50] mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Review Distribution for {selectedMonth}
        </h3>
        
        {hasData ? (
          <>
            {/* Mobile version - Centered with percentages inside */}
            <div className="sm:hidden w-full flex justify-center">
              <div className="w-full max-w-sm">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={filteredPieData}
                      cx="50%"
                      cy="42%"
                      labelLine={false}
                      label={renderMobileLabel}
                      outerRadius={85}
                      innerRadius={45}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {filteredPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={renderCustomLegend} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Desktop version - Full width with labels outside */}
            <div className="hidden sm:block w-full">
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={filteredPieData}
                    cx="50%"
                    cy="45%"
                    labelLine={{
                      stroke: '#CBD5E1',
                      strokeWidth: 1
                    }}
                    label={renderDesktopLabel}
                    outerRadius={100}
                    innerRadius={55}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {filteredPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={renderCustomLegend} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              No review data available for {selectedMonth}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
