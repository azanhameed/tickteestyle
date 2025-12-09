/**
 * Admin Order API route (single order)
 * Handles GET (fetch order details) and PUT (update order status)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrderWithDetails, updateOrderStatus } from '@/lib/supabase/admin';
import { OrderStatus } from '@/types/database.types';
import { requireAdmin } from '@/lib/auth/admin-check';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin access
    const adminCheck = await requireAdmin();
    if ('response' in adminCheck) {
      return adminCheck.response;
    }

    const { order, items, error } = await getOrderWithDetails(params.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order, items });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin access
    const adminCheck = await requireAdmin();
    if ('response' in adminCheck) {
      return adminCheck.response;
    }

    // Parse request body
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Validate status
    const validStatuses: OrderStatus[] = [
      'pending',
      'awaiting_payment',
      'payment_verified',
      'payment_rejected',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update order status
    const { success, error: updateError } = await updateOrderStatus(
      params.id,
      body.status
    );

    if (updateError || !success) {
      return NextResponse.json(
        { error: updateError || 'Failed to update order status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Order status updated' });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}




