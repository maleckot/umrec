'use server';

import { createClient } from '@/utils/supabase/server';

export async function getUnderReviewDetails(submissionId: string) {
  try {
    const supabase = await createClient();

    // Get submission
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError) throw submissionError;

    // Get researcher profile separately
    const researcherId = submission.researcher_id || submission.user_id || submission.created_by;
    let researcher = null;

    if (researcherId) {
      const { data: resData } = await supabase
        .from('profiles')
        .select('full_name, email, organization, school, college')
        .eq('id', researcherId)
        .single();
      
      researcher = resData;
    }

    // Get consolidated document with signed URL
    const { data: consolidatedDoc } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('document_type', 'consolidated_application')
      .single();

    let signedUrl = null;
    if (consolidatedDoc?.file_url) {
      const { data: urlData } = await supabase.storage
        .from('research-documents')
        .createSignedUrl(consolidatedDoc.file_url, 3600);
      signedUrl = urlData?.signedUrl;
    }

    // Get original documents
    const { data: originalDocs } = await supabase
      .from('uploaded_documents')
      .select('file_name')
      .eq('submission_id', submissionId)
      .neq('document_type', 'consolidated_application');

    // Get reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('submission_id', submissionId)
      .order('submitted_at', { ascending: false });

    // Get reviewer profiles separately
    let reviewerMap = new Map();
    if (reviews && reviews.length > 0) {
      const reviewerIds = reviews.map(r => r.reviewer_id).filter(Boolean);
      if (reviewerIds.length > 0) {
        const { data: reviewerProfiles } = await supabase
          .from('profiles')
          .select('id, full_name, reviewer_code')
          .in('id', reviewerIds);

        reviewerMap = new Map(reviewerProfiles?.map(r => [r.id, r]) || []);
      }
    }

    // Get reviewer assignments
    const { data: assignments } = await supabase
      .from('reviewer_assignments')
      .select('reviewer_id')
      .eq('submission_id', submissionId);

    // Get reviewer names for assignments
    let assignedReviewers: string[] = [];
    if (assignments && assignments.length > 0) {
      const assignmentReviewerIds = assignments.map(a => a.reviewer_id).filter(Boolean);
      if (assignmentReviewerIds.length > 0) {
        const { data: assignmentReviewers } = await supabase
          .from('profiles')
          .select('full_name')
          .in('id', assignmentReviewerIds);

        assignedReviewers = assignmentReviewers?.map(r => r.full_name) || [];
      }
    }

    const reviewsRequired = submission.classification_type === 'Expedited Review' ? 2 : 4;
    const reviewsComplete = reviews?.filter(r => r.status === 'submitted').length || 0;

    // Format reviews
    const formattedReviews = reviews?.map(review => {
      const reviewer = reviewerMap.get(review.reviewer_id);
      return {
        id: review.id,
        reviewerName: reviewer?.full_name || 'Reviewer',
        status: review.status === 'submitted' ? 'Complete' : 'In Progress',
        completedDate: review.submitted_at ? new Date(review.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null,
        dueDate: review.status !== 'submitted' ? 'TBD' : null,
        overallAssessment: review.overall_assessment || 'No assessment provided',
        feedbacks: []
      };
    }) || [];

    return {
      success: true,
      submission: {
        id: submission.id,
        trackingNumber: submission.submission_id || `SUB-${submission.id.slice(0, 8)}`,
        title: submission.title,
        status: submission.status,
        submittedAt: submission.submitted_at,
        coAuthors: submission.co_authors,
        classificationType: submission.classification_type || 'Full Review',
        researcher: {
          fullName: researcher?.full_name || 'Unknown',
          email: researcher?.email || 'N/A',
          organization: researcher?.organization || 'N/A',
          school: researcher?.school || 'N/A',
          college: researcher?.college || 'N/A',
        },
      },
      consolidatedDocument: consolidatedDoc ? {
        name: consolidatedDoc.file_name,
        url: signedUrl,
        uploadedAt: consolidatedDoc.uploaded_at
      } : null,
      originalDocuments: originalDocs?.map(doc => ({ name: doc.file_name })) || [],
      reviews: formattedReviews,
      assignedReviewers,
      reviewsComplete,
      reviewsRequired,
    };
  } catch (error) {
    console.error('Error in getUnderReviewDetails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load submission',
    };
  }
}
