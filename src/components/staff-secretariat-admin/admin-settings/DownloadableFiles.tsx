'use client';

import { useState } from 'react';
import { FileText, Upload, Eye, Trash2, X, Plus, Edit2, Download } from 'lucide-react';

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
  const [files, setFiles] = useState<File[]>([
    { id: '1', name: 'ApplicationFormEthicReview.pdf', type: 'PDF', size: '1.2 MB', uploadedDate: '08-15-2025', url: '/sample.pdf' },
    { id: '2', name: 'InformedConsentForm.pdf', type: 'PDF', size: '245 KB', uploadedDate: '08-15-2025', url: '/sample.pdf' },
    { id: '3', name: 'SurveyQuestionnaire.pdf', type: 'PDF', size: '318 KB', uploadedDate: '08-15-2025', url: '/sample.pdf' },
    { id: '4', name: 'EthicsForm.pdf', type: 'PDF', size: '890 KB', uploadedDate: '08-15-2025', url: '/sample.pdf' }
  ]);

  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
    {
      id: '1',
      title: 'Protocol Reviewer Worksheet Questionnaire for Reviewer',
      questions: [
        { id: '1', question: 'Is/Are the research question(s) reasonable?', type: 'Yes/No' },
        { id: '2', question: 'Are the study objectives specific, measurable, attainable, and reasonable?', type: 'Yes/No' },
        { id: '3', question: 'Is the research methodology appropriate?', type: 'Yes/No' },
        { id: '4', question: 'Do you have any other concerns?', type: 'Comment' }
      ]
    },
    {
      id: '2',
      title: 'Informed Consent Assessment Checklist for Reviewer',
      questions: [
        { id: '1', question: 'Is the informed consent form clearly written and understandable?', type: 'Yes/No' },
        { id: '2', question: 'Does it adequately explain the research purpose and procedures?', type: 'Yes/No' },
        { id: '3', question: 'Are the risks and benefits clearly stated?', type: 'Yes/No' },
        { id: '4', question: 'Is voluntary participation emphasized?', type: 'Yes/No' },
        { id: '5', question: 'Additional comments on consent form?', type: 'Comment' }
      ]
    }
  ]);

  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'file' | 'question' | 'questionnaire', id: string, parentId?: string } | null>(null);

  const handleDeleteConfirm = (type: 'file' | 'question' | 'questionnaire', id: string, parentId?: string) => {
    setDeleteTarget({ type, id, parentId });
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'file') {
      setFiles(files.filter(f => f.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'question' && deleteTarget.parentId) {
      setQuestionnaires(questionnaires.map(q => {
        if (q.id === deleteTarget.parentId) {
          return { ...q, questions: q.questions.filter(quest => quest.id !== deleteTarget.id) };
        }
        return q;
      }));
    } else if (deleteTarget.type === 'questionnaire') {
      setQuestionnaires(questionnaires.filter(q => q.id !== deleteTarget.id));
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      {/* Downloadable Files Section */}
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
             Upload File
           </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {files.map((file) => (
              <div key={file.id} className="group p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-start gap-3 sm:gap-4">
                 <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                    <FileText size={20} />
                 </div>
                 <div className="flex-1 min-w-0">
                    {/* Responsive Font Size: text-sm on mobile, text-base on larger screens */}
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
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
                       <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirm('file', file.id)}
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

      {/* Questionnaires Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h2 className="text-lg font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
               Reviewer Questionnaires
             </h2>
             <p className="text-sm text-gray-500 mt-1">Manage checklists and forms for reviewers</p>
           </div>
           <button
             className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold whitespace-nowrap"
           >
             <Plus size={16} />
             Add Questionnaire
           </button>
        </div>

        <div className="divide-y divide-gray-100">
          {questionnaires.map((questionnaire) => (
            <div key={questionnaire.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                 <h3 className="text-base font-bold text-gray-800 leading-snug" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {questionnaire.title}
                 </h3>
                 <div className="flex gap-2 flex-shrink-0">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                       <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirm('questionnaire', questionnaire.id)}
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
                      <button 
                        onClick={() => handleDeleteConfirm('question', q.id, questionnaire.id)}
                        className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded"
                      >
                         <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
                <button className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-bold flex items-center justify-center gap-2">
                   <Plus size={16} /> Add Question
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
                onClick={handleDelete}
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
