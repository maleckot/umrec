// src/app/actions/saveClassification.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function saveClassification(
  submissionId: string,
  category: 'Exempted' | 'Expedited' | 'Full Review'
) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const reviewersRequired = {
      'Exempted': 0,
      'Expedited': 3,
      'Full Review': 5,
    }[category];

    // Update submission with classification
    const { error: updateError } = await supabase
      .from('research_submissions')
      .update({
        classification_type: category,  
        assigned_reviewers_count: reviewersRequired,
        status: category === 'Exempted' ? 'exempted' : 'classified',
        classified_at: new Date().toISOString(),
        classified_by: user.id,
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Update error:', updateError);
      return { success: false, error: 'Failed to save classification' };
    }

    // Create classification history record
    const { error: historyError } = await supabase
      .from('submission_history')
      .insert({
        submission_id: submissionId,
        action: 'classified',
        actor_id: user.id,
        actor_role: 'secretariat',
        details: {
          classification: category,
          reviewers_required: reviewersRequired,
        },
        created_at: new Date().toISOString(),
      });

    if (historyError) {
      console.error('History error:', historyError);
    }

    return { 
      success: true, 
      classification: category,
      reviewersRequired 
    };

  } catch (error) {
    console.error('Error saving classification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save classification',
    };
  }
}
