/**
 * Home page for TickTee Style
 * Main landing page with hero, featured products, categories, and more
 */

import Link from 'next/link';
import {
  Watch,
  Shield,
  Truck,
  RotateCcw,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ui/ProductCard';
import Button from '@/components/ui/Button';
import { Product } from '@/types/database.types';
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema } from '@/components/seo/StructuredData';
import TrustBadges from '@/components/ui/TrustBadges';

// Enable ISR with revalidation
export const revalidate = 300; // Revalidate every 5 minutes

// Testimonials data (can be moved to database later)
const testimonials = [
  {
    id: 1,
    name: 'Ahmed Khan',
    location: 'Karachi',
    rating: 5,
    review: 'Absolutely stunning watch! The quality is exceptional and the delivery was super fast. Highly recommend TickTee Style!',
    avatar: 'AK',
    verified: true,
    date: 'Nov 2024',
  },
  {
    id: 2,
    name: 'Fatima Malik',
    location: 'Lahore',
    rating: 5,
    review: 'I\'ve purchased three watches from here. Each one is more beautiful than the last. The customer service is outstanding.',
    avatar: 'FM',
    verified: true,
    date: 'Oct 2024',
  },
  {
    id: 3,
    name: 'Ali Raza',
    location: 'Islamabad',
    rating: 5,
    review: 'Best luxury watch collection online. Authentic products, secure payment, and excellent packaging. Will shop again!',
    avatar: 'AR',
    verified: true,
    date: 'Sep 2024',
  },
];

// Categories data
const categories = [
  {
    id: 'mens',
    name: "Men's Watches",
    icon: Watch,
    href: '/shop?category=mens',
    gradient: 'from-blue-600 to-blue-800',
  },
  {
    id: 'womens',
    name: "Women's Watches",
    icon: Sparkles,
    href: '/shop?category=womens',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'luxury',
    name: 'Luxury Collection',
    icon: Star,
    href: '/shop?category=luxury',
    gradient: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'sports',
    name: 'Sports Watches',
    icon: Watch,
    href: '/shop?category=sports',
    gradient: 'from-green-500 to-green-700',
  },
];

// Features data
const features = [
  {
    id: 1,
    title: 'Authentic Timepieces',
    description: '100% genuine watches with certificates of authenticity',
    icon: Shield,
  },
  {
    id: 2,
    title: 'Secure Payment',
    description: 'Safe and encrypted transactions for your peace of mind',
    icon: Shield,
  },
  {
    id: 3,
    title: 'Fast Delivery',
    description: 'Quick shipping worldwide with tracking on all orders',
    icon: Truck,
  },
  {
    id: 4,
    title: 'Easy Returns',
    description: '30-day return policy with hassle-free exchanges',
    icon: RotateCcw,
  },
];

async function getFeaturedProducts() {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(6)
      .order('created_at', { ascending: false });

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

export default async function Page() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      {/* SEO Structured Data */}
      <OrganizationSchema />
      <WebsiteSchema />
      <LocalBusinessSchema />
      
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center justify-center mb-6">
              <Watch className="w-16 h-16 text-secondary animate-float" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
              Where Time Meets Trend
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up-delay">
              Discover luxury watches with styles for every occasion. Over 3000 premium timepieces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay">
              <Link href="/shop">
                <Button variant="secondary" size="large" rightIcon={<ArrowRight className="w-5 h-5" />} className="animate-glow">
                  Shop Now
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="large" className="border-white text-white hover:bg-white hover:text-primary">
                  View Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Watches
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our finest timepieces
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductCard key={i} product={{} as any} isLoading />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="primary" size="large" rightIcon={<ArrowRight className="w-5 h-5" />}>
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect watch for your style
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.gradient} p-8 text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="relative z-10">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/90 flex items-center group-hover:translate-x-2 transition-transform">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose TickTee Style?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted partner for luxury timepieces
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of watch enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-background-light rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-xl mr-4 shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <CheckCircle className="w-4 h-4 text-green-600 fill-green-600" title="Verified Buyer" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{testimonial.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">&quot;{testimonial.review}&quot;</p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified Purchase
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-primary-dark to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Perfect Watch?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Explore our extensive collection of luxury timepieces and discover the watch that speaks to you.
            </p>
            <Link href="/shop">
              <Button
                variant="secondary"
                size="large"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-secondary hover:bg-secondary-light"
              >
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
