/**
 * Payment helper functions
 * Handles payment proof uploads, verification, and payment-related operations
 */

import { createClient } from './client';
import { createServerClient } from './server';
import { Order } from '@/types/database.types';

/**
 * Upload payment proof to Supabase Storage
 * Uploads to payment-proofs/userId/ folder for privacy
 */
export async function uploadPaymentProof(
  file: File,
  orderId: string,
  userId: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const supabase = createClient();

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      return {
        url: null,
        error: 'Invalid file type. Please upload a JPG, PNG, or PDF file.',
      };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        url: null,
        error: 'File size exceeds 5MB limit.',
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `payment-proofs/${userId}/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from('payment-proofs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading payment proof:', error);
      return { url: null, error: error.message };
    }

    // Get signed URL (bucket is private)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('payment-proofs')
      .createSignedUrl(filePath, 31536000); // 1 year expiry

    if (urlError || !urlData) {
      return { url: null, error: 'Failed to generate file URL' };
    }

    return { url: urlData.signedUrl };
  } catch (error: any) {
    console.error('Error uploading payment proof:', error);
    return { url: null, error: error.message || 'Failed to upload payment proof' };
  }
}

/**
 * Get payment proof URL for an order
 */
export async function getPaymentProofUrl(
  orderId: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const supabase = await createServerClient();

    const { data: order, error } = await supabase
      .from('orders')
      .select('payment_proof_url')
      .eq('id' as any, orderId as any)
      .single();

    if (error || !order) {
      return { url: null, error: error?.message || 'Order not found' };
    }

    return { url: (order as any).payment_proof_url };
  } catch (error: any) {
    console.error('Error getting payment proof URL:', error);
    return { url: null, error: error.message || 'Failed to get payment proof' };
  }
}

/**
 * Verify payment for an order
 * Sets payment_verified=true and status='processing'
 */
export async function verifyPayment(
  orderId: string,
  adminId: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();

    // Update order
    const { error } = await (supabase
      .from('orders')
      .update as any)({
        payment_verified: true,
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id' as any, orderId as any);

    if (error) {
      console.error('Error verifying payment:', error);
      return { success: false, error: error.message };
    }

    // Log admin action (you can create an admin_actions table for this)
    console.log(`Payment verified for order ${orderId} by admin ${adminId}. Notes: ${notes || 'N/A'}`);

    return { success: true };
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return { success: false, error: error.message || 'Failed to verify payment' };
  }
}

/**
 * Reject payment for an order
 */
export async function rejectPayment(
  orderId: string,
  reason: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();

    // Update order
    const { error } = await (supabase
      .from('orders')
      .update as any)({
        payment_verified: false,
        status: 'payment_rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id' as any, orderId);

    if (error) {
      console.error('Error rejecting payment:', error);
      return { success: false, error: error.message };
    }

    // Log admin action
    console.log(`Payment rejected for order ${orderId} by admin ${adminId}. Reason: ${reason}`);

    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting payment:', error);
    return { success: false, error: error.message || 'Failed to reject payment' };
  }
}

/**
 * Get orders awaiting payment verification
 */
export async function getOrdersAwaitingPayment(): Promise<{
  orders: Order[];
  error?: string;
}> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status' as any, 'awaiting_payment' as any)
      .order('created_at' as any, { ascending: false });

    if (error) {
      console.error('Error fetching orders awaiting payment:', error);
      return { orders: [], error: error.message };
    }

    return { orders: (data as unknown as Order[]) || [] };
  } catch (error: any) {
    console.error('Error fetching orders awaiting payment:', error);
    return { orders: [], error: error.message || 'Failed to fetch orders' };
  }
}