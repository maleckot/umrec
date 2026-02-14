'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, FileText } from 'lucide-react'; 
import { Submission } from '@/types/researcher';

interface Props {
  submissions: Submission[];
  onViewDocument: (name: string, url: string | null) => void;
}

export default function RecentActivity({ submissions, onViewDocument }: Props) {
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  const filteredSubmissions = submissions.filter(submission => {
    if (activeTab === 'all') return true;
    if (activeTab === 'revision') {
      const hasRejectedDocs = submission.documents?.some(doc => doc.needsRevision === true);
      return hasRejectedDocs || submission.status === 'Under Revision';
    }
    if (activeTab === 'pending') {
      if (submission.status === 'review_complete') return false;
      const hasPendingDocs = submission.documents?.some(doc => doc.isApproved === null);
      return hasPendingDocs || submission.status === 'under_review';
    }
    if (activeTab === 'approved') {
      const allApproved = submission.documents?.every(doc => doc.isApproved === true);
      return allApproved || submission.status === 'review_complete';
    }
    return true;
  });

  return (
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
        <span className="w-1 h-6 sm:h-7 md:h-8 bg-gradient-to-b from-[#101C50] to-[#F0E847] rounded-full"></span>
        Recent Activity
      </h2>

      {/* Mobile Dropdown (Visible on small screens) */}
      <div className="mb-4 sm:hidden">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-[#101C50] focus:border-[#101C50] outline-none transition-all"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          <option value="all">All Activities</option>
          <option value="revision">Revision</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Desktop Tabs (Visible on larger screens) */}
      <div className="hidden sm:flex mb-6 gap-2 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {['all', 'revision', 'pending', 'approved'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab 
              ? 'bg-gradient-to-r from-[#101C50] to-[#1a2d6e] text-white shadow-md' 
              : 'text-gray-600 hover:text-[#101C50]'
            }`}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {tab === 'all' ? 'All Activities' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-2 sm:space-y-3">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>No activities found.</p>
          </div>
        ) : (
          filteredSubmissions.map(sub => (
            sub.documents?.map(doc => {
               // Determine logic inside map
               const needsRevision = doc.needsRevision || (doc.fileType === 'consolidated_application' && sub.status === 'under_revision');
               
               return (
                  <div key={`${sub.id}-${doc.id}`} className="group bg-white rounded-xl border border-gray-200 hover:border-[#101C50] shadow-sm hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                    
                    {/* Icon - Changed to FileText */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md transition-colors ${
                      needsRevision ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#101C50]'
                    }`}>
                      <FileText size={20} />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {doc.displayTitle || doc.fileType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </h3>
                        {needsRevision && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wide">
                            Action Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {sub.title}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                      <button 
                        onClick={() => onViewDocument(doc.fileName, doc.fileUrl)}
                        className="flex-1 sm:flex-none p-2 rounded-lg text-gray-400 hover:text-[#101C50] hover:bg-gray-50 transition-colors"
                        title="Quick View"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <button 
                        onClick={() => {
                          if (needsRevision) {
                            router.push(`/researchermodule/submissions/revision/?id=${sub.id}`);
                          } else {
                            router.push(`/researchermodule/activity-details?id=${sub.id}&docId=${doc.id}`);
                          }
                        }}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-sm hover:shadow transition-all ${
                          needsRevision 
                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                            : 'bg-gradient-to-r from-[#101C50] to-[#1a2d6e] hover:from-[#1a2d6e] hover:to-[#243b8a]'
                        }`}
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        {needsRevision ? 'Revise Submission' : 'View Details'}
                      </button>
                    </div>
                  </div>
               );
            })
          ))
        )}
      </div>
    </div>
  );
}
