// components/staff-secretariat-admin/admin-settings/DownloadableFiles.tsx
'use client';

import { useState } from 'react';
import { FileText, Upload, Eye, Trash2, X, Plus, Edit2 } from 'lucide-react';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';

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

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddQuestionnaireModal, setShowAddQuestionnaireModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'file' | 'question' | 'questionnaire', id: string, parentId?: string } | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newQuestionnaire, setNewQuestionnaire] = useState({ title: '', targetAudience: 'Reviewer' });
  const [editingQuestion, setEditingQuestion] = useState<{ questionnaireId: string, question: Question } | null>(null);

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

  const handleView = (file: File) => {
    setSelectedFile(file);
    setShowViewModal(true);
  };

  const handleUpload = () => {
    setShowUploadModal(false);
    setNewFileName('');
    alert('File uploaded successfully!');
  };

  const handleAddQuestionnaire = () => {
    const newId = (questionnaires.length + 1).toString();
    setQuestionnaires([...questionnaires, {
      id: newId,
      title: newQuestionnaire.title,
      questions: []
    }]);
    setShowAddQuestionnaireModal(false);
    setNewQuestionnaire({ title: '', targetAudience: 'Reviewer' });
  };

  const handleEditQuestion = (questionnaireId: string, question: Question) => {
    setEditingQuestion({ questionnaireId, question });
    setShowEditQuestionModal(true);
  };

  const handleSaveEditQuestion = () => {
    if (!editingQuestion) return;
    
    setQuestionnaires(questionnaires.map(q => {
      if (q.id === editingQuestion.questionnaireId) {
        return {
          ...q,
          questions: q.questions.map(quest => 
            quest.id === editingQuestion.question.id ? editingQuestion.question : quest
          )
        };
      }
      return q;
    }));
    
    setShowEditQuestionModal(false);
    setEditingQuestion(null);
  };

  const handleAddQuestion = (questionnaireId: string) => {
    const newQuestionId = (questionnaires.find(q => q.id === questionnaireId)?.questions.length || 0) + 1;
    setQuestionnaires(questionnaires.map(q => {
      if (q.id === questionnaireId) {
        return {
          ...q,
          questions: [...q.questions, {
            id: newQuestionId.toString(),
            question: 'New question',
            type: 'Yes/No' as const
          }]
        };
      }
      return q;
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Available Files Section */}
      <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-2 border-gray-200">
        <h2 
          className="text-base sm:text-lg md:text-xl font-bold text-[#003366] mb-2" 
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          Downloadable Files
        </h2>
        <p 
          className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6" 
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          Manage files available to researchers
        </p>

        <div className="mb-3 sm:mb-4">
          <h3 
            className="text-xs sm:text-sm font-semibold text-[#003366] mb-2 sm:mb-3" 
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Available Files
          </h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#003366]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white rounded-tl-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  File Name
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Type
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Size
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Uploaded
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white rounded-tr-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={file.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {file.name}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {file.type}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {file.size}
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {file.uploadedDate}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleView(file)}
                        className="p-2 text-[#003366] hover:bg-gray-100 rounded-lg transition-colors" 
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteConfirm('file', file.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-2 sm:space-y-3">
          {files.map((file) => (
            <div key={file.id} className="border-2 border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-semibold text-[#003366] text-xs leading-tight break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {file.name}
                  </p>
                  <p className="text-[10px] text-gray-700 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {file.type} • {file.size}
                  </p>
                  <p className="text-[10px] text-gray-700 mt-0.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Uploaded: {file.uploadedDate}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleView(file)}
                    className="p-1.5 text-[#003366] hover:bg-gray-100 rounded-lg transition-colors" 
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteConfirm('file', file.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload New File Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#003366] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm flex items-center justify-center gap-2"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Upload New File
      </button>

      {/* Questionnaires Section */}
      {questionnaires.map((questionnaire) => (
        <div key={questionnaire.id} className="bg-white rounded-xl p-3 sm:p-4 md:p-6 border-2 border-gray-200">
          <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-[#003366] rounded-lg p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {questionnaire.title}
              </h3>
            </div>
            <button
              onClick={() => handleDeleteConfirm('questionnaire', questionnaire.id)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Delete Questionnaire</span>
            </button>
          </div>

          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
            {questionnaire.questions.map((question) => (
              <div key={question.id} className="flex flex-col p-3 sm:p-4 border-2 border-gray-200 rounded-lg gap-2 sm:gap-3">
                <p className="text-xs sm:text-sm font-medium text-[#003366] leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {question.id}. {question.question}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#003366] text-white rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {question.type}
                  </span>
                  <div className="flex gap-1 sm:gap-2">
                    <button 
                      onClick={() => handleEditQuestion(questionnaire.id, question)}
                      className="p-1.5 sm:p-2 text-[#003366] hover:bg-gray-100 rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteConfirm('question', question.id, questionnaire.id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => handleAddQuestion(questionnaire.id)}
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Add Question</span>
            </button>

            <button 
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 bg-[#003366] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm" 
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Save Changes
            </button>
          </div>
        </div>
      ))}

      {/* Add New Questionnaire Button */}
      <button
        onClick={() => setShowAddQuestionnaireModal(true)}
        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm flex items-center justify-center gap-2"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Add New Questionnaire
      </button>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <h3 className="text-base sm:text-lg font-bold text-[#003366] mb-3 sm:mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Confirm Delete
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold text-xs sm:text-sm"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-xs sm:text-sm"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showViewModal && selectedFile && (
        <DocumentViewerModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedFile(null);
          }}
          documentUrl={selectedFile.url || ''}
          documentName={selectedFile.name}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Upload New File
              </h3>
              <button onClick={() => setShowUploadModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  File Name
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Enter file name"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm text-[#003366]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm text-gray-700 mb-1 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Drag and drop or click to upload
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  PDF file only
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Maximum file size: 50MB
                </p>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 px-3 sm:px-4 py-2 bg-[#003366] text-white rounded-lg font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Questionnaire Modal */}
      {showAddQuestionnaireModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Add New Questionnaire
              </h3>
              <button onClick={() => setShowAddQuestionnaireModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Questionnaire Title
                </label>
                <input
                  type="text"
                  value={newQuestionnaire.title}
                  onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, title: e.target.value })}
                  placeholder="e.g., Research Ethics Assessment for Reviewer"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm text-[#003366]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Target Audience
                </label>
                <select
                  value={newQuestionnaire.targetAudience}
                  onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, targetAudience: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <option>Reviewer</option>
                  <option>Researcher</option>
                  <option>Staff</option>
                </select>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  onClick={() => setShowAddQuestionnaireModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuestionnaire}
                  className="flex-1 px-3 sm:px-4 py-2 bg-[#003366] text-white rounded-lg font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {showEditQuestionModal && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Edit Question
              </h3>
              <button onClick={() => setShowEditQuestionModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Question
                </label>
                <textarea
                  value={editingQuestion.question.question}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    question: { ...editingQuestion.question, question: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm text-[#003366]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Response Type
                </label>
                <select
                  value={editingQuestion.question.type}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    question: { ...editingQuestion.question, type: e.target.value as 'Yes/No' | 'Comment' }
                  })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] text-xs sm:text-sm font-medium text-[#003366]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <option>Yes/No</option>
                  <option>Comment</option>
                </select>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  onClick={() => setShowEditQuestionModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditQuestion}
                  className="flex-1 px-3 sm:px-4 py-2 bg-[#003366] text-white rounded-lg font-semibold text-xs sm:text-sm"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
