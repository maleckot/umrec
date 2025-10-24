// app/actions/secretariat-staff/staff/getApprovedDetails.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getApprovedDetails(submissionId: string) {
  try {
    const supabase = await createClient();

    // Get submission
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError) throw submissionError;

    // Get researcher profile
    const researcherId = submission.researcher_id || submission.user_id;
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

    let consolidatedUrl = null;
    if (consolidatedDoc?.file_url) {
      const { data: urlData } = await supabase.storage
        .from('research-documents')
        .createSignedUrl(consolidatedDoc.file_url, 3600);
      consolidatedUrl = urlData?.signedUrl;
    }

    // Get ALL original documents with signed URLs
    const { data: originalDocs } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .neq('document_type', 'consolidated_application')
      .not('document_type', 'in', '(certificate_of_approval,form_0011,form_0012)')
      .order('uploaded_at', { ascending: true });

    const originalDocsWithUrls = await Promise.all(
      (originalDocs || []).map(async (doc) => {
        const { data: urlData } = await supabase.storage
          .from('research-documents')
          .createSignedUrl(doc.file_url, 3600);
        
        return {
          id: doc.id,
          name: doc.file_name,
          type: doc.document_type,
          url: urlData?.signedUrl,
          uploadedAt: doc.uploaded_at
        };
      })
    );

    // Get reviewer assignments with dates
    const { data: assignments } = await supabase
      .from('reviewer_assignments')
      .select('reviewer_id, assigned_at, due_date, status')
      .eq('submission_id', submissionId);

    // Get reviewer details with assignment info
    let assignedReviewersWithDates: any[] = [];
    if (assignments && assignments.length > 0) {
      const assignmentReviewerIds = assignments.map(a => a.reviewer_id).filter(Boolean);
      if (assignmentReviewerIds.length > 0) {
        const { data: assignmentReviewers } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', assignmentReviewerIds);

        assignedReviewersWithDates = assignments.map(assignment => {
          const reviewer = assignmentReviewers?.find(r => r.id === assignment.reviewer_id);
          return {
            name: reviewer?.full_name || 'Unknown',
            assignedAt: assignment.assigned_at,
            dueDate: assignment.due_date,
            status: assignment.status
          };
        });
      }
    }

    // Get reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('submission_id', submissionId)
      .order('submitted_at', { ascending: false });

    // Get reviewer profiles for reviews
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

    const reviewsRequired = submission.classification_type === 'Expedited Review' ? 2 : 4;
    const reviewsComplete = reviews?.filter(r => r.status === 'submitted').length || 0;

    // Format reviews
    const formattedReviews = reviews?.map(review => {
      const reviewer = reviewerMap.get(review.reviewer_id);
      return {
        id: review.id,
        reviewerName: reviewer?.full_name || 'Reviewer',
        status: 'Complete' as const,
        completedDate: review.submitted_at ? new Date(review.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null,
        overallAssessment: review.overall_assessment || 'No assessment provided',
        feedbacks: []
      };
    }) || [];

    // Find earliest assigned_at and latest due_date
    const assignedAt = assignments && assignments.length > 0 
      ? new Date(Math.min(...assignments.map(a => new Date(a.assigned_at).getTime())))
      : null;

    const dueDate = assignments && assignments.length > 0 
      ? new Date(Math.max(...assignments.map(a => new Date(a.due_date).getTime())))
      : null;

    // ✅ Get approval documents from database
    const { data: approvalDocs, error: approvalDocsError } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .in('document_type', ['certificate_of_approval', 'form_0011', 'form_0012'])
      .order('uploaded_at', { ascending: true });

    if (approvalDocsError) {
      console.error('Error fetching approval docs:', approvalDocsError);
    }

    // ✅ Transform approval documents with signed URLs
    const approvalDocumentsWithUrls = await Promise.all(
      (approvalDocs || []).map(async (doc) => {
        const { data: urlData } = await supabase.storage
          .from('research-documents')
          .createSignedUrl(doc.file_url, 3600);

        const titles: Record<string, string> = {
          certificate_of_approval: 'Certificate of Approval',
          form_0011: 'Form 0011 - Protocol Reviewer Worksheet',
          form_0012: 'Form 0012 - Informed Consent Checklist',
        };

        const descriptions: Record<string, string> = {
          certificate_of_approval: 'Official certificate confirming ethical approval',
          form_0011: 'Protocol reviewer worksheet document',
          form_0012: 'Informed consent checklist document',
        };

        return {
          id: doc.id,
          title: titles[doc.document_type] || doc.file_name,
          description: descriptions[doc.document_type] || '',
          url: urlData?.signedUrl,
        };
      })
    );

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
        url: consolidatedUrl,
        uploadedAt: consolidatedDoc.uploaded_at
      } : null,
      originalDocuments: originalDocsWithUrls,
      reviews: formattedReviews,
      assignedReviewers: assignedReviewersWithDates.map(r => r.name),
      assignedReviewersWithDates,
      reviewsComplete,
      reviewsRequired,
      assignedAt,
      dueDate,
      approvalDocuments: approvalDocumentsWithUrls, // ✅ Added approval documents
    };
  } catch (error) {
    console.error('Error in getApprovedDetails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load submission',
    };
  }
}
