'use server';

import { createClient } from '@/utils/supabase/server';

export async function getPublicAnnouncements() {
  const supabase = await createClient();

  // Fetch active announcements, ordered by newest created
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4); // Limit to 4 cards for the homepage

  if (error) {
    console.error('Error fetching public announcements:', error);
    return [];
  }

  return data;
}