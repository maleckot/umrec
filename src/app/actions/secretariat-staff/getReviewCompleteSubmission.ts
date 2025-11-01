// app/actions/secretariat-staff/getReviewCompleteSubmission.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewCompleteDetails(submissionId: string) {
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
      console.error('Submission error:', submissionError);
      return { success: false, error: 'Submission not found' };
    }

    console.log('Submission data:', submission);

    // ✅ Try to find the researcher ID
    const researcherId = submission.researcher_id || submission.user_id || submission.created_by;
    console.log('Looking for researcher with ID:', researcherId);

    // Get researcher profile
    let researcher = null;
    if (researcherId) {
      const { data: resData, error: resError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', researcherId)
        .single();
      
      console.log('Researcher query result:', resData, resError);
      researcher = resData;
    }

    // Get documents
    const { data: documents } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .order('uploaded_at', { ascending: true });

    const consolidatedDoc = documents?.find(doc => doc.document_type === 'consolidated_application');
    const originalDocs = documents?.filter(doc => doc.document_type !== 'consolidated_application') || [];

    // ✅ NEW: Get certificates from documents
    const certificates = documents?.filter(doc => 
      ['certificate_of_approval', 'form_0011', 'form_0012'].includes(doc.document_type)
    ) || [];

    console.log('Certificates found:', certificates); // ✅ Debug log

    // Get signed URL for consolidated document
    let consolidatedUrl = null;
    if (consolidatedDoc?.file_url) {
      const { data: urlData } = await supabase.storage
        .from('research-documents')
        .createSignedUrl(consolidatedDoc.file_url, 3600);
      consolidatedUrl = urlData?.signedUrl || null;
    }

    // ✅ NEW: Get signed URLs for certificates
    const certificatesWithUrls = await Promise.all(
      certificates.map(async (cert) => {
        if (cert.file_url) {
          const { data: urlData } = await supabase.storage
            .from('research-documents')
            .createSignedUrl(cert.file_url, 3600);
          return {
            id: cert.id,
            name: cert.file_name,
            url: urlData?.signedUrl || cert.file_url,
            type: cert.document_type,
          };
        }
        return {
          id: cert.id,
          name: cert.file_name,
          url: cert.file_url,
          type: cert.document_type,
        };
      })
    );

    // Get reviews and reviewers
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('submission_id', submissionId)
      .order('submitted_at', { ascending: true });

    const reviewerIds = reviews?.map(r => r.reviewer_id) || [];
    const { data: reviewers } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', reviewerIds);

    const reviewerMap = new Map(reviewers?.map(r => [r.id, r.full_name || r.email]) || []);

    const { data: assignments } = await supabase
      .from('reviewer_assignments')
      .select('*')
      .eq('submission_id', submissionId);

    const assignedIds = assignments?.map(a => a.reviewer_id) || [];
    const { data: assignedReviewers } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', assignedIds);

    return {
      success: true,
      submission: {
        id: submission.id,
        trackingNumber: submission.submission_id || `UMREC-${Date.now()}`,
        title: submission.title,
        status: submission.status,
        submittedAt: submission.submitted_at,
        classificationType: submission.classification_type,
        coAuthors: submission.co_authors,
        researchDescription: submission.research_description,
        researcher: {
          fullName: researcher?.full_name || 'Unknown',
          email: researcher?.email || 'N/A',
          organization: researcher?.organization || 'N/A',
          college: researcher?.college || 'N/A',
          school: researcher?.school || 'N/A',
        },
      },
      consolidatedDocument: consolidatedDoc ? {
        id: consolidatedDoc.id,
        name: consolidatedDoc.file_name,
        url: consolidatedUrl,
        uploadedAt: consolidatedDoc.uploaded_at,
        fileSize: consolidatedDoc.file_size,
      } : null,
      originalDocuments: originalDocs.map(doc => ({
        id: doc.id,
        name: doc.file_name,
        type: doc.document_type,
        uploadedAt: doc.uploaded_at,
      })),
      reviews: reviews?.map((review) => ({
        id: review.id,
        reviewerName: reviewerMap.get(review.reviewer_id) || 'Unknown Reviewer',
        status: 'Complete' as const,
        completedDate: new Date(review.submitted_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        overallAssessment: review.ethics_recommendation || 'No assessment provided',
        recommendation: review.recommendation,
        technicalSuggestions: review.technical_suggestions,
        feedbacks: [],
      })) || [],
      assignedReviewers: assignedReviewers?.map(r => r.full_name || r.email || 'Unknown') || [],
      reviewsComplete: reviews?.length || 0,
      reviewsRequired: assignments?.length || 0,
      certificates: certificatesWithUrls, // ✅ ADD THIS
    };

  } catch (error) {
    console.error('Error fetching review complete details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch details',
    };
  }
}
