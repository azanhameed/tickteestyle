/**
 * Supabase client-side configuration
 * Creates a Supabase client for use in client components and browser environments
 */

import { createBrowserClient } from '@supabase/ssr';
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
 * Creates a Supabase client for client-side usage
 * This client is used in React components that run in the browser
 * 
 * @returns {ReturnType<typeof createBrowserClient<Database>>} Supabase client instance
 * 
 * @example
 * ```tsx
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 * 
 * const supabase = createClient();
 * const { data } = await supabase.from('products').select('*');
 * ```
 */
export function createClient() {
  try {
    return createBrowserClient<Database>(supabaseUrl as string, supabaseAnonKey as string);
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw new Error('Failed to initialize Supabase client');
  }
}


