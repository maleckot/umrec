// components/staff-secretariat-admin/submission-details/DocumentVerificationList.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Check, Eye, RotateCcw } from 'lucide-react';
import DocumentViewerModal from './DocumentViewerModal';

interface Document {
  id: number;
  name: string;
  isVerified: boolean | null;
  comment?: string;
  fileUrl?: string;
  previousState?: {
    isVerified: boolean | null;
    comment: string;
  } | null;
}

interface DocumentVerificationListProps {
  documents: Document[];
  onVerify: (documentId: number, isApproved: boolean, comment?: string) => void;
  onUndo?: (documentId: number) => void;
  isSaving?: boolean;
}

export default function DocumentVerificationList({ documents, onVerify, onUndo, isSaving }: DocumentVerificationListProps) {
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    const initialComments: { [key: number]: string } = {};
    documents.forEach((doc) => {
      if (doc.comment) {
        initialComments[doc.id] = doc.comment;
      }
    });
    setComments(initialComments);
  }, [documents]);

  const handleReject = (docId: number) => {
    setActiveCommentId(docId);
  };

  const handleSubmitComment = (docId: number) => {
    const comment = comments[docId] || '';
    
    onVerify(docId, false, comment);
    
    setComments((prev) => ({ ...prev, [docId]: '' }));
    
    setActiveCommentId(null);
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  const handleUndo = (docId: number) => {
    if (onUndo) {
      onUndo(docId);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
        <div className="bg-[#101C50] p-4 lg:p-6">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Document Verification
          </h3>
        </div>
        
        <div className="p-4 lg:p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Please verify all submission documents are complete and meet requirements before marking as complete.
            </p>
          </div>

          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={`doc-${index}-${doc.name}`} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <button
                    onClick={() => handleViewDocument(doc)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex-1 text-left flex items-center gap-2 transition-colors"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <Eye size={16} className="text-gray-500" />
                    {doc.name}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {/* Undo Button - Shows when previousState exists */}
                    {doc.previousState && onUndo && (
                      <button
                        onClick={() => handleUndo(doc.id)}
                        disabled={isSaving}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                        title="Undo last action"
                      >
                        <RotateCcw size={14} />
                        Undo
                      </button>
                    )}

                    {/* Action buttons for unverified documents */}
                    {doc.isVerified === null && (
                      <>
                        <button
                          onClick={() => handleReject(doc.id)}
                          disabled={isSaving}
                          className="p-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reject"
                        >
                          <X size={20} className="text-red-600" />
                        </button>
                        <button
                          onClick={() => onVerify(doc.id, true)}
                          disabled={isSaving}
                          className="p-2 rounded-full hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Approve"
                        >
                          <Check size={20} className="text-green-600" />
                        </button>
                      </>
                    )}
                    
                    {/* Approved status */}
                    {doc.isVerified === true && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check size={20} />
                        <span className="text-xs font-semibold">Approved</span>
                      </div>
                    )}
                    
                    {/* Rejected status */}
                    {doc.isVerified === false && (
                      <div className="flex items-center gap-2 text-red-600">
                        <X size={20} />
                        <span className="text-xs font-semibold">Rejected</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comment input for rejection */}
                {activeCommentId === doc.id && doc.isVerified === null && (
                  <div className="p-3 bg-white border-t border-gray-200">
                    <label className="block text-xs font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Feedback:
                    </label>
                    <textarea
                      value={comments[doc.id] || ''}
                      onChange={(e) => setComments((prev) => ({ ...prev, [doc.id]: e.target.value }))}
                      placeholder="Kindly resubmit your files, they appear to be incomplete."
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                      rows={3}
                      disabled={isSaving}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleSubmitComment(doc.id)}
                        disabled={isSaving || !comments[doc.id]?.trim()}
                        className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        Submit Feedback
                      </button>
                      <button
                        onClick={() => {
                          setActiveCommentId(null);
                          setComments((prev) => ({ ...prev, [doc.id]: '' }));
                        }}
                        disabled={isSaving}
                        className="px-4 py-2 bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Display feedback for rejected documents */}
                {doc.isVerified === false && doc.comment && (
                  <div className="p-3 bg-red-50 border-t border-red-200">
                    <p className="text-xs font-semibold text-red-900 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Feedback:
                    </p>
                    <p className="text-xs text-red-800 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {doc.comment}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDocument && (
        <DocumentViewerModal
          isOpen={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedDocument(null);
          }}
          documentName={selectedDocument.name}
          documentUrl={selectedDocument.fileUrl || '/sample-document.pdf'}
        />
      )}
    </>
  );
}
