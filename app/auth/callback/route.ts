/**
 * OAuth and email confirmation callback handler
 * Handles authentication callbacks from Supabase (OAuth, email confirmation, etc.)
 */

import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/shop';

  if (code) {
    try {
      const supabase = await createServerClient();
      
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }

      // Successfully authenticated, redirect to the intended page
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (error) {
      console.error('Callback error:', error);
      return NextResponse.redirect(
        new URL('/auth/login?error=authentication_failed', requestUrl.origin)
      );
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin));
}

