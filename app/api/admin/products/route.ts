/**
 * Admin Products API route
 * Handles GET (list products) and POST (create product)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/supabase/admin';
import { ProductFilters } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-check';

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await requireAdmin();
    if ('response' in adminCheck) {
      return adminCheck.response;
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters: ProductFilters = {
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as ProductFilters['sortBy']) || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    // Fetch products
    const { products, total, error } = await getAllProducts(filters);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      products,
      total,
      page: filters.page,
      limit: filters.limit,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await requireAdmin();
    if ('response' in adminCheck) {
      return adminCheck.response;
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.brand || !body.price || !body.description || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate price
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Validate stock
    if (typeof body.stock !== 'number' || body.stock < 0) {
      return NextResponse.json(
        { error: 'Stock must be a non-negative number' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["Men's Watches", "Women's Watches", 'Luxury Collection', 'Sports Watches'];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate images - prefer image_urls, fallback to image_url for backward compatibility
    const imageUrls = body.image_urls && Array.isArray(body.image_urls) && body.image_urls.length > 0
      ? body.image_urls
      : body.image_url
      ? [body.image_url]
      : [];

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one product image is required' },
        { status: 400 }
      );
    }

    // Create product
    const { product, error: createError } = await createProduct({
      name: body.name.trim(),
      brand: body.brand.trim(),
      price: body.price,
      description: body.description.trim(),
      category: body.category,
      stock: body.stock,
      image_url: imageUrls[0], // First image as primary for backward compatibility
      image_urls: imageUrls,
    });

    if (createError || !product) {
      return NextResponse.json(
        { error: createError || 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}




