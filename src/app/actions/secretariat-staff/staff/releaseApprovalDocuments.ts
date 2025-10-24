// app/actions/secretariat-staff/staff/releaseApprovalDocuments.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function releaseApprovalDocuments(submissionId: string) {
  try {
    const supabase = await createClient();

    console.log('📤 Releasing documents for:', submissionId);

    // Update submission status to review_complete
    const { error: updateError } = await supabase
      .from('research_submissions')
      .update({
        status: 'review_complete',
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('❌ Failed to update status:', updateError);
      return {
        success: false,
        error: updateError.message
      };
    }

    console.log('✅ Documents released successfully');

    return {
      success: true,
      message: 'Documents released to researcher successfully'
    };

  } catch (error) {
    console.error('❌ Error releasing documents:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to release documents'
    };
  }
}
