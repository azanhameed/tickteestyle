-- Migration: Add support for multiple product images
-- Run this SQL in your Supabase SQL Editor

-- Add image_urls column to products table (JSONB array)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb;

-- Migrate existing image_url data to image_urls array
-- This ensures backward compatibility
UPDATE products 
SET image_urls = CASE 
  WHEN image_url IS NOT NULL THEN jsonb_build_array(image_url)
  ELSE '[]'::jsonb
END
WHERE image_urls IS NULL OR image_urls = '[]'::jsonb;

-- Create index for faster queries on image_urls
CREATE INDEX IF NOT EXISTS idx_products_image_urls 
ON products USING GIN (image_urls);

-- Add comment to document the column
COMMENT ON COLUMN products.image_urls IS 'Array of product image URLs. The first image is the primary image.';

