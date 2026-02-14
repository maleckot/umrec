'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateAnnouncement(announcement: any) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('announcements') // Make sure this matches your actual table name
      .update({
        title: announcement.title,
        type: announcement.type,
        date: announcement.date,
        excerpt: announcement.excerpt,
        mode: announcement.mode,
        location: announcement.location,
        link: announcement.link,
        updated_at: new Date().toISOString()
      })
      .eq('id', announcement.id);

    if (error) throw error;
    return { success: true };

  } catch (error) {
    console.error('Error updating announcement:', error);
    return { success: false, error: 'Failed to update announcement' };
  }
}
