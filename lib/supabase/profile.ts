/**
 * Supabase profile helper functions
 * Handles user profile operations
 */

import { createClient } from '@/lib/supabase/client';
import { createServerClient } from '@/lib/supabase/server';
import { Profile } from '@/types/database.types';

export interface ProfileUpdateData {
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  memberSince: string;
}

/**
 * Fetch user profile
 */
export async function fetchUserProfile(
  userId: string
): Promise<{ profile: Profile | null; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id' as any, userId)
      .single();

    if (error) {
      // Profile might not exist yet, create it
      if (error.code === 'PGRST116') {
        return { profile: null, error: 'Profile not found' };
      }
      console.error('Error fetching profile:', error);
      return { profile: null, error: error.message };
    }

    return { profile: data as Profile };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { profile: null, error: 'Failed to fetch profile' };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  profileData: ProfileUpdateData
): Promise<{ success: boolean; profile?: Profile; error?: string }> {
  try {
    const supabase = createClient();

    // Upsert profile (create if doesn't exist, update if exists)
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true, profile: data as Profile };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string): Promise<{ stats: UserStats; error?: string }> {
  try {
    const supabase = createClient();

    // Fetch user's auth metadata for member since date
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        stats: {
          totalOrders: 0,
          totalSpent: 0,
          memberSince: new Date().toISOString(),
        },
        error: 'User not found',
      };
    }

    // Fetch orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .eq('user_id' as any, userId);

    if (ordersError) {
      console.error('Error fetching orders for stats:', ordersError);
    }

    const orderList = orders || [];
    const totalOrders = orderList.length;
    const totalSpent = orderList.reduce((sum, order) => sum + (order as any).total_amount, 0);
    const memberSince = user.created_at || new Date().toISOString();

    return {
      stats: {
        totalOrders,
        totalSpent,
        memberSince,
      },
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        memberSince: new Date().toISOString(),
      },
      error: 'Failed to get stats',
    };
  }
}

/**
 * Get user profile (server-side)
 * Fetches user profile from Supabase profiles table including role
 * 
 * @param {string} userId - The user ID to fetch profile for
 * @returns {Promise<{ profile: Profile | null; error?: string }>} Profile data or null with optional error
 */
export async function getUserProfile(
  userId: string
): Promise<{ profile: Profile | null; error?: string }> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id' as any, userId as any)
      .single();

    if (error) {
      // Profile might not exist yet
      if (error.code === 'PGRST116') {
        return { profile: null, error: 'Profile not found' };
      }
      console.error('Error fetching user profile:', error);
      return { profile: null, error: error.message };
    }

    return { profile: data as unknown as Profile };
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return { profile: null, error: error.message || 'Failed to fetch profile' };
  }
}

/**
 * Check if a user is an admin
 * Fetches user profile and checks if role === 'admin'
 * 
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} True if user is admin, false otherwise
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const { profile, error } = await getUserProfile(userId);

    if (error || !profile) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return profile.role === 'admin';
  } catch (error: any) {
    console.error('Error checking admin status:', error);
    return false;
  }
}