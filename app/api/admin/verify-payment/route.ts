/**
 * Admin Payment Verification API
 * Handles payment verification and rejection
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { verifyPayment, rejectPayment } from '@/lib/supabase/payments';
import { sendPaymentVerified, sendPaymentRejected } from '@/lib/email';
import { requireAdmin } from '@/lib/auth/admin-check';

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await requireAdmin();
    if ('response' in adminCheck) {
      return adminCheck.response;
    }

    const supabase = await createServerClient();

    // Parse request body
    const body = await request.json();

    if (!body.orderId || body.verified === undefined) {
      return NextResponse.json(
        { error: 'Order ID and verification status are required' },
        { status: 400 }
      );
    }

    // Get order details
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', body.orderId)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get customer email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', (orderData as any).user_id)
      .single();

    const customerEmail = (profile as any)?.email || null;

    if (body.verified) {
      // Verify payment
      const { success, error } = await verifyPayment(
        body.orderId,
        adminCheck.userId,
        body.adminNotes
      );

      if (!success) {
        return NextResponse.json(
          { error: error || 'Failed to verify payment' },
          { status: 500 }
        );
      }

      // Send confirmation email
      if (customerEmail) {
        await sendPaymentVerified(orderData as any, customerEmail);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      // Reject payment
      if (!body.rejectionReason) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }

      const { success, error } = await rejectPayment(
        body.orderId,
        body.rejectionReason,
        adminCheck.userId
      );

      if (!success) {
        return NextResponse.json(
          { error: error || 'Failed to reject payment' },
          { status: 500 }
        );
      }

      // Send rejection email
      if (customerEmail) {
        await sendPaymentRejected(orderData as any, customerEmail, body.rejectionReason);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment rejected',
      });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}