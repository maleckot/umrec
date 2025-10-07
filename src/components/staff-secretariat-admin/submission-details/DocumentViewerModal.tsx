// components/staff-secretariat-admin/submission-details/DocumentViewerModal.tsx
'use client';

import { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentUrl: string;
}

export default function DocumentViewerModal({
  isOpen,
  onClose,
  documentName,
  documentUrl,
}: DocumentViewerModalProps) {
  const [zoom, setZoom] = useState(100);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      {/* Modal Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#101C50]">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {documentName}
            </h3>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={20} className="text-white" />
            </button>
            <span className="text-white text-sm font-medium px-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={20} className="text-white" />
            </button>
            <div className="w-px h-6 bg-gray-600 mx-2"></div>
            <a
              href={documentUrl}
              download
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Download"
            >
              <Download size={20} className="text-white" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Close"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            {/* For now, show an iframe - backend will need to serve the actual PDF */}
            <iframe
              src={documentUrl}
              className="w-full h-[800px] border-0"
              title={documentName}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Preview mode - Download for full quality
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#101C50] text-white rounded-lg hover:opacity-90 transition-colors font-semibold"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
