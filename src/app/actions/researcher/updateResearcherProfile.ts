// app/actions/researcher/updateResearcherProfile.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateResearcherProfile(profileData: any) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return { success: false, error: 'Not authenticated' };
    }

    // ✅ Parse first, middle, last names from full_name if needed
    let firstName = profileData.firstName;
    let middleName = profileData.middleName;
    let lastName = profileData.lastName;

    const fullName = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(' ');

    // ✅ ONLY update columns that ACTUALLY exist in profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        email: profileData.email || null,
        username: profileData.username || null,
        phone: profileData.phone || null,  // ✅ Use phone, not contact_number
        organization: profileData.organization || null,
        school: profileData.school || null,
        college: profileData.college || null,
        date_of_birth: profileData.dateOfBirth || null,
        gender: profileData.gender || null,
        program: profileData.program || null,
        year_level: profileData.yearLevel || null,
        section: profileData.section || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return { success: false, error: updateError.message || 'Failed to update profile' };
    }

    // Update auth email if changed
    if (profileData.email && profileData.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: profileData.email,
      });

      if (emailError) {
        console.error('Email update error:', emailError);
        return { success: true, warning: 'Profile updated but email change failed' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
