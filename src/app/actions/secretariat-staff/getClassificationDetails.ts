// src/app/actions/getClassificationDetails.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getClassificationDetails(submissionId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get submission details with AI classification fields
    const { data: submission, error: submissionError } = await supabase
      .from('research_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return { success: false, error: 'Submission not found' };
    }

    // Get all documents
    const { data: documents, error: docsError } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('submission_id', submissionId)
      .order('uploaded_at', { ascending: true });

    if (docsError) {
      console.error('Documents error:', docsError);
    }

    // Find consolidated document
    const consolidatedDoc = documents?.find(doc => doc.document_type === 'consolidated_application');

    // Get original documents (non-consolidated)
    const originalDocs = documents?.filter(doc => doc.document_type !== 'consolidated_application') || [];

    // Get signed URLs for documents
    let consolidatedUrl = null;
    if (consolidatedDoc?.file_url) {
      const { data: urlData } = await supabase.storage
        .from('research-documents')
        .createSignedUrl(consolidatedDoc.file_url, 3600);
      consolidatedUrl = urlData?.signedUrl || null;
    }

    return {
      success: true,
      submission: {
        id: submission.id,
        submissionId: submission.submission_id,
        title: submission.title,
        status: submission.status,
        submittedAt: submission.submitted_at,
        
        classificationType: submission.classification_type,
        classifiedAt: submission.classified_at,
        classifiedBy: submission.classified_by,
        
        aiSuggestedClassification: submission.ai_suggested_classification,
        aiClassificationConfidence: submission.ai_classification_confidence,
        aiClassifiedAt: submission.ai_classified_at,
        aiClassificationMethod: submission.ai_classification_method,
        aiClassificationMetadata: submission.classification_metadata,
        
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
    };

  } catch (error) {
    console.error('Error fetching classification details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch details',
    };
  }
}
