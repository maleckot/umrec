'use server';

import { createClient } from '@/utils/supabase/server';

export async function deleteReviewReply(replyId: number) {
  const supabase = await createClient();

  try {
    // 1. Get Current User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    // 2. Verify Ownership & Delete
    // We strictly use .eq('reviewer_id', user.id) to ensure users can only delete their own replies
    const { error } = await supabase
      .from('review_replies')
      .delete()
      .eq('id', replyId)
      .eq('reviewer_id', user.id);

    if (error) throw error;

    return { success: true };

  } catch (error) {
    console.error('Error deleting reply:', error);
    return { success: false, error: 'Failed to delete reply' };
  }
}
