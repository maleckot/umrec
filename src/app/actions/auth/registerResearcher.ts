// app/actions/auth/registerResearcher.ts
'use server';

import { createClient } from '@/utils/supabase/server';

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

    // 1. Check if username already exists
    const { data: existingUsername } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', data.username)
      .maybeSingle();

    if (existingUsername) {
      return { success: false, error: 'Username already taken' };
    }

    // 2. Check if email already exists
    const { data: existingEmail } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', data.email)
      .maybeSingle();

    if (existingEmail) {
      return { success: false, error: 'Email already registered' };
    }

    // 3. Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          username: data.username,
        }
      }
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'User creation failed' };
    }

    // 4. Build full name
    const fullName = `${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}`.trim();

    // 5. Wait a moment for trigger to create basic profile
    await new Promise(resolve => setTimeout(resolve, 500));

    // 6. Update profile with additional researcher data
    const { error: profileError } = await supabase
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
      console.error('❌ Profile update error:', profileError);
      // Don't delete user, they can complete profile later
      return { 
        success: true, 
        message: 'Account created! Please complete your profile after email verification.',
        userId: authData.user.id 
      };
    }

    console.log('✅ Researcher registered successfully:', data.email);

    return {
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      userId: authData.user.id,
      needsEmailConfirmation: true,
    };

  } catch (error) {
    console.error('❌ Registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}
