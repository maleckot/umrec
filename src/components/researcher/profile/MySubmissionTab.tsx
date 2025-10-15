// components/researcher/profile/MySubmissionTab.tsx
'use client';

import { Eye, Download } from 'lucide-react';
import { useState } from 'react';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';

export default function MySubmissionTab() {
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string } | null>(null);

  // Mock submission data
  const submissions = [
    { 
      id: 1, 
      fileName: 'Research Protocol.pdf', 
      date: '7/16/25', 
      status: 'Approved',
      fileUrl: '/documents/research-protocol.pdf' // TODO: Replace with actual file URL
    },
    { 
      id: 2, 
      fileName: 'Research Protocol.pdf', 
      date: '7/16/25', 
      status: 'Needs Revision',
      fileUrl: '/documents/research-protocol-2.pdf'
    },
    { 
      id: 3, 
      fileName: 'Research Protocol.pdf', 
      date: '7/16/25', 
      status: 'Pending',
      fileUrl: '/documents/research-protocol-3.pdf'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600';
      case 'Needs Revision': return 'text-red-600';
      case 'Pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handleViewDocument = (fileName: string, fileUrl: string) => {
    setSelectedDocument({ name: fileName, url: fileUrl });
  };

  const handleDownload = (fileName: string, fileUrl: string) => {
    // TODO: Implement actual download logic
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#E8EEF3]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  File Name
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Date
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Status
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={submission.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submission.fileName}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submission.date}
                  </td>
                  <td className={`px-4 py-3 text-center text-sm font-semibold ${getStatusColor(submission.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submission.status}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleViewDocument(submission.fileName, submission.fileUrl)}
                        className="p-2 text-[#003366] hover:bg-gray-100 rounded-lg transition-colors" 
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDownload(submission.fileName, submission.fileUrl)}
                        className="p-2 text-[#003366] hover:bg-gray-100 rounded-lg transition-colors" 
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-[#003366] text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submission.fileName}
                  </p>
                  <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submission.date}
                  </p>
                </div>
                <span className={`text-xs font-semibold ${getStatusColor(submission.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {submission.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewDocument(submission.fileName, submission.fileUrl)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#003366] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button 
                  onClick={() => handleDownload(submission.fileName, submission.fileUrl)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#003366] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewerModal
          isOpen={true}
          onClose={() => setSelectedDocument(null)}
          documentName={selectedDocument.name}
          documentUrl={selectedDocument.url}
        />
      )}
    </>
  );
}
