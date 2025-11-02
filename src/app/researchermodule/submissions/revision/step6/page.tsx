// app/researchermodule/submissions/revision/step6/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { ArrowLeft, AlertCircle, MessageSquare, Upload, FileText, Shield } from 'lucide-react';
import PDFUploadValidator from '@/components/researcher/submission/PDFUploadValidator';
import { createClient } from '@/utils/supabase/client';

// Revision Comment Box Component
const RevisionCommentBox: React.FC<{ comments: string }> = ({ comments }) => {
  const reviewers = comments.split('---').filter(r => r.trim());

  return (
    <div className="mb-6 sm:mb-8 space-y-4">
      {reviewers.map((review, idx) => (
        <div key={idx} className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-sm">{idx + 1}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-amber-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Reviewer {idx + 1} Comments
              </h3>
              <div className="space-y-2 text-sm text-amber-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {review
                  .split('\n')
                  .filter(line => line.trim())
                  .map((line, lineIdx) => (
                    <p key={lineIdx} className="leading-relaxed">
                      {line.replace(/\*\*/g, '').trim()}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function RevisionStep6Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  const docId = searchParams.get('docId');
  const docType = searchParams.get('docType');

  const isQuickRevision = !!docId && docType === 'proposal_defense';

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [revisionComments, setRevisionComments] = useState<string>('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [isClient, setIsClient] = useState(false); // ✅ ADDED
  const supabase = createClient();

  // ✅ --- START: REVISED useEffect ---
  useEffect(() => {
    setIsClient(true); 

    // 1. Guard against missing submissionId
    if (!submissionId) {
      alert('No submission ID found. Redirecting to dashboard.');
      router.push('/researchermodule/submissions');
      return;
    }
  
    const fetchCommentsAndData = async () => {
      setLoadingComments(true);
      try {
        if (isQuickRevision) {
          // 2a. QUICK REVISION flow
          console.log(`Quick Revision: Fetching comments for docId ${docId}`);
          const { data: verification } = await supabase
            .from('document_verifications')
            .select('feedback_comment')
            .eq('document_id', docId) // docId is guaranteed to exist here
            .single();
  
          if (verification?.feedback_comment) {
            setRevisionComments(verification.feedback_comment);
          } else {
            setRevisionComments('No specific feedback provided. Please review the document for any general improvements.');
          }
        } else {
          // 2b. FULL REVISION flow
          console.log(`Full Revision: Fetching ALL comments for submissionId ${submissionId}`);
          
          const { data: reviews } = await supabase
            .from('reviews')
            .select(
              `
              protocol_recommendation,
              protocol_disapproval_reasons,
              protocol_ethics_recommendation,
              protocol_technical_suggestions,
              icf_recommendation,
              icf_disapproval_reasons,
              icf_ethics_recommendation,
              icf_technical_suggestions
              `
            )
            .eq('submission_id', submissionId)
            .eq('status', 'submitted');
  
          if (reviews && reviews.length > 0) {
            const allComments = reviews
              .map((review, index) => {
                let text = `**Reviewer ${index + 1} Comments:**\n`;
                
                // Protocol Comments
                if (review.protocol_recommendation) text += `\n📋 **Protocol Recommendation:** ${review.protocol_recommendation}\n`;
                if (review.protocol_disapproval_reasons) text += `❌ **Protocol Disapproval Reasons:** ${review.protocol_disapproval_reasons}\n`;
                if (review.protocol_ethics_recommendation) text += `⚖️ **Protocol Ethics Recommendation:** ${review.protocol_ethics_recommendation}\n`;
                if (review.protocol_technical_suggestions) text += `💡 **Protocol Technical Suggestions:** ${review.protocol_technical_suggestions}\n`;
                
                // ICF Comments
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

      // 3. Load from localStorage (for multi-step flow)
      // This is still useful for remembering the file if you click "Back" then "Next"
      if (!isQuickRevision) {
        const saved = localStorage.getItem('revisionStep6Data');
        if (saved) {
          const parsedData = JSON.parse(saved);
          if (parsedData.fileName) {
            console.log('Previous file:', parsedData.fileName);
            // You could potentially restore the 'file' object from sessionStorage here
            // but simply logging is fine.
          }
        }
      }
    };
  
    fetchCommentsAndData();
  
  }, [submissionId, docId, isQuickRevision, router, supabase]);
  // ✅ --- END: REVISED useEffect ---


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please upload a valid proposal defense certification document.');
      return;
    }

    // ✅ QUICK REVISION: Upload directly and update database
    if (isQuickRevision && submissionId && docId) {
      setUploading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert('Not authenticated');
          setUploading(false);
          return;
        }

        // ✅ FETCH OLD FILE URL FIRST
        const { data: existingDoc } = await supabase
          .from('uploaded_documents')
          .select('file_url')
          .eq('id', docId)
          .single();

        // ✅ DELETE OLD FILE FROM STORAGE
        if (existingDoc?.file_url) {
          try {
            await supabase.storage
              .from('research-documents')
              .remove([existingDoc.file_url]);
            console.log('✅ Deleted old defense certification file');
          } catch (err) {
            console.warn('⚠️ Could not delete old file:', err);
          }
        }

        // ✅ UPLOAD NEW FILE
        const filePath = `${user.id}/${submissionId}/proposal_defense_${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('research-documents')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // ✅ UPDATE DOCUMENT RECORD WITH NEW PATH
        const { error: updateError } = await supabase
          .from('uploaded_documents')
          .update({
            file_url: filePath,
            file_name: file.name,
            file_size: file.size,
            uploaded_at: new Date().toISOString(),
          })
          .eq('id', docId);

        if (updateError) {
          throw updateError;
        }

        // ✅ RESET VERIFICATION STATUS
        const { error: verifyError } = await supabase
          .from('document_verifications')
          .update({
            is_approved: null,
            feedback_comment: null,
            verified_at: null,
          })
          .eq('document_id', docId);

        if (verifyError) {
          console.error('Failed to reset verification:', verifyError);
        }

        // ✅ CHECK STATUS: If all document verifications are null → "pending", else → "needs_revision"
        console.log('🔍 Checking document verification status...');

        const { data: allDocs } = await supabase
          .from('uploaded_documents')
          .select('id')
          .eq('submission_id', submissionId);

        if (allDocs && allDocs.length > 0) {
          // Get all verification records for this submission
          const { data: allVerifications } = await supabase
            .from('document_verifications')
            .select('is_approved')
            .eq('submission_id', submissionId);

          // Check if ALL verifications are null/approved is null
          const allAreNull = !allVerifications || allVerifications.every(v => v.is_approved === null);

          const newStatus = allAreNull ? 'pending' : 'needs_revision';

          console.log(`📊 Status update: ${newStatus} (${allAreNull ? 'All verifications null' : 'Some verifications exist'})`);

          // Update submission status
          const { error: statusError } = await supabase
            .from('research_submissions')
            .update({
              status: newStatus,
              updated_at: new Date().toISOString(),
            })
            .eq('id', submissionId);

          if (statusError) {
            console.error('Failed to update status:', statusError);
          } else {
            console.log(`✅ Submission status updated to: ${newStatus}`);
          }
        }

        alert('✅ Proposal Defense Certification updated successfully! Your submission has been resubmitted for review.');
        router.push(`/researchermodule`);
      } catch (error) {
        console.error('Error uploading:', error);
        alert('Failed to upload document. Please try again.');
      } finally {
        setUploading(false);
      }
    }
    // ✅ NORMAL MULTI-STEP FLOW
    else {
      setUploading(true); // Show loading state
      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem('revisionStep6File', reader.result as string);

        const dataToSave = {
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
        };
        localStorage.setItem('revisionStep6Data', JSON.stringify(dataToSave));
        console.log('💾 Revision Step 6 data saved');
        
        setUploading(false); // Hide loading state
        router.push(`/researchermodule/submissions/revision/step7?mode=revision&id=${submissionId}`);
      };
      reader.onerror = () => {
        alert('Error reading file.');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ --- START: REVISED handleBack ---
  const handleBack = () => {
    if (isQuickRevision && submissionId) {
      router.push(`/researchermodule/activity-details?id=${submissionId}`);
    } else {
      // ✅ FIX: Added submissionId to the URL
      router.push(`/researchermodule/submissions/revision/step5?mode=revision&id=${submissionId}`);
    }
  };
  // ✅ --- END: REVISED handleBack ---

  // Loading state while checking client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#071139] mx-auto mb-4"></div>
            <p className="text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Enhanced Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <button
                onClick={handleBack}
                className="w-12 h-12 bg-white border-2 border-[#071139]/20 rounded-full flex items-center justify-center hover:bg-[#071139] hover:border-[#071139] hover:shadow-lg transition-all duration-300 group"
                aria-label="Go back to previous page"
              >
                <ArrowLeft size={20} className="text-[#071139] group-hover:text-[#F7D117] transition-colors duration-300" />
              </button>

              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                  <span style={{ fontFamily: 'Metropolis, sans-serif' }}>6</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Proposal Defense Certification - {isQuickRevision ? 'Quick Revision' : 'Revision'}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {isQuickRevision
                      ? 'Upload your updated certification and submit immediately'
                      : 'Upload an updated or clearer version of your certification'}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar - Only in multi-step */}
            {!isQuickRevision && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 transition-all duration-500 rounded-full shadow-lg"
                    style={{ width: '75%' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Step 6 of 8
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    75% Complete
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Enhanced Content Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Reviewer Comments Box - WITH LOADING STATE */}
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
              revisionComments && <RevisionCommentBox comments={revisionComments} />
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Instructions */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-base sm:text-lg mb-3 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <AlertCircle size={20} className="text-orange-500" />
                  Instructions
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span>Upload a <strong>one-page</strong> proposal defense certification or evaluation with improved quality</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span><strong>High-quality scans are required</strong> - ensure all text, signatures, and stamps are clear and readable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span>File must be in <strong>PDF format</strong> and not exceed <strong>10MB</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span>Document must contain <strong>all required signatures</strong> and official stamps/seals clearly visible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">•</span>
                    <span>Ensure the defense date and any panel recommendations are legible</span>
                  </li>
                </ul>
              </div>

              {/* Upload Component */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#071139] text-base sm:text-lg" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Proposal Defense Certification/Evaluation
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Upload a clear, high-quality scan of your one-page certification
                    </p>
                  </div>
                </div>

                <PDFUploadValidator
                  label="Proposal Defense Certification/Evaluation"
                  description="Upload a clear, high-quality scan of your one-page certification showing your proposal defense has been completed and approved. Address all quality issues mentioned in the feedback."
                  value={file}
                  onChange={setFile}
                  validationKeywords={['defense', 'certification', 'evaluation', 'approval']}
                  required
                />
              </div>

              {/* Important Note */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
                <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <FileText size={18} className="text-orange-600" />
                  For Student Researchers
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  This document certifies that you have successfully defended your research proposal before a panel.
                  It should include the date of defense, panel members' signatures, and any recommendations or conditions
                  for proceeding with the study.
                </p>
                <p className="text-xs sm:text-sm text-orange-800 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  If the previous submission was rejected due to poor quality, please ensure this updated version meets all clarity requirements. Contact your research adviser if you need assistance obtaining a clearer copy.
                </p>
              </div>

              {/* Quality Requirements */}
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-600 p-4 sm:p-6 rounded-r-lg">
                <h4 className="font-bold text-[#071139] mb-3 text-sm sm:text-base flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <AlertCircle size={18} className="text-orange-600" />
                  Quality Requirements
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <li className="flex items-start">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                    <span>All text is legible and clear (no blurry or pixelated areas)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                    <span>All signatures are clearly visible and authentic</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                    <span>Official stamps or seals are visible and readable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                    <span>Defense date is clearly shown</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                    <span>Panel recommendations or approval status is readable</span>
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={uploading || !file}
                  className={`group relative px-10 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden transition-all duration-300 ${
                    !file || uploading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                  }`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label={isQuickRevision ? "Submit revision" : "Save and continue"}
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

export default function RevisionStep6() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    }>
      <RevisionStep6Content />
    </Suspense>
  );
}