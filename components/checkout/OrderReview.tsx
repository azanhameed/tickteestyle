'use client';

/**
 * Order review component
 * Displays cart items in compact view for checkout
 */

import Link from 'next/link';
import Image from 'next/image';
import { Edit, Watch } from 'lucide-react';
import { CartItem } from '@/lib/store/cartStore';
import { formatPrice } from '@/utils/formatters';

export interface OrderReviewProps {
  cartItems: CartItem[];
}

export default function OrderReview({ cartItems }: OrderReviewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Review</h3>
        <Link
          href="/cart"
          className="text-sm text-primary hover:text-primary-dark flex items-center space-x-1 transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Cart</span>
        </Link>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => {
          // Get first image from image_urls array, fallback to image_url for backward compatibility
          const primaryImage = item.product.image_urls && item.product.image_urls.length > 0
            ? item.product.image_urls[0]
            : item.product.image_url || null;
          const imageUrl = primaryImage || '/placeholder-watch.jpg';
          const subtotal = item.product.price * item.quantity;

          return (
            <div
              key={item.id}
              className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              {/* Product Image */}
              <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                {imageUrl && imageUrl.startsWith('http') ? (
                  <Image
                    src={imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Watch className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500">{item.product.brand}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Qty: {item.quantity} × {formatPrice(item.product.price)}
                </p>
              </div>

              {/* Subtotal */}
              <div className="text-sm font-semibold text-gray-900 text-right">
                {formatPrice(subtotal)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Items Count */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Total: <span className="font-semibold text-gray-900">{cartItems.length}</span> item
          {cartItems.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}


