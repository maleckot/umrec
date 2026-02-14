import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Video } from 'lucide-react';

interface Announcement {
  id: string;
  type: string;
  title: string;
  content: string;
  event_date: string;
  mode: string;
  location?: string;
}

export default function AnnouncementsSection({ announcements }: { announcements: Announcement[] }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="py-12 px-4 sm:px-8 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl md:text-4xl text-[#101C50]" style={{ fontWeight: 800 }}>ANNOUNCEMENTS<div className="w-20 h-1 bg-[#D3CC50]"></div></h2>
            <Link href="/announcements" className="hidden md:flex items-center gap-2 text-[#101C50] font-bold hover:text-blue-700">View All <ArrowRight size={20}/></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.length === 0 && <div className="col-span-full text-center py-10 bg-gray-50 rounded-2xl border border-dashed text-gray-500">No active announcements.</div>}
            {announcements.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl p-6 border shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#101C50] group-hover:bg-[#D3CC50] transition-colors"></div>
                <div className="flex justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.type === 'Seminar' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}>{item.type}</span>
                  <span className="text-gray-400 text-xs font-medium flex gap-1"><Calendar size={14} /> {formatDate(item.event_date)}</span>
                </div>
                <h3 className="text-xl font-bold text-[#101C50] mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.content}</p>
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border flex gap-2">{item.mode === 'Onsite' ? <><MapPin size={12}/> {item.location}</> : <><Video size={12}/> Online</>}</span>
                    <span className="text-sm font-bold text-[#D3CC50] flex items-center cursor-pointer">Read More <ArrowRight size={16} className="ml-1"/></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>
    </>
  );
}
