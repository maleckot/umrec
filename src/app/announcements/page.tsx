'use client';

import { useState, useEffect } from 'react';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { Megaphone, Calendar, MapPin, X, ArrowRight, Search, Filter, Video, Globe } from 'lucide-react';
import { getPublicAnnouncements } from '@/app/actions/homepage/getPublicAnnouncements'; 

// --- Types ---
interface Announcement {  
  id: string;
  type: 'Seminar' | 'Announcement';
  mode?: 'Onsite' | 'Virtual';
  title: string;
  date: string;
  location?: string;
  link?: string;
  description: string;
  content: string;
}

export default function AnnouncementsPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Seminar' | 'Announcement'>('All');
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);
  const [items, setItems] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // 👈 Added loading state

  // --- Load Data from Database ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPublicAnnouncements();

        // Map DB Data to UI Interface
        const mappedItems: Announcement[] = data.map((item: any) => ({
          id: item.id,
          type: item.type,
          mode: item.mode,
          title: item.title,
          // Format the date nicely
          date: new Date(item.event_date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          location: item.location,
          link: item.link,
          // Use content for description (it gets truncated in the UI via line-clamp)
          description: item.content, 
          content: item.content
        }));

        setItems(mappedItems);
      } catch (error) {
        console.error("Failed to load announcements", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Filter Logic ---
  const filteredItems = items.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <NavbarRoles role="main" />

      {/* --- HERO HEADER --- */}
      <div className="bg-[#101C50] text-white pt-32 pb-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D3CC50] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Announcements & Seminars
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest news, training schedules, and important advisories.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 -mt-8">
        
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 sm:p-4 mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
            {['All', 'Seminar', 'Announcement'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md text-sm font-bold transition-all ${
                  activeFilter === filter 
                    ? 'bg-white text-[#101C50] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter}s
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
             <input 
               type="text" 
               placeholder="Search updates..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
             />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div>
          </div>
        )}

        {/* Grid Layout */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1 h-full"
              >
                <div className={`h-1.5 w-full ${item.type === 'Seminar' ? 'bg-[#D3CC50]' : 'bg-[#101C50]'}`}></div>
                
                <div className="p-6 flex flex-col flex-grow">
                  {/* Badges Row */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.type === 'Seminar' ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {item.type}
                    </span>
                    
                    {item.mode && (
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.mode === 'Virtual' ? 'bg-purple-50 text-purple-700' : 'bg-green-50 text-green-700'
                       }`}>
                          {item.mode === 'Virtual' ? <Globe size={10} /> : <MapPin size={10} />}
                          {item.mode}
                       </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="text-gray-400 text-xs font-bold flex items-center gap-1 mb-2">
                     <Calendar size={12} /> {item.date}
                  </div>

                  <h3 className="text-lg font-bold text-[#101C50] mb-3 line-clamp-2 group-hover:text-blue-800 transition-colors" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Footer Info */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                     {/* Location OR Link Logic */}
                     <div className="flex-1 pr-2">
                       {item.mode === 'Onsite' && item.location && (
                         <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 truncate">
                           <MapPin size={12} /> {item.location}
                         </span>
                       )}
                       {item.mode === 'Virtual' && (
                         <span className="text-xs font-semibold text-blue-500 flex items-center gap-1 truncate">
                           <Video size={12} /> Online
                         </span>
                       )}
                     </div>
                     
                     <button 
                       onClick={() => setSelectedItem(item)}
                       className="text-sm font-bold text-[#101C50] hover:text-[#D3CC50] transition-colors flex items-center gap-1 whitespace-nowrap"
                     >
                       Read More <ArrowRight size={14} />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
           <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                 <Filter size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-600">No updates found</h3>
              <p className="text-gray-400 text-sm">Try changing the filter or search term.</p>
           </div>
        )}
      </div>

      <Footer />

      {/* --- READ MORE MODAL --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 relative">
              
              {/* Header */}
              <div className={`h-24 sm:h-32 w-full relative ${selectedItem.type === 'Seminar' ? 'bg-[#D3CC50]' : 'bg-[#101C50]'} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <h3 className="relative z-10 text-white text-2xl sm:text-3xl font-bold px-6 text-center drop-shadow-md">
                   {selectedItem.type}
                </h3>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors z-20"
                >
                   <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                   <span className="flex items-center gap-1.5 text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Calendar size={16} /> {selectedItem.date}
                   </span>

                   {selectedItem.mode === 'Onsite' && selectedItem.location && (
                      <span className="flex items-center gap-1.5 text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                         <MapPin size={16} className="text-red-500" /> {selectedItem.location}
                      </span>
                   )}

                   {selectedItem.mode === 'Virtual' && selectedItem.link && (
                      <a 
                        href={selectedItem.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                          <Video size={16} /> Join Meeting
                      </a>
                   )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#101C50] mb-6 leading-tight" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                   {selectedItem.title}
                </h2>

                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                   <p className="whitespace-pre-line">{selectedItem.content}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                   <button 
                     onClick={() => setSelectedItem(null)}
                     className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                   >
                      Close
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}