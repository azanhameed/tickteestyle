'use client';

/**
 * Address form component
 * Handles editing shipping address
 */

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface AddressFormData {
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface AddressFormProps {
  initialAddress: AddressFormData;
  onSave: (address: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AddressForm({
  initialAddress,
  onSave,
  onCancel,
  isLoading = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>(initialAddress);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});

  useEffect(() => {
    setFormData(initialAddress);
  }, [initialAddress]);

  const validateField = (field: keyof AddressFormData, value: string): string | undefined => {
    switch (field) {
      case 'address':
        if (!value.trim()) return 'Street address is required';
        if (value.trim().length < 5) return 'Address is too short';
        break;
      case 'city':
        if (!value.trim()) return 'City is required';
        break;
      case 'postal_code':
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

  const handleChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};
    (Object.keys(formData) as Array<keyof AddressFormData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Street Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Street Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main Street"
            disabled={isLoading}
            required
          />
        </div>
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
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
          <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="postal_code"
            value={formData.postal_code}
            onChange={(e) => handleChange('postal_code', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.postal_code ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="75500"
            disabled={isLoading}
            required
          />
          {errors.postal_code && (
            <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
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

      {/* Actions */}
      <div className="flex items-center space-x-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Save Address
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}


