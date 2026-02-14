export interface Document {
  id: number;
  fileName: string;
  fileType: string;
  displayTitle?: string; 
  fileUrl: string | null;
  fileSize: number;
  isApproved?: boolean | null;
  needsRevision?: boolean;
  revisionComment?: string | null;
}

export interface Submission {
  id: string;
  submission_id: string;
  title: string;
  status: string;
  submitted_at: string;
  documents: Document[];
  certificateUrl?: string | null;
  form0011Url?: string | null;
  form0012Url?: string | null;
  approvalDate?: string | null;
}
