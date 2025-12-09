/**
 * Admin Pending Payments API route
 * Returns orders awaiting payment verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrdersAwaitingPayment } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-check';

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await requireAdmin();
    if ('response' in adminCheck) {
      return adminCheck.response;
    }

    // Fetch orders awaiting payment (already includes customer info)
    const { orders, error } = await getOrdersAwaitingPayment();

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching pending payments:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}




