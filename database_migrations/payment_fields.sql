-- Migration: Add payment fields to orders table
-- Run this SQL in your Supabase SQL Editor

-- Add payment-related columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS payment_proof_url text,
ADD COLUMN IF NOT EXISTS transaction_id text,
ADD COLUMN IF NOT EXISTS payment_verified boolean DEFAULT false;

-- Update existing orders to have default values
UPDATE orders 
SET payment_method = 'cod', payment_verified = true 
WHERE payment_method IS NULL AND status = 'pending';

-- Add index for faster queries on payment status
CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
ON orders(status) 
WHERE status IN ('awaiting_payment', 'payment_verified', 'payment_rejected');

CREATE INDEX IF NOT EXISTS idx_orders_payment_method 
ON orders(payment_method);

-- Create storage bucket for payment proofs (run in Supabase Dashboard Storage section)
-- Bucket name: payment-proofs
-- Public: No (Private)
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, application/pdf

-- Storage policies for payment-proofs bucket
-- Policy 1: Users can upload their own payment proofs
CREATE POLICY "Users can upload own payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND auth.role() = 'authenticated'
);

-- Policy 2: Users can view their own payment proofs
CREATE POLICY "Users can view own payment proofs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-proofs'
  AND (
    -- Users can view if they own the order
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.payment_proof_url LIKE '%' || storage.objects.name || '%'
      AND orders.user_id = auth.uid()
    )
    OR
    -- Admins can view all (you'll need to add admin role check later)
    auth.role() = 'authenticated'
  )
);

-- Policy 3: Users can delete their own payment proofs (before verification)
CREATE POLICY "Users can delete own payment proofs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'payment-proofs'
  AND EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.payment_proof_url LIKE '%' || storage.objects.name || '%'
    AND orders.user_id = auth.uid()
    AND orders.status = 'awaiting_payment'
  )
);

-- Note: After running this migration, update your order status enum if needed
-- The status field already supports the new statuses: 'awaiting_payment', 'payment_verified', 'payment_rejected'




