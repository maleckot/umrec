'use client';

import { TabType } from '@/app/reviewermodule/ReviewerDashboardContent';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  reviews: any[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onView: (review: any) => void;
}

const Badge = ({ type }: { type: string }) => {
  const isExpedited = type?.toLowerCase().includes('expedited');
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
      isExpedited 
        ? 'bg-blue-50 text-blue-700 border-blue-200' 
        : 'bg-amber-50 text-amber-700 border-amber-200'
    }`}>
      {type}
    </span>
  );
};

const OverdueSection = ({ reviews, activeTab, setActiveTab, onView }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden w-full flex flex-col min-h-[350px] lg:min-h-0 lg:flex-[2]">
        <div className="p-6 border-b border-red-50 bg-red-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <AlertCircle size={22} className="text-red-600" />
              <h2 className="text-xl font-bold text-red-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Overdue Reviews
              </h2>
            </div>
            <div className="hidden sm:flex bg-white/60 p-1 rounded-xl border border-red-100">
              {['all', 'expedited', 'full'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as TabType)}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                      activeTab === tab 
                        ? 'bg-red-100 text-red-800' 
                        : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
              ))}
            </div>
        </div>

        <div className="flex-grow flex flex-col">
            {reviews.length === 0 ? (
               <div className="flex-grow flex flex-col items-center justify-center text-center p-8 h-full">
                 <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-50 text-green-500">
                   <CheckCircle size={32} />
                 </div>
                 <p className="text-base font-medium text-gray-500">Great job! No overdue reviews.</p>
               </div>
            ) : (
              <div className="overflow-x-auto h-full">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-red-50/10 text-xs text-red-800 uppercase border-b border-red-50 tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold w-[45%]">Title</th>
                      <th className="px-6 py-4 font-bold">Category</th>
                      <th className="px-6 py-4 font-bold">Due Date</th>
                      <th className="px-6 py-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-50">
                    {reviews.map((item: any) => (
                      <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-base font-bold text-gray-800 line-clamp-2 leading-snug">{item.title}</p>
                        </td>
                        <td className="px-6 py-4"><Badge type={item.category} /></td>
                        <td className="px-6 py-4">
                           <span className="text-sm font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-lg">
                             {item.dueDate}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => onView(item)}
                            className="text-sm font-bold text-red-700 border border-red-200 bg-white px-4 py-2 rounded-xl hover:bg-red-50 transition-colors whitespace-nowrap"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
    </div>
  );
};

export default OverdueSection;
