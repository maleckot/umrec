// src/app/actions/getReviewers.ts
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

    // Get all users with reviewer role
    const { data: reviewers, error: reviewersError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role')
      .eq('role', 'reviewer')
      .order('last_name', { ascending: true });

    if (reviewersError) {
      console.error('Error fetching reviewers:', reviewersError);
      return { success: false, error: 'Failed to fetch reviewers' };
    }

    // Format reviewers for display
    const formattedReviewers = (reviewers || []).map(r => ({
      id: r.id,
      name: `${r.first_name} ${r.last_name}`,
      email: r.email,
      availability: 'Available', // TODO: Calculate based on current assignments
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
