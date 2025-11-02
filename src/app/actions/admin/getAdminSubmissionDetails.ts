// app/actions/admin/getAdminSubmissionDetails.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getSubmissionDetails(submissionId: string) {
  try {
    const supabase = await createClient();

    // Verify user is admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    console.log('🔍 Starting getSubmissionDetails for:', submissionId);

    // 1. Fetch submission
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError) {
      console.error('Error fetching submission:', submissionError);
      return { success: false, error: submissionError.message };
    }

    console.log('✅ Submission found:', submission.submission_id);

    // 2. Fetch researcher info
    const { data: researcher } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('id', submission.user_id)
      .single();

    // 3. Fetch application form
    const { data: applicationForm } = await supabase
      .from('application_forms')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    // 4. Fetch research protocol
    const { data: protocol } = await supabase
      .from('research_protocols')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    // 5. Fetch uploaded documents
    const { data: documents } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .order('uploaded_at', { ascending: true });

    console.log('📦 Total documents found:', documents?.length || 0);

    // 6. Build documents with signed URLs (WORKING FORMAT)
    const documentsWithUrls = [];
    
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        const { data: urlData } = await supabase.storage
          .from('research-documents')
          .createSignedUrl(doc.file_url, 3600);

        if (urlData?.signedUrl) {
          documentsWithUrls.push({
            id: doc.id,
            name: doc.file_name, // ✅ Use "name" not "file_name"
            documentType: doc.document_type,  
            size: doc.file_size,
            url: urlData.signedUrl, // ✅ Use "url" not "file_url"
            createdAt: doc.uploaded_at,
          });
        }
      }
    }

    console.log('✅ Documents with URLs:', documentsWithUrls.length);

    // 7. Fetch reviewer assignments
    const { data: assignments } = await supabase
      .from('reviewer_assignments')
      .select('*')
      .eq('submission_id', submissionId);

    // 8. Get reviewer profiles
    const reviewerIds = assignments?.map(a => a.reviewer_id).filter(Boolean) || [];
    const { data: reviewerProfiles } = reviewerIds.length > 0
      ? await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', reviewerIds)
      : { data: [] };

    // 9. Fetch reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('submission_id', submissionId);

    // 10. Get reviewer names for reviews
    const reviewReviewerIds = reviews?.map(r => r.reviewer_id).filter(Boolean) || [];
    const { data: reviewReviewers } = reviewReviewerIds.length > 0
      ? await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', reviewReviewerIds)
      : { data: [] };

    // 11. Build history
    const historyEvents = [];

    historyEvents.push({
      title: 'Submission Received',
      date: new Date(submission.created_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      icon: 'submission',
      description: null,
      performedBy: researcher?.full_name || 'Unknown',
    });

    if (submission.verified_at) {
      const { data: verifier } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', submission.verified_by)
        .single();

      historyEvents.push({
        title: 'Document Verification Complete',
        date: new Date(submission.verified_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        icon: 'verification',
        description: `All documents verified and consolidated by ${verifier?.full_name || 'staff'}`,
        performedBy: verifier?.full_name || 'Staff',
      });
    }

    if (submission.classified_at) {
      const { data: classifier } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', submission.classified_by)
        .single();

      historyEvents.push({
        title: `Classification - ${submission.classification_type || 'Unknown'}`,
        date: new Date(submission.classified_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        icon: 'classification',
        description: `Classified as ${submission.classification_type} by ${classifier?.full_name || 'secretariat'}`,
        performedBy: classifier?.full_name || 'Secretariat',
      });
    }

    if (assignments && assignments.length > 0) {
      const sortedAssignments = [...assignments].sort((a, b) =>
        new Date(a.assigned_at).getTime() - new Date(b.assigned_at).getTime()
      );
      const earliestAssignment = sortedAssignments[0];

      historyEvents.push({
        title: 'Reviewers Assigned',
        date: new Date(earliestAssignment.assigned_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        icon: 'assignment',
        description: `${assignments.length} reviewer(s) assigned`,
        performedBy: 'Staff',
      });
    }

    if (submission.status === 'under_review' || submission.status === 'reviewed') {
      historyEvents.push({
        title: 'Under Review',
        date: assignments?.[0]?.assigned_at ? new Date(assignments[0].assigned_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }) : 'N/A',
        icon: 'review',
        description: null,
        performedBy: null,
        isCurrent: submission.status === 'under_review',
      });
    }

    if (submission.reviewed_at) {
      historyEvents.push({
        title: 'Review Complete',
        date: new Date(submission.reviewed_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        icon: 'complete',
        description: 'All reviews have been submitted',
        performedBy: null,
        isCurrent: submission.status === 'reviewed',
      });
    }

    // 12. Format assignments
    const assignmentsWithNames = assignments?.map(a => {
      const reviewerInfo = reviewerProfiles?.find(r => r.id === a.reviewer_id);
      return {
        id: a.id,
        reviewerId: a.reviewer_id,
        reviewerName: reviewerInfo?.full_name || 'Unknown',
        status: a.status,
        assignedAt: a.assigned_at,
        dueDate: a.due_date,
        completedAt: a.completed_at,
      };
    }) || [];

    // 13. Format reviews
    const reviewsWithData = reviews?.map(r => {
      const reviewerInfo = reviewReviewers?.find(rr => rr.id === r.reviewer_id);
      const assignment = assignments?.find(a => a.id === r.assignment_id);

      return {
        id: r.id,
        reviewerName: reviewerInfo?.full_name || 'Unknown',
        status: r.status === 'submitted' ? ('Complete' as const) : ('In Progress' as const),
        completedDate: r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }) : undefined,
        dueDate: assignment?.due_date ? new Date(assignment.due_date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }) : undefined,
        overallAssessment: r.recommendation || 'No assessment provided',
        feedbacks: [],
      };
    }) || [];

    // 14. Calculate completion status
    const completedReviews = reviews?.filter(r => r.status === 'submitted').length || 0;
    const totalReviewers = assignments?.length || 0;
    const completionStatus = `${completedReviews}/${totalReviewers} Reviews Complete`;

    // 15. Map status
    const statusMapping: Record<string, string> = {
      'pending': 'Under Verification',
      'verified': 'Under Classification',
      'classified': 'Waiting for Reviewers',
      'under_review': 'Under Review',
      'reviewed': 'Review Complete',
      'revision': 'Under Revision',
    };

    const displayStatus = statusMapping[submission.status] || submission.status;

    return {
      success: true,
      submission: {
        id: submission.id,
        submissionId: submission.submission_id,
        title: submission.title || protocol?.title || 'Untitled',
        status: displayStatus,
        category: submission.classification_type || 'Not Classified',
        submittedDate: new Date(submission.created_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        coAuthors: submission.co_authors || applicationForm?.co_researcher || '',
        researcher: {
          name: researcher?.full_name ||
            `${applicationForm?.researcher_first_name || ''} ${applicationForm?.researcher_last_name || ''}`.trim() ||
            'Unknown',
          email: researcher?.email || (typeof applicationForm?.contact_info === 'object' && applicationForm.contact_info?.email) || 'N/A',
          organization: submission.organization || applicationForm?.institution || 'N/A',
          school: applicationForm?.institution || 'N/A',
          college: submission.college || applicationForm?.college || 'N/A',
        },
        // ✅ RETURN FULL DOCUMENTS ARRAY (NOT JUST STRINGS!)
        documents: documentsWithUrls,
        consolidatedDocumentUrl: null, // You can add consolidated logic later
        consolidatedDocumentName: null,
        consolidatedDate: null,
        timeline: {
          submitted: new Date(submission.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          reviewDue: assignments?.[0]?.due_date ? new Date(assignments[0].due_date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }) : 'N/A',
          decisionTarget: 'N/A',
        },
        verificationStatus: submission.verification_status,
        verificationFeedback: submission.verification_feedback,
      },
      assignments: assignmentsWithNames,
      reviews: reviewsWithData,
      completionStatus,
      history: historyEvents,
    };

  } catch (error) {
    console.error('❌ Error in getSubmissionDetails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch submission details',
    };
  }
}
