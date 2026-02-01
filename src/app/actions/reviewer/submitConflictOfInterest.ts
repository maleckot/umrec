'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

interface COIFormData {
  submissionId: string;
  hasStockOwnership: boolean;
  hasReceivedCompensation: boolean;
  hasOfficialRole: boolean;
  hasPriorWorkExperience: boolean;
  hasStandingIssue: boolean;
  hasSocialRelationship: boolean;
  hasOwnershipInterest: boolean;
  protocolCode: string;
  remarks: string;
  printedName: string;
}

export async function submitConflictOfInterest(formData: COIFormData, signatureFile: FormData) {
  const supabase = await createClient();

  // 1. Check Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Unauthorized' };

  try {
    // 2. Upload Signature
    const file = signatureFile.get('file') as File;
    let signaturePath = null;

    if (file) {
      const fileName = `signatures/${user.id}-${Date.now()}.png`;
      const { error: uploadError, data } = await supabase.storage
        .from('research-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;
      signaturePath = data?.path;
    }

    // 3. Insert Form Data
    const { error: insertError } = await supabase
      .from('conflict_of_interest_forms')
      .insert({
        submission_id: formData.submissionId,
        reviewer_id: user.id,
        has_stock_ownership: formData.hasStockOwnership,
        has_received_compensation: formData.hasReceivedCompensation,
        has_official_role: formData.hasOfficialRole,
        has_prior_work_experience: formData.hasPriorWorkExperience,
        has_standing_issue: formData.hasStandingIssue,
        has_social_relationship: formData.hasSocialRelationship,
        has_ownership_interest: formData.hasOwnershipInterest,
        protocol_code: formData.protocolCode,
        remarks: formData.remarks,
        printed_name: formData.printedName,
        signature_url: signaturePath,
        date_signed: new Date().toISOString()
      });

    if (insertError) throw insertError;

    // 4. Update Assignment Status
    const { error: updateError } = await supabase
      .from('reviewer_assignments')
      .update({ status: 'conflict_of_interest' })
      .eq('submission_id', formData.submissionId)
      .eq('reviewer_id', user.id);

    if (updateError) throw updateError;

    revalidatePath('/reviewer/dashboard');
    return { success: true };

  } catch (error) {
    console.error('Error submitting COI:', error);
    return { success: false, error: 'Failed to submit form' };
  }
}