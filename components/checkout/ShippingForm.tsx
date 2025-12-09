'use client';

/**
 * Shipping address form component
 * Handles shipping address input with validation
 */

import { useState, useEffect } from 'react';
import { ShippingAddress } from '@/types/order.types';

export interface ShippingFormProps {
  initialValues?: Partial<ShippingAddress>;
  onSubmit: (address: ShippingAddress, saveAddress: boolean) => void;
  isLoading?: boolean;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

// Move validateField function OUTSIDE the component
const validateField = (name: keyof ShippingAddress, value: string): string | undefined => {
  switch (name) {
    case 'fullName':
      if (!value.trim()) return 'Full name is required';
      if (value.trim().length < 2) return 'Full name must be at least 2 characters';
      break;
    case 'phone':
      if (!value.trim()) return 'Phone number is required';
      // Basic phone validation (adjust for your country)
      if (!/^[0-9+\-\s()]+$/.test(value)) return 'Invalid phone number format';
      if (value.replace(/\D/g, '').length < 10) return 'Phone number is too short';
      break;
    case 'streetAddress':
      if (!value.trim()) return 'Street address is required';
      if (value.trim().length < 5) return 'Address is too short';
      break;
    case 'city':
      if (!value.trim()) return 'City is required';
      break;
    case 'postalCode':
      if (!value.trim()) return 'Postal code is required';
      if (!/^\d{5,6}$/.test(value.replace(/\s/g, ''))) {
        return 'Invalid postal code format';
      }
      break;
    case 'country':
      if (!value.trim()) return 'Country is required';
      break;
  }
  return undefined;
};

export default function ShippingForm({
  initialValues,
  onSubmit,
  isLoading = false,
}: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: initialValues?.fullName || '',
    email: initialValues?.email || '',
    phone: initialValues?.phone || '',
    streetAddress: initialValues?.streetAddress || '',
    city: initialValues?.city || '',
    postalCode: initialValues?.postalCode || '',
    country: initialValues?.country || 'Pakistan',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate and update parent on change
  useEffect(() => {
    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof ShippingAddress>).forEach((field) => {
      if (field !== 'email') {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field as keyof FormErrors] = error;
        }
      }
    });
    setErrors(newErrors);

    // Call onSubmit when form is valid (for real-time updates to parent)
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid && formData.fullName && formData.phone && formData.streetAddress && formData.city && formData.postalCode) {
      onSubmit(formData, saveAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, saveAddress]);

  return (
    <div className="space-y-6">
      {/* ... rest of your JSX remains the same ... */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
            disabled={isLoading}
            required
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Email (Read-only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            readOnly
            disabled
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+92 300 1234567"
            disabled={isLoading}
            required
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Street Address */}
        <div>
          <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="streetAddress"
            value={formData.streetAddress}
            onChange={(e) => handleChange('streetAddress', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.streetAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main Street"
            disabled={isLoading}
            required
          />
          {errors.streetAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.streetAddress}</p>
          )}
        </div>

        {/* City and Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Karachi"
              disabled={isLoading}
              required
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="75500"
              disabled={isLoading}
              required
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            id="country"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
            required
          >
            <option value="Pakistan">Pakistan</option>
            <option value="India">India</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Other">Other</option>
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>
      </div>

      {/* Save Address Checkbox */}
      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={saveAddress}
            onChange={(e) => setSaveAddress(e.target.checked)}
            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            disabled={isLoading}
          />
          <span className="text-sm text-gray-700">
            Save this address to my profile for future orders
          </span>
        </label>
      </div>
    </div>
  );
}

// Export validation function
export function validateShippingAddress(address: ShippingAddress): FormErrors {
  const errors: FormErrors = {};
  (Object.keys(address) as Array<keyof ShippingAddress>).forEach((field) => {
    if (field !== 'email') {
      const error = validateField(field, address[field]);
      if (error) {
        errors[field as keyof FormErrors] = error;
      }
    }
  });
  return errors;
}