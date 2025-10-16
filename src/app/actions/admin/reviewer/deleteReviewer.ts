// app/actions/admin/deleteReviewer.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function deleteReviewer(reviewerId: string) {
  try {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (adminProfile?.role !== 'admin') return { success: false, error: 'Unauthorized' };

    // Delete reviewer assignments
    await supabase
      .from('reviewer_assignments')
      .delete()
      .eq('reviewer_id', reviewerId);

    // Delete reviewer profile
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', reviewerId);

    if (deleteError) {
      return { success: false, error: 'Failed to delete reviewer' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting reviewer:', error);
    return { success: false, error: 'Failed to delete reviewer' };
  }
}
