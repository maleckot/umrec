'use server';

import { createClient } from '@/utils/supabase/server';

export async function getResubmissionData(submissionId: string) {
  const supabase = await createClient();

  try {
    // 1. Fetch Submission + Application Form + Comments (Reviewers)
    const { data: submission, error } = await supabase
      .from('research_submissions')
      .select(`
        *,
        application_forms (*),
        submission_comments (*)
      `)
      .eq('id', submissionId)
      .single();

    if (error) {
      console.error('Database Error:', error);
      return { success: false, error: 'Submission not found' };
    }

    // 2. NEW: Fetch Secretariat Feedback (Document Verifications)
    // We get items that are NOT approved and have a feedback comment.
    const { data: verifications, error: verifError } = await supabase
      .from('document_verifications')
      .select(`
        id,
        feedback_comment,
        is_approved,
        uploaded_documents (
          file_name,
          document_type
        )
      `)
      .eq('submission_id', submissionId)
      .eq('is_approved', false) // Only get rejected items
      .not('feedback_comment', 'is', null); // Only get items with comments

    // 3. Extract Application Form Data
    const appForm = submission.application_forms?.[0] || {};
    const contactInfo = appForm.contact_info || {};
    const coResearchers = appForm.co_researcher || [];

    // 4. Map to Frontend Form Data
    const formData = {
      titleOfStudy: submission.title || '',
      versionNumber: new Date().toISOString().split('T')[0],
      umrecCode: submission.submission_id || '',
      studySite: appForm.study_site || '',
      nameOfResearcher: `${submission.project_leader_first_name} ${submission.project_leader_last_name}`,
      
      coResearchers: Array.isArray(coResearchers) && coResearchers.length > 0 
        ? coResearchers 
        : [''], 
      
      telNo: contactInfo.tel_no || '',
      mobileNo: contactInfo.mobile_no || '',
      faxNo: contactInfo.fax_no || '',
      email: submission.project_leader_email || '', 
      
      institution: appForm.institution || '',
      addressOfInstitution: appForm.institution_address || '',
    };

    // 5. MERGE COMMENTS (Reviewers + Secretariat)
    
    // A. Map Reviewer Comments
    const commentRows = (submission.submission_comments || [])
      .filter((c: any) => c.comment_type === 'revision_request' && !c.is_resolved)
      .map((c: any) => ({
        id: c.id, 
        // Label it clearly so the user knows it's from a Reviewer
        recommendation: `[Reviewer] ${c.comment_text}`,
        response: c.researcher_response || '',
        pageNumber: c.revision_page_number || '',
        type: 'comment' // Helper tag
      }));

    // B. Map Secretariat Verification Feedback
    const verificationRows = (verifications || []).map((v: any) => {
      // Get document name safely
      const docName = v.uploaded_documents?.document_type?.replace(/_/g, ' ').toUpperCase() || 'DOCUMENT';
      
      return {
        // We use a prefix 'verif-' to distinguish these IDs from the uuid of comments
        id: `verif-${v.id}`, 
        recommendation: `[Secretariat - ${docName}] ${v.feedback_comment}`,
        response: '', // Verification table doesn't usually store response text, leaving blank
        pageNumber: '',
        type: 'verification' // Helper tag
      };
    });

    // Combine them
    const allRevisionRows = [...commentRows, ...verificationRows];

    // Default row if empty
    if (allRevisionRows.length === 0) {
      allRevisionRows.push({ id: 'new-1', recommendation: '', response: '', pageNumber: '', type: 'new' });
    }

    return { 
      success: true, 
      submissionId: submission.id,
      formData, 
      revisionRows: allRevisionRows 
    };

  } catch (error) {
    console.error('Error fetching resubmission data:', error);
    return { success: false, error: 'Failed to load data' };
  }
}