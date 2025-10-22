// components/reviewer/profile/CertificatesCard.tsx
'use client';

import { useState } from 'react';
import { Upload, FileText, X, Download } from 'lucide-react';

interface Certificate {
  id: string;
  fileName: string;
  uploadDate: string;
  fileUrl: string;
  fileSize: string;
}

interface CertificatesCardProps {
  certificates?: Certificate[];
  onUpload?: (file: File) => Promise<void>;
  onDelete?: (certificateId: string) => Promise<void>;
}

export default function CertificatesCard({ certificates = [], onUpload, onDelete }: CertificatesCardProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      setUploading(true);
      try {
        await onUpload(file);
        e.target.value = ''; // Reset input
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload certificate');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && onUpload) {
      setUploading(true);
      try {
        await onUpload(file);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload certificate');
      } finally {
        setUploading(false);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
        Ethics Review Training Certificates
      </h2>

      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Upload certificates from UMREC ethics review seminars and training sessions you've attended.
      </p>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 mb-6 transition-all ${
          dragActive ? 'border-[#101C50] bg-blue-50' : 'border-gray-300 bg-gray-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-[#101C50] hover:bg-blue-50'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
          <p className="text-sm sm:text-base font-semibold mb-2" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            {uploading ? 'Uploading...' : 'Drag and drop your certificate here'}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            or
          </p>
          <label className="inline-block">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              disabled={uploading}
            />
            <span className="px-4 sm:px-6 py-2 sm:py-3 bg-[#101C50] text-white rounded-lg cursor-pointer hover:bg-[#0d1640] transition-colors text-xs sm:text-sm font-semibold inline-block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Browse Files
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-3 sm:mt-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Supported formats: PDF, JPG, PNG (Max 10MB)
          </p>
        </div>
      </div>

      {/* Certificates List */}
      {certificates.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
            Uploaded Certificates ({certificates.length})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#101C50] transition-colors"
              >
                <div className="flex items-start space-x-3 flex-1 w-full sm:w-auto mb-3 sm:mb-0">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-[#101C50] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#101C50] truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {cert.fileName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Uploaded: {cert.uploadDate} • {cert.fileSize}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <a
                    href={cert.fileUrl}
                    download
                    className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-[#101C50] text-white rounded-lg hover:bg-[#0d1640] transition-colors text-xs sm:text-sm font-semibold"
                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(cert.id)}
                      className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-semibold"
                      style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
          <p className="text-xs sm:text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            No certificates uploaded yet
          </p>
        </div>
      )}
    </div>
  );
}
