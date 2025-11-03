// src/app/actions/getResearcherSubmissions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

function formatDocumentTitle(documentType: string, submissionTitle: string): string {
  const typeFormatMap: Record<string, string> = {
    'research_instrument': 'Research Instrument',
    'endorsement_letter': 'Endorsement Letter',
    'proposal_defense': 'Proposal Defense',
    'application_form': 'Application Form',
    'research_protocol': 'Research Protocol',
    'consent_form': 'Consent Form',
    'consolidated_application': 'Consolidated Application',
  };

  const formattedType = typeFormatMap[documentType] || documentType;
  return `${formattedType} - ${submissionTitle}`;
}

export async function getResearcherSubmissions() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('Auth user:', user?.id);
    console.log('Auth error:', userError);
    
    if (userError || !user) {
      return {
        success: false,
        error: 'User not authenticated',
        submissions: [],
        stats: { active: 0, pending: 0, needsRevision: 0 },
        currentSubmission: null
      };
    }
    
    console.log('Current user email:', user?.email);
    console.log('Current user ID:', user?.id);

    const { data: submissions, error: submissionsError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false });

    console.log('Submissions count:', submissions?.length);
    console.log('Submissions error:', submissionsError);
    console.log('Raw submissions:', submissions);

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

    // ✅ FILTER: 6 original documents
    const originalDocTypes = [
      'application_form',
      'consent_form',
      'research_protocol',
      'research_instrument',
      'endorsement_letter',
      'proposal_defense',
    ];

    const submissionsWithDocuments = await Promise.all(
      submissionList.map(async (submission) => {
        const { data: documents } = await supabase
          .from('uploaded_documents')
          .select('*')
          .eq('submission_id', submission.id)
          .order('uploaded_at', { ascending: true });

        const { data: verifications } = await supabase
          .from('document_verifications')
          .select('*')
          .eq('submission_id', submission.id);

        let filteredDocuments = documents || [];

        console.log('=== FILTER DEBUG ===');
        console.log('Status:', submission.status);
        console.log('Total documents:', documents?.length);
        console.log('Document types:', documents?.map(d => d.document_type));

        // ✅ Show only consolidated document for these statuses:
        if (submission.status === 'under_review' ||
          submission.status === 'review_complete' ||
          submission.status === 'under_revision' ||
          submission.status === 'approved') {
          filteredDocuments = (documents || []).filter(
            doc => doc.document_type === 'consolidated_application'
          );
          console.log('After filter - filtered count:', filteredDocuments.length);
        } else {
          // ✅ NEW: For early statuses, show only 6 original docs
          filteredDocuments = (documents || []).filter(
            doc => originalDocTypes.includes(doc.document_type)
          );
          console.log('After original filter - filtered count:', filteredDocuments.length);
        }
        console.log('===================');

        const documentsWithUrls = await Promise.all(
          filteredDocuments.map(async (doc) => {
            const verification = verifications?.find(v => v.document_id === doc.id);

            const { data: urlData } = await supabase.storage
              .from('research-documents')
              .createSignedUrl(doc.file_url, 3600);

            const displayTitle = formatDocumentTitle(doc.document_type, submission.title);

            console.log('Document type:', doc.document_type);
            console.log('Submission title:', submission.title);
            console.log('Display title:', displayTitle);

            return {
              id: doc.id,
              fileName: doc.file_name,
              fileType: doc.document_type,
              displayTitle: displayTitle,
              fileUrl: urlData?.signedUrl || null,
              fileSize: doc.file_size,
              isApproved: verification?.is_approved ?? null,
              needsRevision: verification?.is_approved === false,
              revisionComment: verification?.feedback_comment || null,
            };
          })
        );

        // ✅ Fetch approval documents if status is review_complete
        let certificateUrl = null;
        let form0011Url = null;
        let form0012Url = null;

        if (submission.status === 'review_complete') {
          const { data: approvalDocs } = await supabase
            .from('uploaded_documents')
            .select('*')
            .eq('submission_id', submission.id)
            .in('document_type', ['certificate_of_approval', 'form_0011', 'form_0012']);

          if (approvalDocs) {
            for (const doc of approvalDocs) {
              const { data: urlData } = await supabase.storage
                .from('research-documents')
                .createSignedUrl(doc.file_url, 3600);

              if (doc.document_type === 'certificate_of_approval') {
                certificateUrl = urlData?.signedUrl;
              } else if (doc.document_type === 'form_0011') {
                form0011Url = urlData?.signedUrl;
              } else if (doc.document_type === 'form_0012') {
                form0012Url = urlData?.signedUrl;
              }
            }
          }
        }

        return {
          ...submission,
          documents: documentsWithUrls,
          certificateUrl,
          form0011Url,
          form0012Url,
          approvalDate: submission.status === 'review_complete' ? submission.updated_at : null
        };
      })
    );

    const stats = {
      active: submissionList.filter(s =>
        ['new_submission', 'awaiting_classification', 'under_review', 'pending', 'classified', 'under_revision'].includes(s.status)
      ).length,
      pending: submissionList.filter(s =>
        ['under_review', 'pending', 'classified'].includes(s.status)
      ).length,
      needsRevision: submissionList.filter(s =>
        ['needs_revision', 'under_revision'].includes(s.status)).length,
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
