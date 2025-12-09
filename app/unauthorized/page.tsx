'use client';

/**
 * Unauthorized access page
 * Displayed when a user tries to access admin routes without proper permissions
 */

import Link from 'next/link';
import { ShieldAlert, Home, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Access Denied</h1>
        
        <p className="text-lg text-gray-600 mb-2">
          You don't have permission to access this page. Admin access is required.
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          If you believe you should have access, please contact support.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" leftIcon={<Home className="w-5 h-5" />}>
              Back to Home
            </Button>
          </Link>
          
          <Link href="/shop">
            <Button variant="outline" leftIcon={<ShoppingBag className="w-5 h-5" />}>
              Go to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

