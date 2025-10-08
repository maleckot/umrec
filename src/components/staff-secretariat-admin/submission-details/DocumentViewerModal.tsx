// components/staff-secretariat-admin/submission-details/DocumentViewerModal.tsx
'use client';

import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen && mounted) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, mounted]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (mounted) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose, mounted]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full h-full sm:h-[95vh] sm:w-[95vw] lg:w-[90vw] xl:w-[85vw] max-w-7xl bg-white sm:rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{
          position: 'relative',
          maxHeight: '95vh',
          maxWidth: '95vw',
        }}
      >
        {/* Header */}
        <div className="bg-[#101C50] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 flex-shrink-0 border-b-2 border-white/10">
          {/* Document Name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Document Icon */}
            <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex-shrink-0 items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 
                className="text-sm sm:text-base lg:text-lg font-bold text-white truncate" 
                style={{ fontFamily: 'Metropolis, sans-serif' }}
                title={documentName}
              >
                {documentName}
              </h3>
              <p className="text-xs text-white/70 hidden sm:block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                PDF Document
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Desktop Zoom Controls */}
            <div className="hidden md:flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-white/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Zoom Out"
                disabled={zoom <= 50}
              >
                <ZoomOut size={18} className="text-white" />
              </button>
              <span className="text-xs font-semibold text-white px-2 min-w-[3rem] text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-white/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                title="Zoom In"
                disabled={zoom >= 200}
              >
                <ZoomIn size={18} className="text-white" />
              </button>
            </div>

            {/* Download Button */}
            <a
              href={documentUrl}
              download={documentName}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
              title="Download"
            >
              <Download size={18} className="text-white sm:w-5 sm:h-5" />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
              title="Close"
            >
              <X size={18} className="text-white sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 bg-gray-900 overflow-hidden relative" style={{ minHeight: 0 }}>
          <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
            <div 
              className="w-full h-full bg-white shadow-2xl overflow-hidden"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <iframe
                src={documentUrl}
                className="w-full h-full border-0"
                title={documentName}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Zoom Controls */}
        <div className="md:hidden bg-[#101C50] px-3 py-2 flex items-center justify-center gap-3 border-t-2 border-white/10 flex-shrink-0">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={zoom <= 50}
            title="Zoom Out"
          >
            <ZoomOut size={20} className="text-white" />
          </button>
          <span className="text-sm font-semibold text-white min-w-[3.5rem] text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={zoom >= 200}
            title="Zoom In"
          >
            <ZoomIn size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
