// app/actions/researcher/updatePassword.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function verifyCurrentPassword(password: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.email) {
      console.error('❌ Auth error:', userError);
      return { success: false, error: 'Not authenticated' };
    }

    // ✅ Verify password
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    if (error) {
      console.error('❌ Password verification failed:', error.message);
      return { success: false, error: 'Incorrect password' };
    }

    console.log('✅ Password verified successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Unexpected error verifying password:', error);
    return { success: false, error: 'Failed to verify password' };
  }
}

export async function updateUserPassword(newPassword: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Auth error:', userError);
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('❌ Password update failed:', error.message);
      return { success: false, error: error.message || 'Failed to update password' };
    }

    console.log('✅ Password updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Unexpected error updating password:', error);
    return { success: false, error: 'Failed to update password' };
  }
}
