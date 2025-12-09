'use client';

/**
 * Reusable product form component
 * Used for both adding and editing products
 */

import { useState, useEffect } from 'react';
import { Product } from '@/types/database.types';
import MultiImageUpload from './MultiImageUpload';
import Button from '@/components/ui/Button';

export interface ProductFormData {
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  image_url: string | null; // Kept for backward compatibility
  image_urls: string[]; // Array of image URLs
}

export interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CATEGORIES = [
  "Men's Watches",
  "Women's Watches",
  'Luxury Collection',
  'Sports Watches',
];

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  // Get initial images: prefer image_urls, fallback to image_url for backward compatibility
  const getInitialImages = (): string[] => {
    if (initialData?.image_urls && initialData.image_urls.length > 0) {
      return initialData.image_urls;
    }
    if (initialData?.image_url) {
      return [initialData.image_url];
    }
    return [];
  };

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    brand: initialData?.brand || '',
    price: initialData?.price || 0,
    description: initialData?.description || '',
    category: initialData?.category || "Men's Watches",
    stock: initialData?.stock || 0,
    image_url: initialData?.image_url || null,
    image_urls: getInitialImages(),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [imageUrls, setImageUrls] = useState<string[]>(getInitialImages());

  useEffect(() => {
    if (initialData) {
      const images = initialData.image_urls && initialData.image_urls.length > 0
        ? initialData.image_urls
        : initialData.image_url
        ? [initialData.image_url]
        : [];
      
      setFormData({
        name: initialData.name || '',
        brand: initialData.brand || '',
        price: initialData.price || 0,
        description: initialData.description || '',
        category: initialData.category || "Men's Watches",
        stock: initialData.stock || 0,
        image_url: initialData.image_url || null,
        image_urls: images,
      });
      setImageUrls(images);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (imageUrls.length === 0) {
      newErrors.image_urls = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      ...formData,
      image_url: imageUrls[0] || null, // First image as primary for backward compatibility
      image_urls: imageUrls,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
    // Clear error for this field
    if (errors[name as keyof ProductFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ProductFormData];
        return newErrors;
      });
    }
  };

  const handleImagesChange = (urls: string[]) => {
    setImageUrls(urls);
    setFormData((prev) => ({
      ...prev,
      image_url: urls[0] || null, // First image as primary for backward compatibility
      image_urls: urls,
    }));
    if (errors.image_urls) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image_urls;
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter product name"
          disabled={isLoading}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Brand */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
          Brand <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
            errors.brand ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter brand name"
          disabled={isLoading}
        />
        {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
      </div>

      {/* Price and Stock Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              Rs.
            </span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1"
              className={`w-full pl-12 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 2499"
              disabled={isLoading}
            />
          </div>
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
            disabled={isLoading}
          />
          {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          disabled={isLoading}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter product description"
          disabled={isLoading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Multiple Image Upload */}
      <div>
        <MultiImageUpload
          onImagesChange={handleImagesChange}
          existingImages={imageUrls}
          disabled={isLoading}
          maxImages={10}
        />
        {errors.image_urls && (
          <p className="mt-1 text-sm text-red-600">{errors.image_urls}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="large"
          isLoading={isLoading}
          className="flex-1"
        >
          {initialData ? 'Update Product' : 'Save Product'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="large"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}




