// app/actions/auth/checkAuthStatus.ts
'use server';

import { createClient } from '@/utils/supabase/server';

// app/actions/auth/checkAuthStatus.ts
export async function checkAuthStatus() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return { isLoggedIn: false, firstName: null, userRole: null };
    }

    // ✅ CRITICAL: Query the profiles table with the CORRECT role column
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')  // ✅ Must match your DB column name
      .eq('id', user.id)
      .single();

    const firstName = profile?.full_name?.split(' ')[0] || null;
    
    console.log('🔍 Profile from DB:', profile); // ✅ Debug log

    return {
      isLoggedIn: true,
      firstName: firstName,
      userRole: profile?.role || 'researcher',  // ✅ Must exist in DB
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return { isLoggedIn: false, firstName: null, userRole: null };
  }
}
