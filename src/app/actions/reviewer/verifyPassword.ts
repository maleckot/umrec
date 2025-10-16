// app/actions/reviewer/verifyPassword.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function verifyReviewerPassword(password: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Try to sign in with current credentials to verify password
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password,
    });

    if (error) {
      return { success: false, error: 'Incorrect password' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to verify password' };
  }
}
