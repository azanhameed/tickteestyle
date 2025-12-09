'use client';

/**
 * User profile page
 * View and edit account information
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Lock,
  Package,
  LogOut,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import Avatar from '@/components/ui/Avatar';
import ProfileForm from '@/components/profile/ProfileForm';
import AddressForm from '@/components/profile/AddressForm';
import ProfileStats from '@/components/profile/ProfileStats';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { ProfileFormData } from '@/components/profile/ProfileForm';
import { AddressFormData } from '@/components/profile/AddressForm';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check authentication
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push('/auth/login?redirect=/profile');
          return;
        }

        setUser(currentUser);

        // Fetch profile
        const response = await fetch('/api/profile');
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to load profile');
        }

        setProfile(result.profile);

        // Fetch stats
        const statsResponse = await fetch('/api/profile/stats');
        const statsResult = await statsResponse.json();

        if (statsResult.success) {
          setStats(statsResult.stats);
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        toast.error(error.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router, supabase]);

  const handleSaveProfile = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: data.full_name,
          phone: data.phone,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setProfile(result.profile);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async (data: AddressFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: data.address,
          city: data.city,
          postal_code: data.postal_code,
          country: data.country,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update address');
      }

      setProfile(result.profile);
      setIsEditingAddress(false);
      toast.success('Address updated successfully!');
    } catch (error: any) {
      console.error('Error saving address:', error);
      toast.error(error.message || 'Failed to update address');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="min-h-screen bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">Failed to load profile</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile.full_name || user.email?.split('@')[0] || 'User';
  const hasAddress =
    profile.address && profile.city && profile.postal_code && profile.country;

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Quick Stats */}
        <div className="mb-8">
          <ProfileStats
            totalOrders={stats.totalOrders}
            totalSpent={stats.totalSpent}
            memberSince={stats.memberSince || user.created_at}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 1: Profile Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <ProfileForm
                initialData={{
                  full_name: profile.full_name || '',
                  phone: profile.phone || '',
                }}
                onSave={handleSaveProfile}
                onCancel={() => setIsEditingProfile(false)}
                isLoading={isSaving}
              />
            ) : (
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  <Avatar name={displayName} size="large" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
                    <p className="text-sm text-gray-500">Profile Photo</p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">{profile.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-gray-900 font-medium">
                        {profile.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
              {!isEditingAddress && (
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {hasAddress ? 'Edit' : 'Add Address'}
                  </span>
                </button>
              )}
            </div>

            {isEditingAddress ? (
              <AddressForm
                initialAddress={{
                  address: profile.address || '',
                  city: profile.city || '',
                  postal_code: profile.postal_code || '',
                  country: profile.country || 'Pakistan',
                }}
                onSave={handleSaveAddress}
                onCancel={() => setIsEditingAddress(false)}
                isLoading={isSaving}
              />
            ) : (
              <div className="space-y-4">
                {hasAddress ? (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="text-gray-700">
                      <p>{profile.address}</p>
                      <p>
                        {profile.city}, {profile.postal_code}
                      </p>
                      <p>{profile.country}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No address saved</p>
                    <p className="text-sm mt-1">Add an address for faster checkout</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Account Settings */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-500">Last changed: Recently</p>
              </div>
              <Link href="/profile/change-password">
                <Button variant="outline" leftIcon={<Lock className="w-4 h-4" />}>
                  Change Password
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Email Verification</p>
                <p className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                  {user.email_confirmed_at ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-orange-500" />
                      <span>Not verified</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Member Since</p>
                <p className="text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/orders">
            <Button variant="primary" leftIcon={<Package className="w-4 h-4" />}>
              View My Orders
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => setShowLogoutModal(true)}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        size="small"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to logout?</p>
          <div className="flex items-center space-x-4">
            <Button variant="primary" onClick={handleLogout} className="flex-1">
              Yes, Logout
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
