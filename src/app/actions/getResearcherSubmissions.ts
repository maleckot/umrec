// src/app/actions/getResearcherSubmissions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getResearcherSubmissions() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { 
        success: false, 
        error: 'User not authenticated',
        submissions: [],
        stats: { active: 0, pending: 0, needsRevision: 0 },
        currentSubmission: null
      };
    }

    // Fetch all submissions for this researcher
    const { data: submissions, error: submissionsError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false });

    if (submissionsError) {
      return { 
        success: false, 
        error: 'Failed to fetch submissions',
        submissions: [],
        stats: { active: 0, pending: 0, needsRevision: 0 },
        currentSubmission: null
      };
    }

    const submissionList = submissions || [];

    // Fetch documents for each submission WITH verification status
    const submissionsWithDocuments = await Promise.all(
      submissionList.map(async (submission) => {
        const { data: documents } = await supabase
          .from('uploaded_documents')
          .select('*')
          .eq('submission_id', submission.id)
          .order('uploaded_at', { ascending: true });

        // ✅ Fetch verifications for this submission
        const { data: verifications } = await supabase
          .from('document_verifications')
          .select('*')
          .eq('submission_id', submission.id);

        // Generate signed URLs for documents
        const documentsWithUrls = await Promise.all(
          (documents || []).map(async (doc) => {
            // ✅ Find verification for this specific document
            const verification = verifications?.find(v => v.document_id === doc.id);

            const { data: urlData } = await supabase.storage
              .from('research-documents')
              .createSignedUrl(doc.file_url, 3600);

            return {
              id: doc.id,
              fileName: doc.file_name,
              fileType: doc.document_type,
              fileUrl: urlData?.signedUrl || null,
              fileSize: doc.file_size,
              // ✅ Add verification status
              isApproved: verification?.is_approved ?? null,
              needsRevision: verification?.is_approved === false,
              revisionComment: verification?.feedback_comment || null,
            };
          })
        );

        return {
          ...submission,
          documents: documentsWithUrls
        };
      })
    );

    const stats = {
      active: submissionList.filter(s => 
        ['new_submission', 'awaiting_classification', 'under_review', 'submitted', 'pending'].includes(s.status)
      ).length,
      pending: submissionList.filter(s => 
        ['under_review', 'pending'].includes(s.status)
      ).length,
      needsRevision: submissionList.filter(s => 
        s.status === 'needs_revision'
      ).length,
    };

    const currentSubmission = submissionList[0] || null;

    return {
      success: true,
      submissions: submissionsWithDocuments,
      stats,
      currentSubmission
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch submissions',
      submissions: [],
      stats: { active: 0, pending: 0, needsRevision: 0 },
      currentSubmission: null
    };
  }
}
