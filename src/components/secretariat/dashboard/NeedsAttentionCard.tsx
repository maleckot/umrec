'use client';

import { AlertTriangle } from 'lucide-react';

interface Props {
  items: any[];
  onActionClick: (route: string) => void;
}

const NeedsAttentionCard = ({ items, onActionClick }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-[#101C50] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>Needs Attention</h3>
        
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.id} className="bg-red-50/50 rounded-xl p-6 border border-red-100 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">
                            <span className="text-red-600 font-extrabold mr-1">{item.count}</span>
                            {item.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{item.subtext}</p>
                        <button 
                            onClick={() => onActionClick(item.route)}
                            className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            {item.action}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default NeedsAttentionCard;
