// app/actions/reviewer/changePassword.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function changeReviewerPassword(newPassword: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate password length
    if (newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Update the updated_at timestamp in profiles
    await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id);

    return { success: true };
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to change password',
    };
  }
}
