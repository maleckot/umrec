'use server';

import { createServiceClient } from '@/utils/supabase/service';
import { createClient } from '@/utils/supabase/server';

export async function getAllUsers() {
  const supabase = await createClient();

  try {
    // ✅ Fetch from profiles table
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      users: users || []
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch users',
      users: []
    };
  }
}

export async function createUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  status: string;
  code?: string;
  contactNumber?: string;
}) {
  const supabaseAdmin = createServiceClient();

  try {
    // ✅ Validate role against your actual enum values
    const validRoles = ['admin', 'staff', 'researcher', 'reviewer', 'secretariat'];
    const normalizedRole = userData.role.toLowerCase();
    
    if (!validRoles.includes(normalizedRole)) {
      return {
        success: false,
        error: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      };
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return { success: false, error: 'This email is already registered' };
      }
      throw authError;
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Wait for DB
    await new Promise(resolve => setTimeout(resolve, 300));

    // ✅ Insert profile
    const { data: profileResult, error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: userData.email,
        full_name: `${userData.firstName} ${userData.lastName}`,
        role: normalizedRole, // Must match enum exactly
        availability_status: userData.status || 'Available',
        reviewer_code: userData.code || null,
        phone: userData.contactNumber || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Profile insert error:', insertError);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return {
        success: false,
        error: `Failed to create profile: ${insertError.message}`
      };
    }

    console.log('✅ Profile created:', profileResult);
    return { success: true };
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    };
  }
}


export async function updateUser(userId: string, userData: any) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('profiles')
      .update(userData)
      .eq('id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user'
    };
  }
}

export async function deleteUser(userId: string) {
  const supabaseAdmin = createServiceClient();

  try {
    // ✅ Delete from profiles first
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    // ✅ Delete auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Auth user deletion failed:', authError);
      // Don't throw - profile is already deleted
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user'
    };
  }
}
