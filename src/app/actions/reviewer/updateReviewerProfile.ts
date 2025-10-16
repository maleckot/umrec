// app/actions/reviewer/updateReviewerProfile.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateReviewerProfile(profileData: {
  fullName: string;
  email: string;
  department: string;
  title: string;
}) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: profileData.fullName,
        department: profileData.department,
        title: profileData.title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return { success: false, error: 'Failed to update profile' };
    }

    // Update email if changed
    if (profileData.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: profileData.email,
      });

      if (emailError) {
        return { success: false, error: 'Failed to update email' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}
