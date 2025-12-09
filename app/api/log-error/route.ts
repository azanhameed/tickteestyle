/**
 * Example API Route with Rate Limiting
 * Apply this pattern to all API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, RateLimits } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimit(RateLimits.contact)(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await req.json();
    
    // Your API logic here
    // Example: send contact form email
    
    return NextResponse.json(
      { message: 'Success' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
