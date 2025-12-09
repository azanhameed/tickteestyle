/**
 * Orders API route
 * Handles order creation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createOrder, createOrderItems } from '@/lib/supabase/orders';
import { CreateOrderRequest } from '@/types/order.types';

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body: CreateOrderRequest = await request.json();

    // Validate request body
    if (!body.shippingAddress || !body.cartItems || body.cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Validate shipping address
    const { shippingAddress } = body;
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.streetAddress ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required shipping address fields' },
        { status: 400 }
      );
    }

    // Verify cart items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of body.cartItems) {
      // Verify product exists and get current price
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id' as any, cartItem.productId)
        .single();

      if (productError || !product) {
        return NextResponse.json(
          { success: false, error: `Product ${cartItem.productId} not found` },
          { status: 400 }
        );
      }

      // Verify stock availability
      if ((product as any).stock < cartItem.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for ${(product as any).name}. Available: ${(product as any).stock}`,
          },
          { status: 400 }
        );
      }

      // Use current product price (prevent price manipulation)
      const itemPrice = (product as any).price;
      const itemTotal = itemPrice * cartItem.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: itemPrice,
        productName: (product as any).name,
      });
    }

    // Validate payment method
    const validPaymentMethods = ['cod', 'jazzcash', 'easypaisa'];
    const paymentMethod = body.paymentMethod || 'cod';
    
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Validate payment fields based on method
    if (paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') {
      if (!body.transactionId) {
        return NextResponse.json(
          { success: false, error: 'Transaction ID is required' },
          { status: 400 }
        );
      }
    }

    // Calculate tax and shipping
    const tax = totalAmount * 0.1; // 10% tax
    const baseShipping = totalAmount >= 5000 ? 0 : 200;
    const codFee = paymentMethod === 'cod' ? 200 : 0;
    const shipping = baseShipping + codFee;
    const finalTotal = totalAmount + tax + shipping;

    // Determine initial order status based on payment method
    let initialStatus: string;
    if (paymentMethod === 'cod') {
      initialStatus = 'pending'; // Confirmed immediately
    } else {
      initialStatus = 'awaiting_payment'; // Needs verification
    }

    // Add order reference to shipping address if provided
    const shippingDataWithRef = { ...shippingAddress };
    if (body.orderReference) {
      (shippingDataWithRef as any).orderReference = body.orderReference;
    }

    // Create order
    const { order, error: orderError } = await createOrder(user.id, {
      userId: user.id,
      totalAmount: finalTotal,
      shippingAddress: shippingDataWithRef,
      paymentMethod: paymentMethod,
      status: initialStatus as any,
      paymentProofUrl: body.paymentProofUrl || null,
      transactionId: body.transactionId || null,
    });

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: orderError || 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItemsData = orderItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      productName: item.productName,
    }));

    const { success: itemsSuccess, error: itemsError } = await createOrderItems(
      order.id,
      orderItemsData
    );

    if (!itemsSuccess) {
      // Rollback: delete the order if items creation fails
      await supabase.from('orders').delete().eq('id' as any, order.id);
      return NextResponse.json(
        { success: false, error: itemsError || 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Update product stock
    for (const item of orderItems) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id' as any, item.productId)
        .single();

      if (product) {
        await (supabase
          .from('products')
          .update as any)({ stock: (product as any).stock - item.quantity })
          .eq('id' as any, item.productId);
      }
    }

    // Clear user's cart
    await supabase.from('cart_items').delete().eq('user_id' as any, user.id);

    // Send order confirmation email
    try {
      const { sendOrderConfirmation } = await import('@/lib/email');
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id' as any, user.id)
        .single();
      
      if (profile && (profile as any).email) {
        await sendOrderConfirmation(order as any, (profile as any).email);
      }
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}