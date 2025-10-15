// app/actions/admin/getAdminSubmissions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function getAdminSubmissions() {
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
      return { success: false, error: 'Unauthorized' };
    }

    // ✅ MANUAL APPROACH - Fetch submissions without nested join
    const { data: submissions, error: submissionsError } = await supabase
      .from('research_submissions')
      .select('id, submission_id, title, status, submitted_at, classification_type, user_id')
      .order('submitted_at', { ascending: false });

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return { success: false, error: submissionsError.message };
    }

    // ✅ Fetch all user profiles separately
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email');

    // ✅ Manually join the data
    const submissionsWithProfiles = submissions?.map(submission => {
      const userProfile = profiles?.find(p => p.id === submission.user_id);
      return {
        ...submission,
        researcher_name: userProfile?.full_name || 'Unknown',
        researcher_email: userProfile?.email || '',
      };
    });

    console.log('✅ Fetched', submissionsWithProfiles?.length, 'submissions');

    return {
      success: true,
      submissions: submissionsWithProfiles || [],
    };

  } catch (error) {
    console.error('Error in getAdminSubmissions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch submissions',
    };
  }
}
