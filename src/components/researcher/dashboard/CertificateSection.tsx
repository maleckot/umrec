'use client';
import { Download, FileCheck, Clock } from 'lucide-react';
import { Submission } from '@/types/researcher';

// Duplicate this helper if not imported from a shared utils file
const getTimelineStage = (status: string) => {
  const normalizedStatus = status?.toLowerCase().replace(/ /g, '_');
  if (['completed', 'approved'].includes(normalizedStatus)) return 6;
  if (['review_complete'].includes(normalizedStatus)) return 7;
  return 1; // Default low stage if not matched
};

export default function CertificateSection({ submissions }: { submissions: Submission[] }) {
  
  // Filter for submissions that are ready for or awaiting certificates (Stage 6+)
  const submissionsAwaitingOrApproved = submissions.filter(s => getTimelineStage(s.status) >= 6);

  if (submissionsAwaitingOrApproved.length === 0) return null;

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="mb-8 sm:mb-12">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <span className="w-1 h-6 sm:h-7 md:h-8 bg-gradient-to-b from-[#101C50] to-[#F0E847] rounded-full"></span>
        Certificates & Documents
      </h2>
      
      <div className="space-y-3 sm:space-y-4">
        {submissionsAwaitingOrApproved.map(submission => {
          const certificatesReleased = submission.certificateUrl || submission.form0011Url || submission.form0012Url;
          
          return (
            <div key={submission.id} 
              className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 shadow-md hover:shadow-lg transition-all duration-300 ${
                certificatesReleased 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 hover:border-blue-500' 
                  : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400 hover:border-yellow-500'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  certificatesReleased 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                }`}>
                  {certificatesReleased 
                    ? <FileCheck size={20} className="text-white sm:w-6 sm:h-6" />
                    : <Clock size={20} className="text-white sm:w-6 sm:h-6" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base sm:text-lg font-bold mb-1 truncate ${
                    certificatesReleased ? 'text-blue-900' : 'text-yellow-900'
                  }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {submission.title}
                  </h3>
                  <p className={`text-xs sm:text-sm ${
                    certificatesReleased ? 'text-blue-800' : 'text-yellow-800'
                  }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {certificatesReleased 
                      ? `Approved on ${submission.approvalDate ? formatDate(submission.approvalDate) : formatDate(submission.submitted_at)}`
                      : "Review completed. Awaiting certificate release from secretariat."
                    }
                  </p>
                </div>
              </div>

              {certificatesReleased ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {submission.certificateUrl && (
                    <DownloadButton 
                      label="Certificate of Approval" 
                      onClick={() => handleDownload(submission.certificateUrl!, 'Certificate_of_Approval.pdf')} 
                    />
                  )}
                  {submission.form0011Url && (
                    <DownloadButton 
                      label="Form 0011" 
                      onClick={() => handleDownload(submission.form0011Url!, 'Form_0011.pdf')} 
                    />
                  )}
                  {submission.form0012Url && (
                    <DownloadButton 
                      label="Form 0012" 
                      onClick={() => handleDownload(submission.form0012Url!, 'Form_0012.pdf')} 
                    />
                  )}
                </div>
              ) : (
                <div className="bg-yellow-100/80 border border-yellow-300 rounded-xl p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-yellow-900 text-center font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    <strong>Pending Release:</strong> The secretariat will release your approval documents shortly.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const DownloadButton = ({ label, onClick }: { label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer"
    style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
  >
    <Download size={16} className="sm:w-5 sm:h-5" />
    <span className="text-xs sm:text-sm">{label}</span>
  </button>
);
