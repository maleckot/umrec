'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addHistory(item: any) {
  const supabase = await createClient();
  
  // Get max order to append to end
  const { data: max } = await supabase.from('homepage_history').select('display_order').order('display_order', { ascending: false }).limit(1).single();
  const nextOrder = (max?.display_order || 0) + 1;

  const { error } = await supabase.from('homepage_history').insert({
    year: item.year,
    title: item.title,
    description: item.description,
    display_order: nextOrder
  });

  if (error) return { success: false, error: error.message };
  revalidatePath('/');
  return { success: true };
}

export async function updateHistory(id: string, item: any) {
  const supabase = await createClient();
  const { error } = await supabase.from('homepage_history').update({
    year: item.year,
    title: item.title,
    description: item.description
  }).eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/');
  return { success: true };
}

export async function deleteHistory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('homepage_history').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/');
  return { success: true };
}