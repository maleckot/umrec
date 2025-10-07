// components/staff-secretariat-admin/submission-details/DocumentVerificationList.tsx
'use client';

import { useState } from 'react';
import { X, Check, Eye } from 'lucide-react';
import DocumentViewerModal from './DocumentViewerModal';

interface Document {
  id: number;
  name: string;
  isVerified: boolean | null;
  comment?: string;
  fileUrl?: string; // URL to the document
}

interface DocumentVerificationListProps {
  documents: Document[];
  onVerify: (documentId: number, isApproved: boolean, comment?: string) => void;
}

export default function DocumentVerificationList({ documents, onVerify }: DocumentVerificationListProps) {
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // Document Viewer Modal State
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleReject = (docId: number) => {
    setActiveCommentId(docId);
  };

  const handleSubmitComment = (docId: number) => {
    onVerify(docId, false, commentText);
    setCommentText('');
    setActiveCommentId(null);
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
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
            {documents.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg overflow-hidden">
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
                    {doc.isVerified === null && (
                      <>
                        <button
                          onClick={() => handleReject(doc.id)}
                          className="p-2 rounded-full hover:bg-red-100 transition-colors"
                          title="Reject"
                        >
                          <X size={20} className="text-red-600" />
                        </button>
                        <button
                          onClick={() => onVerify(doc.id, true)}
                          className="p-2 rounded-full hover:bg-green-100 transition-colors"
                          title="Approve"
                        >
                          <Check size={20} className="text-green-600" />
                        </button>
                      </>
                    )}
                    
                    {doc.isVerified === true && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check size={20} />
                        <span className="text-xs font-semibold">Approved</span>
                      </div>
                    )}
                    
                    {doc.isVerified === false && (
                      <div className="flex items-center gap-2 text-red-600">
                        <X size={20} />
                        <span className="text-xs font-semibold">Rejected</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comment Section */}
                {activeCommentId === doc.id && (
                  <div className="p-3 bg-white border-t border-gray-200">
                    <label className="block text-xs font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Feedback:
                    </label>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Kindly resubmit your files, they appear to be incomplete."
                      className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                      rows={3}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleSubmitComment(doc.id)}
                        className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        Submit Feedback
                      </button>
                      <button
                        onClick={() => {
                          setActiveCommentId(null);
                          setCommentText('');
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Show existing comment if rejected - DARKER TEXT */}
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

      {/* Document Viewer Modal */}
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
