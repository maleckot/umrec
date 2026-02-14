'use client';

import { FileText } from 'lucide-react';

interface Document {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  isApproved?: boolean | null;
  needsRevision?: boolean;
  revisionComment?: string | null;
  revisionCount?: number;
}

interface Props {
  selectedDocument: Document | null;
}

const DocumentInfoCard = ({ selectedDocument }: Props) => {
  const getDocumentTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      consolidated_application: 'Consolidated Application',
      research_instrument: 'Research Instrument',
      endorsement_letter: 'Endorsement Letter',
      proposal_defense: 'Proposal Defense',
      application_form: 'Application Form',
      research_protocol: 'Research Protocol',
      consent_form: 'Consent Form',
    };
    return typeMap[type] || type;
  };

  if (!selectedDocument) return null;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#101C50] rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3
            className="font-bold text-lg text-[#101C50] mb-1"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {getDocumentTypeLabel(selectedDocument.fileType)}
          </h3>
          <p
            className="text-sm text-gray-700 font-medium"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
             {/* Additional details can go here */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentInfoCard;
