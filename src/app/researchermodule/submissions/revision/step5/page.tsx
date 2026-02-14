'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { Upload } from 'lucide-react';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';
import { createClient } from '@/utils/supabase/client';

// Import New Components
import RevisionCommentBox from '@/components/researcher/submission/revision/step5/RevisionCommentBox';
import InstructionsSection from '@/components/researcher/submission/revision/step5/InstructionsSection';
import RequirementsChecklist from '@/components/researcher/submission/revision/step5/RequirementsChecklist';
import Step5Header from '@/components/researcher/submission/revision/step5/Step5Header';

function RevisionStep5Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const docId = searchParams.get('docId');
  const docType = searchParams.get('docType');
  const [isClient, setIsClient] = useState(false);
  const isQuickRevision = !!docId && docType === 'research_instrument';

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [revisionComments, setRevisionComments] = useState<string>('');
  const [loadingComments, setLoadingComments] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    setIsClient(true);

    if (!submissionId) {
      alert('No submission ID found. Redirecting to dashboard.');
      router.push('/researchermodule/submissions');
      return;
    }

    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        if (isQuickRevision) {
          const { data: verification } = await supabase
            .from('document_verifications')
            .select('feedback_comment')
            .eq('document_id', docId)
            .single();

          const { data: submissionComments } = await supabase
            .from('submission_comments')
            .select('comment_text')
            .eq('submission_id', submissionId)
            .eq('is_resolved', false)
            .order('created_at', { ascending: false });

          let combinedFeedback = '';
          if (verification?.feedback_comment) {
            combinedFeedback += `📋 **Document Reviewer Feedback:**\n${verification.feedback_comment}\n\n`;
          }
          if (submissionComments && submissionComments.length > 0) {
            combinedFeedback += `💬 **Submission Comments:**\n`;
            submissionComments.forEach((comment, idx) => {
              combinedFeedback += `\n${idx + 1}. ${comment.comment_text}\n`;
            });
          }
          setRevisionComments(combinedFeedback || 'No specific feedback provided. Please review the document for any general improvements.');
        } else {
          const { data: reviews } = await supabase
            .from('reviews')
            .select(`
                protocol_recommendation,
                protocol_disapproval_reasons,
                protocol_ethics_recommendation,
                protocol_technical_suggestions,
                icf_recommendation,
                icf_disapproval_reasons,
                icf_ethics_recommendation,
                icf_technical_suggestions
            `)
            .eq('submission_id', submissionId)
            .eq('status', 'submitted');

          if (reviews && reviews.length > 0) {
            const allComments = reviews
              .map((review, index) => {
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
              })
              .join('\n---\n');
            setRevisionComments(allComments);
          } else {
            setRevisionComments('No reviewer comments available.');
          }
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        setRevisionComments('Unable to load feedback comments.');
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [submissionId, docId, isQuickRevision, router, supabase]);

  useEffect(() => {
    const saved = localStorage.getItem('revisionStep5Data');
    if (saved) {
      const parsedData = JSON.parse(saved);
      if (parsedData.fileName) console.log('Previous file:', parsedData.fileName);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a valid research instrument document.');
      return;
    }

    if (isQuickRevision && submissionId && docId) {
      setUploading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('Not authenticated');
            return;
        }

        const { data: existingDoc } = await supabase.from('uploaded_documents').select('file_url, revision_count').eq('id', docId).single();

        if (existingDoc?.file_url) {
            await supabase.storage.from('research-documents').remove([existingDoc.file_url]);
        }

        const filePath = `${user.id}/${submissionId}/research_instrument_${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage.from('research-documents').upload(filePath, file);
        if (uploadError) throw uploadError;

        const newRevisionCount = (existingDoc?.revision_count || 0) + 1;
        const { error: updateError } = await supabase.from('uploaded_documents').update({
            file_url: filePath,
            file_name: file.name,
            file_size: file.size,
            uploaded_at: new Date().toISOString(),
            revision_count: newRevisionCount,
        }).eq('id', docId);
        if (updateError) throw updateError;

        await supabase.from('document_verifications').update({ is_approved: null, feedback_comment: null, verified_at: null }).eq('document_id', docId);

        const { data: allDocs } = await supabase.from('uploaded_documents').select('id').eq('submission_id', submissionId);
        if (allDocs && allDocs.length > 0) {
             const { data: allVerifications } = await supabase.from('document_verifications').select('is_approved').eq('submission_id', submissionId);
             const allAreNullOrApproved = !allVerifications || allVerifications.every((v) => v.is_approved === null || v.is_approved === true);
             const newStatus = allAreNullOrApproved ? 'pending' : 'needs_revision';
             await supabase.from('research_submissions').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', submissionId);
             
             if (allAreNullOrApproved) {
                 await supabase.from('submission_comments').update({ is_resolved: true }).eq('submission_id', submissionId).eq('is_resolved', false);
             }
        }

        alert('✅ Research Instrument updated successfully! Your submission has been resubmitted for review.');
        router.push(`/researchermodule`);
      } catch (error) {
        console.error('Error uploading:', error);
        alert('Failed to upload document. Please try again.');
      } finally {
        setUploading(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem('revisionStep5File', reader.result as string);
        const dataToSave = { fileName: file.name, fileSize: file.size, uploadedAt: new Date().toISOString() };
        localStorage.setItem('revisionStep5Data', JSON.stringify(dataToSave));
        router.push(`/researchermodule/submissions/revision/step6?mode=revision&id=${submissionId}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    if (isQuickRevision && submissionId) {
      router.push(`/researchermodule/activity-details?id=${submissionId}`);
    } else {
      router.push(`/researchermodule/submissions/revision/step4?mode=revision&id=${submissionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          
          <Step5Header isQuickRevision={isQuickRevision} onBack={handleBack} />

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            
            {loadingComments ? (
              <div className="mb-6 sm:mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : (
              <RevisionCommentBox comments={revisionComments} />
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <InstructionsSection />

              {/* Upload Component */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#071139] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Research Instrument Document
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Upload your revised and validated survey form, questionnaire, or other research measurement tools
                    </p>
                  </div>
                </div>

                <PDFUploadValidator
                  label="Research Instrument Document"
                  description="Upload your revised and validated survey form, questionnaire, or other research measurement tools. Ensure all requested changes have been incorporated."
                  value={file}
                  onChange={setFile}
                  validationKeywords={['survey', 'questionnaire', 'instrument', 'form']}
                  required
                />
              </div>

              <RequirementsChecklist />

              {/* Submit Button */}
              <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label={isQuickRevision ? "Submit revision" : "Save changes"}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-50"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {uploading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {isQuickRevision ? 'Submit Revision' : 'Save & Continue'}
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function RevisionStep5() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    }>
      <RevisionStep5Content />
    </Suspense>
  );
}
