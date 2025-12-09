/**
 * Health check endpoint
 * Returns API status and timestamp
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'TickTee Style API',
  });
}




