'use client';

/**
 * Profile edit form component
 * Handles editing user profile information
 */

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import Button from '@/components/ui/Button';

export interface ProfileFormData {
  full_name: string;
  phone: string;
}

export interface ProfileFormProps {
  initialData: ProfileFormData;
  onSave: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProfileForm({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const validateField = (field: keyof ProfileFormData, value: string): string | undefined => {
    switch (field) {
      case 'full_name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters';
        break;
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[0-9+\-\s()]+$/.test(value)) return 'Invalid phone number format';
        if (value.replace(/\D/g, '').length < 10) return 'Phone number is too short';
        break;
    }
    return undefined;
  };

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};
    (Object.keys(formData) as Array<keyof ProfileFormData>).forEach((field) => {
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
      {/* Full Name */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.full_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
            disabled={isLoading}
            required
          />
        </div>
        {errors.full_name && (
          <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
        )}
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

      {/* Actions */}
      <div className="flex items-center space-x-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Save Changes
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


