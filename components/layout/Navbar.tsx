'use client';

/**
 * Main navigation bar component
 * Responsive navbar with auth state, cart, and mobile menu
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Watch, ShoppingCart, Menu, User, LogOut, Package, UserCircle, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'react-hot-toast';
import { useAdmin } from '@/hooks/useAdmin';
import MobileMenu from './MobileMenu';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const supabase = createClient();
  const { totalItems } = useCartStore();
  const { isAdmin, loading: adminLoading, profile } = useAdmin();

  // Check auth state
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Failed to logout. Please try again.');
        return;
      }

      toast.success('Logged out successfully');
      setIsUserMenuOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-primary shadow-lg">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 text-white hover:text-secondary transition-colors group"
              aria-label="TickTee Style Home"
            >
              <div className="bg-secondary/20 p-2 rounded-lg group-hover:bg-secondary/30 transition-colors">
                <Watch className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-xl font-bold hidden sm:inline-block">TickTee Style</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-primary-dark transition-colors font-medium ${
                    pathname === link.href ? 'bg-primary-dark text-white' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative p-2 text-white hover:text-secondary transition-colors"
                aria-label={`Shopping cart with ${totalItems} items`}
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Desktop Auth Buttons / User Menu */}
              <div className="hidden md:block">
                {isLoading ? (
                  <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
                ) : user ? (
                  <div className="relative" data-user-menu>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-2 text-white hover:text-secondary transition-colors rounded-lg hover:bg-primary-dark"
                      aria-label="User menu"
                      aria-expanded={isUserMenuOpen}
                    >
                      <UserCircle className="w-6 h-6" />
                      <span className="text-sm font-medium hidden lg:inline-block">
                        {profile?.full_name || user.email?.split('@')[0] || 'Account'}
                        {isAdmin && profile?.role && (
                          <span className="ml-2 text-xs text-secondary">({profile.role})</span>
                        )}
                      </span>
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1">
                        {/* Admin Dashboard - Only show for admins */}
                        {!adminLoading && isAdmin && (
                          <>
                            <Link
                              href="/admin"
                              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Shield className="w-4 h-4" />
                              <span>Admin Dashboard</span>
                            </Link>
                            <div className="border-t border-gray-200 my-1" />
                          </>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>
                        <div className="border-t border-gray-200 my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 text-white hover:text-secondary transition-colors font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary-light transition-colors font-semibold"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-white hover:text-secondary transition-colors"
                aria-label="Open mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={!!user}
        isAdmin={isAdmin && !adminLoading}
        onLogout={handleLogout}
      />
    </>
  );
}


