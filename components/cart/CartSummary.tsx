'use client';

/**
 * Cart summary component
 * Displays order summary with totals and checkout button
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import Button from '@/components/ui/Button';

export interface CartSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  codFee?: number;
  total: number;
  onCheckout?: () => void;
  isLoading?: boolean;
}

export default function CartSummary({
  subtotal,
  tax,
  shipping,
  codFee = 0,
  total,
  onCheckout,
  isLoading = false,
}: CartSummaryProps) {
  const hasFreeShipping = shipping === 0 && subtotal > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Cost Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Tax (10%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span className="font-medium">
            {hasFreeShipping ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shipping - codFee)
            )}
          </span>
        </div>

        {codFee > 0 && (
          <div className="flex justify-between text-gray-700">
            <span>COD Fee</span>
            <span className="font-medium">{formatPrice(codFee)}</span>
          </div>
        )}

        {hasFreeShipping && subtotal < 5000 && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            Add {formatPrice(5000 - subtotal)} more for free shipping!
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link href="/checkout" className="block">
          <Button
            variant="primary"
            size="large"
            onClick={onCheckout}
            disabled={isLoading || total === 0}
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full"
          >
            Proceed to Checkout
          </Button>
        </Link>

        <Link
          href="/shop"
          className="block text-center text-primary hover:text-primary-dark font-medium transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          🔒 Secure checkout with encrypted payment
        </p>
      </div>
    </div>
  );
}


