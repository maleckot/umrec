'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getReviewerEvaluations } from '@/app/actions/reviewer/getReviewerEvaluations';
import { postReviewReply } from '@/app/actions/reviewer/postReviewReply';
import { submitConflictOfInterest } from '@/app/actions/reviewer/submitConflictOfInterest';
import { updateReviewReply } from '@/app/actions/reviewer/updateReviewReply'; 
import { deleteReviewReply } from '@/app/actions/reviewer/deleteReviewReply';

// Components
import BackButton from '@/components/reviewer/reviews/details/BackButton';
import SubmissionDetailsCard from '@/components/reviewer/reviews/details/SubmissionDetailsCard';
import SubmittedFilesCard from '@/components/reviewer/reviews/details/SubmittedFilesCard';
import EvaluationsList from '@/components/reviewer/reviews/details/EvaluationsList';
import ActionButtons from '@/components/reviewer/reviews/details/ActionButtons';
import StartReviewModal from '@/components/reviewer/StartReviewModal';
import EditReviewModal from '@/components/reviewer/EditReviewModal';
import ConflictOfInterestModal from '@/components/reviewer/ConflictOfInterestModal';
import DocumentViewerModal from '@/components/staff-secretariat-admin/submission-details/DocumentViewerModal';
import DeleteConfirmationModal from '@/components/reviewer/reviews/details/DeleteConfirmationModal';

