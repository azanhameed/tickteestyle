import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { Product } from '@/types/database.types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tickteestyle.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic product pages
  try {
    const supabase = await createServerClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('id, updated_at')
      .gt('stock', 0); // Only include products in stock

    if (!error && products) {
      const productPages: MetadataRoute.Sitemap = (products as any as Product[]).map((product: any) => ({
        url: `${baseUrl}/shop/${product.id}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

      return [...staticPages, ...productPages];
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return staticPages;
}

