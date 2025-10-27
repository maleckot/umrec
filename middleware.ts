// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // If user is logged in and trying to access login page
  if (session && request.nextUrl.pathname === '/login') {
    // ✅ FIXED: Changed from 'users' to 'profiles'
    const { data: profile } = await supabase
      .from('profiles')  // ✅ Correct table
      .select('role')
      .eq('id', session.user.id)
      .single();

    let redirectPath = '/';
    
    if (profile?.role) {  // ✅ Check profile instead of userData
      const role = profile.role.toLowerCase();
      switch (role) {
        case 'researcher':
          redirectPath = '/researchermodule';
          break;
        case 'reviewer':
          redirectPath = '/reviewermodule';
          break;
        case 'staff':
          redirectPath = '/staffmodule';
          break;
        case 'secretariat':
          redirectPath = '/secretariatmodule';
          break;
        case 'admin':
          redirectPath = '/adminmodule';
          break;
      }
    }

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/login', '/signup'],
};
