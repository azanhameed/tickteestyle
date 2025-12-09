/**
 * Shop page - Main product catalog
 * Features: search, filters, sorting, pagination
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { Product } from '@/types/database.types';
import ShopContent from '@/components/shop/ShopContent';

export const metadata: Metadata = {
  title: 'Shop Premium Watches Online in Pakistan | TickTee Style',
  description: '🕰️ Buy authentic luxury watches online in Pakistan. Premium men\'s & women\'s timepieces. ✓ 100% Authentic ✓ COD Available ✓ Fast Delivery ✓ Easy Returns. Shop now!',
  keywords: [
    'luxury watches Pakistan',
    'premium watches online',
    'buy watches Pakistan',
    'authentic watches',
    'men\'s watches',
    'women\'s watches',
    'COD watches',
    'watch shop Pakistan',
    'branded watches',
    'TickTee Style',
  ],
  openGraph: {
    title: 'Shop Premium Watches Online in Pakistan | TickTee Style',
    description: '🕰️ Buy authentic luxury watches online in Pakistan. 100% Authentic, COD Available, Fast Delivery. Browse our premium collection now!',
    type: 'website',
  },
  alternates: {
    canonical: '/shop',
  },
};

// Enable ISR - Revalidate every 60 seconds
export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    // Parse image_urls from JSONB for each product
    const products = (data || []).map((product: any) => {
      if (product.image_urls) {
        try {
          product.image_urls = typeof product.image_urls === 'string' 
            ? JSON.parse(product.image_urls) 
            : product.image_urls;
        } catch (e) {
          // If parsing fails, it might already be an array
          console.warn('Could not parse image_urls for product:', product.id, e);
        }
      }
      return product;
    });

    return products as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getBrands(): Promise<string[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .order('brand');

    if (error) {
      console.error('Error fetching brands:', error);
      return [];
    }

    // Get unique brands
    const products = (data as { brand: string }[]) || [];
    const uniqueBrands = Array.from(new Set(products.map((p) => p.brand)));
    return uniqueBrands.sort();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export default async function ShopPage() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);

  // Calculate price range
  const prices = products.map((p) => p.price).filter((p) => typeof p === 'number');
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000;

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Our Collection
          </h1>
          <p className="text-lg text-gray-600">
            Discover luxury timepieces that define elegance and precision
          </p>
        </div>

        {/* Shop Content */}
        <Suspense fallback={<div>Loading...</div>}>
          <ShopContent
            initialProducts={products}
            availableBrands={brands}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </Suspense>
      </div>
    </div>
  );
}
