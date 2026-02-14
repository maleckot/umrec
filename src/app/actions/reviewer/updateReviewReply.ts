'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateReviewReply(replyId: number, newText: string) {
  const supabase = await createClient();

  try {
    // 1. Get Current User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    // 2. Verify Ownership & Update
    // We strictly use .eq('reviewer_id', user.id) to ensure users can only edit their own replies
    const { data, error } = await supabase
      .from('review_replies')
      .update({ 
        reply_text: newText,
        updated_at: new Date().toISOString() 
      })
      .eq('id', replyId)
      .eq('reviewer_id', user.id) 
      .select()
      .single();

    if (error) throw error;

    return { success: true, reply: data };

  } catch (error) {
    console.error('Error updating reply:', error);
    return { success: false, error: 'Failed to update reply' };
  }
}
