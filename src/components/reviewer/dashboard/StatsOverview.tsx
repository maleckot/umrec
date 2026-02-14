'use client';

import { Briefcase, Clock, CheckCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green';
}

const StatCard = ({ title, count, icon, color }: StatCardProps) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    green: 'bg-green-50 text-green-700 border-green-100'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{title}</p>
        <p className="text-3xl font-bold text-[#101C50]">{count}</p>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${colorStyles[color]}`}>
        {icon}
      </div>
    </div>
  );
};

interface StatsProps {
  stats: {
    newAssignments: number;
    overdueReviews: number;
    completedReviews: number;
  };
}

const StatsOverview = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      <StatCard 
        title="New Assignments" 
        count={stats.newAssignments} 
        icon={<Briefcase size={24} />} 
        color="blue" 
      />
      <StatCard 
        title="Overdue Reviews" 
        count={stats.overdueReviews} 
        icon={<Clock size={24} />} 
        color="red" 
      />
      <StatCard 
        title="Completed" 
        count={stats.completedReviews} 
        icon={<CheckCircle size={24} />} 
        color="green" 
      />
    </div>
  );
};

export default StatsOverview;
