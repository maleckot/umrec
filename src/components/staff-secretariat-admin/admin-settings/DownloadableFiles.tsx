'use client';

import { useState, useRef } from 'react';
import { FileText, Upload, Eye, Trash2, X, Plus, Edit2 } from 'lucide-react';

// --- Interfaces ---
interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedDate: string;
  url?: string;
}

interface Question {
  id: string;
  question: string;
  type: 'Yes/No' | 'Comment';
}

interface Questionnaire {
  id: string;
  title: string;
  questions: Question[];
}

export default function DownloadableFiles() {
  // --- State: Files & Questionnaires ---
  const [files, setFiles] = useState<File[]>([
    { id: '1', name: 'ApplicationFormEthicReview.pdf', type: 'PDF', size: '1.2 MB', uploadedDate: '08-15-2025', url: '/sample.pdf' },
    { id: '2', name: 'InformedConsentForm.pdf', type: 'PDF', size: '245 KB', uploadedDate: '08-15-2025', url: '/sample.pdf' },
  ]);

  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
    {
      id: '1',
      title: 'Protocol Reviewer Worksheet Questionnaire',
      questions: [
        { id: '1', question: 'Is/Are the research question(s) reasonable?', type: 'Yes/No' },
        { id: '2', question: 'Do you have any other concerns?', type: 'Comment' }
      ]
    }
  ]);

  // --- Modal States ---
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // --- Form States ---
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<Questionnaire>({
    id: '',
    title: '',
    questions: []
  });

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'file' | 'question' | 'questionnaire', id: string, parentId?: string } | null>(null);

  // --- Handlers: File Upload ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // ✅ Strict PDF Validation
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setFileError('Only PDF files are allowed.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newFile: File = {
      id: Date.now().toString(),
      name: selectedFile.name,
      type: 'PDF',
      size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
      uploadedDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      url: URL.createObjectURL(selectedFile)
    };

    setFiles([...files, newFile]);
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  // --- Handlers: Questionnaire ---
  const openAddQuestionnaire = () => {
    setIsEditing(false);
    setCurrentQuestionnaire({
      id: Date.now().toString(),
      title: '',
      questions: [{ id: Date.now().toString(), question: '', type: 'Yes/No' }]
    });
    setShowQuestionnaireModal(true);
  };

  const openEditQuestionnaire = (q: Questionnaire) => {
    setIsEditing(true);
    setCurrentQuestionnaire(JSON.parse(JSON.stringify(q)));
    setShowQuestionnaireModal(true);
  };

  // ✅ New Handler: Add question directly from the main card
  const openEditAndAddQuestion = (q: Questionnaire) => {
    setIsEditing(true);
    const updatedQ = JSON.parse(JSON.stringify(q));
    // Immediately add a blank question
    updatedQ.questions.push({ id: Date.now().toString(), question: '', type: 'Yes/No' });
    setCurrentQuestionnaire(updatedQ);
    setShowQuestionnaireModal(true);
  };

  const handleQuestionChange = (qId: string, field: 'question' | 'type', value: string) => {
    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === qId ? { ...q, [field]: value } : q)
    }));
  };

  const addQuestionToCurrent = () => {
    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: [...prev.questions, { id: Date.now().toString(), question: '', type: 'Yes/No' }]
    }));
  };

  const removeQuestionFromCurrent = (qId: string) => {
    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== qId)
    }));
  };

  const saveQuestionnaire = () => {
    if (!currentQuestionnaire.title.trim()) return alert("Title is required");
    
    if (isEditing) {
      setQuestionnaires(prev => prev.map(q => q.id === currentQuestionnaire.id ? currentQuestionnaire : q));
    } else {
      setQuestionnaires(prev => [...prev, currentQuestionnaire]);
    }
    setShowQuestionnaireModal(false);
  };

  // --- Handlers: Delete ---
  const confirmDelete = (type: 'file' | 'question' | 'questionnaire', id: string, parentId?: string) => {
    setDeleteTarget({ type, id, parentId });
    setShowDeleteConfirm(true);
  };

  const executeDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'file') {
      setFiles(files.filter(f => f.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'questionnaire') {
      setQuestionnaires(questionnaires.filter(q => q.id !== deleteTarget.id));
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      
      {/* --- SECTION 1: DOWNLOADABLE FILES --- */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h2 className="text-lg font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
               Downloadable Files
             </h2>
             <p className="text-sm text-gray-500 mt-1">Manage files available for researchers</p>
           </div>
           <button
             onClick={() => setShowUploadModal(true)}
             className="flex items-center justify-center gap-2 px-4 py-2 bg-[#101C50] text-white rounded-lg hover:bg-blue-900 transition-colors text-sm font-semibold whitespace-nowrap"
           >
             <Upload size={16} />
             Upload PDF
           </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {files.length === 0 && <p className="text-gray-400 text-sm col-span-2 text-center py-4">No PDF files uploaded yet.</p>}
            {files.map((file) => (
              <div key={file.id} className="group p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-start gap-3 sm:gap-4">
                 <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                    <FileText size={20} />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate leading-tight mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {file.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                       <span className="font-medium text-gray-700">{file.type}</span>
                       <span className="text-gray-300">•</span>
                       <span>{file.size}</span>
                       <span className="text-gray-300">•</span>
                       <span>{file.uploadedDate}</span>
                    </div>
                 </div>
                 <div className="flex gap-1">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
                       <Eye size={18} />
                    </a>
                    <button 
                      onClick={() => confirmDelete('file', file.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- SECTION 2: REVIEWER QUESTIONNAIRES --- */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h2 className="text-lg font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
               Reviewer Questionnaires
             </h2>
             <p className="text-sm text-gray-500 mt-1">Manage checklists and forms for reviewers</p>
           </div>
           <button
             onClick={openAddQuestionnaire}
             className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold whitespace-nowrap"
           >
             <Plus size={16} />
             Add Questionnaire
           </button>
        </div>

        <div className="divide-y divide-gray-100">
          {questionnaires.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No questionnaires added yet.</p>}
          {questionnaires.map((questionnaire) => (
            <div key={questionnaire.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                 <h3 className="text-base font-bold text-gray-800 leading-snug" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {questionnaire.title}
                 </h3>
                 <div className="flex gap-2 flex-shrink-0">
                    <button 
                      onClick={() => openEditQuestionnaire(questionnaire)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
                    >
                       <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => confirmDelete('questionnaire', questionnaire.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg"
                    >
                       <Trash2 size={14} /> Delete
                    </button>
                 </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <ul className="space-y-3">
                  {questionnaire.questions.map((q, index) => (
                    <li key={q.id} className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0 shadow-sm mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium break-words">{q.question}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-semibold border border-blue-200">
                             {q.type}
                          </span>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {/* ✅ Added back the "Add Question" button on the main card */}
                <button 
                  onClick={() => openEditAndAddQuestion(questionnaire)}
                  className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                >
                   <Plus size={16} /> Add Question
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* --- MODAL: UPLOAD FILE (PDF ONLY) --- */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Upload PDF File</h3>
               <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleUploadSubmit}>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors mb-2 ${
                  fileError ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileSelect} 
                  accept=".pdf" 
                />
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${fileError ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-600'}`}>
                  <Upload size={24} />
                </div>
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Click to browse or drag PDF here</p>
                    <p className="text-xs text-gray-400 mt-1">PDF only, up to 10MB</p>
                  </div>
                )}
              </div>
              
              {fileError && <p className="text-xs text-red-500 font-bold text-center mb-4">{fileError}</p>}

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button 
                  type="submit" 
                  disabled={!selectedFile}
                  className="flex-1 py-2.5 rounded-xl bg-[#101C50] text-white font-bold hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* --- MODAL: ADD/EDIT QUESTIONNAIRE --- */}
      {showQuestionnaireModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                 {isEditing ? 'Edit Questionnaire' : 'New Questionnaire'}
               </h3>
               <button onClick={() => setShowQuestionnaireModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Questionnaire Title</label>
                <input 
                  type="text" 
                  value={currentQuestionnaire.title}
                  onChange={(e) => setCurrentQuestionnaire({...currentQuestionnaire, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium"
                  placeholder="e.g., Protocol Review Checklist"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Questions</label>
                <div className="space-y-3">
                  {currentQuestionnaire.questions.map((q, idx) => (
                    <div key={q.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="mt-2 text-xs font-bold text-gray-400 w-5 text-center">{idx + 1}</span>
                      <div className="flex-1 space-y-2">
                        {/* ✅ Made text darker (text-gray-900) and border visible */}
                        <input 
                          type="text" 
                          value={q.question}
                          onChange={(e) => handleQuestionChange(q.id, 'question', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-400 rounded text-sm focus:border-blue-500 outline-none text-gray-900 font-semibold placeholder-gray-500"
                          placeholder="Enter question text..."
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500">Answer Type:</label>
                          <select 
                            value={q.type}
                            onChange={(e) => handleQuestionChange(q.id, 'type', e.target.value as any)}
                            className="px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-800"
                          >
                            <option value="Yes/No">Yes/No</option>
                            <option value="Comment">Comment Box</option>
                          </select>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeQuestionFromCurrent(q.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"
                        title="Remove Question"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={addQuestionToCurrent}
                  className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Another Question
                </button>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setShowQuestionnaireModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                <button 
                  onClick={saveQuestionnaire}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  {isEditing ? 'Save Changes' : 'Create Questionnaire'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* --- MODAL: DELETE CONFIRM --- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[#101C50] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
