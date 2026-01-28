'use client';

import { useState, useRef } from 'react';
import { Save, Plus, Trash2, Edit2, Upload, X, Image as ImageIcon } from 'lucide-react';

// --- Interfaces for Data ---
interface HistoryItem { id: string; year: string; title: string; description: string; }
interface Announcement { id: string; title: string; date: string; location: string; description: string; }
interface HomeForm { id: string; title: string; formNumber: string; file: string; }

export default function HomepageContent() {
  // --- STATE MANAGEMENT ---
  
  // 1. Text Content State
  const [textContent, setTextContent] = useState({
    heroTitle: 'UMREConnect',
    aboutText: 'The University of Makati Research Ethics Committee (UMREC) is an independent body that makes decisions regarding the review, approval, and implementation of research protocols.',
    missionText: 'The University of Makati Research Ethics Committee commits to an organized, transparent, impartial, collaborative, and quality-driven research ethics review system.',
    visionText: 'The University of Makati Research Ethics Committee is a PHREB Level 2 Accredited research ethics board in 2030.'
  });

  // 2. History State
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: '1', year: '2018', title: 'The Inception', description: 'College of Allied Health Studies recognized the need for an internal ethics review board.' },
    { id: '2', year: '2019', title: 'PHREB Partnership', description: 'COAHS engaged PHREB for Basic Research Ethics Training.' },
  ]);

  // 3. Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: '1', title: 'Research Ethics Basics', date: 'February 15, 2026', location: 'HPSB Auditorium', description: 'A comprehensive seminar for new researchers.' },
  ]);

  // 4. Homepage Forms State
  const [homeForms, setHomeForms] = useState<HomeForm[]>([
    { id: '1', title: 'Application Form', formNumber: 'Form No. 0013-1', file: 'application.pdf' },
    { id: '2', title: 'Research Protocol', formNumber: 'Form No. 0033', file: 'protocol.pdf' },
  ]);

  // --- HANDLERS ---

  const handleTextChange = (field: keyof typeof textContent, value: string) => {
    setTextContent(prev => ({ ...prev, [field]: value }));
  };

  // Generic Delete Handler
  const handleDelete = <T extends { id: string }>(
    setFunction: React.Dispatch<React.SetStateAction<T[]>>, 
    items: T[], 
    id: string
  ) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setFunction(items.filter(item => item.id !== id));
    }
  };

  // Generic Add Handler (Simplified for demo)
  const handleAddHistory = () => {
    const newItem = { id: Date.now().toString(), year: '2024', title: 'New Milestone', description: 'Description here...' };
    setHistory([...history, newItem]);
  };

  // File Upload Simulation
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFormUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newForm = {
        id: Date.now().toString(),
        title: file.name.replace('.pdf', ''),
        formNumber: 'New Form',
        file: file.name
      };
      setHomeForms([...homeForms, newForm]);
    }
  };

  const handleSaveAll = () => {
    // API Call would go here
    alert('Homepage content updated successfully!');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* --- Action Bar --- */}
      <div className="flex justify-between items-center sticky top-0 bg-gray-50/95 backdrop-blur z-10 py-4 border-b border-gray-200 -mx-6 px-6 lg:-mx-8 lg:px-8">
        <div>
          <h2 className="text-xl font-bold text-[#050B24]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Homepage Editor</h2>
          <p className="text-sm text-gray-700 font-medium">Manage content visible on the landing page</p>
        </div>
        <button 
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#050B24] text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>

      {/* --- 1. General Text Section --- */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#050B24] mb-4 border-b border-gray-200 pb-2">General Content</h3>
        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Hero Section Title</label>
            <input 
              type="text" 
              value={textContent.heroTitle}
              onChange={(e) => handleTextChange('heroTitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold focus:ring-2 focus:ring-[#050B24] outline-none bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">About Section Text</label>
            <textarea 
              rows={4}
              value={textContent.aboutText}
              onChange={(e) => handleTextChange('aboutText', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-medium focus:ring-2 focus:ring-[#050B24] outline-none bg-gray-50 focus:bg-white resize-none transition-colors leading-relaxed"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Mission Statement</label>
              <textarea 
                rows={4}
                value={textContent.missionText}
                onChange={(e) => handleTextChange('missionText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-medium focus:ring-2 focus:ring-[#050B24] outline-none bg-gray-50 focus:bg-white resize-none transition-colors leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Vision Statement</label>
              <textarea 
                rows={4}
                value={textContent.visionText}
                onChange={(e) => handleTextChange('visionText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-medium focus:ring-2 focus:ring-[#050B24] outline-none bg-gray-50 focus:bg-white resize-none transition-colors leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. History Timeline Section --- */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
           <h3 className="text-lg font-extrabold text-[#050B24]">History Timeline</h3>
           <button onClick={handleAddHistory} className="text-sm flex items-center gap-1 text-blue-700 hover:text-blue-900 font-bold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
             <Plus size={16} /> Add Milestone
           </button>
        </div>
        <div className="space-y-4">
          {history.map((item, index) => (
             <div key={item.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-200 group hover:border-gray-300 transition-colors">
                <div className="bg-[#050B24] text-white text-xs font-bold px-2.5 py-1 rounded">#{index + 1}</div>
                <div className="flex-1 grid gap-4 md:grid-cols-12">
                   <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Year</label>
                      <input 
                        value={item.year} 
                        onChange={(e) => {
                          const newHistory = [...history];
                          newHistory[index].year = e.target.value;
                          setHistory(newHistory);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-bold text-[#050B24] bg-white focus:ring-1 focus:ring-[#050B24] outline-none" 
                      />
                   </div>
                   <div className="md:col-span-3">
                      <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Title</label>
                      <input 
                        value={item.title} 
                        onChange={(e) => {
                          const newHistory = [...history];
                          newHistory[index].title = e.target.value;
                          setHistory(newHistory);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-bold text-black bg-white focus:ring-1 focus:ring-[#050B24] outline-none" 
                      />
                   </div>
                   <div className="md:col-span-7">
                      <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Description</label>
                      <textarea 
                        rows={2}
                        value={item.description} 
                        onChange={(e) => {
                          const newHistory = [...history];
                          newHistory[index].description = e.target.value;
                          setHistory(newHistory);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-900 bg-white focus:ring-1 focus:ring-[#050B24] outline-none resize-none leading-relaxed" 
                      />
                   </div>
                </div>
                <button 
                  onClick={() => handleDelete(setHistory, history, item.id)}
                  className="text-gray-400 hover:text-red-600 p-2 bg-white rounded-lg border border-gray-200 hover:border-red-200 transition-all"
                >
                  <Trash2 size={18} />
                </button>
             </div>
          ))}
        </div>
      </div>

      {/* --- 3. Homepage Forms Section --- */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
           <div>
             <h3 className="text-lg font-extrabold text-[#050B24]">Homepage Forms</h3>
             <p className="text-xs text-gray-600 font-medium mt-0.5">These forms appear in the "Downloadable Forms" grid on the landing page</p>
           </div>
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors text-sm font-bold shadow-sm"
           >
             <Upload size={16} /> Upload New Form
           </button>
           <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFormUpload} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {homeForms.map((form) => (
             <div key={form.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all relative group">
                <div className="flex justify-between items-start mb-3">
                   <div className="w-10 h-10 rounded-full bg-[#050B24] flex items-center justify-center text-[#F0E847] shadow-sm">
                      <Upload size={18} />
                   </div>
                   <button 
                      onClick={() => handleDelete(setHomeForms, homeForms, form.id)}
                      className="text-gray-400 hover:text-red-600 p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:border-red-200"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
                <div className="space-y-3">
                   <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Title</label>
                     <input 
                        value={form.title}
                        onChange={(e) => {
                           const newForms = [...homeForms];
                           const idx = newForms.findIndex(f => f.id === form.id);
                           newForms[idx].title = e.target.value;
                           setHomeForms(newForms);
                        }}
                        className="w-full bg-transparent border-b border-gray-300 hover:border-[#050B24] focus:border-[#050B24] outline-none text-sm font-bold text-[#050B24] pb-1 transition-colors"
                        placeholder="Form Title"
                     />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Form ID / Number</label>
                     <input 
                        value={form.formNumber}
                        onChange={(e) => {
                           const newForms = [...homeForms];
                           const idx = newForms.findIndex(f => f.id === form.id);
                           newForms[idx].formNumber = e.target.value;
                           setHomeForms(newForms);
                        }}
                        className="w-full bg-transparent border-b border-gray-300 hover:border-[#050B24] focus:border-[#050B24] outline-none text-sm font-semibold text-gray-700 pb-1 transition-colors"
                        placeholder="Form Number / ID"
                     />
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg w-fit border border-blue-100 mt-2">
                      <ImageIcon size={14} /> {form.file}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
}
