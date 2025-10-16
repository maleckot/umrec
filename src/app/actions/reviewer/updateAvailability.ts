// app/actions/reviewer/updateAvailability.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function updateReviewerAvailability(status: 'available' | 'unavailable') {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Update availability status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        availability_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update availability error:', updateError);
      return { success: false, error: 'Failed to update availability' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating availability:', error);
    return {
      success: false,
      error: 'Failed to update availability status',
    };
  }
}

export async function getReviewerAvailability() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Not authenticated', availability: 'available' };
    }

    // Get current availability status
    const { data, error } = await supabase
      .from('profiles')
      .select('availability_status')
      .eq('id', user.id)
      .single();

    if (error) {
      return { success: false, error: 'Failed to fetch availability', availability: 'available' };
    }

    return { 
      success: true, 
      availability: (data?.availability_status as 'available' | 'unavailable') || 'available' 
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch availability status',
      availability: 'available' as const,
    };
  }
}
