'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateReviewerExpertise(reviewerId: string, expertiseString: string) {
  
  try {
    
    const supabase = await createClient();

    // Verify user is staff/secretariat/admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!['staff', 'secretariat', 'admin'].includes(profile?.role || '')) {
      return { success: false, error: 'Unauthorized' };
    }

    // Update expertise_areas
    const { error } = await supabase
      .from('profiles')
      .update({ expertise_areas: expertiseString })
      .eq('id', reviewerId);

    if (error) {
      console.error('Error updating expertise:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Expertise updated for reviewer:', reviewerId);
    return { success: true };
  } catch (error) {
    console.error('Error in updateReviewerExpertise:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update expertise',
    };
  }
}
