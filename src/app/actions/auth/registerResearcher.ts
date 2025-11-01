// app/actions/auth/registerResearcher.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { createServiceClient } from '@/utils/supabase/service';

interface RegisterResearcherData {
  lastName: string;
  firstName: string;
  middleName: string;
  dateOfBirth: string;
  contactNumber: string;
  gender: string;
  school: string;
  college: string;
  program: string;
  yearLevel: string;
  section: string;
  studentNo: string;
  username: string;
  email: string;
  password: string;
}

export async function registerResearcher(data: RegisterResearcherData) {
  try {
    const supabase = await createClient();

    // 1. Check if username exists
    const { data: existingUsername } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', data.username)
      .maybeSingle();

    if (existingUsername) {
      return { success: false, error: 'Username already taken' };
    }

    // 2. Check if email exists
    const { data: existingEmail } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', data.email)
      .maybeSingle();

    if (existingEmail) {
      return { success: false, error: 'Email already registered' };
    }

    // 3. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError || !authData.user) {
      console.error('❌ Auth error:', authError);
      return { success: false, error: authError?.message || 'User creation failed' };
    }

    // 4. Build full name
    const fullName = `${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}`.trim();

    // 5. Wait for trigger to create profile
    await new Promise(resolve => setTimeout(resolve, 500));

    // 6. Use SERVICE CLIENT to insert full profile
    const serviceClient = createServiceClient();
    const { error: profileError } = await serviceClient
      .from('profiles')
      .update({
        full_name: fullName,
        username: data.username,
        phone: data.contactNumber,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        organization: data.school.toLowerCase().includes('makati') ? 'Internal (UMAK)' : 'External',
        school: data.school,
        college: data.college,
        program: data.program,
        year_level: data.yearLevel,
        section: data.section,
        student_number: data.studentNo || null,
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('❌ Profile error:', profileError);
    }

    console.log('✅ Researcher registered:', data.email);

    return {
      success: true,
      message: 'Registration successful! Check your email for OTP.',
      userId: authData.user.id,
      needsOtpConfirmation: true,
    };

  } catch (error) {
    console.error('❌ Registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}
