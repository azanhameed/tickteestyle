/**
 * Order details API route
 * Fetches order details with items
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient();

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order and verify ownership
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId as any)
      .eq('user_id', user.id as any)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json(
        { success: false, error: orderError?.message || 'Order not found' },
        { status: 404 }
      );
    }

    // Fetch order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId as any);

    if (itemsError) {
      return NextResponse.json(
        { success: false, error: itemsError.message },
        { status: 500 }
      );
    }

    const order = orderData as any;
    const items = itemsData as any || [];

    if (orderError || !orderData) {
      return NextResponse.json(
        { success: false, error: (orderError as any)?.message || 'Order not found' },
        { status: 404 }
      );
    }

    // Fetch product details for each item
    const itemsWithProducts = await Promise.all(
      items.map(async (item: any) => {
        const { data: product } = await supabase
          .from('products')
          .select('id, name, brand, image_url')
          .eq('id', item.product_id)
          .single();

        return {
          ...item,
          product: product || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      order,
      items: itemsWithProducts,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

