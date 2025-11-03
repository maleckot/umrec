// src/app/actions/secretariat-staff/getWaitingRevisionDetails.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getWaitingRevisionDetails(submissionId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get submission details
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return { success: false, error: 'Submission not found' };
    }

    // ✅ Try different possible field names for researcher/user ID
    const researcherId = submission.researcher_id || submission.user_id || submission.created_by;

    // Get researcher profile
    let researcher = null;
    if (researcherId) {
      const { data: resData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', researcherId)
        .single();
      researcher = resData;
    }

    // ✅ FILTER: Get ONLY the 6 original documents
    const originalDocTypes = [
      'application_form',
      'consent_form',
      'research_protocol',
      'research_instrument',
      'endorsement_letter',
      'proposal_defense',
    ];

    const { data: allDocuments } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .in('document_type', originalDocTypes) // ✅ Filter by document type
      .order('uploaded_at', { ascending: true });

    // Get document verifications with feedback
    const { data: verifications } = await supabase
      .from('document_verifications')
      .select('*')
      .eq('submission_id', submissionId);

    const { data: reviewerAssignments } = await supabase
      .from('reviewer_assignments')
      .select('id, reviewer_id')
      .eq('submission_id', submissionId);

    const reviewersAssigned = reviewerAssignments?.length || 0; // ✅ Changed from 3
    const reviewersRequired = submission.assigned_reviewers_count || 0;

    // Get comments
    const { data: comments } = await supabase
      .from('submission_comments')
      .select('id, comment_text, created_at, staff_id')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false });

    // Get staff profiles for comments
    let staffNames = new Map();
    if (comments && comments.length > 0) {
      const staffIds = comments.map(c => c.staff_id).filter(Boolean);
      if (staffIds.length > 0) {
        const { data: staffProfiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', staffIds);

        staffNames = new Map(staffProfiles?.map(s => [s.id, s.full_name]) || []);
      }
    }

    // Build documents with feedback
    const documentsWithFeedback = allDocuments?.map(doc => {
      const verification = verifications?.find(v => v.document_id === doc.id);

      return {
        id: doc.id,
        name: doc.file_name,
        type: doc.document_type,
        status:
          verification?.is_approved === true
            ? 'Approved'
            : verification?.is_approved === false
              ? 'Rejected'
              : 'Pending',
        feedback: verification?.feedback_comment || null,
        uploadedAt: doc.uploaded_at,
      };
    }) || [];

    // Count rejected documents
    const rejectedCount = documentsWithFeedback.filter(d => d.status === 'Rejected').length;

    return {
      success: true,
      submission: {
        id: submission.id,
        trackingNumber: submission.submission_id || `SUB-${submission.id.slice(0, 8)}`,
        title: submission.title,
        status: submission.status,
        submittedAt: submission.submitted_at,
        coAuthors: submission.co_authors,
        researcher: {
          fullName: researcher?.full_name || 'Unknown',
          email: researcher?.email || 'N/A',
          organization: researcher?.organization || 'N/A',
          school: researcher?.school || 'N/A',
          college: researcher?.college || 'N/A',
        },
      },
      documentsWithFeedback,
      revisionInfo: {
        needsRevision: submission.status === 'needs_revision',
        rejectedCount,
        totalDocuments: documentsWithFeedback.length,
        reviewersRequired,
        reviewersAssigned,
      },
      comments:
        comments?.map(c => ({
          id: c.id,
          commentText: c.comment_text,
          createdAt: c.created_at,
          staffName: staffNames.get(c.staff_id) || 'Staff Member',
        })) || [],
    };
  } catch (error) {
    console.error('Error in getWaitingRevisionDetails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch details',
    };
  }
}
