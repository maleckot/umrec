'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import StatCard from '@/components/staff-secretariat-admin/StatCard';
import AttentionCard from '@/components/staff-secretariat-admin/AttentionCard';
import { useRouter } from 'next/navigation';
import { getSecretariatDashboardData } from '@/app/actions/secretariat-staff/secretariat/getSecretariatDashboardData';
import { Megaphone, Calendar, Plus, Trash2, MapPin, X, Video, AlertTriangle, Clock, Timer, AlertCircle } from 'lucide-react';

// --- Types ---
interface Announcement {
  id: string;
  title: string;
  type: 'Seminar' | 'Announcement';
  date: string;
  excerpt: string;
  mode: 'Onsite' | 'Virtual';
  location?: string;
  link?: string;
}

export default function SecretariatDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // --- Announcement State ---
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null); // Store ID of item to delete
  
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({
    type: 'Announcement',
    title: '',
    date: '',
    excerpt: '',
    mode: 'Onsite',
    location: '',
    link: ''
  });

  // Ref for the date input to trigger it programmatically
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDashboardData();
    loadAnnouncements(); 
  }, []);

  // --- Helpers for Due Dates ---
  const DEFAULT_DUE_DAYS = 7;
  const DUE_SOON_DAYS = 2;

  const toDateSafe = (value: any) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

  const formatShortDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getDueMeta = (submission: any) => {
    // Priority: dueDate -> submittedAt -> date -> null
    const baseDate = toDateSafe(submission.dueDate) 
      ?? toDateSafe(submission.submittedAt) 
      ?? toDateSafe(submission.date);

    if (!baseDate) return { due: null as Date | null, overdue: false, dueSoon: false };

    // If dueDate is not explicit, assume default SLA from submission date
    const due = submission.dueDate ? baseDate : addDays(baseDate, DEFAULT_DUE_DAYS);

    const now = new Date();
    // Normalize time to compare dates only
    now.setHours(0,0,0,0);
    const dueTime = new Date(due);
    dueTime.setHours(0,0,0,0);

    const msLeft = dueTime.getTime() - now.getTime();
    const overdue = msLeft < 0;
    const dueSoon = !overdue && msLeft <= DUE_SOON_DAYS * 24 * 60 * 60 * 1000;

    return { due, overdue, dueSoon };
  };

  // --- 1. Load Announcements ---
  const loadAnnouncements = () => {
    const stored = localStorage.getItem('secretariat_announcements');
    if (stored) {
      setAnnouncements(JSON.parse(stored));
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const result = await getSecretariatDashboardData();
      if (result.success) {
        setDashboardData(result);
      } else {
        console.error('Failed to load dashboard data:', result.error);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionClick = (submission: any) => {
      if (submission.status === 'Under Classification') router.push(`/secretariatmodule/submissions/details?id=${submission.id}`);
      else if (submission.status === 'Resubmit') router.push(`/secretariatmodule/submissions/assign-reviewers?id=${submission.id}`);
      else if (submission.status === 'Classified') router.push(`/secretariatmodule/submissions/assign-reviewers?id=${submission.id}`);
      else if (submission.status === 'Under Review') router.push(`/secretariatmodule/submissions/under-review?id=${submission.id}`);
      else if (submission.status === 'Approved') router.push(`/secretariatmodule/submissions/review-complete?id=${submission.id}`);
      else if (submission.status === 'Needs Revision') router.push(`/secretariatmodule/submissions/under-revision?id=${submission.id}`);
      else router.push(`/secretariatmodule/submissions/details?id=${submission.id}`);
  };

  // --- 2. Handle Adding New Announcement ---
  const handlePostAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.date || !newAnnouncement.excerpt) {
      alert("Please fill in all required fields.");
      return;
    }

    const post: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title!,
      type: newAnnouncement.type as 'Seminar' | 'Announcement',
      date: newAnnouncement.date!,
      excerpt: newAnnouncement.excerpt!,
      mode: newAnnouncement.mode as 'Onsite' | 'Virtual',
      location: newAnnouncement.mode === 'Onsite' ? newAnnouncement.location : undefined,
      link: newAnnouncement.mode === 'Virtual' ? newAnnouncement.link : undefined
    };

    const updatedList = [post, ...announcements];
    setAnnouncements(updatedList);
    localStorage.setItem('secretariat_announcements', JSON.stringify(updatedList));
    
    setNewAnnouncement({ type: 'Announcement', title: '', date: '', excerpt: '', mode: 'Onsite', location: '', link: '' });
    setShowAnnouncementModal(false);
  };

  // --- 3. Handle Delete (With Custom Modal) ---
  const confirmDelete = () => {
    if (showDeleteModal) {
      const updatedList = announcements.filter(a => a.id !== showDeleteModal);
      setAnnouncements(updatedList);
      localStorage.setItem('secretariat_announcements', JSON.stringify(updatedList));
      setShowDeleteModal(null);
    }
  };

  // Helper to trigger date picker on container click
  const openDatePicker = () => {
    if (dateInputRef.current) {
        if (typeof dateInputRef.current.showPicker === 'function') {
            dateInputRef.current.showPicker();
        } else {
            dateInputRef.current.focus();
        }
    }
  };

  const stats = [
    { label: 'Total Submissions', value: loading ? '...' : (dashboardData?.stats.totalSubmissions || 0).toString(), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { label: 'Pending Classification', value: loading ? '...' : (dashboardData?.stats.pendingClassification || 0).toString(), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: 'Active Reviewers', value: loading ? '...' : (dashboardData?.stats.activeReviewers || 0).toString(), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { label: 'Completed Classifications', value: loading ? '...' : (dashboardData?.stats.completedClassifications || 0).toString(), icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  const recentSubmissions = dashboardData?.recentSubmissions || [];
  const pendingClassification = dashboardData?.pendingClassification || [];
  const needsAttention = [
    { id: 1, count: dashboardData?.attention.needsClassification || 0, message: 'new submissions need document classification', subtext: 'These submissions need to be classified before assigning reviewers', action: 'Classify Submissions', route: '/secretariatmodule/submissions' },
    { id: 2, count: dashboardData?.attention.overdueReviews || 0, message: 'reviewers have overdue reviews', subtext: 'Some reviewers are late by more than 7 days', action: 'View Reviewers', route: '/secretariatmodule/reviewers' },
  ];

  // Calculate detailed Due Stats
  const dueStats = (() => {
    const all = [...pendingClassification, ...recentSubmissions];
    const overdueItems: any[] = [];
    const dueSoonItems: any[] = [];
    
    for (const s of all) {
      const meta = getDueMeta(s);
      if (meta.overdue) {
        overdueItems.push({ ...s, due: meta.due });
      } else if (meta.dueSoon) {
        dueSoonItems.push({ ...s, due: meta.due });
      }
    }
    return { overdueItems, dueSoonItems };
  })();

  if (loading) {
    return (
      <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Dashboard" activeNav="dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Dashboard" activeNav="dashboard">
      
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} label={stat.label} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* --- LARGE DEADLINE CARDS --- */}
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
               {dueStats.overdueItems.length}
             </span>
          </div>
          
          <div className="flex-1 bg-orange-50/50 rounded-lg p-3 overflow-y-auto max-h-[150px]">
             {dueStats.overdueItems.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-2">No overdue items.</p>
             ) : (
                <ul className="space-y-2">
                   {dueStats.overdueItems.map((item: any) => (
                      <li key={item.id} className="flex justify-between items-start text-sm border-b border-orange-100 pb-2 last:border-0 last:pb-0" onClick={() => handleSubmissionClick(item)}>
                         <span className="font-medium text-gray-700 truncate flex-1 pr-2 cursor-pointer hover:text-orange-700 hover:underline">{item.title}</span>
                         <span className="font-bold text-orange-700 whitespace-nowrap text-xs bg-orange-100 px-2 py-1 rounded">
                            Due: {formatShortDate(item.due)}
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
               {dueStats.dueSoonItems.length}
             </span>
          </div>

          <div className="flex-1 bg-yellow-50/50 rounded-lg p-3 overflow-y-auto max-h-[150px]">
             {dueStats.dueSoonItems.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-2">No items due soon.</p>
             ) : (
                <ul className="space-y-2">
                   {dueStats.dueSoonItems.map((item: any) => (
                      <li key={item.id} className="flex justify-between items-start text-sm border-b border-yellow-100 pb-2 last:border-0 last:pb-0" onClick={() => handleSubmissionClick(item)}>
                         <span className="font-medium text-gray-700 truncate flex-1 pr-2 cursor-pointer hover:text-yellow-700 hover:underline">{item.title}</span>
                         <span className="font-bold text-yellow-700 whitespace-nowrap text-xs bg-yellow-100 px-2 py-1 rounded">
                            Due: {formatShortDate(item.due)}
                         </span>
                      </li>
                   ))}
                </ul>
             )}
          </div>
        </div>

      </div>

      {/* 2. Pending Classification Table */}
      {pendingClassification.length > 0 && (
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6 lg:mb-8 w-full">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <h2 className="text-lg lg:text-xl font-bold break-words" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>Pending Classification</h2>
              <p className="text-sm text-gray-600 mt-1 break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>Submissions ready for classification</p>
            </div>
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>TITLE</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>SUBMITTED BY</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>DATE</th>
                  {/* Added Due Date Header */}
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>DUE DATE</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {pendingClassification.map((submission: any) => (
                  <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-left">
                      <p className="text-sm text-gray-800 truncate max-w-md" style={{ fontFamily: 'Metropolis, sans-serif' }}>{submission.title}</p>
                      <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>ID: {submission.submissionId}</p>
                    </td>
                    <td className="py-4 px-4 text-center"><p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>{submission.submittedBy}</p></td>
                    <td className="py-4 px-4 text-center"><p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>{submission.date}</p></td>
                    
                    {/* Due Date Cell */}
                    <td className="py-4 px-4 text-center">
                      {(() => {
                        const meta = getDueMeta(submission);
                        if (!meta.due) return <span className="text-xs text-gray-400">—</span>;

                        const badgeClass = meta.overdue
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : meta.dueSoon
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-green-100 text-green-700 border border-green-200';

                        const badgeText = meta.overdue ? 'Overdue' : meta.dueSoon ? 'Due soon' : 'On track';

                        return (
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {formatShortDate(meta.due)}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                              {badgeText}
                            </span>
                          </div>
                        );
                      })()}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button onClick={() => router.push(`/secretariatmodule/submissions/details?id=${submission.id}`)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors" style={{ fontFamily: 'Metropolis, sans-serif' }}>Classify</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-4">
            {pendingClassification.map((submission: any) => (
              <div key={submission.id} className="bg-gray-50 rounded-lg p-4 w-full border border-gray-100 shadow-sm">
                <p className="text-sm font-semibold text-gray-800 mb-2 break-words whitespace-normal leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>{submission.title}</p>
                <p className="text-xs text-gray-500 mb-3 break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>ID: {submission.submissionId}</p>
                
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex justify-between">
                     <p className="text-xs text-gray-600 break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>By: {submission.submittedBy}</p>
                     <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>{submission.date}</p>
                  </div>
                  
                  {/* Mobile Due Date Indicator */}
                  {(() => {
                    const meta = getDueMeta(submission);
                    if (!meta.due) return null;
                    const pillClass = meta.overdue ? 'bg-orange-100 text-orange-800' : meta.dueSoon ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700';
                    const pillText = meta.overdue ? 'Overdue' : meta.dueSoon ? 'Due soon' : 'On track';
                    return (
                        <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-200">
                           <span className="text-xs font-bold text-gray-500 uppercase">Deadline:</span>
                           <div className="flex items-center gap-2">
                                <span className="text-xs font-medium">{formatShortDate(meta.due)}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${pillClass}`}>{pillText}</span>
                           </div>
                        </div>
                    );
                  })()}
                </div>
                
                <button onClick={() => router.push(`/secretariatmodule/submissions/details?id=${submission.id}`)} className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors mt-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>Classify</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Recent Submissions */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 mb-6 lg:mb-8 w-full">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-bold break-words" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>Recent Submissions</h2>
          <button onClick={() => router.push('/secretariatmodule/submissions')} className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap ml-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>View All</button>
        </div>
        {recentSubmissions.length === 0 ? (
          <div className="text-center py-8"><p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>No papers to classify yet</p></div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>TITLE</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>DATE</th>
                    {/* Added Due Date Header */}
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>DUE DATE</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((submission: any) => (
                    <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleSubmissionClick(submission)}>
                      <td className="py-4 px-4 text-left">
                        <p className="text-sm text-gray-800 truncate max-w-md" style={{ fontFamily: 'Metropolis, sans-serif' }}>{submission.title}</p>
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>ID: {submission.submissionId}</p>
                      </td>
                      <td className="py-4 px-4 text-center"><p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>{submission.date}</p></td>
                      
                      {/* Due Date Cell */}
                      <td className="py-4 px-4 text-center">
                        {(() => {
                            const meta = getDueMeta(submission);
                            if (!meta.due) return <span className="text-xs text-gray-400">—</span>;
                            const colorClass = meta.overdue ? 'text-orange-700 font-bold' : meta.dueSoon ? 'text-yellow-700 font-bold' : 'text-gray-600';
                            return <p className={`text-sm ${colorClass}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>{formatShortDate(meta.due)}</p>;
                        })()}
                      </td>

                      <td className="py-4 px-4 text-center"><span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${submission.statusColor}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>{submission.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-4">
              {recentSubmissions.map((submission: any) => (
                <div key={submission.id} className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors w-full border border-gray-100" onClick={() => handleSubmissionClick(submission)}>
                  <p className="text-sm font-semibold text-gray-800 mb-2 break-words whitespace-normal" style={{ fontFamily: 'Metropolis, sans-serif' }}>{submission.title}</p>
                  <p className="text-xs text-gray-500 mb-3 break-all" style={{ fontFamily: 'Metropolis, sans-serif' }}>ID: {submission.submissionId}</p>
                  
                  {/* Mobile Date/Due/Status Row */}
                  <div className="flex flex-col gap-2">
                     <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>{submission.date}</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${submission.statusColor}`}>{submission.status}</span>
                     </div>
                     
                     {/* Mobile Due Date Row */}
                     {(() => {
                        const meta = getDueMeta(submission);
                        if (!meta.due) return null;
                        const cls = meta.overdue ? 'text-orange-700 bg-orange-50' : meta.dueSoon ? 'text-yellow-700 bg-yellow-50' : 'text-gray-600 bg-gray-100';
                        return (
                            <div className={`flex items-center justify-between px-2 py-1 rounded text-xs ${cls}`}>
                                <span className="font-semibold">Due: {formatShortDate(meta.due)}</span>
                                {meta.overdue && <span className="font-bold uppercase text-[10px]">Overdue</span>}
                            </div>
                        );
                     })()}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 4. Needs Attention */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 w-full mb-6 lg:mb-8">
        <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>Needs Attention</h2>
        <div className="space-y-4">
          {needsAttention.map((item) => (
            <AttentionCard key={item.id} count={item.count} message={item.message} subtext={item.subtext} action={item.action} onActionClick={() => router.push(item.route)} />
          ))}
        </div>
      </div>

      {/* 5. Manage Public Announcements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F8FAFC]">
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Manage Public Announcements
            </h2>
            <p className="text-sm text-gray-500 mt-1">Posts here will appear on the Home Page.</p>
          </div>
          <button 
            onClick={() => setShowAnnouncementModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#101C50] text-white rounded-lg font-bold text-sm hover:bg-blue-900 transition-colors shadow-sm"
          >
             <Plus size={16} /> Post New
          </button>
        </div>

        {/* List of Active Announcements */}
        <div className="divide-y divide-gray-100">
          {announcements.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-300">
                 <Megaphone size={32} />
              </div>
              <p className="text-gray-500 font-medium">No active announcements.</p>
            </div>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ann.type === 'Seminar' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {ann.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ann.mode === 'Virtual' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {ann.mode}
                      </span>
                      <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                         <Calendar size={12} /> {ann.date}
                      </span>
                   </div>
                   <h4 className="text-base font-bold text-[#101C50] mb-1">{ann.title}</h4>
                   <p className="text-sm text-gray-600 line-clamp-2">{ann.excerpt}</p>
                   {ann.mode === 'Onsite' && ann.location && (
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                         <MapPin size={12} /> {ann.location}
                      </p>
                   )}
                   {ann.mode === 'Virtual' && ann.link && (
                      <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
                         <Video size={12} /> <a href={ann.link} target="_blank" rel="noopener noreferrer" className="underline truncate max-w-xs">{ann.link}</a>
                      </p>
                   )}
                </div>
                <button 
                  onClick={() => setShowDeleteModal(ann.id)} 
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="Delete Post"
                >
                   <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- MODAL: Post New Announcement --- */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#101C50]">Post Announcement</h3>
                <button onClick={() => setShowAnnouncementModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
             </div>
             
             <div className="space-y-4">
                
                {/* 1. Type */}
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Post Type</label>
                   <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" checked={newAnnouncement.type === 'Announcement'} onChange={() => setNewAnnouncement({...newAnnouncement, type: 'Announcement'})} className="w-4 h-4 text-[#101C50]" />
                         <span className="text-sm font-medium text-gray-800">General Announcement</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" checked={newAnnouncement.type === 'Seminar'} onChange={() => setNewAnnouncement({...newAnnouncement, type: 'Seminar'})} className="w-4 h-4 text-[#101C50]" />
                         <span className="text-sm font-medium text-gray-800">Seminar / Event</span>
                      </label>
                   </div>
                </div>

                {/* 2. Mode (Onsite vs Virtual) */}
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Mode</label>
                   <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" checked={newAnnouncement.mode === 'Onsite'} onChange={() => setNewAnnouncement({...newAnnouncement, mode: 'Onsite'})} className="w-4 h-4 text-[#101C50]" />
                         <span className="text-sm font-medium text-gray-800">Onsite</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input type="radio" checked={newAnnouncement.mode === 'Virtual'} onChange={() => setNewAnnouncement({...newAnnouncement, mode: 'Virtual'})} className="w-4 h-4 text-[#101C50]" />
                         <span className="text-sm font-medium text-gray-800">Virtual / Online</span>
                      </label>
                   </div>
                </div>

                {/* 3. Title */}
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                   <input 
                     type="text" 
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                     placeholder="Title..."
                     value={newAnnouncement.title}
                     onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                   />
                </div>

                {/* 4. Date & Location/Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {/* FIXED DATE PICKER CONTAINER */}
                   <div onClick={openDatePicker} className="cursor-pointer relative">
                      <label className="block text-sm font-bold text-gray-700 mb-1 pointer-events-none">Date</label>
                      <div className="relative">
                         <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                         <input 
                           ref={dateInputRef}
                           type="date"
                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium cursor-pointer"
                           value={newAnnouncement.date}
                           onChange={(e) => setNewAnnouncement({...newAnnouncement, date: e.target.value})}
                           onClick={(e) => e.stopPropagation()} 
                         />
                      </div>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        {newAnnouncement.mode === 'Onsite' ? 'Venue / Location' : 'Meeting Link'}
                      </label>
                      <div className="relative">
                         {newAnnouncement.mode === 'Onsite' ? (
                            <>
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                              <input 
                                type="text" 
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                                placeholder="e.g. HPSB Auditorium"
                                value={newAnnouncement.location}
                                onChange={(e) => setNewAnnouncement({...newAnnouncement, location: e.target.value})}
                              />
                            </>
                         ) : (
                            <>
                              <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                              <input 
                                type="text" 
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-medium placeholder-gray-400"
                                placeholder="e.g. https://zoom.us/j/..."
                                value={newAnnouncement.link}
                                onChange={(e) => setNewAnnouncement({...newAnnouncement, link: e.target.value})}
                              />
                            </>
                         )}
                      </div>
                   </div>
                </div>

                {/* 5. Content */}
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Content</label>
                   <textarea 
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none text-gray-900 font-medium placeholder-gray-400"
                     placeholder="Details..."
                     value={newAnnouncement.excerpt}
                     onChange={(e) => setNewAnnouncement({...newAnnouncement, excerpt: e.target.value})}
                   ></textarea>
                </div>

                <div className="pt-4 flex gap-3">
                   <button onClick={() => setShowAnnouncementModal(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
                   <button onClick={handlePostAnnouncement} className="flex-1 py-2.5 bg-[#101C50] text-white font-bold rounded-xl hover:bg-blue-900 shadow-lg">Post</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- MODAL: Delete Confirmation --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                 <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Announcement?</h3>
              <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove this post from the public home page? This action cannot be undone.</p>
              
              <div className="flex gap-3">
                 <button 
                   onClick={() => setShowDeleteModal(null)}
                   className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={confirmDelete}
                   className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg transition-colors"
                 >
                   Delete
                 </button>
              </div>
           </div>
        </div>
      )}

    </DashboardLayout>
  );
}
