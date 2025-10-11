// app/actions/getUnassignedSubmissions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

interface GetUnassignedSubmissionsParams {
  page?: number;
  limit?: number;
  searchQuery?: string;
}

export async function getUnassignedSubmissions({
  page = 1,
  limit = 10,
  searchQuery = '',
}: GetUnassignedSubmissionsParams = {}) {
  try {
    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query: Get classified submissions that haven't been assigned reviewers yet
    let query = supabase
      .from('research_submissions')
      .select('*', { count: 'exact' })
      .eq('status', 'classified')  // ✅ Classification is complete

    // Add search filter
    if (searchQuery && searchQuery.trim() !== '') {
      query = query.or(`title.ilike.%${searchQuery}%,submission_id.ilike.%${searchQuery}%`);
    }

    // Add pagination
    query = query.range(from, to);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching unassigned submissions:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data || [],
      total: count || 0,
      page,
      limit,
    };

  } catch (error) {
    console.error('Error in getUnassignedSubmissions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch submissions',
    };
  }
}
