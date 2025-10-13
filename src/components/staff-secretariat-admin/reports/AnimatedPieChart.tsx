// components/staff-secretariat-admin/reports/AnimatedPieChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState } from 'react';

interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface AnimatedPieChartProps {
  title: string;
  description: string;
  data: ChartData[];
}

export default function AnimatedPieChart({ title, description, data }: AnimatedPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    // Only show label if percentage is greater than 3%
    if (percent < 0.03) return null;

    const RADIAN = Math.PI / 180;
    // Position label in the center of each slice
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-bold"
        style={{ 
          fontFamily: 'Metropolis, sans-serif',
          fontSize: '11px',
          fontWeight: 'bold'
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200">
      <h3 
        className="text-base sm:text-lg font-bold text-[#003366] mb-2" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        {title}
      </h3>
      <p 
        className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        {description}
      </p>

      <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={90}
            innerRadius={0}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
            paddingAngle={1}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className="transition-all duration-300 cursor-pointer"
                style={{
                  filter: activeIndex === index ? 'brightness(1.15)' : 'brightness(1)',
                  opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.7
                }}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
              fontFamily: 'Metropolis, sans-serif',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`${value} submissions`, '']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              fontFamily: 'Metropolis, sans-serif',
              fontSize: '10px',
              paddingTop: '15px'
            }}
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
