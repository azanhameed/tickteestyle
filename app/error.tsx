'use client';

/**
 * Global Error Boundary Page
 * Catches errors in the application and displays a friendly message
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console (or error tracking service in production)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center animate-slide-up">
          <div className="relative">
            <AlertCircle className="w-24 h-24 text-red-500" />
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Error Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-up-delay">
          Something Went Wrong
        </h1>

        {/* Friendly Message */}
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto animate-fade-in-delay">
          We encountered an unexpected error. Don't worry, our team has been notified.
          Please try again or return to the home page.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay">
          <Button
            variant="primary"
            size="large"
            onClick={reset}
            leftIcon={<RefreshCw className="w-5 h-5" />}
          >
            Try Again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              size="large"
              leftIcon={<Home className="w-5 h-5" />}
            >
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}




