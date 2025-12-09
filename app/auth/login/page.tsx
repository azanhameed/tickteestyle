'use client';

/**
 * Login page for TickTee Style
 * Handles user authentication with email and password
 */

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import AuthForm, { type AuthFormData } from '@/components/auth/AuthForm';
import { Watch } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const redirectTo = searchParams.get('redirect') || '/shop';

  const handleLogin = async (data: AuthFormData) => {
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || 'Failed to sign in. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        toast.success('Welcome back! Redirecting...');
        router.push(redirectTo);
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Branding Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 group">
            <div className="bg-primary p-2 rounded-lg group-hover:bg-primary-dark transition-colors">
              <Watch className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-primary">TickTee Style</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your luxury watch collection
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <AuthForm mode="login" onSubmit={handleLogin} isLoading={isLoading} />

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/reset-password"
              className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to TickTee Style?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
