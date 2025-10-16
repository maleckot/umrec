// app/actions/admin/updateReviewerExpertise.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateReviewerExpertise(reviewerId: string, expertiseAreas: string[]) {
  try {
    const supabase = await createClient();

    // Verify user is admin
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    // Update expertise areas
    const { error } = await supabase
      .from('profiles')
      .update({ expertise_areas: expertiseAreas })
      .eq('id', reviewerId);

    if (error) {
      return { success: false, error: 'Failed to update expertise' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update expertise' };
  }
}
