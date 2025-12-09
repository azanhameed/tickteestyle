/**
 * Supabase middleware helper
 * Handles authentication token refresh and session management in Next.js middleware
 */

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database.types';

/**
 * Environment variable validation
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * Creates a Supabase client for middleware usage
 * Handles cookie-based authentication in Next.js middleware
 * 
 * @param {NextRequest} request - The incoming Next.js request
 * @returns {ReturnType<typeof createSupabaseServerClient<Database>>} Supabase client instance
 */
export function createClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseServerClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, response };
}

/**
 * Refreshes the user session and updates cookies
 * Should be called in middleware to keep sessions fresh
 * 
 * @param {NextRequest} request - The incoming Next.js request
 * @returns {Promise<NextResponse>} Response with updated cookies
 */
export async function refreshSession(request: NextRequest): Promise<NextResponse> {
  const { supabase, response } = createClient(request);

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser();

  return response;
}