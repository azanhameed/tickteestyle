/**
 * Admin access check helper for API routes
 * Provides a reusable function to verify admin access in API route handlers
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkIsAdmin } from '@/lib/supabase/profile';

/**
 * Check if the current user is an admin
 * Returns null if user is admin, or an error response if not
 * 
 * @returns {Promise<{ isAdmin: boolean; userId: string } | { response: NextResponse }>}
 *   Returns admin status and userId if admin, or error response if not
 * 
 * @example
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const adminCheck = await requireAdmin();
 *   if ('response' in adminCheck) {
 *     return adminCheck.response; // Error response
 *   }
 *   
 *   // User is admin, proceed with admin logic
 *   const { userId } = adminCheck;
 *   // ... admin code
 * }
 * ```
 */
export async function requireAdmin(): Promise<
  | { isAdmin: true; userId: string }
  | { response: NextResponse }
> {
  try {
    const supabase = await createServerClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        response: NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ),
      };
    }

    // Check if user is admin
    const isAdminUser = await checkIsAdmin(user.id);

    if (!isAdminUser) {
      return {
        response: NextResponse.json(
          { error: 'Forbidden: Admin access required' },
          { status: 403 }
        ),
      };
    }

    return { isAdmin: true, userId: user.id };
  } catch (error: any) {
    console.error('Error checking admin access:', error);
    return {
      response: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ),
    };
  }
}

