// components/PreviewCard.tsx
'use client';

import { useState } from 'react';

interface PreviewCardProps {
  fileUrl?: string;
  filename?: string;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ fileUrl, filename }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      <h3 className="text-lg md:text-xl font-bold mb-6 text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Preview
      </h3>

      <div className="relative w-full bg-gray-200 rounded-xl overflow-hidden" style={{ height: '1000px' }}>
        {fileUrl ? (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-[#101C50] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Loading preview...
                  </p>
                </div>
              </div>
            )}
            
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="text-center px-4">
                  <p className="text-base text-gray-600 mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Unable to preview this file
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-[#101C50] text-white rounded-full hover:bg-[#0d1640] transition-colors inline-block"
                    style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}
                  >
                    Download File
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                src={`${fileUrl}#view=FitH`}
                className="w-full h-full absolute inset-0"
                style={{ border: 'none' }}
                title={filename || 'File Preview'}
                onLoad={handleLoad}
                onError={handleError}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-base text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              File preview placeholder
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewCard;
