// app/actions/auth/forgotPassword.ts
'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create admin client
function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

export async function sendPasswordResetOTP(email: string) {
  try {
    const adminClient = getAdminClient();

    // Check if user exists
    const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers();
    
    if (usersError) {
      return { success: false, error: 'Failed to verify email' };
    }

    const userExists = users?.some(u => u.email === email);

    if (!userExists) {
      return { success: false, error: 'Email not found' };
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete old OTPs
    await adminClient
      .from('password_reset_otps')
      .delete()
      .eq('email', email);

    // Store OTP
    const { error: otpError } = await adminClient
      .from('password_reset_otps')
      .insert({
        email,
        otp,
        expires_at: expiresAt.toISOString(),
      });

    if (otpError) {
      console.error('OTP insert error:', otpError);
      return { success: false, error: 'Failed to generate verification code' };
    }

    // Send email
    try {
      await transporter.sendMail({
        from: `"UMREC - University of Makati" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Verification Code - UMREC',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #071139; margin: 0;">UMREC</h1>
              <p style="color: #666; margin: 5px 0;">University of Makati Research Ethics Committee</p>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 30px; border-radius: 10px;">
              <h2 style="color: #071139; margin-top: 0;">Password Reset Request</h2>
              <p style="color: #333; line-height: 1.6;">
                You requested to reset your password for your UMREC account.
              </p>
              
              <p style="color: #333; margin: 20px 0;">Your verification code is:</p>
              
              <div style="background-color: #F0E847; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #071139; border-radius: 8px; margin: 25px 0;">
                ${otp}
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                ⏰ This code will expire in <strong>10 minutes</strong>.
              </p>
              
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                If you didn't request this password reset, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; margin: 5px 0;">
                © 2025 University of Makati Research Ethics Committee
              </p>
            </div>
          </div>
        `,
      });

      console.log(`✅ Email sent to ${email} with OTP: ${otp}`);
    } catch (emailError) {
      console.error('Email error:', emailError);
      console.log(`⚠️ Email failed but OTP saved: ${otp}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false, error: 'Failed to send verification code' };
  }
}

export async function verifyPasswordResetOTP(email: string, otp: string) {
  try {
    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from('password_reset_otps')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return { success: false, error: 'Invalid or expired verification code' };
    }

    await adminClient
      .from('password_reset_otps')
      .update({ used: true })
      .eq('id', data.id);

    return { success: true };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, error: 'Failed to verify code' };
  }
}

export async function resetPasswordWithOTP(email: string, newPassword: string) {
  try {
    const adminClient = getAdminClient();

    const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers();

    if (usersError) {
      return { success: false, error: 'Failed to find user' };
    }

    const user = users?.find(u => u.email === email);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Update password error:', updateError);
      return { success: false, error: 'Failed to update password' };
    }

    await adminClient
      .from('password_reset_otps')
      .delete()
      .eq('email', email);

    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'Failed to reset password' };
  }
}
