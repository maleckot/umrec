// app/actions/reviewer/sendVerificationCode.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';

export async function sendVerificationCode(email: string) {
  try {
    const supabase = await createClient();

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // ✅ Delete old codes for this email (with error handling)
    try {
      await supabase
        .from('password_reset_otps')
        .delete()
        .eq('email', email)
        .neq('used', false); // Only delete used or old ones (optional)
    } catch (e) {
      console.log('Cleanup note:', e);
    }

    // Insert new code
    const { error: dbError } = await supabase
      .from('password_reset_otps')
      .insert([
        {
          otp: code,
          email,
          expires_at: expiresAt,
          used: false,
        },
      ]);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification Code',
      html: `<h2>Verify Your Email</h2><p>Your code: <strong>${code}</strong></p><p>Expires in 10 minutes.</p>`,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
