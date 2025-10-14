// src/app/actions/getSubmissionDetails.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSubmissionDetails(submissionId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return { success: false, error: 'Submission not found' };
    }

    const { data: documents } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submission.id)
      .order('uploaded_at', { ascending: true });

    const { data: verifications } = await supabase
      .from('document_verifications')
      .select('*')
      .eq('submission_id', submissionId);

    const documentsWithUrls = [];
    
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        const { data: urlData } = await supabase.storage
          .from('research-documents')
          .createSignedUrl(doc.file_url, 3600);

        const verification = verifications?.find(v => v.document_id === doc.id);

        if (urlData?.signedUrl) {
          documentsWithUrls.push({
            id: doc.id,
            name: doc.file_name,
            type: doc.document_type,
            size: doc.file_size,
            url: urlData.signedUrl,
            createdAt: doc.uploaded_at,
            isVerified: verification ? verification.is_approved : null,
            comment: verification?.feedback_comment || '',
          });
        }
      }
    }

    return {
      success: true,
      submission: {
        id: submission.id,
        submissionId: submission.submission_id,
        title: submission.title,
        status: submission.status,
        submittedAt: submission.submitted_at,
        projectLeader: {
          firstName: submission.project_leader_first_name,
          middleName: submission.project_leader_middle_name,
          lastName: submission.project_leader_last_name,
          email: submission.project_leader_email,
          contact: submission.project_leader_contact,
        },
        coAuthors: submission.co_authors,
        organization: submission.organization,
        college: submission.college,
        studySiteType: submission.study_site_type,
        typeOfStudy: submission.type_of_study,
        sourceOfFunding: submission.source_of_funding,
        startDate: submission.start_date,
        endDate: submission.end_date,
        numParticipants: submission.num_participants,
      },
      documents: documentsWithUrls,
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get submission details'
    };
  }
}
