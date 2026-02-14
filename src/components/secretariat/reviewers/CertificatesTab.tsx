'use client';

import { FileText, ExternalLink, Download } from 'lucide-react';

interface Props {
  certificates: any[];
  onView: (cert: any) => void;
  onDownload: (cert: any) => void;
}

const CertificatesTab = ({ certificates, onView, onDownload }: Props) => {
  return (
    <div className="p-4 md:p-8">
      <h3 className="text-lg font-bold text-[#101C50] mb-6">Certificates & Documents</h3>
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#101C50] mb-1 truncate">{cert.name}</p>
                  <p className="text-xs text-gray-500 font-medium">Uploaded on {cert.uploadDate}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{cert.fileSize}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                <button
                  onClick={() => onView(cert)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-[#101C50] bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <ExternalLink size={14} /> View
                </button>
                <button
                  onClick={() => onDownload(cert)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-blue-600 bg-blue-50/50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <FileText size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No certificates uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default CertificatesTab;
