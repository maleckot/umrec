// components/researcher/profile/MySubmissionTab.tsx
'use client';

import { Eye, Download } from 'lucide-react';
import { useState } from 'react';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';

interface MySubmissionTabProps {
  submissions: any[];
}

export default function MySubmissionTab({ submissions }: MySubmissionTabProps) {
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string } | null>(null);

  // Flatten submissions to documents and filter out consolidated files
  const documents = submissions.flatMap(submission =>
    submission.documents?.filter((doc: any) =>
      !doc.file_name?.toLowerCase().includes('consolidated') &&
      !doc.is_consolidated // if you have a flag in your backend
    ).map((doc: any) => ({
      id: doc.id,
      fileName: doc.file_name,
      date: submission.date,
      status: submission.status,
      fileUrl: doc.signedUrl
    })) || []
  );

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'text-gray-600',
      'verified': 'text-blue-600',
      'classified': 'text-purple-600',
      'under_review': 'text-orange-600',
      'review_complete': 'text-green-600',
      'revision': 'text-red-600',
      'approved': 'text-green-600',
      'rejected': 'text-red-600',
    };
    return statusMap[status] || 'text-gray-600';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      'pending': 'Pending',
      'verified': 'Verified',
      'classified': 'Classified',
      'under_review': 'Under Review',
      'review_complete': 'Reviewed',
      'revision': 'Needs Revision',
      'approved': 'Approved',
      'rejected': 'Rejected',
    };
    return statusLabels[status] || status;
  };

  const handleViewDocument = (fileName: string, fileUrl: string) => {
    setSelectedDocument({ name: fileName, url: fileUrl });
  };

  const handleDownload = (fileName: string, fileUrl: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          No documents yet
        </p>
      </div>
    );
  }

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
              {documents.map((document, index) => (
                <tr key={document.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {document.fileName}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {document.date}
                  </td>
                  <td className={`px-4 py-3 text-center text-sm font-semibold ${getStatusColor(document.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {getStatusLabel(document.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDocument(document.fileName, document.fileUrl)}
                        className="p-2 text-[#003366] hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(document.fileName, document.fileUrl)}
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
          {documents.map((document) => (
            <div key={document.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-[#003366] text-sm" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {document.fileName}
                  </p>
                  <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {document.date}
                  </p>
                </div>
                <span className={`text-xs font-semibold ${getStatusColor(document.status)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {getStatusLabel(document.status)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDocument(document.fileName, document.fileUrl)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#003366] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button
                  onClick={() => handleDownload(document.fileName, document.fileUrl)}
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
