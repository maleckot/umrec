// components/staff-secretariat-admin/submission-details/ConsolidatedDocument.tsx
'use client';

import { useState } from 'react';
import { Eye, FileText, Download } from 'lucide-react';
import DocumentViewerModal from './DocumentViewerModal';

interface ConsolidatedDocumentProps {
  title?: string;
  description?: string;
  consolidatedDate?: string;
  fileUrl?: string;
  originalDocuments?: string[];
}

export default function ConsolidatedDocument({ 
  title = 'Consolidated Document', 
  description,
  consolidatedDate = 'May 16, 2023',
  fileUrl = '/sample-document.pdf',
  originalDocuments = []
}: ConsolidatedDocumentProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [showOriginals, setShowOriginals] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
        {/* Header */}
        <div className="bg-[#101C50] p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {title}
          </h3>
        </div>
        
        {/* Content */}
        <div className="p-3 sm:p-4 lg:p-6">
          {description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {description}
              </p>
            </div>
          )}

          {/* Consolidated File Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <div className="flex items-start gap-2 sm:gap-3 mb-2">
              <FileText size={20} className="text-green-700 flex-shrink-0 sm:w-6 sm:h-6" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-green-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  All Documents Consolidated
                </h4>
                <p className="text-xs text-green-700 mt-0.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Compiled on {consolidatedDate}
                </p>
              </div>
            </div>
            <p className="text-xs text-green-800 mb-0" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              All submission documents have been verified and merged into a single consolidated file for review.
            </p>
          </div>

          {/* Main Consolidated Document */}
          <div className="border-2 border-blue-500 rounded-lg overflow-hidden bg-blue-50">
            <button
              onClick={() => setViewerOpen(true)}
              className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-blue-100 transition-colors gap-2"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <FileText size={18} className="text-blue-700 flex-shrink-0 sm:w-5 sm:h-5" />
                <div className="text-left min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-bold text-blue-900 block truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    SUB-2025-001_Consolidated.pdf
                  </span>
                  <span className="text-xs text-blue-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {originalDocuments.length} document{originalDocuments.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <a
                  href={fileUrl}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 sm:p-2 hover:bg-blue-200 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={16} className="text-blue-700 sm:w-5 sm:h-5" />
                </a>
                <div className="p-1.5 sm:p-2">
                  <Eye size={16} className="text-blue-700 sm:w-5 sm:h-5" />
                </div>
              </div>
            </button>
          </div>

          {/* Original Documents Toggle */}
          {originalDocuments.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <button
                onClick={() => setShowOriginals(!showOriginals)}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                {showOriginals ? '− Hide' : '+ Show'} Original Documents ({originalDocuments.length})
              </button>

              {showOriginals && (
                <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 pl-3 sm:pl-4 border-l-2 border-gray-300">
                  {originalDocuments.map((doc, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-start gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-1.5"></span>
                      <span className="flex-1 break-words">{doc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        documentName="SUB-2025-001_Consolidated.pdf"
        documentUrl={fileUrl}
      />
    </>
  );
}
