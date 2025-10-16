// app/actions/researcher/updateResearcherProfile.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateResearcherProfile(profileData: any) {
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
        first_name: profileData.firstName,
        middle_name: profileData.middleName,
        last_name: profileData.lastName,
        full_name: `${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`.trim(),
        date_of_birth: profileData.dateOfBirth,
        contact_number: profileData.contactNumber,
        gender: profileData.gender,
        school: profileData.school,
        college: profileData.college,
        program: profileData.program,
        year_level: profileData.yearLevel,
        section: profileData.section,
        student_no: profileData.studentNo,
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
