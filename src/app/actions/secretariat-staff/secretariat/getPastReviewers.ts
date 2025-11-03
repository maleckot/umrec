// app/actions/secretariat-staff/secretariat/getPastReviewers.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getPastReviewers(submissionId: string) {
  try {
    const supabase = await createClient();

    // ✅ ONLY get reviewer_id - no join needed
    const { data: assignments, error } = await supabase
      .from('reviewer_assignments')
      .select('reviewer_id')
      .eq('submission_id', submissionId);

    if (error) {
      return { success: false, error: error.message };
    }

    // ✅ Extract just the IDs
    const pastReviewerIds = assignments?.map(a => a.reviewer_id) || [];

    return {
      success: true,
      pastReviewerIds, // Array of reviewer IDs only
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch past reviewers',
    };
  }
}
