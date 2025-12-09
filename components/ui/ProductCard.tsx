'use client';

/**
 * Reusable product card component
 * Displays product information with hover effects and actions
 * Optimized with React.memo to prevent unnecessary re-renders
 */

import { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, Watch } from 'lucide-react';
import { Product } from '@/types/database.types';
import { formatPrice } from '@/utils/formatters';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'react-hot-toast';
import Button from './Button';

export interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
  showAddToCart?: boolean;
  priority?: boolean;
}

function ProductCard({
  product,
  isLoading = false,
  showAddToCart = true,
  priority = false,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCartStore();

  const isOutOfStock = (product.stock ?? 0) === 0;
  // Get first image from image_urls array, fallback to image_url for backward compatibility
  const primaryImage = product.image_urls && product.image_urls.length > 0
    ? product.image_urls[0]
    : product.image_url || null;
  const imageUrl = primaryImage && !imageError ? primaryImage : '/placeholder-watch.jpg';

  // Memoize the add to cart handler to prevent re-creation on every render
  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      addItem(product, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  }, [isOutOfStock, product, addItem]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-5 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
      <Link href={`/shop/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/')) ? (
            <Image
              src={imageUrl}
              alt={`${product.name} - ${product.brand} watch`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading={priority ? 'eager' : 'lazy'}
              priority={priority}
              quality={85}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <Watch className="w-16 h-16 text-primary/40" />
            </div>
          )}

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Eye className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-sm text-gray-500 font-medium mb-1">{product.brand || 'Brand'}</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name || 'Product Name'}
          </h3>
          <p className="text-2xl font-bold text-primary mb-4">{formatPrice(product.price || 0)}</p>

          {/* Actions */}
          {showAddToCart && (
            <Button
              variant="primary"
              size="small"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart}
              isLoading={isAddingToCart}
              leftIcon={<ShoppingCart className="w-4 h-4" />}
              className="w-full"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </Link>
    </div>
  );
}

// Memoize component to prevent re-renders when props haven't changed
export default memo(ProductCard, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if these props change
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.showAddToCart === nextProps.showAddToCart &&
    prevProps.priority === nextProps.priority
  );
});