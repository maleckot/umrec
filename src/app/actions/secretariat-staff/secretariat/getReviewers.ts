// src/app/actions/secretariat-staff/secretariat/getReviewers.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getReviewers() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // ✅ ONLY ADD: panel to SELECT (reviewer_code already exists)
    const { data: reviewers, error: reviewersError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, panel, reviewer_code') // ✅ Just add panel
      .eq('role', 'reviewer');

    if (reviewersError) {
      console.error('Error fetching reviewers:', reviewersError);
      return { success: false, error: 'Failed to fetch reviewers' };
    }

    // ✅ ONLY ADD: panel to formatted output
    const formattedReviewers = (reviewers || []).map(r => ({
      id: r.id,
      name: r.full_name || 'Unknown',
      email: r.email || '',
      code: r.reviewer_code || 'N/A', // Already have this
      panel: r.panel || 'Unassigned', // ✅ Just add this line
      availability: 'Available',
    }));

    return {
      success: true,
      reviewers: formattedReviewers,
    };

  } catch (error) {
    console.error('Error getting reviewers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get reviewers',
    };
  }
}
