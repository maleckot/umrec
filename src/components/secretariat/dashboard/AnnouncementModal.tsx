'use client';

import { useRef } from 'react';
import { X, Calendar, Edit3, Megaphone } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  setData: (val: any) => void;
  onSave: () => void;
  isEditing: boolean;
}

const AnnouncementModal = ({ isOpen, onClose, data, setData, onSave, isEditing }: Props) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const openDatePicker = () => {
    if (dateInputRef.current) {
        if (typeof dateInputRef.current.showPicker === 'function') {
            dateInputRef.current.showPicker();
        } else {
            dateInputRef.current.focus();
        }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isEditing ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                        {isEditing ? <Edit3 className="w-5 h-5 text-blue-600" /> : <Megaphone className="w-5 h-5 text-yellow-600" />}
                    </div>
                    <h3 className="text-[#101C50] font-bold text-xl" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {isEditing ? 'Edit Announcement' : 'New Announcement'}
                    </h3>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-all">
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <div className="p-6 space-y-5 bg-gray-50/30">
                {/* Type Toggle */}
                <div className="flex bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                    {['Announcement', 'Seminar'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setData({...data, type})}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                data.type === type 
                                    ? 'bg-[#101C50] text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Title */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g., Ethics Review Workshop"
                        value={data.title}
                        onChange={(e) => setData({...data, title: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/5 outline-none text-[#101C50] font-bold placeholder:font-normal bg-white transition-all shadow-sm"
                    />
                </div>

                {/* Date & Mode */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative cursor-pointer group" onClick={openDatePicker}>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Date</label>
                        <div className="w-full px-4 py-3.5 rounded-xl border border-gray-200 group-hover:border-[#101C50] flex items-center justify-between transition-all bg-white shadow-sm">
                             <input 
                                ref={dateInputRef}
                                type="date"
                                value={data.date}
                                onChange={(e) => setData({...data, date: e.target.value})}
                                className="bg-transparent font-bold text-[#101C50] outline-none w-full cursor-pointer text-sm"
                            />
                            <Calendar className="w-4 h-4 text-gray-400 group-hover:text-[#101C50]" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Mode</label>
                        <select 
                            value={data.mode}
                            onChange={(e) => setData({...data, mode: e.target.value})}
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#101C50] outline-none text-[#101C50] font-bold bg-white cursor-pointer appearance-none shadow-sm text-sm"
                        >
                            <option>Onsite</option>
                            <option>Virtual</option>
                        </select>
                    </div>
                </div>

                {/* Excerpt */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">Details</label>
                    <textarea 
                        rows={3}
                        placeholder="Brief description..."
                        value={data.excerpt}
                        onChange={(e) => setData({...data, excerpt: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/5 outline-none text-gray-700 resize-none transition-all bg-white shadow-sm text-sm"
                    />
                </div>

                {/* Location/Link */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block ml-1">
                        {data.mode === 'Virtual' ? 'Meeting Link' : 'Location'}
                    </label>
                    <input 
                        type="text" 
                        placeholder={data.mode === 'Virtual' ? 'https://zoom.us/...' : 'e.g., Conference Room A'}
                        value={data.location}
                        onChange={(e) => setData({...data, location: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/5 outline-none text-[#101C50] font-medium transition-all bg-white shadow-sm text-sm"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 bg-white border-t border-gray-100 flex gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={onSave}
                    className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#101C50] hover:bg-[#1a2d70] hover:shadow-lg transform active:scale-95 transition-all"
                >
                    {isEditing ? 'Save Changes' : 'Post Announcement'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default AnnouncementModal;
