'use client';

import StatCard from '@/components/staff-secretariat-admin/StatCard';
import { FileText, Clock, CheckCircle, Users } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
}

const DashboardStats = ({ stats }: { stats: StatItem[] }) => {
  // Map icons based on label or index to match original visual
  const getIcon = (label: string) => {
    if (label.includes('Total')) return <FileText size={20} />;
    if (label.includes('Pending')) return <Clock size={20} />;
    if (label.includes('Reviewers')) return <Users size={20} />;
    return <CheckCircle size={20} />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {stats.map((stat, index) => (
        <StatCard 
          key={index} 
          label={stat.label} 
          value={Number(stat.value)} // Ensure value is a number for StatCard
          icon={getIcon(stat.label)} 
        />
      ))}
    </div>
  );
};

export default DashboardStats;
