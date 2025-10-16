// app/actions/researcher/updatePassword.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function verifyCurrentPassword(password: string) {
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

export async function updateUserPassword(newPassword: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: 'Failed to update password' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update password' };
  }
}
