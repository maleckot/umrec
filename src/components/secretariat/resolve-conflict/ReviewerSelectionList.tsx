'use client';

import { UserCheck } from 'lucide-react';

interface Props {
  reviewers: any[];
  selectedReviewer: string | null;
  onSelect: (id: string) => void;
}

const ReviewerSelectionList = ({ reviewers, selectedReviewer, onSelect }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-[#101C50] mb-6 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <UserCheck size={20} />
        Select Replacement Reviewer
      </h3>

      <div className="space-y-3">
        {reviewers.length === 0 ? (
           <p className="text-gray-500 italic p-4 text-center font-medium">No eligible reviewers found (others may already be assigned).</p>
        ) : (
           reviewers.map((reviewer) => (
             <label 
               key={reviewer.id} 
               className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                 selectedReviewer === reviewer.id 
                   ? 'border-[#101C50] bg-blue-50/50' 
                   : 'border-gray-100 hover:border-blue-200'
               }`}
             >
               <div className="flex items-center gap-4">
                 <input 
                   type="radio" 
                   name="reviewer"
                   className="w-5 h-5 text-[#101C50] accent-[#101C50]"
                   checked={selectedReviewer === reviewer.id}
                   onChange={() => onSelect(reviewer.id)}
                 />
                 <div>
                   <p className="font-bold text-[#101C50]">{reviewer.full_name}</p>
                   <p className="text-xs text-gray-500 font-medium">
                     {reviewer.expertise_areas && reviewer.expertise_areas.length > 0 
                       ? reviewer.expertise_areas.join(', ') 
                       : 'General Reviewer'} 
                   </p>
                 </div>
               </div>
               <div className="text-right">
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                     Available
                   </span>
               </div>
             </label>
           ))
        )}
      </div>
    </div>
  );
};

export default ReviewerSelectionList;
