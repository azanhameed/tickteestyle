/**
 * Role-based access control utilities
 * Defines user roles and helper functions for role checking
 */

/**
 * User role constants
 */
export const CUSTOMER = 'customer' as const;
export const ADMIN = 'admin' as const;

export type UserRole = typeof CUSTOMER | typeof ADMIN;

/**
 * User interface with role
 */
export interface UserWithRole {
  id: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

/**
 * Check if a role is admin
 * 
 * @param {string} role - The role to check
 * @returns {boolean} True if role is 'admin'
 */
export function isAdmin(role: string | null | undefined): boolean {
  return role === ADMIN;
}

/**
 * Check if a user has admin access
 * 
 * @param {UserWithRole | null | undefined} user - The user object to check
 * @returns {boolean} True if user exists and has admin role
 */
export function hasAdminAccess(user: UserWithRole | null | undefined): boolean {
  if (!user) {
    return false;
  }
  return isAdmin(user.role);
}

/**
 * Get user role, defaulting to 'customer' if not set
 * 
 * @param {UserWithRole | null | undefined} user - The user object
 * @returns {UserRole} The user's role, or 'customer' as default
 */
export function getUserRole(user: UserWithRole | null | undefined): UserRole {
  if (!user || !user.role) {
    return CUSTOMER;
  }
  return user.role === ADMIN ? ADMIN : CUSTOMER;
}

