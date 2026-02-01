'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Plus, Trash2, Edit2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getHomepageData } from '@/app/actions/homepage/getHomepageData';
import { updateHomepageText } from '@/app/actions/homepage/updateContent';
import { addHistory, deleteHistory, updateHistory } from '@/app/actions/homepage/manageHistory';
import { uploadHomeForm, deleteHomeForm } from '@/app/actions/homepage/manageForms';

export default function HomepageContent() {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 1. Text Content State
  const [textContent, setTextContent] = useState({
    heroTitle: '', 
    aboutText: '', 
    missionText: '', 
    visionText: ''
  });

  // 2. History State
  const [history, setHistory] = useState<any[]>([]);

  // 3. Homepage Forms State
  const [homeForms, setHomeForms] = useState<any[]>([]);

  // --- LOAD DATA ON MOUNT ---
  const loadData = async () => {
    try {
      const data = await getHomepageData();
      
      // Map DB data to state
      setTextContent({
        heroTitle: data.textContent.hero_title || '',
        aboutText: data.textContent.about_text || '',
        missionText: data.textContent.mission_text || '',
        visionText: data.textContent.vision_text || ''
      });
      
      setHistory(data.history || []);
      setHomeForms(data.forms || []);
    } catch (error) {
      console.error("Failed to load content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- HANDLERS ---

  const handleTextChange = (field: keyof typeof textContent, value: string) => {
    setTextContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const res = await updateHomepageText(textContent);
    setSaving(false);
    
    if (res.success) {
      alert('Homepage content updated successfully!');
    } else {
      alert('Error updating content: ' + res.error);
    }
  };

  // --- HISTORY HANDLERS ---

  const handleAddHistory = async () => {
    const newItem = { 
      year: new Date().getFullYear().toString(), 
      title: 'New Milestone', 
      description: 'Enter description here...' 
    };
    
    // Optimistic UI update not ideal here because we need the real ID from DB
    // So we just call the action then reload
    const res = await addHistory(newItem);
    if (res.success) {
      loadData(); 
    } else {
      alert("Failed to add item: " + res.error);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    // Optimistic update
    const previous = [...history];
    setHistory(prev => prev.filter(item => item.id !== id));

    const res = await deleteHistory(id);
    if (!res.success) {
      alert("Failed to delete: " + res.error);
      setHistory(previous); // Revert
    }
  };

  const handleUpdateHistoryField = async (id: string, field: string, value: string) => {
    // 1. Optimistic Update in UI
    const updatedHistory = history.map(h => h.id === id ? { ...h, [field]: value } : h);
    setHistory(updatedHistory);
    
    // 2. Silent Update to DB (Debouncing would be better for production, but this works)
    const item = updatedHistory.find(h => h.id === id);
    if (item) {
      await updateHistory(id, item);
    }
  };

  // --- FORM HANDLERS ---

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFormUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Simple prompt for metadata (can be improved with a modal later)
      const title = prompt("Enter Form Title (e.g., Application Form):", file.name.replace(/\.[^/.]+$/, ""));
      if (!title) return; // User cancelled
      
      const formNumber = prompt("Enter Form Number/ID (e.g., UMREC Form No. 1):", "New Form");
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('formNumber', formNumber || '');

      setSaving(true);
      const res = await uploadHomeForm(formData);
      setSaving(false);

      if (res.success) {
        loadData(); // Reload to get the new file URL and ID
      } else {
        alert("Upload failed: " + res.error);
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;

    const previous = [...homeForms];
    setHomeForms(prev => prev.filter(f => f.id !== id));

    const res = await deleteHomeForm(id);
    if (!res.success) {
      alert("Failed to delete: " + res.error);
      setHomeForms(previous);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#050B24]" />
          <p className="text-gray-500 font-medium">Loading content...</p>
        </div>
      </div>
    );
  }

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
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#050B24] text-white rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
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
             <div key={item.id} className="flex flex-col md:flex-row gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-200 group hover:border-gray-300 transition-colors">
                <div className="bg-[#050B24] text-white text-xs font-bold px-2.5 py-1 rounded hidden md:block">#{index + 1}</div>
                <div className="flex-1 grid gap-4 w-full md:grid-cols-12">
                   <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Year</label>
                      <input 
                        value={item.year} 
                        onChange={(e) => handleUpdateHistoryField(item.id, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-bold text-[#050B24] bg-white focus:ring-1 focus:ring-[#050B24] outline-none" 
                      />
                   </div>
                   <div className="md:col-span-3">
                      <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Title</label>
                      <input 
                        value={item.title} 
                        onChange={(e) => handleUpdateHistoryField(item.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-bold text-black bg-white focus:ring-1 focus:ring-[#050B24] outline-none" 
                      />
                   </div>
                   <div className="md:col-span-7">
                      <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase tracking-wide">Description</label>
                      <textarea 
                        rows={2}
                        value={item.description} 
                        onChange={(e) => handleUpdateHistoryField(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-900 bg-white focus:ring-1 focus:ring-[#050B24] outline-none resize-none leading-relaxed" 
                      />
                   </div>
                </div>
                <button 
                  onClick={() => handleDeleteHistory(item.id)}
                  className="text-gray-400 hover:text-red-600 p-2 bg-white rounded-lg border border-gray-200 hover:border-red-200 transition-all self-end md:self-start"
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
           <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFormUpload} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {homeForms.map((form) => (
             <div key={form.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all relative group">
                <div className="flex justify-between items-start mb-3">
                   <div className="w-10 h-10 rounded-full bg-[#050B24] flex items-center justify-center text-[#F0E847] shadow-sm">
                      <Upload size={18} />
                   </div>
                   <button 
                      onClick={() => handleDeleteForm(form.id)}
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
                       readOnly
                       className="w-full bg-transparent border-b border-gray-300 outline-none text-sm font-bold text-[#050B24] pb-1 cursor-default"
                     />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Form ID / Number</label>
                     <input 
                       value={form.form_number || form.formNumber}
                       readOnly
                       className="w-full bg-transparent border-b border-gray-300 outline-none text-sm font-semibold text-gray-700 pb-1 cursor-default"
                     />
                   </div>
                   <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg w-fit border border-blue-100 mt-2">
                      <ImageIcon size={14} /> 
                      <a href={form.file_url || form.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        View File
                      </a>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
}