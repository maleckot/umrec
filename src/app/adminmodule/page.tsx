'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import { getAdminDashboardData } from '@/app/actions/admin/getAdminDashboardData';
import { FileText, Users, Activity, ChevronRight, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const result = await getAdminDashboardData();
    if (result.success) {
      setDashboardData(result);
    }
    setLoading(false);
  };

  const handleSubmissionClick = (submission: any) => {
    router.push(`/adminmodule/submissions/details?id=${submission.id}`);
  };

  function formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'new_submission': 'New Submission',
      'pending_review': 'Review Pending',
      'awaiting_classification': 'Under Classification',
      'under_review': 'Under Review',
      'classified': 'Classified',
      'review_complete': 'Review Complete',
      'reviewed': 'Reviewed',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'needs_revision': 'Needs Revision',
      'revision_requested': 'Revision Requested',
      'pending_verification': 'Pending Verification',
      'completed': 'Completed',
    };
    return statusMap[status] || status;
  }

  function getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'new_submission': 'bg-blue-50 text-blue-700 border-blue-200',
      'pending_review': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'awaiting_classification': 'bg-amber-50 text-amber-700 border-amber-200',
      'under_review': 'bg-violet-50 text-violet-700 border-violet-200',
      'classified': 'bg-teal-50 text-teal-700 border-teal-200',
      'review_complete': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'reviewed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'approved': 'bg-green-50 text-green-700 border-green-200',
      'rejected': 'bg-rose-50 text-rose-700 border-rose-200',
      'needs_revision': 'bg-orange-50 text-orange-700 border-orange-200',
      'revision_requested': 'bg-orange-50 text-orange-700 border-orange-200',
      'pending_verification': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    return colorMap[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Admin Dashboard" activeNav="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50] mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium tracking-wide text-sm">LOADING DASHBOARD...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Admin Dashboard" activeNav="dashboard">
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Failed to load dashboard data
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const { stats, recentSubmissions, reviewerWorkload } = dashboardData;

  return (
    <DashboardLayout role="admin" roleTitle="Admin" pageTitle="Admin Dashboard" activeNav="dashboard">
      <div className="max-w-[1600px] mx-auto w-full pb-8">
        
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          
          {/* Total Submissions Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#101C50]">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
                    Overview
                  </span>
               </div>
               <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Submissions</h3>
               <p className="text-4xl font-bold text-[#101C50] mb-6">{stats.totalSubmissions}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-50">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <Clock size={14} className="text-amber-500" />
                     <span className="text-xs font-bold text-gray-500 uppercase">Pending</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{stats.pendingReview}</p>
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <Activity size={14} className="text-indigo-500" />
                     <span className="text-xs font-bold text-gray-500 uppercase">Active</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{stats.underReview}</p>
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <CheckCircle size={14} className="text-emerald-500" />
                     <span className="text-xs font-bold text-gray-500 uppercase">Done</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">{stats.completed}</p>
               </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
               <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700">
                    <Users size={24} />
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wide">
                    Community
                  </span>
               </div>
               <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Active Users</h3>
               <p className="text-4xl font-bold text-[#101C50] mb-6">{stats.totalUsers}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-50">
               <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Researchers</p>
                  <p className="text-lg font-bold text-gray-800">{stats.researchers}</p>
               </div>
               <div>
                   <p className="text-xs font-bold text-gray-400 uppercase mb-1">Reviewers</p>
                   <p className="text-lg font-bold text-gray-800">{stats.reviewers}</p>
               </div>
               <div>
                   <p className="text-xs font-bold text-gray-400 uppercase mb-1">Staff</p>
                   <p className="text-lg font-bold text-gray-800">{stats.staff}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
           <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#101C50] flex items-center gap-2">
                 <Clock size={20} className="text-gray-400" />
                 Recent Submissions
              </h2>
           </div>

           {/* Desktop Table */}
           <div className="hidden md:block">
              <table className="w-full">
                 <thead>
                    <tr className="bg-[#101C50] text-white">
                       <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Title</th>
                       <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Date</th>
                       <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Status</th>
                       <th className="py-4 px-6 w-10"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {recentSubmissions.length === 0 ? (
                       <tr>
                          <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                             No recent submissions found
                          </td>
                       </tr>
                    ) : (
                       recentSubmissions.map((submission: any) => (
                          <tr 
                             key={submission.id}
                             onClick={() => handleSubmissionClick(submission)}
                             className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                          >
                             <td className="py-4 px-6">
                                <p className="text-sm font-bold text-[#101C50] truncate max-w-md">
                                   {submission.title}
                                </p>
                             </td>
                             <td className="py-4 px-6 text-center text-sm text-gray-600 font-medium">
                                {formatDate(submission.submitted_at)}
                             </td>
                             <td className="py-4 px-6 text-center">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(submission.status)}`}>
                                   {formatStatus(submission.status)}
                                </span>
                             </td>
                             <td className="py-4 px-6 text-right">
                                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>

           {/* Mobile List */}
           <div className="md:hidden p-4 space-y-4">
              {recentSubmissions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No recent submissions</p>
              ) : (
                  recentSubmissions.map((submission: any) => (
                     <div 
                        key={submission.id}
                        onClick={() => handleSubmissionClick(submission)}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                     >
                        <div className="flex items-start justify-between gap-3 mb-3">
                           <h3 className="text-sm font-bold text-[#101C50] line-clamp-2 leading-snug">
                              {submission.title}
                           </h3>
                           <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-1" />
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                              <Clock size={12} />
                              {formatDate(submission.submitted_at)}
                           </span>
                           <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(submission.status)}`}>
                              {formatStatus(submission.status)}
                           </span>
                        </div>
                     </div>
                  ))
              )}
           </div>
        </div>

        {/* Reviewer Workload */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#101C50] flex items-center gap-2">
                 <BarChart3 size={20} className="text-gray-400" />
                 Reviewer Workload
              </h2>
           </div>

           {/* Desktop Table */}
           <div className="hidden md:block">
              <table className="w-full">
                 <thead>
                    <tr className="bg-[#101C50] text-white">
                       <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Reviewer</th>
                       <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Assigned</th>
                       <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Completed</th>
                       <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Pending</th>
                       <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Overdue</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {reviewerWorkload.length === 0 ? (
                       <tr>
                          <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                             No workload data available
                          </td>
                       </tr>
                    ) : (
                       reviewerWorkload.map((reviewer: any) => (
                          <tr key={reviewer.id} className="hover:bg-gray-50 transition-colors">
                             <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                      {reviewer.reviewer.charAt(0)}
                                   </div>
                                   <span className="text-sm font-bold text-[#101C50]">{reviewer.reviewer}</span>
                                </div>
                             </td>
                             <td className="py-4 px-6 text-center text-sm font-medium text-gray-600">{reviewer.assigned}</td>
                             <td className="py-4 px-6 text-center text-sm font-medium text-emerald-600">{reviewer.completed}</td>
                             <td className="py-4 px-6 text-center text-sm font-medium text-amber-600">{reviewer.pending}</td>
                             <td className="py-4 px-6 text-center">
                                {reviewer.overdue > 0 ? (
                                   <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-bold">
                                      <AlertCircle size={12} />
                                      {reviewer.overdue}
                                   </span>
                                ) : (
                                   <span className="text-gray-400 text-sm">-</span>
                                )}
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>

           {/* Mobile Cards */}
           <div className="md:hidden p-4 space-y-4">
              {reviewerWorkload.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No data available</p>
              ) : (
                  reviewerWorkload.map((reviewer: any) => (
                     <div key={reviewer.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold">
                              {reviewer.reviewer.charAt(0)}
                           </div>
                           <h3 className="text-sm font-bold text-[#101C50]">{reviewer.reviewer}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                           <div className="bg-gray-50 p-2 rounded-lg text-center">
                              <span className="block text-gray-400 font-bold uppercase text-[10px] mb-1">Assigned</span>
                              <span className="text-base font-bold text-gray-800">{reviewer.assigned}</span>
                           </div>
                           <div className="bg-emerald-50 p-2 rounded-lg text-center">
                              <span className="block text-emerald-400 font-bold uppercase text-[10px] mb-1">Completed</span>
                              <span className="text-base font-bold text-emerald-700">{reviewer.completed}</span>
                           </div>
                           <div className="bg-amber-50 p-2 rounded-lg text-center">
                              <span className="block text-amber-400 font-bold uppercase text-[10px] mb-1">Pending</span>
                              <span className="text-base font-bold text-amber-700">{reviewer.pending}</span>
                           </div>
                           <div className={`p-2 rounded-lg text-center ${reviewer.overdue > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                              <span className={`block font-bold uppercase text-[10px] mb-1 ${reviewer.overdue > 0 ? 'text-red-400' : 'text-gray-400'}`}>Overdue</span>
                              <span className={`text-base font-bold ${reviewer.overdue > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                                 {reviewer.overdue}
                              </span>
                           </div>
                        </div>
                     </div>
                  ))
              )}
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
