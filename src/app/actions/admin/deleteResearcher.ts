// app/actions/admin/deleteResearcher.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function deleteResearcher(researcherId: string) {
  try {
    const supabase = await createClient();

    // Verify admin permission
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminProfile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    // Delete researcher's submissions first (cascade delete)
    const { error: submissionsError } = await supabase
      .from('research_submissions')
      .delete()
      .eq('user_id', researcherId);

    if (submissionsError) {
      console.error('Error deleting submissions:', submissionsError);
      return { success: false, error: 'Failed to delete researcher submissions' };
    }

    // Delete researcher profile
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', researcherId);

    if (deleteError) {
      console.error('Error deleting researcher:', deleteError);
      return { success: false, error: 'Failed to delete researcher' };
    }

    // Delete auth user (optional - depends on your requirements)
    // const { error: authError } = await supabase.auth.admin.deleteUser(researcherId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting researcher:', error);
    return {
      success: false,
      error: 'Failed to delete researcher',
    };
  }
}
