/**
 * Trust Badge Component
 * Displays security and payment trust badges to increase conversion
 */

import { Shield, Lock, CreditCard, CheckCircle, Truck, RotateCcw } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: '100% Authentic',
      description: 'Verified Products',
    },
    {
      icon: Lock,
      title: 'Secure Payment',
      description: 'SSL Encrypted',
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'COD, JazzCash, EasyPaisa',
    },
    {
      icon: CheckCircle,
      title: 'Quality Assured',
      description: 'Certificate Included',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Nationwide Shipping',
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Easy Exchange',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center text-white p-4 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <badge.icon className="w-8 h-8 mb-2 text-secondary" />
              <h3 className="text-sm font-bold mb-1">{badge.title}</h3>
              <p className="text-xs text-white/80">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CheckoutTrustBadges() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
      <div className="flex items-start gap-3 mb-3">
        <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">Secure Checkout</h3>
          <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Lock className="w-4 h-4 text-green-600" />
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>Safe Payment</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Shield className="w-4 h-4 text-green-600" />
          <span>Privacy Protected</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <RotateCcw className="w-4 h-4 text-green-600" />
          <span>Easy Returns</span>
        </div>
      </div>
      
      {/* Payment Method Logos */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Accepted Payment Methods:</p>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-white px-3 py-1 rounded border border-gray-200 text-xs font-semibold text-gray-700">
            💵 Cash on Delivery
          </div>
          <div className="bg-white px-3 py-1 rounded border border-gray-200 text-xs font-semibold text-red-600">
            📱 JazzCash
          </div>
          <div className="bg-white px-3 py-1 rounded border border-gray-200 text-xs font-semibold text-green-600">
            💳 EasyPaisa
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentSecurityBadge() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
      <Lock className="w-5 h-5 text-green-600" />
      <div>
        <p className="font-medium text-gray-900">Secure Payment Processing</p>
        <p className="text-xs text-gray-500">256-bit SSL encryption protects your data</p>
      </div>
    </div>
  );
}
