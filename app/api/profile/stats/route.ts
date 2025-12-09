/**
 * Profile stats API route
 * Returns user statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
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

    // Fetch orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .eq('user_id', user.id as any)
   //  <-- FIXED HERE

    if (ordersError) {
      console.error('Error fetching orders for stats:', ordersError);
    }

    const orderList = orders || [];
    const totalOrders = orderList.length;
    const totalSpent = orderList.reduce(
      (sum, order: any) => sum + (order as any).total_amount,
      0
    );
    const memberSince = user.created_at || new Date().toISOString();

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        totalSpent,
        memberSince,
      },
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
