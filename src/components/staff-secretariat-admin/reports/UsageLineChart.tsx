// components/staff-secretariat-admin/reports/UsageLineChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jan', users: 400 },
  { date: 'Feb', users: 300 },
  { date: 'Mar', users: 600 },
  { date: 'Apr', users: 800 },
  { date: 'May', users: 700 },
  { date: 'Jun', users: 900 },
];

export default function UsageLineChart() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200">
      <h3 
        className="text-base sm:text-lg font-bold text-[#003366] mb-2" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Daily Active Users
      </h3>
      <p 
        className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Track daily user activity over time
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            style={{ fontFamily: 'Metropolis, sans-serif', fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontFamily: 'Metropolis, sans-serif', fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
              fontFamily: 'Metropolis, sans-serif'
            }}
          />
          <Legend
            wrapperStyle={{
              fontFamily: 'Metropolis, sans-serif',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#F7D117" 
            strokeWidth={3}
            dot={{ fill: '#F7D117', r: 5 }}
            activeDot={{ r: 8 }}
            name="Active Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
