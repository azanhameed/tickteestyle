/**
 * About TickTee Style page
 * Company story, why choose us, contact information
 */

import { Metadata } from 'next';
import { Award, Shield, Truck, HeadphonesIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import InstagramLink from '@/components/ui/InstagramLink';

export const metadata: Metadata = {
  title: 'About TickTee Style - Premium Watch Retailer in Pakistan',
  description: '🕰️ Pakistan\'s trusted luxury watch retailer since [Year]. 100% authentic timepieces, nationwide delivery, COD available. Follow @tick.teestyle on Instagram. Your time, your style!',
  keywords: [
    'about TickTee Style',
    'luxury watch retailer Pakistan',
    'authentic watches',
    'watch company Pakistan',
    'tick.teestyle',
    'premium watches Pakistan',
    'COD watches',
  ],
  openGraph: {
    title: 'About TickTee Style - Premium Watch Retailer in Pakistan',
    description: 'Pakistan\'s trusted luxury watch retailer. 100% authentic timepieces, nationwide delivery, COD available.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
};

const features = [
  {
    icon: Award,
    title: 'Authentic Products',
    description: 'We guarantee 100% authenticity on all our luxury watches. Every product is verified and comes with a certificate of authenticity.',
  },
  {
    icon: Shield,
    title: 'Secure Shopping',
    description: 'Your payment and personal information are protected with industry-leading security measures.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over Rs. 5,000. Express delivery available for urgent orders.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our customer service team is available around the clock to assist you with any questions or concerns.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About TickTee Style
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where Time Meets Trend - Your trusted destination for authentic luxury watches
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-gray-600">Follow us on</span>
            <InstagramLink variant="inline" showIcon />
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card padding="large">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
              <p>
                Founded with a passion for precision and elegance, TickTee Style has been at the
                forefront of luxury watch retailing for over a decade. We believe that a watch is
                more than just a timepiece—it's a statement of style, a symbol of achievement, and
                a companion for life's most important moments.
              </p>
              <p>
                Our curated collection features over 3000+ authentic luxury watches from the world's
                most prestigious brands. Each timepiece is carefully selected to meet our exacting
                standards for quality, craftsmanship, and authenticity.
              </p>
              <p>
                At TickTee Style, we're committed to providing an exceptional shopping experience
                that matches the quality of our products. From expert guidance to seamless delivery,
                we ensure every interaction exceeds your expectations.
              </p>
            </div>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose TickTee Style?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} hover padding="medium" className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-4xl mx-auto">
          <Card padding="large">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Authenticity</h3>
                <p>
                  Every watch in our collection is 100% authentic, verified by our expert team and
                  backed by our authenticity guarantee.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
                <p>
                  We strive for excellence in every aspect of our business, from product selection
                  to customer service.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
                <p>
                  Your satisfaction is our top priority. We're committed to providing exceptional
                  service and support at every step of your journey with us.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}




