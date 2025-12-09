'use client';

/**
 * Mobile menu drawer component
 * Slide-in menu for mobile navigation
 */

import { useEffect } from 'react';
import { X, Shield, User, Package, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  onLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
  isAdmin = false,
  onLogout,
}: MobileMenuProps) {
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-primary">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-4 space-y-2" aria-label="Mobile navigation">
          <Link
            href="/"
            className="px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
            onClick={onClose}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
            onClick={onClose}
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
            onClick={onClose}
          >
            About
          </Link>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2" />

          {/* Auth Links */}
          {isAuthenticated ? (
            <>
              {/* Admin Dashboard - Only show for admins */}
              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                    onClick={onClose}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <div className="border-t border-gray-200 my-2" />
                </>
              )}
              <Link
                href="/profile"
                className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                onClick={onClose}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/orders"
                className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                onClick={onClose}
              >
                <Package className="w-5 h-5" />
                <span>My Orders</span>
              </Link>
              <div className="border-t border-gray-200 my-2" />
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center space-x-2 w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                onClick={onClose}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors font-medium text-center"
                onClick={onClose}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}

