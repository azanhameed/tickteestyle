'use client';

/**
 * Custom React hook for admin access checking
 * Returns admin status, loading state, and user information
 */

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database.types';
import { isAdmin } from '@/lib/auth/roles';

export interface UseAdminReturn {
  isAdmin: boolean;
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  error: string | null;
}

/**
 * Custom hook to check if current user is an admin
 * 
 * @returns {UseAdminReturn} Object containing admin status, loading state, user, and profile
 * 
 * @example
 * ```tsx
 * function AdminComponent() {
 *   const { isAdmin, loading } = useAdmin();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (!isAdmin) return <div>Access Denied</div>;
 *   
 *   return <div>Admin Content</div>;
 * }
 * ```
 */
export function useAdmin(): UseAdminReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user from Supabase auth
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !currentUser) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        setUser(currentUser);

        // Fetch user profile to get role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id as any)
          .single();

        if (profileError) {
          // Profile might not exist yet
          if (profileError.code === 'PGRST116') {
            setProfile(null);
            setLoading(false);
            return;
          }
          console.error('Error fetching profile:', profileError);
          setError(profileError.message);
          setProfile(null);
          setLoading(false);
          return;
        }

        setProfile(profileData as unknown as Profile);
      } catch (err: any) {
        console.error('Error checking admin status:', err);
        setError(err.message || 'Failed to check admin status');
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        
        // Fetch profile when auth state changes
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
            .eq('id', session.user.id as any)
          .single();
        
        setProfile(profileData as Profile | null);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const adminStatus = profile ? isAdmin(profile.role) : false;

  return {
    isAdmin: adminStatus,
    loading,
    user,
    profile,
    error,
  };
}