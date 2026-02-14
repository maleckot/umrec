'use client';

import { Plus, Trash2, MapPin, Calendar, Edit2 } from 'lucide-react';

interface Props {
  announcements: any[];
  onAddClick: () => void;
  onEditClick: (item: any) => void; // Added back
  onDeleteClick: (id: string) => void;
}

const AnnouncementsCard = ({ announcements, onAddClick, onEditClick, onDeleteClick }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Manage Public Announcements
            </h3>
            <button 
                onClick={(e) => { e.stopPropagation(); onAddClick(); }}
                className="bg-[#101C50] hover:bg-[#1a2d70] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
                <Plus className="w-4 h-4" /> Post New
            </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">Posts here will appear on the Home Page.</p>

        <div className="divide-y divide-gray-50">
            {announcements.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-sm">No announcements posted.</div>
            ) : (
                announcements.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => onEditClick(item)} // Make card clickable to edit (pop-out)
                        className="py-6 first:pt-0 last:pb-0 group cursor-pointer hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2"
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1 mr-4">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                        item.type === 'Seminar' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {item.type}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-green-100 text-green-800">
                                        {item.mode}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {item.date}
                                    </span>
                                </div>
                                <h4 className="font-bold text-lg text-[#101C50] group-hover:text-blue-700 transition-colors">{item.title}</h4>
                                <p className="text-sm text-gray-500 uppercase tracking-wide font-medium line-clamp-2">{item.excerpt}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {item.location}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onEditClick(item); }}
                                    className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                    title="Edit Announcement"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteClick(item.id); }}
                                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                    title="Delete Announcement"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default AnnouncementsCard;
