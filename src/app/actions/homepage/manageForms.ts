'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadHomeForm(formData: FormData) {
  const supabase = await createClient();
  
  const file = formData.get('file') as File;
  const title = formData.get('title') as string;
  const formNumber = formData.get('formNumber') as string;

  if (!file) return { success: false, error: 'No file provided' };

  try {
    // 1. Upload File to Storage
    const fileName = `forms/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error: uploadError, data } = await supabase.storage
      .from('research-documents') // Using your existing bucket
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('research-documents')
      .getPublicUrl(fileName);

    // 3. Save Record to Database
    const { error: dbError } = await supabase.from('homepage_forms').insert({
      title,
      form_number: formNumber,
      file_url: publicUrl
    });

    if (dbError) throw dbError;

    revalidatePath('/');
    return { success: true };

  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteHomeForm(id: string) {
  const supabase = await createClient();
  // Note: For full cleanup, you'd fetch the file path and delete from storage too.
  // For now, we just delete the database reference.
  const { error } = await supabase.from('homepage_forms').delete().eq('id', id);
  
  if (error) return { success: false, error: error.message };
  revalidatePath('/');
  return { success: true };
}