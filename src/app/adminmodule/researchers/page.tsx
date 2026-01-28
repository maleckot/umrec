'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import Pagination from '@/components/staff-secretariat-admin/Pagination';
import { getResearchers } from '@/app/actions/admin/getAdminResearchersTab';
import { Search, Filter, ChevronRight, User, Mail, Building2, Briefcase } from 'lucide-react';

export default function ResearchersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('All organization');
  const [collegeFilter, setCollegeFilter] = useState('Any');
  const [currentPage, setCurrentPage] = useState(1);
  const [researchers, setResearchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Responsive Placeholder State
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search by name, email, or college...');

  const itemsPerPage = 10;

  useEffect(() => {
    loadResearchers();
  }, []);

  // Dynamic Placeholder Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { // Small screens
        setSearchPlaceholder('Search name...');
      } else { // Desktop
        setSearchPlaceholder('Search by name, email, or college...');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadResearchers = async () => {
    setLoading(true);
    const result = await getResearchers();
    
    if (result.success) {
      setResearchers(result.researchers);
    } else {
      console.error('Failed to load researchers:', result.error);
    }
    
    setLoading(false);
  };

  const filteredData = useMemo(() => {
    let filtered = [...researchers];

    if (searchQuery) {
      filtered = filtered.filter(researcher =>
        researcher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        researcher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        researcher.college.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (organizationFilter !== 'All organization') {
      filtered = filtered.filter(researcher => researcher.organization === organizationFilter);
    }

    if (collegeFilter !== 'Any') {
      filtered = filtered.filter(researcher => researcher.college === collegeFilter);
    }

    return filtered;
  }, [researchers, searchQuery, organizationFilter, collegeFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, organizationFilter, collegeFilter]);

  const handleRowClick = (researcher: any) => {
    router.push(`/adminmodule/researchers/details?id=${researcher.id}`);
  };

  const resultsText = `Showing ${startIndex + 1}-${Math.min(endIndex, filteredData.length)} of ${filteredData.length} results`;

  return (
    <DashboardLayout role="admin" roleTitle="UMREC Admin" pageTitle="Researchers" activeNav="researchers">
      <div className="max-w-[1600px] mx-auto w-full pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden transition-all hover:shadow-md">
          
          {/* Formal Toolbar Section */}
          <div className="border-b border-gray-100 bg-white p-5 lg:p-8">
            <div className="flex flex-col gap-6">
              {/* Responsive Search Bar */}
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 text-base bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 transition-all placeholder-gray-400 font-medium"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
                {/* Organization Filter */}
                <div className="relative group">
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Organization
                  </label>
                  <div className="relative">
                    <select
                      value={organizationFilter}
                      onChange={(e) => setOrganizationFilter(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 cursor-pointer appearance-none transition-all"
                    >
                      <option value="All organization">All Organizations</option>
                      <option value="UMak">UMak</option>
                      <option value="External">External</option>
                    </select>
                    <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* College Filter */}
                <div className="relative group">
                  <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    College/Department
                  </label>
                  <div className="relative">
                    <select
                      value={collegeFilter}
                      onChange={(e) => setCollegeFilter(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 text-sm font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#101C50]/10 focus:border-[#101C50] text-gray-700 cursor-pointer appearance-none transition-all"
                    >
                      <option value="Any">All Colleges</option>
                      <option value="CCIS">CCIS</option>
                      <option value="COA">COA</option>
                      <option value="COB">COB</option>
                      <option value="COE">COE</option>
                      <option value="CHK">CHK</option>
                      <option value="ION">ION</option>
                      <option value="CTM">CTM</option>
                      <option value="CBFS">CBFS</option>
                      <option value="CCPPS">CCPPS</option>
                      <option value="CGPP">CGPP</option>
                      <option value="CS">CS</option>
                      <option value="SOL">SOL</option>
                    </select>
                    <Briefcase size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white p-4 lg:p-8">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#101C50] mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium tracking-wide text-sm">LOADING RESEARCHERS...</p>
              </div>
            ) : currentPageData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center opacity-70">
                <User className="text-gray-300 mb-4" size={48} />
                <p className="text-gray-800 text-lg font-bold mb-1">No researchers found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-between">
                <div>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm mb-6">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#101C50] text-white">
                          <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Researcher Name</th>
                          <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Contact</th>
                          <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Organization</th>
                          <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">College/Dept</th>
                          <th className="py-4 px-6 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentPageData.map((researcher) => (
                          <tr 
                            key={researcher.id} 
                            onClick={() => handleRowClick(researcher)}
                            className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#101C50] font-bold text-sm border border-blue-100">
                                  {researcher.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-[#101C50]">{researcher.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail size={14} className="text-gray-400" />
                                {researcher.email}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${
                                researcher.organization === 'UMak' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-purple-50 text-purple-700 border-purple-200'
                              }`}>
                                {researcher.organization}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                               <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                                  <span className="text-xs font-bold">{researcher.college}</span>
                               </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 mb-6">
                    {currentPageData.map((researcher) => (
                      <div 
                        key={researcher.id}
                        onClick={() => handleRowClick(researcher)}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#101C50] font-bold text-lg border border-blue-100">
                              {researcher.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-[#101C50]">{researcher.name}</h3>
                              <span className={`inline-flex px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                researcher.organization === 'UMak' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-purple-50 text-purple-700 border-purple-200'
                              }`}>
                                {researcher.organization}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-gray-300" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            <span className="truncate">{researcher.email}</span>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                <Building2 size={14} />
                                {researcher.college}
                              </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    resultsText={resultsText}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
