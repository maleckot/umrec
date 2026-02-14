'use client';

import ResubmitButton from '@/components/researcher/ResubmitButton';

interface Props {
  selectedDocument: any;
  rawStatus: string;
  onResubmit: () => void;
}

const ResubmitAction = ({ selectedDocument, rawStatus, onResubmit }: Props) => {
  if (!selectedDocument) return null;

  const showButton = selectedDocument.fileType === 'consolidated_application'
    ? (rawStatus === 'under_revision' || rawStatus === 'needs_revision')
    : selectedDocument.needsRevision;

  if (showButton) {
    return (
        <div className="flex justify-end pt-4">
            <ResubmitButton onClick={onResubmit} />
        </div>
    );
  }

  return null;
};

export default ResubmitAction;
