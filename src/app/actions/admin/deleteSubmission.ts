// app/actions/admin/deleteSubmission.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function deleteSubmission(submissionId: string) {
  try {
    const supabase = await createClient();

    // Verify user is admin
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized - Admin access required' };
    }

    // Delete submission (cascade will delete related records)
    const { error: deleteError } = await supabase
      .from('research_submissions')
      .delete()
      .eq('id', submissionId);

    if (deleteError) {
      console.error('Error deleting submission:', deleteError);
      return { success: false, error: deleteError.message };
    }

    console.log('Submission deleted successfully:', submissionId);

    return {
      success: true,
      message: 'Submission deleted successfully',
    };

  } catch (error) {
    console.error('Error in deleteSubmission:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete submission',
    };
  }
}
