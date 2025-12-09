/**
 * Custom 404 Not Found Page
 * Displays when a page doesn't exist
 */

import Link from 'next/link';
import { Watch, Home, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-2xl w-full text-center">
        {/* Watch Icon */}
        <div className="mb-8 flex justify-center animate-slide-up">
          <div className="relative">
            <Watch className="w-24 h-24 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
          </div>
        </div>

        {/* 404 Heading */}
        <h1 className="text-9xl font-bold text-primary mb-4 animate-slide-up-delay">
          404
        </h1>

        {/* Main Message */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-up-delay">
          Page Not Found
        </h2>

        {/* Subtext */}
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto animate-fade-in-delay">
          The page you're looking for might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay">
          <Link href="/">
            <Button
              variant="primary"
              size="large"
              leftIcon={<Home className="w-5 h-5" />}
            >
              Back to Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button
              variant="outline"
              size="large"
              leftIcon={<ShoppingBag className="w-5 h-5" />}
            >
              Go to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}




