'use client';

/**
 * Cart item component
 * Displays product in cart with quantity controls and remove button
 */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Watch } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/store/cartStore';
import { formatPrice } from '@/utils/formatters';
import QuantitySelector from '@/components/ui/QuantitySelector';

export interface CartItemProps {
  cartItem: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
  isUpdating?: boolean;
}

export default function CartItem({
  cartItem,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const { product, quantity } = cartItem;
  const subtotal = product.price * quantity;
  const maxQuantity = product.stock;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity > maxQuantity) {
      return;
    }
    await onUpdateQuantity(product.id, newQuantity);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(product.id);
    setIsRemoving(false);
  };

  // Get first image from image_urls array, fallback to image_url for backward compatibility
  const primaryImage = product.image_urls && product.image_urls.length > 0
    ? product.image_urls[0]
    : product.image_url || null;
  const imageUrl = primaryImage || '/placeholder-watch.jpg';

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 md:p-6 transition-all ${
        isRemoving ? 'opacity-50' : 'hover:shadow-md'
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Product Image */}
        <Link
          href={`/shop/${product.id}`}
          className="flex-shrink-0 w-full md:w-32 h-32 relative rounded-lg overflow-hidden bg-gray-100 group"
        >
          {imageUrl && imageUrl.startsWith('http') ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <Watch className="w-12 h-12 text-primary/40" />
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <Link
              href={`/shop/${product.id}`}
              className="block mb-2 hover:text-primary transition-colors"
            >
              <p className="text-sm text-secondary font-semibold mb-1">{product.brand}</p>
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            </Link>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Unit Price: {formatPrice(product.price)}</span>
              {product.stock < 10 && product.stock > 0 && (
                <span className="text-orange-600">Only {product.stock} left</span>
              )}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Quantity Selector */}
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-2 md:hidden">
                Quantity
              </label>
              <QuantitySelector
                value={quantity}
                min={1}
                max={maxQuantity}
                onChange={handleQuantityChange}
                disabled={isUpdating || isRemoving}
              />
            </div>

            {/* Subtotal */}
            <div className="flex-shrink-0 text-right">
              <p className="text-sm text-gray-600 mb-1 md:hidden">Subtotal</p>
              <p className="text-xl font-bold text-primary">{formatPrice(subtotal)}</p>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Out of Stock Warning */}
      {product.stock === 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">
            This item is out of stock and will be removed from your cart
          </p>
        </div>
      )}
    </div>
  );
}


