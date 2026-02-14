'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { createClient } from '@/utils/supabase/client';

// Import UI Components from your components directory structure
import Step7Header from '@/components/researcher/submission/revision/step7/Step7Header';
import RevisionCommentBox from '@/components/researcher/submission/revision/step7/RevisionCommentBox';
import InstructionPanel from '@/components/researcher/submission/revision/step7/InstructionPanel';
import UploadField from '@/components/researcher/submission/revision/step7/UploadField';
import AddressGuide from '@/components/researcher/submission/revision/step7/AddressGuide';
import RequirementsList from '@/components/researcher/submission/revision/step7/RequirementsList';
import ActionButtons from '@/components/researcher/submission/revision/step7/ActionButtons';

function RevisionStep7Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const docId = searchParams.get('docId');
  const docType = searchParams.get('docType');
  const supabase = createClient();

  // State
  const [revisionCount, setRevisionCount] = useState<number>(0);
  const isQuickRevision = !!docId && docType === 'endorsement_letter';
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [revisionComments, setRevisionComments] = useState<string>('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Initial Data Fetching
  useEffect(() => {
    setIsClient(true);
    if (!submissionId) {
      // Don't redirect immediately to avoid hydration mismatch, handle in UI
      return;
    }

    const fetchCommentsAndData = async () => {
      setLoadingComments(true);
      try {
        if (isQuickRevision && docId) {
          // --- QUICK REVISION LOGIC ---
          console.log(`Quick Revision: Fetching comments for docId ${docId}`);

          const { data: verification } = await supabase
            .from('document_verifications')
            .select('feedback_comment')
            .eq('document_id', docId)
            .single();

          const { data: docData } = await supabase
            .from('uploaded_documents')
            .select('revision_count')
            .eq('id', docId)
            .single();

          setRevisionCount(docData?.revision_count || 0);

          const { data: submissionCommentsData } = await supabase
            .from('submission_comments')
            .select('comment_text, created_at')
            .eq('submission_id', submissionId)
            .eq('is_resolved', false)
            .order('created_at', { ascending: true });

          let combinedComments = '';
          if (verification?.feedback_comment) {
            combinedComments += `**Document Verification Feedback:**\n${verification.feedback_comment}\n\n`;
          }
          if (submissionCommentsData && submissionCommentsData.length > 0) {
            combinedComments += submissionCommentsData
              .map((comment, idx) => `**UMREC Comment ${idx + 1}:**\n${comment.comment_text}`)
              .join('\n\n---\n\n');
          }
          setRevisionComments(combinedComments || 'No specific feedback provided. Please review the document for any general improvements.');

        } else {
          // --- FULL REVISION LOGIC ---
          console.log(`Full Revision: Fetching ALL comments for submissionId ${submissionId}`);

          const { data: reviews } = await supabase
            .from('reviews')
            .select(`
              protocol_recommendation, protocol_disapproval_reasons, protocol_ethics_recommendation, protocol_technical_suggestions,
              icf_recommendation, icf_disapproval_reasons, icf_ethics_recommendation, icf_technical_suggestions
            `)
            .eq('submission_id', submissionId)
            .eq('status', 'submitted');

          const { data: submissionCommentsData } = await supabase
            .from('submission_comments')
            .select('comment_text, created_at')
            .eq('submission_id', submissionId)
            .eq('is_resolved', false)
            .order('created_at', { ascending: true });

          let combinedComments = '';
          
          if (reviews && reviews.length > 0) {
            const reviewComments = reviews.map((review, index) => {
              let text = `**Reviewer ${index + 1} Comments:**\n`;
              if (review.protocol_recommendation) text += `\n📋 **Protocol Recommendation:** ${review.protocol_recommendation}\n`;
              if (review.protocol_disapproval_reasons) text += `❌ **Protocol Disapproval Reasons:** ${review.protocol_disapproval_reasons}\n`;
              if (review.protocol_ethics_recommendation) text += `⚖️ **Protocol Ethics Recommendation:** ${review.protocol_ethics_recommendation}\n`;
              if (review.protocol_technical_suggestions) text += `💡 **Protocol Technical Suggestions:** ${review.protocol_technical_suggestions}\n`;
              if (review.icf_recommendation) text += `\n📋 **ICF Recommendation:** ${review.icf_recommendation}\n`;
              if (review.icf_disapproval_reasons) text += `❌ **ICF Disapproval Reasons:** ${review.icf_disapproval_reasons}\n`;
              if (review.icf_ethics_recommendation) text += `⚖️ **ICF Ethics Recommendation:** ${review.icf_ethics_recommendation}\n`;
              if (review.icf_technical_suggestions) text += `💡 **ICF Technical Suggestions:** ${review.icf_technical_suggestions}\n`;
              return text;
            }).join('\n---\n');
            combinedComments += reviewComments;
          }

          if (submissionCommentsData && submissionCommentsData.length > 0) {
            if (combinedComments) combinedComments += '\n\n---\n\n';
            combinedComments += '**UMREC Additional Comments:**\n\n';
            combinedComments += submissionCommentsData
              .map((comment, idx) => `**Comment ${idx + 1}:** ${comment.comment_text}`)
              .join('\n\n');
          }
          setRevisionComments(combinedComments || 'No reviewer comments available.');
        }

        // Load local storage for normal flow
        if (!isQuickRevision) {
          const saved = localStorage.getItem('revisionStep7Data');
          if (saved) {
            const parsedData = JSON.parse(saved);
            if (parsedData.fileName) console.log('Previous file:', parsedData.fileName);
          }
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setRevisionComments('Unable to load feedback comments.');
      } finally {
        setLoadingComments(false);
      }
    };

    fetchCommentsAndData();
  }, [submissionId, docId, isQuickRevision, router, supabase]);

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a valid endorsement letter document.');
      return;
    }

    if (isQuickRevision && submissionId && docId) {
      // --- QUICK REVISION SUBMIT ---
      setUploading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { alert('Not authenticated'); setUploading(false); return; }

        const { data: existingDoc } = await supabase.from('uploaded_documents').select('file_url, revision_count').eq('id', docId).single();

        if (existingDoc?.file_url) {
          try { await supabase.storage.from('research-documents').remove([existingDoc.file_url]); } catch (err) { console.warn('Old file delete error', err); }
        }

        const filePath = `${user.id}/${submissionId}/endorsement_letter_${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage.from('research-documents').upload(filePath, file);
        if (uploadError) throw uploadError;

        const newRevisionCount = (existingDoc?.revision_count || 0) + 1;
        const { error: updateError } = await supabase.from('uploaded_documents').update({
          file_url: filePath, file_name: file.name, file_size: file.size, uploaded_at: new Date().toISOString(), revision_count: newRevisionCount,
        }).eq('id', docId);
        if (updateError) throw updateError;

        await supabase.from('document_verifications').update({ is_approved: null, feedback_comment: null, verified_at: null }).eq('document_id', docId);

        const { data: allVerifications } = await supabase.from('document_verifications').select('is_approved').eq('submission_id', submissionId);
        const allAreNullOrApproved = !allVerifications || allVerifications.every((v) => v.is_approved === null || v.is_approved === true);
        const newStatus = allAreNullOrApproved ? 'pending' : 'needs_revision';

        await supabase.from('research_submissions').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', submissionId);

        if (allAreNullOrApproved) {
          await supabase.from('submission_comments').update({ is_resolved: true }).eq('submission_id', submissionId).eq('is_resolved', false);
        }

        alert('✅ Endorsement Letter updated successfully! Your submission has been resubmitted for review.');
        router.push(`/researchermodule`);
      } catch (error) {
        console.error('Error uploading:', error);
        alert('Failed to upload document. Please try again.');
      } finally {
        setUploading(false);
      }
    } else {
      // --- NORMAL FLOW SUBMIT ---
      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem('revisionStep7File', reader.result as string);
        const dataToSave = { fileName: file.name, fileSize: file.size, uploadedAt: new Date().toISOString() };
        localStorage.setItem('revisionStep7Data', JSON.stringify(dataToSave));
        setUploading(false);
        router.push(`/researchermodule/submissions/revision/step8?mode=revision&id=${submissionId}`);
      };
      reader.onerror = () => { alert('Error reading file.'); setUploading(false); };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    if (isQuickRevision && submissionId) {
      router.push(`/researchermodule/activity-details?id=${submissionId}`);
    } else {
      router.push(`/researchermodule/submissions/revision/step6?mode=revision&id=${submissionId}`);
    }
  };

  if (!isClient) return null; // Or a loading spinner

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />
      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          
          <Step7Header 
            isQuickRevision={isQuickRevision} 
            onBack={handleBack} 
          />

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            
            <RevisionCommentBox 
              comments={revisionComments} 
              isLoading={loadingComments} 
            />

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <InstructionPanel />
              
              <UploadField 
                file={file} 
                setFile={setFile} 
              />
              
              <AddressGuide />
              
              <RequirementsList />
              
              <ActionButtons 
                uploading={uploading} 
                file={file} 
                isQuickRevision={isQuickRevision} 
              />
            </form>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function RevisionStep7() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    }>
      <RevisionStep7Content />
    </Suspense>
  );
}
