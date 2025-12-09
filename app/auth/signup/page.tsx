'use client';

/**
 * Signup page for TickTee Style
 * Handles new user registration with email, password, and full name
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import AuthForm, { type AuthFormData } from '@/components/auth/AuthForm';
import { Watch } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSignup = async (data: AuthFormData) => {
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password!,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Update user metadata with full name
        if (data.fullName) {
          const { error: updateError } = await supabase.auth.updateUser({
            data: { full_name: data.fullName },
          });

          if (updateError) {
            console.error('Error updating user metadata:', updateError);
          }
        }

        toast.success('Account created successfully! Redirecting...');
        
        // Check if email confirmation is required
        if (authData.user.email_confirmed_at) {
          // Email already confirmed, redirect to shop
          router.push('/shop');
          router.refresh();
        } else {
          // Email confirmation required
          toast.success('Please check your email to confirm your account.', {
            duration: 5000,
          });
          router.push('/auth/login');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join TickTee Style and discover luxury watches
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <AuthForm mode="signup" onSubmit={handleSignup} isLoading={isLoading} />

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
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
