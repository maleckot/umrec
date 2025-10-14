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
      .select('id, full_name, email, role')
      .eq('role', 'reviewer')

    if (reviewersError) {
      console.error('Error fetching reviewers:', reviewersError);
      return { success: false, error: 'Failed to fetch reviewers' };
    }


    const formattedReviewers = (reviewers || []).map(r => ({
      id: r.id,
      name: `${r.full_name}`,
      email: r.email,
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
