'use client';

const LoadingIndicator = () => {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
        <p className="text-sm text-orange-700 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Uploading files and submitting your revision...
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
