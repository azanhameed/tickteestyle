/**
 * API Rate Limiting Middleware
 * Prevents abuse and protects Supabase quota
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (use Redis in production)
const rateLimitStore: RateLimitStore = {};

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;  // Max requests per window
  windowMs: number;     // Time window in milliseconds
  message?: string;     // Custom error message
}

/**
 * Rate limiting middleware for API routes
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    maxRequests,
    windowMs,
    message = 'Too many requests. Please try again later.',
  } = config;

  return async (req: NextRequest): Promise<NextResponse | null> => {
    // Get client identifier (IP address or user ID)
    const identifier = getClientIdentifier(req);
    const now = Date.now();

    // Get or create rate limit entry
    if (!rateLimitStore[identifier]) {
      rateLimitStore[identifier] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    const entry = rateLimitStore[identifier];

    // Reset if window expired
    if (entry.resetTime < now) {
      entry.count = 0;
      entry.resetTime = now + windowMs;
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      return NextResponse.json(
        {
          error: message,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    const remaining = Math.max(0, maxRequests - entry.count);
    
    return null; // Continue to handler with headers to be added
  };
}

/**
 * Get client identifier from request
 */
function getClientIdentifier(req: NextRequest): string {
  // Try to get IP address
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
  
  // For authenticated requests, use user ID (more accurate)
  // const userId = req.headers.get('x-user-id');
  // return userId || ip;
  
  return ip;
}

/**
 * Pre-configured rate limits for different endpoints
 */
export const RateLimits = {
  // General API endpoints
  standard: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // Authentication endpoints
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 5 requests per 15 minutes
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  
  // Contact form
  contact: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 3 requests per hour
    message: 'Too many contact form submissions. Please try again later.',
  },
  
  // Order placement
  orders: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 10 orders per hour
    message: 'Order limit reached. Please contact support if you need assistance.',
  },
  
  // Admin operations
  admin: {
    maxRequests: 200,
    windowMs: 15 * 60 * 1000, // 200 requests per 15 minutes
  },
  
  // Public read endpoints (shop, products)
  public: {
    maxRequests: 300,
    windowMs: 15 * 60 * 1000, // 300 requests per 15 minutes
  },
};

/**
 * Middleware wrapper for easy integration
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const rateLimitResponse = await rateLimit(config)(req);
    
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    return handler(req);
  };
}
