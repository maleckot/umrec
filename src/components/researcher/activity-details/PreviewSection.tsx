'use client';

import PreviewCard from '@/components/researcher-reviewer/PreviewCard';

interface Props {
  selectedDocument: any;
}

const PreviewSection = ({ selectedDocument }: Props) => {
  if (selectedDocument) {
    return <PreviewCard fileUrl={selectedDocument.fileUrl} filename={selectedDocument.fileName} />;
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <p className="text-gray-700 font-medium text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        No document available for preview
      </p>
    </div>
  );
};

export default PreviewSection;
