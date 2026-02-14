'use client';

import { TabType } from '@/app/reviewermodule/ReviewerDashboardContent';
import { Briefcase } from 'lucide-react';

interface Props {
  assignments: any[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onView: (assignment: any) => void;
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

const AssignmentsTable = ({ assignments, activeTab, setActiveTab, onView }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-full flex flex-col min-h-[500px] lg:min-h-0 lg:flex-[3]">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#101C50] rounded-full"></div>
          <h2 className="text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            New Assignments
          </h2>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-xl self-start sm:self-auto">
           {['all', 'expedited', 'full'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TabType)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-[#101C50] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
           ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        {assignments.length === 0 ? (
           <div className="flex-grow flex flex-col items-center justify-center text-center p-8 h-full">
             <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-50 text-gray-300">
               <Briefcase size={32} />
             </div>
             <p className="text-base font-medium text-gray-500">No pending assignments.</p>
           </div>
        ) : (
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase border-b border-gray-100 tracking-wider">
                  <th className="px-6 py-4 font-bold w-[45%]">Title</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Due Date</th>
                  <th className="px-6 py-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assignments.map((item: any) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-base font-bold text-[#101C50] line-clamp-2 leading-snug">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Assigned: {item.assignedDate}</p>
                    </td>
                    <td className="px-6 py-4">
                       <Badge type={item.category} />
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm font-semibold text-gray-700">{item.dueDate}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => onView(item)}
                        className="text-sm font-bold text-white bg-[#101C50] px-5 py-2.5 rounded-xl hover:bg-blue-900 transition-colors shadow-sm whitespace-nowrap"
                      >
                        Review
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

export default AssignmentsTable;
