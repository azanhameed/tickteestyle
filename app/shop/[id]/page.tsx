/**
 * Product detail page
 * Individual product view with image gallery, details, and add to cart
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import { Product } from '@/types/database.types';
import ProductDetailClient from '@/components/shop/ProductDetailClient';
import { formatPrice } from '@/utils/formatters';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id as any)
      .single();

    if (error || !data) {
      return null;
    }

    // Parse image_urls from JSONB if it exists
    if ((data as any).image_urls) {
      try {
        (data as any).image_urls = typeof (data as any).image_urls === 'string' 
          ? JSON.parse((data as any).image_urls) 
          : (data as any).image_urls;
      } catch (e) {
        // If parsing fails, it might already be an array
        console.warn('Could not parse image_urls:', e);
      }
    }

    return data as any as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category as any)
      .neq('id', excludeId as any)
      .limit(4);

    if (error) {
      return [];
    }

    // Parse image_urls from JSONB for each product
    const products = (data as any || []).map((product: any) => {
      if (product.image_urls) {
        try {
          product.image_urls = typeof product.image_urls === 'string' 
            ? JSON.parse(product.image_urls) 
            : product.image_urls;
        } catch (e) {
          // If parsing fails, it might already be an array
          console.warn('Could not parse image_urls for product:', product.id as any, e);
        }
      }
      return product;
    });

    return products as Product[];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const description = product.description || `Buy ${product.name} by ${product.brand}. Premium luxury watch with authentic design. Fast delivery, secure payment.`;

  // Get primary image from image_urls array, fallback to image_url for backward compatibility
  const primaryImage = product.image_urls && product.image_urls.length > 0
    ? product.image_urls[0]
    : product.image_url || null;

  return {
    title: `${product.name} - ${product.brand}`,
    description,
    keywords: [product.name, product.brand, product.category, 'luxury watch', 'premium watch'],
    openGraph: {
      title: `${product.name} - ${product.brand} | TickTee Style`,
      description,
      type: 'website', // Changed from 'product' - Next.js doesn't support 'product' type
      images: primaryImage ? [primaryImage] : [],
      siteName: 'TickTee Style',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${product.brand}`,
      description,
      images: primaryImage ? [primaryImage] : [],
    },
    alternates: {
      canonical: `/shop/${params.id}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  // Get primary image from image_urls array, fallback to image_url for backward compatibility
  const primaryImage = product.image_urls && product.image_urls.length > 0
    ? product.image_urls[0]
    : product.image_url || null;

  // Get all images for schema
  const allImages = product.image_urls && product.image_urls.length > 0
    ? product.image_urls
    : product.image_url
    ? [product.image_url]
    : [];

  // Generate Product schema structured data
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: allImages.length > 0 ? allImages : primaryImage,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PKR', // Changed from INR to PKR for Pakistan
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tickteestyle.com'}/shop/${product.id}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '120',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <div className="min-h-screen bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <li>
                <Link href="/shop" className="hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <li className="text-gray-900 font-medium" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Back Button */}
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark mb-6 transition-colors"
            aria-label="Back to shop"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Shop</span>
          </Link>

          {/* Product Detail Client Component */}
          <ProductDetailClient product={product} relatedProducts={relatedProducts} />
        </div>
      </div>
    </>
  );
}
