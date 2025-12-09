'use client';

/**
 * Password reset page for TickTee Style
 * Allows users to request a password reset link via email
 */

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import AuthForm, { type AuthFormData } from '@/components/auth/AuthForm';
import { Watch, ArrowLeft, Mail } from 'lucide-react';

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const supabase = createClient();

  const handleResetPassword = async (data: AuthFormData) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/update-password`,
      });

      if (error) {
        toast.error(error.message || 'Failed to send reset email. Please try again.');
        setIsLoading(false);
        return;
      }

      setEmailSent(true);
      toast.success('Password reset link sent! Check your email.');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check your email
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to your email address. Please check your inbox
              and follow the instructions to reset your password.
            </p>
            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Login
              </Link>
              <button
                onClick={() => setEmailSent(false)}
                className="w-full text-sm text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Resend email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <AuthForm mode="reset" onSubmit={handleResetPassword} isLoading={isLoading} />

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-primary hover:text-primary-dark font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