export default function ReviewDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [coiOpen, setCoiOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<number | null>(null);

  // General States
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showRepliesFor, setShowRepliesFor] = useState<string[]>([]);
  
  // Data State
  const [reviewerEvaluations, setReviewerEvaluations] = useState<any[]>([]);
  const [currentReviewerId, setCurrentReviewerId] = useState<string>('');
  const [assignmentStatus, setAssignmentStatus] = useState<string>('pending');
  const [selectedDocument, setSelectedDocument] = useState<{ name: string, url: string } | null>(null);
  const [submittedFiles, setSubmittedFiles] = useState<any[]>([]);

  const [submissionData, setSubmissionData] = useState({
    id: id,
    title: 'Loading...',
    category: '',
    assignedDate: '',
    dueDate: '',
    description: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (id) {
      loadEvaluations();
    }
  }, [id]);

  const loadEvaluations = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await getReviewerEvaluations(id);

      if (result.success) {
        setReviewerEvaluations(result.evaluations || []);
        setCurrentReviewerId(result.currentReviewerId || '');
        setAssignmentStatus(result.assignmentStatus || 'pending');

        if (result.submission) {
          setSubmissionData({
            id: result.submission.id,
            title: result.submission.title,
            category: result.submission.category,
            assignedDate: result.submission.assignedDate,
            dueDate: result.submission.dueDate || 'TBD',
            description: result.submission.description,
            status: result.submission.status?.toLowerCase() || 'pending'
          });
        }

        if (result.consolidatedDocument) {
          setSubmittedFiles([
            {
              id: 1,
              name: result.consolidatedDocument.name,
              displayTitle: result.consolidatedDocument.displayTitle,
              time: new Date(result.consolidatedDocument.uploadedAt).toLocaleDateString('en-US'),
              status: 'viewed',
              url: result.consolidatedDocument.url
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = () => setShowModal(true);
  
  const handleConfirmReview = () => {
    setShowModal(false);
    router.push(`/reviewermodule/review-submission?id=${id}`);
  };

  const handleEditReview = () => setShowEditModal(true);
  
  const handleConfirmEditReview = () => {
    setShowEditModal(false);
    router.push(`/reviewermodule/review-submission?id=${id}&edit=true`);
  };

  const handleReplyClick = (evaluationId: string) => {
    setReplyingTo(replyingTo === evaluationId ? null : evaluationId);
    setReplyText('');
  };

  const toggleReplies = (evaluationId: string) => {
    setShowRepliesFor(prev =>
      prev.includes(evaluationId)
        ? prev.filter(id => id !== evaluationId)
        : [...prev, evaluationId]
    );
  };

  const handlePostReply = async () => {
    if (!replyText.trim() || !replyingTo) return;

    try {
      const result = await postReviewReply(replyingTo, replyText);

      if (result.success && result.reply) {
        setReviewerEvaluations(prev => prev.map(evaluation => {
          if (String(evaluation.id) === replyingTo) {
            return {
              ...evaluation,
              replies: [
                ...(evaluation.replies || []),
                {
                  id: result.reply.id,
                  reviewerId: currentReviewerId,
                  name: 'You',
                  code: 'N/A',
                  date: new Date().toLocaleDateString('en-US'),
                  text: replyText,
                }
              ]
            };
          }
          return evaluation;
        }));
        setReplyText('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const handleEditReply = async (replyId: number, newText: string) => {
    try {
      const result = await updateReviewReply(replyId, newText);
      
      if (result.success) {
        setReviewerEvaluations(prev => prev.map(evaluation => ({
          ...evaluation,
          replies: evaluation.replies ? evaluation.replies.map((r: any) => 
            r.id === replyId ? { ...r, text: newText } : r
          ) : []
        })));
      }
    } catch (error) {
      console.error('Error editing reply:', error);
    }
  };

  // 1. Open Modal
  const confirmDeleteReply = (replyId: number) => {
    setReplyToDelete(replyId);
    setShowDeleteModal(true);
  };

  // 2. Perform Delete
  const handleDeleteReply = async () => {
    if (replyToDelete === null) return;

    try {
      const result = await deleteReviewReply(replyToDelete);

      if (result.success) {
        setReviewerEvaluations(prev => prev.map(evaluation => ({
          ...evaluation,
          replies: evaluation.replies ? evaluation.replies.filter((r: any) => r.id !== replyToDelete) : []
        })));
        setShowDeleteModal(false);
        setReplyToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const handleSubmitCOI = async (payload: any) => {
    try {
      const res = await fetch(payload.signatureImage);
      const blob = await res.blob();
      const file = new File([blob], "signature.png", { type: "image/png" });
      
      const signatureFormData = new FormData();
      signatureFormData.append('file', file);

      const formData = {
        submissionId: submissionData.id as string,
        hasStockOwnership: payload.answers.stocks === 'yes',
        hasReceivedCompensation: payload.answers.salary === 'yes',
        hasOfficialRole: payload.answers.officer === 'yes',
        hasPriorWorkExperience: payload.answers.research_work === 'yes',
        hasStandingIssue: payload.answers.issue === 'yes',
        hasSocialRelationship: payload.answers.social === 'yes',
        hasOwnershipInterest: payload.answers.ownership_topic === 'yes',
        protocolCode: payload.protocolCode,
        remarks: payload.remarks,
        printedName: payload.signatureName
      };

      const result = await submitConflictOfInterest(formData, signatureFormData);

      if (result.success) {
        loadEvaluations();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('COI Logic Error:', error);
      return { success: false, error: 'Failed to process submission.' };
    }
  };

  const handleViewDocument = (name: string, url: string) => {
      setSelectedDocument({ name, url });
      setViewerOpen(true);
  };

  const currentUserReview = reviewerEvaluations.find(
    (evaluation) => String(evaluation.reviewerId) === currentReviewerId
  );

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101C50]"></div></div>;

  return (
    <>
      <BackButton />

      <SubmissionDetailsCard submissionData={submissionData} />

      <SubmittedFilesCard 
          submittedFiles={submittedFiles} 
          submissionTitle={submissionData.title}
          onViewDocument={handleViewDocument}
      />

      <EvaluationsList 
          evaluations={reviewerEvaluations}
          currentReviewerId={currentReviewerId}
          showRepliesFor={showRepliesFor}
          toggleReplies={toggleReplies}
          replyingTo={replyingTo}
          handleReplyClick={handleReplyClick}
          replyText={replyText}
          setReplyText={setReplyText}
          handlePostReply={handlePostReply}
          setReplyingTo={setReplyingTo}
          handleEditReview={handleEditReview}
          onEditReply={handleEditReply}
          onDeleteReply={confirmDeleteReply} // Pass the modal trigger function
      />

      <ActionButtons 
          assignmentStatus={assignmentStatus}
          hasReview={!!currentUserReview}
          onStartReview={handleStartReview}
          onCOI={() => setCoiOpen(true)}
          onEditReview={handleEditReview}
      />

      {/* Modals */}
      <StartReviewModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleConfirmReview} submissionTitle={submissionData.title} />
      <EditReviewModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onConfirm={handleConfirmEditReview} submissionTitle={submissionData.title} />
      <ConflictOfInterestModal isOpen={coiOpen} onClose={() => setCoiOpen(false)} protocolCode={String(submissionData.id ?? id ?? '')} submissionTitle={submissionData.title} onSubmit={handleSubmitCOI} />
      {selectedDocument && <DocumentViewerModal isOpen={viewerOpen} onClose={() => setViewerOpen(false)} documentName={selectedDocument.name} documentUrl={selectedDocument.url} />}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={handleDeleteReply} 
      />
    </>
  );
}
