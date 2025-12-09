/**
 * Modern Simplified Footer Component
 * Clean 2025 design with essential links and social media
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Watch, Mail, Instagram, Facebook, Twitter, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import InstagramLink from '@/components/ui/InstagramLink';

export default function ModernFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // TODO: Integrate with email service
    setTimeout(() => {
      toast.success('Welcome to TickTee Style! 🎉');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-primary via-primary-dark to-black text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left: Brand & Description */}
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 group"
              aria-label="TickTee Style Home"
            >
              <div className="bg-secondary/20 p-3 rounded-xl group-hover:bg-secondary/30 transition-all duration-300 group-hover:scale-110">
                <Watch className="w-8 h-8 text-secondary" />
              </div>
              <span className="text-2xl font-bold">TickTee Style</span>
            </Link>
            
            <p className="text-white/80 text-lg max-w-md">
              Where Time Meets Trend. Discover luxury watches that define elegance and precision.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <Link
                href="https://www.instagram.com/tick.teestyle/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all duration-300 group"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" fill="white" />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-500 transition-all duration-300 group"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" fill="white" />
              </Link>
            </div>
          </div>

          {/* Right: Newsletter + Quick Links */}
          <div className="space-y-8">
            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Mail className="w-5 h-5 text-secondary" />
                <span>Join Our Newsletter</span>
              </h3>
              <p className="text-white/70 mb-4">
                Get exclusive deals and updates on new collections.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-secondary text-primary rounded-lg hover:bg-secondary-light transition-all duration-300 font-semibold flex items-center space-x-2 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <Link
                href="/shop"
                className="text-white/80 hover:text-secondary transition-colors font-medium"
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="text-white/80 hover:text-secondary transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href="/faq"
                className="text-white/80 hover:text-secondary transition-colors font-medium"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-white/80 hover:text-secondary transition-colors font-medium"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm text-center md:text-left">
              © {currentYear} TickTee Style. Crafted with ❤️ in Pakistan.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-white/60">Follow us on</span>
              <InstagramLink variant="inline" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
