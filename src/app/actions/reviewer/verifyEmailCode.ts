// app/actions/reviewer/verifyEmailCode.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function verifyEmailCode(code: string, email: string) {
  try {
    const supabase = await createClient();

    // Find the code in database - don't check user.id (not in your table)
    const { data: otpRecord, error: queryError } = await supabase
      .from('password_reset_otps')
      .select('*')
      .eq('otp', code)
      .eq('email', email)
      .eq('used', false)
      .single();

    if (queryError || !otpRecord) {
      return { success: false, error: 'Invalid code' };
    }

    // ✅ Check expiration manually in JavaScript (avoids timezone issues)
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);
    
    if (now > expiresAt) {
      return { success: false, error: 'Code expired' };
    }

    // Mark code as used
    const { error: updateError } = await supabase
      .from('password_reset_otps')
      .update({ used: true })
      .eq('id', otpRecord.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
