/**
 * Google Analytics Integration
 * Track page views, events, and e-commerce
 */

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * Initialize Google Analytics
 */
export function initGA(): void {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function gtag() {
      (window as any).dataLayer.push(arguments);
    };
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    });
  }
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
  if (typeof window !== 'undefined') {
    if (GA_MEASUREMENT_ID && (window as any).gtag) {
      (window as any).gtag('config', GA_MEASUREMENT_ID, { page_path: url });
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Page view:', url);
    }
  }
}

/**
 * Track custom event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    if (GA_MEASUREMENT_ID && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Event:', eventName, properties);
    }
  }
}

/**
 * Track purchase/transaction
 */
export function trackPurchase(orderId: string, amount: number, items?: Array<{ id: string; name: string; price: number; quantity: number }>) {
  if (typeof window !== 'undefined') {
    if (GA_MEASUREMENT_ID && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: orderId,
        value: amount,
        currency: 'PKR',
        items: items,
      });
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Purchase:', { orderId, amount, items });
    }
  }
}

/**
 * Track add to cart
 */
export function trackAddToCart(productId: string, productName: string, price: number) {
  trackEvent('add_to_cart', {
    product_id: productId,
    product_name: productName,
    price,
  });
}

/**
 * Track search
 */
export function trackSearch(searchTerm: string, resultsCount?: number) {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}




