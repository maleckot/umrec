'use server';

import { createClient } from '@/utils/supabase/server';

export async function getHomepageData() {
  const supabase = await createClient();

  try {
    // 1. Get Text Content (Single Row)
    const { data: textContent, error: textError } = await supabase
      .from('homepage_content')
      .select('*')
      .single();

    // 2. Get History (Ordered by display_order)
    const { data: history, error: historyError } = await supabase
      .from('homepage_history')
      .select('*')
      .order('display_order', { ascending: true });

    // 3. Get Forms (Ordered by creation)
    const { data: forms, error: formsError } = await supabase
      .from('homepage_forms')
      .select('*')
      .order('created_at', { ascending: true });

    if (textError || historyError || formsError) {
      console.error("Error fetching homepage data:", textError, historyError, formsError);
    }

    return { 
      // Default to empty strings if DB is empty to prevent crashes
      textContent: textContent || { hero_title: '', about_text: '', mission_text: '', vision_text: '' }, 
      history: history || [], 
      forms: forms || [] 
    };

  } catch (error) {
    console.error("Unexpected error:", error);
    return { textContent: {}, history: [], forms: [] };
  }
}
