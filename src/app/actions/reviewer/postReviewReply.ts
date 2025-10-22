// app/actions/reviewer/postReviewReply.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function postReviewReply(reviewId: string, replyText: string) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Insert reply into review_replies table (create this table if needed)
    const { data, error } = await supabase
      .from('review_replies')
      .insert({
        review_id: reviewId,
        reviewer_id: user.id,
        reply_text: replyText,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error posting reply:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      reply: data,
    };

  } catch (error) {
    console.error('Error in postReviewReply:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post reply',
    };
  }
}
