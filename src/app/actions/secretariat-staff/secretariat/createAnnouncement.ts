'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createAnnouncement(formData: any) {
  const supabase = await createClient();

  // 1. Check Authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Prepare Data
  const newPost = {
    title: formData.title,
    type: formData.type,
    mode: formData.mode,
    event_date: formData.date, // Maps frontend 'date' to DB 'event_date'
    content: formData.excerpt, // Maps frontend 'excerpt' to DB 'content'
    location: formData.mode === 'Onsite' ? formData.location : null,
    link: formData.mode === 'Virtual' ? formData.link : null,
    created_by: user.id,
  };

  // 3. Insert into DB
  const { error } = await supabase
    .from('announcements')
    .insert([newPost]);

  if (error) {
    console.error('Error creating announcement:', error);
    return { success: false, error: error.message };
  }

  // 4. Refresh Dashboard
  revalidatePath('/secretariatmodule/dashboard');
  return { success: true };
}