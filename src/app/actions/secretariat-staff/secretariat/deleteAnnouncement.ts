'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteAnnouncement(announcementId: string) {
  const supabase = await createClient();

  // 1. Check Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Perform Delete Operation
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', announcementId);

  if (error) {
    console.error('Error deleting announcement:', error);
    return { success: false, error: error.message };
  }

  // 3. Revalidate path to update the UI on the server side
  revalidatePath('/secretariatmodule/dashboard');
  return { success: true };
}