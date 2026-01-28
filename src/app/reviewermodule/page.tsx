// app/reviewermodule/page.tsx
'use client';

import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getReviewerDashboardData } from '@/app/actions/reviewer/getReviewerDashboardData';
import { 
  BookOpen, 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  Briefcase,
  AlertCircle,
  FileCheck,
  Shield,
  Scale,
  Book
} from 'lucide-react';

type TabType = 'all' | 'expedited' | 'full';

export default function ReviewerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [overdueActiveTab, setOverdueActiveTab] = useState<TabType>('all');

  // --- MODAL STATE ---
  const [viewingDocument, setViewingDocument] = useState<{ name: string; url: string } | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const result = await getReviewerDashboardData();
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

  const stats = {
    newAssignments: dashboardData?.stats.newAssignments || 0,
    overdueReviews: dashboardData?.stats.overdueReviews || 0,
    completedReviews: dashboardData?.stats.completedReviews || 0,
  };

  const allNewAssignments = dashboardData?.newAssignments || [];
  const allOverdueReviews = dashboardData?.overdueReviews || [];

  // Filter Logic
  const filterData = (data: any[], tab: TabType) => {
    if (tab === 'all') return data;
    const filterTerm = tab === 'expedited' ? 'expedited' : 'full review';
    return data.filter((a: any) => a.category?.toLowerCase().includes(filterTerm));
  };

  const filteredAssignments = filterData(allNewAssignments, activeTab);
  const filteredOverdueReviews = filterData(allOverdueReviews, overdueActiveTab);

  const handleViewSubmission = (assignment: any) => {
    router.push(`/reviewermodule/reviews/details?id=${assignment.submissionId}`);
  };

  // --- PDF HANDLERS ---
  
  const handleDownloadSOP = () => {
    const link = document.createElement('a');
    link.href = '/resources/sop.pdf'; 
    link.download = 'Standard_Operating_Procedures_2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewSOP = () => {
    setViewingDocument({
      name: 'Standard Operating Procedures 2025',
      url: '/resources/sop.pdf'
    });
  };

  // PHREB File 1
  const handleDownloadPHREB_Guidelines = () => {
    const link = document.createElement('a');
    link.href = '/resources/NEGRIHP.pdf'; 
    link.download = 'NEGRIHP_2022.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewPHREB_Guidelines = () => {
    setViewingDocument({
      name: 'National Ethical Guidelines (2022)',
      url: '/resources/NEGRIHP.pdf'
    });
  };

  // PHREB File 2
  const handleDownloadPHREB_Workbook = () => {
    const link = document.createElement('a');
    link.href = '/resources/phreb.pdf';
    link.download = 'PHREB_2020.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewPHREB_Workbook = () => {
    setViewingDocument({
      name: 'PHREB Standard Operating Procedures (2020)',
      url: '/resources/phreb.pdf'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F4F8]">
        <NavbarRoles role="reviewer" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#101C50] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#101C50] font-medium animate-pulse" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Loading Dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <NavbarRoles role="reviewer" />

      {/* Main Content Wrapper */}
      <div className="flex-grow pt-32 pb-16 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto w-full">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#101C50] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Reviewer Dashboard
            </h1>
            <p className="text-gray-500 text-base">
              Manage your review assignments and access ethics resources.
            </p>
          </div>
          <div className="text-right hidden md:block bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Today's Date</p>
            <p className="text-base font-bold text-[#101C50]">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* --- STATS GRID --- */}
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

        {/* --- MAIN DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* --- LEFT COLUMN: ASSIGNMENTS (2/3 width) --- */}
          <div className="lg:col-span-2 flex flex-col gap-8 lg:h-full">
            
            {/* New Assignments Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full flex flex-col min-h-[500px] lg:min-h-0 lg:flex-[3]">
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
                {filteredAssignments.length === 0 ? (
                   <EmptyState message="No pending assignments." type="assignment" />
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
                        {filteredAssignments.map((item: any) => (
                          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="text-base font-bold text-[#101C50] line-clamp-2 leading-snug">{item.title}</p>
                              <p className="text-xs text-gray-400 mt-1 font-medium">Assigned: {item.assignedDate}</p>
                            </td>
                            <td className="px-6 py-4">
                               <Badge type={item.category} />
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-sm font-semibold text-gray-700">{item.dueDate}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => handleViewSubmission(item)}
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

            {/* Overdue Section */}
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
                            onClick={() => setOverdueActiveTab(tab as TabType)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                              overdueActiveTab === tab 
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
                    {filteredOverdueReviews.length === 0 ? (
                       <EmptyState message="Great job! No overdue reviews." icon="check" type="overdue" />
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
                            {filteredOverdueReviews.map((item: any) => (
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
                                    onClick={() => handleViewSubmission(item)}
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

          </div>

          {/* --- RIGHT COLUMN: RESOURCES (1/3 width) --- */}
          <div className="space-y-8 w-full flex flex-col lg:h-full">
            
            {/* Resources Header */}
            <div>
               <h3 className="text-xl font-bold text-[#101C50] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                 Reference Materials
               </h3>
               <p className="text-sm text-gray-500">
                 Access standard guidelines and procedures.
               </p>
            </div>

            {/* SOP Card */}
            <div className="group bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden flex-1 flex flex-col">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BookOpen size={120} className="text-[#101C50]" />
               </div>
               
               <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shadow-inner flex-shrink-0">
                     <FileText size={24} />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-[#101C50] leading-tight">Standard Operating Procedures</h4>
                     <p className="text-xs text-gray-500 mt-1 font-medium">Version 2025 • 33 Chapters</p>
                  </div>
               </div>
               
               <div className="space-y-4 mb-6 flex-grow">
                  <p className="text-sm text-gray-600 leading-relaxed">
                     Complete guide on review classifications, ethical standards, and committee protocols.
                  </p>
                  <ul className="space-y-3 mt-4">
                     <li className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><FileCheck size={12} /></div>
                        Review Classifications & Criteria
                     </li>
                     <li className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Scale size={12} /></div>
                        Ethical Review Standards
                     </li>
                     <li className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Clock size={12} /></div>
                        Turnaround Time & Deadlines
                     </li>
                  </ul>
               </div>

               <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button 
                    onClick={handleDownloadSOP}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-bold bg-[#101C50] text-white py-3 rounded-xl hover:bg-blue-900 transition-colors shadow-sm"
                  >
                     <Download size={16} /> Download
                  </button>
                  <button 
                    onClick={handleViewSOP}
                    className="flex items-center justify-center w-14 bg-white text-gray-600 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors"
                    title="View SOP"
                  >
                     <Eye size={20} />
                  </button>
               </div>
            </div>

            {/* PHREB Card */}
            <div className="group bg-gradient-to-br from-[#101C50] to-[#1a2d70] rounded-2xl p-7 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden text-white flex-1 flex flex-col">
               <div className="absolute -bottom-6 -right-6 p-4 opacity-10">
                  <Briefcase size={160} className="text-white" />
               </div>

               <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 shadow-inner flex-shrink-0">
                     <Shield size={24} />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold leading-tight">PHREB Guidelines</h4>
                     <p className="text-xs text-blue-200 mt-1 font-medium">National Ethical Standards</p>
                  </div>
               </div>

               <div className="space-y-4 mb-6 relative z-10 flex-grow">
                  <p className="text-sm text-blue-100 leading-relaxed">
                     The official national guidelines and workbook for health research ethics.
                  </p>
                  
                  {/* Two Files List */}
                  <div className="space-y-3 mt-4">
                     
                     {/* File 1: Guidelines */}
                     <div className="bg-white/10 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-white/10 hover:bg-white/20 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                              <Book size={16} className="text-white" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-white leading-tight">National Guidelines (2022)</p>
                              <p className="text-[10px] text-blue-200">Ethical Standards</p>
                           </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                           <button 
                              onClick={handleViewPHREB_Guidelines}
                              className="p-2 bg-white/10 hover:bg-white/30 rounded-lg transition-colors flex-1 sm:flex-none flex justify-center"
                              title="View"
                           >
                              <Eye size={16} />
                           </button>
                           <button 
                              onClick={handleDownloadPHREB_Guidelines}
                              className="p-2 bg-white text-[#101C50] hover:bg-blue-50 rounded-lg transition-colors flex-1 sm:flex-none flex justify-center"
                              title="Download"
                           >
                              <Download size={16} />
                           </button>
                        </div>
                     </div>

                     {/* File 2: Workbook */}
                     <div className="bg-white/10 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-white/10 hover:bg-white/20 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                              <FileCheck size={16} className="text-white" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-white leading-tight">PHREB Standard Operating Procedures (2020)</p>
                              <p className="text-[10px] text-blue-200">Practical Guide</p>
                           </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                           <button 
                              onClick={handleViewPHREB_Workbook}
                              className="p-2 bg-white/10 hover:bg-white/30 rounded-lg transition-colors flex-1 sm:flex-none flex justify-center"
                              title="View"
                           >
                              <Eye size={16} />
                           </button>
                           <button 
                              onClick={handleDownloadPHREB_Workbook}
                              className="p-2 bg-white text-[#101C50] hover:bg-blue-50 rounded-lg transition-colors flex-1 sm:flex-none flex justify-center"
                              title="Download"
                           >
                              <Download size={16} />
                           </button>
                        </div>
                     </div>

                  </div>
               </div>
            </div>

          </div>

        </div>
      </div>
      <Footer />

      {/* --- DOCUMENT VIEWER MODAL --- */}
      {viewingDocument && (
        <DocumentViewerModal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          documentName={viewingDocument.name}
          documentUrl={viewingDocument.url}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, count, icon, color }: { title: string, count: number, icon: React.ReactNode, color: 'blue' | 'red' | 'green' }) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    green: 'bg-green-50 text-green-700 border-green-100'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
        <p className="text-3xl font-bold text-[#101C50]">{count}</p>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${colorStyles[color]}`}>
        {icon}
      </div>
    </div>
  );
}

function Badge({ type }: { type: string }) {
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
}

function EmptyState({ message, icon, type }: { message: string, icon?: string, type?: 'assignment' | 'overdue' }) {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 h-full">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
        icon === 'check' 
          ? 'bg-green-50 text-green-500' 
          : 'bg-gray-50 text-gray-300'
      }`}>
        {icon === 'check' ? <CheckCircle size={32} /> : <Briefcase size={32} />}
      </div>
      <p className="text-base font-medium text-gray-500">{message}</p>
    </div>
  );
}
