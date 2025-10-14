// app/actions/getAllSubmissions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

interface GetAllSubmissionsParams {
  page?: number;
  limit?: number;
  searchQuery?: string;
  sortBy?: 'Newest' | 'Oldest' | 'A-Z' | 'Z-A';
  statusFilter?: string;
  startDate?: string;
  endDate?: string;
}

export async function getAllSubmissions({
  page = 1,
  limit = 10,
  searchQuery = '',
  sortBy = 'Newest',
  statusFilter,
  startDate,
  endDate,
}: GetAllSubmissionsParams = {}) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('research_submissions')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (searchQuery && searchQuery.trim() !== '') {
      query = query.or(`title.ilike.%${searchQuery}%,submission_id.ilike.%${searchQuery}%`);
    }

    // Apply status filter
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    // Apply date range filter
    if (startDate) {
      query = query.gte('submitted_at', new Date(startDate).toISOString());
    }
    if (endDate) {
      // Add one day to include the end date
      const endDateTime = new Date(endDate);
      endDateTime.setDate(endDateTime.getDate() + 1);
      query = query.lt('submitted_at', endDateTime.toISOString());
    }

    // Apply sorting
    switch (sortBy) {
      case 'Newest':
        query = query.order('submitted_at', { ascending: false });
        break;
      case 'Oldest':
        query = query.order('submitted_at', { ascending: true });
        break;
      case 'A-Z':
        query = query.order('title', { ascending: true });
        break;
      case 'Z-A':
        query = query.order('title', { ascending: false });
        break;
      default:
        query = query.order('submitted_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
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
    console.error('Error in getAllSubmissions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch submissions',
    };
  }
}
