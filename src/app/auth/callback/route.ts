// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  console.log('🔍 Callback received:', { code: code?.substring(0, 10), error });

  // Handle errors
  if (error) {
    console.error('❌ Auth error:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent(error)}`
    );
  }

  // No code = redirect to login
  if (!code) {
    console.log('⚠️ No code in callback');
    return NextResponse.redirect(`${requestUrl.origin}/login`);
  }

  try {
    const supabase = await createClient();
    
    // ✅ Exchange code for session
    const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code);

    console.log('📝 Exchange result:', { exchangeError: exchangeError?.message, userId: data?.user?.id });

    if (exchangeError) {
      console.error('❌ Exchange error:', exchangeError);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=exchange_failed`
      );
    }

    // ✅ Success! Redirect to dashboard
    console.log('✅ Email verified successfully');
    return NextResponse.redirect(`${requestUrl.origin}/login?verified=true`);

  } catch (error) {
    console.error('❌ Callback error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=callback_error`);
  }
}
