/**
 * Next.js Middleware
 * Handles authentication and route protection for TickTee Style
 * Protects routes that require authentication: /profile, /orders, /checkout, /admin
 * Implements role-based access control for admin routes
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createClient, refreshSession } from '@/lib/supabase/middleware';
import { checkIsAdmin } from '@/lib/supabase/profile';

/**
 * Protected routes that require authentication (but not admin role)
 */
const protectedRoutes = ['/profile', '/orders', '/checkout'];

/**
 * Admin routes that require admin role
 */
const adminRoutes = ['/admin'];

/**
 * Auth routes that should redirect to home if already authenticated
 */
const authRoutes = ['/auth/login', '/auth/signup'];

/**
 * Checks if a path matches any of the protected routes
 * 
 * @param {string} pathname - The pathname to check
 * @returns {boolean} True if the path is protected
 */
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Checks if a path is an admin route
 * 
 * @param {string} pathname - The pathname to check
 * @returns {boolean} True if the path is an admin route
 */
function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Checks if a path is an auth route
 * 
 * @param {string} pathname - The pathname to check
 * @returns {boolean} True if the path is an auth route
 */
function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Main middleware function
 * Handles authentication checks and route protection with role-based access control
 * 
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} The response with updated session
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh session for all routes
  const response = await refreshSession(request);

  // Get user session
  const { supabase } = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle admin routes - require authentication AND admin role
  if (isAdminRoute(pathname)) {
    if (!user) {
      // Redirect to login if not authenticated
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user is admin
    try {
      const isAdmin = await checkIsAdmin(user.id);
      
      if (!isAdmin) {
        // User is authenticated but not admin - redirect to unauthorized page
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    } catch (error) {
      // Error checking admin status - deny access for safety
      console.error('Error checking admin status in middleware:', error);
      const unauthorizedUrl = new URL('/unauthorized', request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  // Protect routes that require authentication (but not admin role)
  if (isProtectedRoute(pathname)) {
    if (!user) {
      // Redirect to login if not authenticated
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathname) && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

/**
 * Middleware configuration
 * Specifies which routes should be processed by middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};


