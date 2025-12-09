/**
 * Configuration Constants
 * Centralized access to environment variables
 */

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

function validateEnv() {
  const missing = requiredEnvVars.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0 && process.env.NODE_ENV !== 'development') {
    console.warn(
      `⚠️  Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

validateEnv();

// Site Configuration
export const config = {
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://tickteestyle.com',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'TickTee Style',
  },

  // Contact Information
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+923150374729',
    email: process.env.NEXT_PUBLIC_EMAIL || 'support@tickteestyle.com',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || '@tick.teestyle',
  },

  // Payment
  payment: {
    mobileWalletNumber: process.env.NEXT_PUBLIC_MOBILE_WALLET_NUMBER || '03150374729',
    codFee: 200, // Rs. 200 COD fee
    freeShippingThreshold: 5000, // Free shipping above Rs. 5,000
    shippingFee: 200, // Standard shipping Rs. 200
  },

  // Analytics
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    logRocketId: process.env.NEXT_PUBLIC_LOGROCKET_ID || '',
  },

  // Features
  features: {
    enableAnalytics: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    enableErrorTracking: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    enableSessionRecording: !!process.env.NEXT_PUBLIC_LOGROCKET_ID,
  },

  // Business Hours
  businessHours: {
    weekday: '10:00 AM - 8:00 PM',
    weekend: '12:00 PM - 6:00 PM',
    timezone: 'PKT',
  },
} as const;

// Export individual constants for convenience
export const SITE_URL = config.site.url;
export const SITE_NAME = config.site.name;
export const CONTACT_PHONE = config.contact.phone;
export const CONTACT_EMAIL = config.contact.email;
export const INSTAGRAM_HANDLE = config.contact.instagram;

export default config;
