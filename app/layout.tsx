import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import ModernFooter from "@/components/layout/ModernFooter";
import BackToTop from "@/components/layout/BackToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tickteestyle.com'),
  title: {
    default: "TickTee Style - Luxury Watches Online",
    template: "%s | TickTee Style",
  },
  description: "Discover premium watches with styles for every occasion. Over 3000+ authentic timepieces. Fast delivery, secure payment, easy returns.",
  keywords: ["luxury watches", "premium timepieces", "watch shop", "authentic watches", "luxury timepieces", "premium watches", "watch collection", "designer watches"],
  authors: [{ name: "TickTee Style" }],
  creator: "TickTee Style",
  publisher: "TickTee Style",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tickteestyle.com",
    siteName: "TickTee Style",
    title: "TickTee Style - Luxury Watches Online",
    description: "Discover premium watches with styles for every occasion. Over 3000+ authentic timepieces. Fast delivery, secure payment, easy returns.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TickTee Style - Luxury Watches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TickTee Style - Luxury Watches Online",
    description: "Discover premium watches with styles for every occasion. Over 3000+ authentic timepieces.",
    images: ["/og-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#1e3a8a",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TickTee Style',
              url: 'https://tickteestyle.com',
              logo: 'https://tickteestyle.com/logo.png',
              description: 'Premium luxury watches for the discerning collector',
              sameAs: [
                'https://www.facebook.com/tickteestyle',
                'https://www.instagram.com/tickteestyle',
                'https://www.twitter.com/tickteestyle',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-234-567-8900',
                contactType: 'Customer Service',
                areaServed: 'Worldwide',
                availableLanguage: ['English'],
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-background-light min-h-screen flex flex-col`}>
        {/* Skip to main content for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        
        <ErrorBoundary>
          <Navbar />
          
          <main id="main-content" role="main" className="flex-grow" tabIndex={-1}>
            {children}
          </main>
          
          <ModernFooter />
          <BackToTop />
        </ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1e3a8a',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}


