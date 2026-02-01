'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateHomepageText(data: any) {
  const supabase = await createClient();
  
  // 1. Check Auth (Double security layer)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // 2. Update the single row in the table
  // We use a "not equal to dummy ID" trick to update the only row present
  const { error } = await supabase
    .from('homepage_content')
    .update({
      hero_title: data.heroTitle,
      about_text: data.aboutText,
      mission_text: data.missionText,
      vision_text: data.visionText,
      updated_at: new Date().toISOString()
    })
    .neq('id', '00000000-0000-0000-0000-000000000000'); 

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/'); // Update public page
  return { success: true };
}