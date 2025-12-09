/**
 * Supabase Storage helper functions
 * Handles product image uploads and deletions
 * Uses client-side Supabase for browser-based uploads
 */

import { createClient } from './client';

/**
 * Upload a product image to Supabase Storage
 * @param file - The image file to upload
 * @returns Promise with the public URL of the uploaded image
 */
export async function uploadProductImage(
  file: File
): Promise<{ url: string | null; error?: string }> {
  try {
    const supabase = createClient();

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        url: null,
        error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
      };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        url: null,
        error: 'File size exceeds 5MB limit. Please upload a smaller image.',
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl };
  } catch (error: any) {
    console.error('Error uploading product image:', error);
    return { url: null, error: error.message || 'Failed to upload image' };
  }
}

/**
 * Delete a product image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 * @returns Promise indicating success or failure
 */
export async function deleteProductImage(
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Extract file path from URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/product-images/[filename]
    const urlParts = imageUrl.split('/product-images/');
    if (urlParts.length !== 2) {
      return { success: false, error: 'Invalid image URL format' };
    }

    const fileName = urlParts[1];
    const filePath = `product-images/${fileName}`;

    // Delete file
    const { error } = await supabase.storage.from('product-images').remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product image:', error);
    return { success: false, error: error.message || 'Failed to delete image' };
  }
}

/**
 * Get public URL for a file in storage
 * @param bucketName - Name of the storage bucket
 * @param filePath - Path to the file within the bucket
 * @returns Public URL string
 */
export function getPublicUrl(bucketName: string, filePath: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}




