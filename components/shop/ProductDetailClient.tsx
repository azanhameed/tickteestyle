'use client';

/**
 * Product detail client component
 * Handles image gallery, quantity selection, and add to cart
 */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Check, Star } from 'lucide-react';
import { Product } from '@/types/database.types';
import { formatPrice } from '@/utils/formatters';
import { useCartStore } from '@/lib/store/cartStore';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';
import SocialShare from '@/components/ui/SocialShare';

export interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCartStore();
  const supabase = createClient();

  // Handle multiple images - prefer image_urls, fallback to image_url for backward compatibility
  const images = product.image_urls && product.image_urls.length > 0
    ? product.image_urls
    : product.image_url
    ? [product.image_url]
    : [];

  const currentImage = images[selectedImage] || '/placeholder-watch.jpg';

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity, supabase);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <>
      {/* Product Main Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              {currentImage && !imageError ? (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={() => setImageError(true)}
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <span className="text-6xl">⌚</span>
                </div>
              )}

              {/* Stock Badge */}
              {isOutOfStock && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Thumbnail Images (if multiple) */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setImageError(false);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <div>
              <p className="text-secondary font-semibold text-lg mb-2">{product.brand}</p>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex-1">
                  {product.name}
                </h1>
                <SocialShare
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={`${product.name} - ${product.brand}`}
                  description={product.description || `Check out this amazing ${product.category} from ${product.brand}!`}
                  image={currentImage}
                  hashtags={['TickTeeStyle', 'PakistanWatches', product.brand.replace(/\s+/g, ''), product.category.replace(/\s+/g, '')]}
                />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Category Tag */}
            <div>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {isOutOfStock ? (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              ) : (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-semibold">
                    In Stock ({product.stock} available)
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-semibold text-gray-900 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="pt-4">
              <Button
                variant="primary"
                size="large"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                isLoading={isAddingToCart}
                leftIcon={<ShoppingCart className="w-5 h-5" />}
                className="w-full"
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>

            {/* Product Specifications (placeholder for future) */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-600">Brand</dt>
                  <dd className="font-semibold text-gray-900">{product.brand}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Category</dt>
                  <dd className="font-semibold text-gray-900">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-gray-600">Stock</dt>
                  <dd className="font-semibold text-gray-900">{product.stock} units</dd>
                </div>
                <div>
                  <dt className="text-gray-600">SKU</dt>
                  <dd className="font-semibold text-gray-900">{product.id.slice(0, 8)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}


