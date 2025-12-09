/**
 * Supabase server-side configuration
 * Creates a Supabase client for use in server components, route handlers, and API routes
 * Handles cookie management for authentication state
 */

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
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
 * Creates a Supabase client for server-side usage
 * This client is used in server components, route handlers, and API routes
 * Automatically handles cookie-based authentication
 * 
 * @returns {Promise<ReturnType<typeof createSupabaseServerClient<Database>>>} Supabase client instance
 * 
 * @example
 * ```tsx
 * import { createServerClient } from '@/lib/supabase/server';
 * 
 * export default async function Page() {
 *   const supabase = await createServerClient();
 *   const { data } = await supabase.from('products').select('*');
 *   return <div>Render data</div>;
 * }
 * ```
 */
export async function createServerClient() {
  try {
    const cookieStore = await cookies();

    return createSupabaseServerClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.warn('Cookie setAll called from Server Component:', error);
          }
        },
      },
    });
  } catch (error) {
    console.error('Error creating Supabase server client:', error);
    throw new Error('Failed to initialize Supabase server client');
  }
}