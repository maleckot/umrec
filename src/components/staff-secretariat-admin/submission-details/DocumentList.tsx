// components/staff-secretariat-admin/submission-details/DocumentList.tsx
'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import DocumentViewerModal from './DocumentViewerModal';

interface Document {
  name: string;
  fileUrl?: string;
  url?: string;        // ✅ ADD THIS (from action)

}

interface DocumentListProps {
  documents: string[] | Document[];
  title?: string;
  description?: string;
}

export default function DocumentList({ documents, title = 'Documents', description }: DocumentListProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; fileUrl: string } | null>(null);

const handleViewDocument = (doc: string | Document) => {
  const docName = typeof doc === 'string' ? doc : doc.name;
  const docUrl = typeof doc === 'string' 
    ? '/sample-document.pdf' 
    : (doc.url || doc.fileUrl || '/sample-document.pdf'); // ✅ CHECK URL FIRST
  
  setSelectedDocument({ name: docName, fileUrl: docUrl });
  setViewerOpen(true);
};

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
        <div className="bg-[#101C50] p-4 lg:p-6">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {title}
          </h3>
        </div>
        
        <div className="p-4 lg:p-6">
          {description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {description}
              </p>
            </div>
          )}

          <div className="space-y-2">
            {documents.map((doc, index) => {
              const docName = typeof doc === 'string' ? doc : doc.name;
              return (
                <button
                  key={index}
                  onClick={() => handleViewDocument(doc)}
                  className="w-full flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <Eye size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-800 flex-1 text-left" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {docName}
                  </span>
                </button>
              );
            })}
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
          documentUrl={selectedDocument.fileUrl}
        />
      )}
    </>
  );
}
