// app/actions/staff/updateReviewerCode.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateReviewerCode(reviewerId: string, newCode: string) {
  try {
    const supabase = await createClient();

    // Verify user is staff/admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'staff' && profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    // Update reviewer code
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ reviewer_code: newCode })
      .eq('id', reviewerId)
      .eq('role', 'reviewer');

    if (updateError) {
      console.error('Error updating reviewer code:', updateError);
      return { success: false, error: updateError.message };
    }

    console.log('✅ Updated reviewer code to:', newCode);

    return {
      success: true,
      message: 'Reviewer code updated successfully',
    };

  } catch (error) {
    console.error('Error in updateReviewerCode:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update reviewer code',
    };
  }
}
