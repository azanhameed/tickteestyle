'use client';

/**
 * Edit Product Page
 * Form to edit an existing product
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Product } from '@/types/database.types';
import { ProductFormData } from '@/components/admin/ProductForm';
import ProductForm from '@/components/admin/ProductForm';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { toast } from 'react-hot-toast';
import { deleteProductImage } from '@/lib/supabase/storage';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!adminLoading) {
      if (!isAdmin) {
        router.push('/unauthorized');
        return;
      }
      if (productId) {
        fetchProduct();
      }
    }
  }, [isAdmin, adminLoading, productId, router]);

  const fetchProduct = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      const data = await response.json();

      if (response.ok) {
        setProduct(data.product);
      } else {
        if (response.status === 404) {
          setError('Product not found');
        } else {
          toast.error(data.error || 'Failed to fetch product');
          router.push('/admin/products');
        }
      }
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
      router.push('/admin');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      // Get old images for comparison
      const oldImageUrls = product?.image_urls && product.image_urls.length > 0
        ? product.image_urls
        : product?.image_url
        ? [product.image_url]
        : [];
      
      const newImageUrls = data.image_urls || [];
      
      // Find images that were removed (in old but not in new)
      const imagesToDelete = oldImageUrls.filter(
        (oldUrl) => !newImageUrls.includes(oldUrl)
      );
      
      // Delete removed images from storage (don't wait, just fire and forget)
      if (imagesToDelete.length > 0) {
        Promise.all(
          imagesToDelete.map((url) => deleteProductImage(url))
        ).catch((err) => {
          console.error('Error deleting old images:', err);
          // Don't block the update if deletion fails
        });
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Product updated successfully!');
        router.push('/admin/products');
      } else {
        toast.error(result.error || 'Failed to update product');
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  // Show loading while checking admin status or fetching product
  if (adminLoading || isFetching) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect handled in useEffect
  if (!isAdmin) {
    return null;
  }

  // Product not found
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-md mx-auto text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">
              The product you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/admin/products">
              <Button variant="primary">Back to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Products', href: '/admin/products' },
            { label: 'Edit', href: `/admin/products/edit/${productId}` },
          ]}
          className="mb-6"
        />

        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/products">
            <Button
              variant="ghost"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              className="mb-4"
            >
              Back to Products
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Edit Product</h1>
          <p className="text-gray-600">Update product information</p>
        </div>

        {/* Form */}
        <div className="max-w-3xl">
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <ProductForm
              initialData={product}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}




