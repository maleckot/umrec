'use server';

import { createClient } from '@/utils/supabase/server';

export async function getExistingReview(submissionId: string) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // ✅ Get the existing review if any
    const { data: review, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('reviewer_id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching review:', error);
      return { success: false, error: error.message };
    }

    // Return the protocol_answers and consent_answers if review exists
    return {
      success: true,
      review: review ? {
        protocol_answers: review.protocol_answers || {},
        consent_answers: review.consent_answers || {},
        status: review.status
      } : null
    };
  } catch (error) {
    console.error('Error in getExistingReview:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load review'
    };
  }
}
