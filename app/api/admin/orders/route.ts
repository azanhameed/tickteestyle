/**
 * Admin Orders API route
 * Handles GET (list all orders)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-check';

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await requireAdmin();
    if ('response' in adminCheck) {
      return adminCheck.response;
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters = {
      status: searchParams.get('status') || undefined,
      payment_method: searchParams.get('payment_method') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    // Fetch orders with filters
    const { orders, total, error } = await getAllOrders(filters as any);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      orders,
      total,
      page: filters.page,
      limit: filters.limit,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}




