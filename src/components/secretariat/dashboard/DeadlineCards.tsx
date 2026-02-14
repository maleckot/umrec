'use client';

import { AlertCircle, Clock } from 'lucide-react';

interface Props {
  overdueItems: any[];
  dueSoonItems: any[];
  onItemClick: (item: any) => void;
}

const formatShortDate = (d: Date) =>
    d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const DeadlineCards = ({ overdueItems, dueSoonItems, onItemClick }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 lg:mb-8">
        
        {/* OVERDUE CARD */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500 w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-orange-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>Overdue</h3>
                  <p className="text-sm text-gray-500">Action needed immediately</p>
               </div>
             </div>
             <span className="text-3xl font-bold text-orange-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
               {overdueItems.length}
             </span>
          </div>
          
          <div className="flex-1 bg-orange-50/50 rounded-lg p-3 overflow-y-auto max-h-[150px] custom-scrollbar">
             {overdueItems.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-2">No overdue items.</p>
             ) : (
                <ul className="space-y-2">
                   {overdueItems.map((item: any) => (
                      <li key={item.id} className="flex justify-between items-start text-sm border-b border-orange-100 pb-2 last:border-0 last:pb-0 cursor-pointer hover:bg-orange-100/50 rounded px-1 transition-colors" onClick={() => onItemClick(item)}>
                         <span className="font-medium text-gray-700 truncate flex-1 pr-2 hover:text-orange-700 hover:underline">{item.title}</span>
                         <span className="font-bold text-orange-700 whitespace-nowrap text-xs bg-orange-100 px-2 py-1 rounded">
                            Due: {formatShortDate(new Date(item.due))}
                         </span>
                      </li>
                   ))}
                </ul>
             )}
          </div>
        </div>

        {/* DUE SOON CARD */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-400 w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>Due Soon</h3>
                  <p className="text-sm text-gray-500">Upcoming within 48 hours</p>
               </div>
             </div>
             <span className="text-3xl font-bold text-yellow-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
               {dueSoonItems.length}
             </span>
          </div>

          <div className="flex-1 bg-yellow-50/50 rounded-lg p-3 overflow-y-auto max-h-[150px] custom-scrollbar">
             {dueSoonItems.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-2">No items due soon.</p>
             ) : (
                <ul className="space-y-2">
                   {dueSoonItems.map((item: any) => (
                      <li key={item.id} className="flex justify-between items-start text-sm border-b border-yellow-100 pb-2 last:border-0 last:pb-0 cursor-pointer hover:bg-yellow-100/50 rounded px-1 transition-colors" onClick={() => onItemClick(item)}>
                         <span className="font-medium text-gray-700 truncate flex-1 pr-2 hover:text-yellow-700 hover:underline">{item.title}</span>
                         <span className="font-bold text-yellow-700 whitespace-nowrap text-xs bg-yellow-100 px-2 py-1 rounded">
                            Due: {formatShortDate(new Date(item.due))}
                         </span>
                      </li>
                   ))}
                </ul>
             )}
          </div>
        </div>
    </div>
  );
};

export default DeadlineCards;
