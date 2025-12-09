/**
 * Admin Product API route (single product)
 * Handles GET, PUT, and DELETE for individual products
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/lib/supabase/admin';
import { deleteProductImage } from '@/lib/supabase/storage';
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

    const { product, error } = await getProductById(params.id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error fetching product:', error);
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

    // Check if product exists
    const { product: existingProduct, error: fetchError } = await getProductById(
      params.id
    );

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate price if provided
    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price <= 0) {
        return NextResponse.json(
          { error: 'Price must be a positive number' },
          { status: 400 }
        );
      }
    }

    // Validate stock if provided
    if (body.stock !== undefined) {
      if (typeof body.stock !== 'number' || body.stock < 0) {
        return NextResponse.json(
          { error: 'Stock must be a non-negative number' },
          { status: 400 }
        );
      }
    }

    // Validate category if provided
    if (body.category) {
      const validCategories = ["Men's Watches", "Women's Watches", 'Luxury Collection', 'Sports Watches'];
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
    }

    // Handle image update - prefer image_urls, fallback to image_url
    const newImageUrls = body.image_urls && Array.isArray(body.image_urls) && body.image_urls.length > 0
      ? body.image_urls
      : body.image_url
      ? [body.image_url]
      : null;

    // Get old images for deletion
    const oldImageUrls = existingProduct.image_urls && existingProduct.image_urls.length > 0
      ? existingProduct.image_urls
      : existingProduct.image_url
      ? [existingProduct.image_url]
      : [];

    // Determine which images to delete (images that are no longer in the new list)
    const imagesToDelete: string[] = [];
    if (newImageUrls && newImageUrls.length > 0) {
      oldImageUrls.forEach((oldUrl) => {
        if (!newImageUrls.includes(oldUrl)) {
          imagesToDelete.push(oldUrl);
        }
      });
    }

    // Prepare update data
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.brand !== undefined) updateData.brand = body.brand.trim();
    if (body.price !== undefined) updateData.price = body.price;
    if (body.description !== undefined) updateData.description = body.description.trim();
    if (body.category !== undefined) updateData.category = body.category;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (newImageUrls && newImageUrls.length > 0) {
      updateData.image_url = newImageUrls[0]; // First image as primary for backward compatibility
      updateData.image_urls = newImageUrls;
    } else if (body.image_url !== undefined) {
      // Fallback for backward compatibility
      updateData.image_url = body.image_url;
    }

    // Update product
    const { product, error: updateError } = await updateProduct(params.id, updateData);

    if (updateError || !product) {
      return NextResponse.json(
        { error: updateError || 'Failed to update product' },
        { status: 500 }
      );
    }

    // Delete old images that were removed
    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map((url) => deleteProductImage(url))
      );
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin access
    const adminCheck = await requireAdmin();
    if ('response' in adminCheck) {
      return adminCheck.response;
    }

    // Get product to access image URL
    const { product, error: fetchError } = await getProductById(params.id);

    if (fetchError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product
    const { success, error: deleteError } = await deleteProduct(params.id);

    if (deleteError || !success) {
      return NextResponse.json(
        { error: deleteError || 'Failed to delete product' },
        { status: 500 }
      );
    }

    // Delete all images from storage
    const imagesToDelete = product.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : product.image_url
      ? [product.image_url]
      : [];

    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map((url) => deleteProductImage(url))
      );
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}




