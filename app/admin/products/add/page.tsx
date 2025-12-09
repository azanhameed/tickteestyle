'use client';

/**
 * Add New Product Page
 * Form to create a new product with image upload
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { ProductFormData } from '@/components/admin/ProductForm';
import ProductForm from '@/components/admin/ProductForm';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { toast } from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!adminLoading) {
      if (!isAdmin) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAdmin, adminLoading, router]);

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Product created successfully!');
        router.push('/admin/products');
      } else {
        toast.error(result.error || 'Failed to create product');
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  // Show loading while checking admin status
  if (adminLoading) {
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

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Products', href: '/admin/products' },
            { label: 'Add New', href: '/admin/products/add' },
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Add New Watch</h1>
          <p className="text-gray-600">Add a new watch to your inventory for website and Instagram (@tick.teestyle)</p>
        </div>

        {/* Form */}
        <div className="max-w-3xl">
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}




