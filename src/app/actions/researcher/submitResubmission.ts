'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitResubmission(submissionId: string, formData: any, revisionRows: any[]) {
  const supabase = await createClient();

  try {
    // 1. Check Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // ---------------------------------------------------------
    // 2. RESET VERIFICATION STATUS (The logic you requested)
    // ---------------------------------------------------------
    
    // Step A: Reset only the Rejected (false) documents to NULL (Pending)
    const { error: resetError } = await supabase
      .from('document_verifications')
      .update({ 
        is_approved: null, // Reset to pending
        verified_by: null, // Clear who verified it previously
        verified_at: null  // Clear the timestamp
      })
      .eq('submission_id', submissionId)
      .eq('is_approved', false); // Only target the ones that need revision

    if (resetError) throw resetError;

    // Step B: Safety Check - Ensure NO documents are left as 'false'
    const { count: remainingFalseCount, error: countError } = await supabase
      .from('document_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('submission_id', submissionId)
      .eq('is_approved', false);

    if (countError) throw countError;

    // If for some reason a document is still false, STOP here.
    // The status will NOT change to 'Resubmit'.
    if (remainingFalseCount !== null && remainingFalseCount > 0) {
      return { 
        success: false, 
        error: 'Cannot resubmit: Some documents are still marked as rejected. Please try again.' 
      };
    }

    // ---------------------------------------------------------
    // 3. UPDATE APPLICATION FORM DATA
    // ---------------------------------------------------------
    const { error: appFormError } = await supabase
      .from('application_forms')
      .update({
        study_site: formData.studySite,
        institution: formData.institution,
        institution_address: formData.addressOfInstitution,
        contact_info: {
          tel_no: formData.telNo,
          mobile_no: formData.mobileNo,
          fax_no: formData.faxNo
        },
        co_researcher: formData.coResearchers
      })
      .eq('submission_id', submissionId);

    if (appFormError) throw appFormError;

    // ---------------------------------------------------------
    // 4. UPDATE MAIN STATUS (Since all docs are now NULL or TRUE)
    // ---------------------------------------------------------
    const { error: subError } = await supabase
      .from('research_submissions')
      .update({
        title: formData.titleOfStudy,
        status: 'Resubmit', // ✅ Change status to Resubmit
        verification_status: 'pending_verification', // ✅ Also reset verification status
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (subError) throw subError;

    // ---------------------------------------------------------
    // 5. SAVE RESPONSES TO COMMENTS (Reviewers)
    // ---------------------------------------------------------
    if (revisionRows && revisionRows.length > 0) {
      for (const row of revisionRows) {
        // Skip rows that don't have a real UUID (like 'new-1' or 'verif-123')
        if (row.id && !String(row.id).startsWith('verif-') && !String(row.id).startsWith('new-')) { 
          await supabase
            .from('submission_comments')
            .update({
              researcher_response: row.response,
              revision_page_number: row.pageNumber,
            })
            .eq('id', row.id);
        }
      }
    }

    revalidatePath('/researchermodule');
    return { success: true };

  } catch (error) {
    console.error('Error submitting revision:', error);
    return { success: false, error: 'Failed to submit revision' };
  }
}