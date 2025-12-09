'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-hot-toast';
import { Banknote, Smartphone, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { sanitizeInput, isValidPhone, isValidPostalCode, isValidTransactionId } from '@/utils/validation';
import { CheckoutTrustBadges, PaymentSecurityBadge } from '@/components/ui/TrustBadges';

type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa';

const PHONE_NUMBER = '03150374729';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, calculateShipping, calculateTax, clearCart } = useCartStore();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState(''); // Added postal code state
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push('/auth/login?redirect=/checkout');
          return;
        }
        setUser(currentUser);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', currentUser.id as any).single();
        if (profile as any) {
          setFullName((profile as any).full_name || '');
          setPhone((profile as any).phone || '');
          setAddress((profile as any).address || '');
          setCity((profile as any).city || '');
          setPostalCode((profile as any).postal_code || '');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/auth/login?redirect=/checkout');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router, supabase]);

  useEffect(() => {
    if (!isLoading && cartItems.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
    }
  }, [cartItems.length, isLoading, router]);

  const handlePlaceOrder = async () => {
    // Sanitize inputs
    const sanitizedFullName = sanitizeInput(fullName);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedAddress = sanitizeInput(address);
    const sanitizedCity = sanitizeInput(city);
    const sanitizedPostalCode = sanitizeInput(postalCode);
    const sanitizedTransactionId = sanitizeInput(transactionId);
    
    // Validation
    if (!sanitizedFullName || sanitizedFullName.length < 2) {
      toast.error('Please enter a valid full name (at least 2 characters)');
      return;
    }
    if (!sanitizedPhone) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!isValidPhone(sanitizedPhone)) {
      toast.error('Please enter a valid Pakistan phone number (e.g., 03001234567)');
      return;
    }
    if (!sanitizedAddress || sanitizedAddress.length < 10) {
      toast.error('Please enter a complete address (at least 10 characters)');
      return;
    }
    if (!sanitizedCity || sanitizedCity.length < 2) {
      toast.error('Please enter a valid city name');
      return;
    }
    if (!sanitizedPostalCode) {
      toast.error('Please enter your postal code');
      return;
    }
    if (!isValidPostalCode(sanitizedPostalCode)) {
      toast.error('Please enter a valid postal code (5-6 digits)');
      return;
    }
    if (paymentMethod !== 'cod' && !sanitizedTransactionId) {
      toast.error('Please enter transaction ID');
      return;
    }
    if (paymentMethod !== 'cod' && !isValidTransactionId(sanitizedTransactionId)) {
      toast.error('Please enter a valid transaction ID (8-20 alphanumeric characters)');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const subtotal = totalPrice;
      const tax = calculateTax(subtotal);
      const baseShipping = calculateShipping(subtotal);
      const codFee = paymentMethod === 'cod' ? 200 : 0;
      const shipping = baseShipping + codFee;
      const total = subtotal + tax + shipping;

      const orderData = {
        shippingAddress: {
          fullName: fullName.trim(),
          email: user.email || '',
          phone: phone.trim(),
          streetAddress: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(), // Now includes postal code
          country: 'Pakistan',
        },
        paymentMethod: paymentMethod,
        transactionId: paymentMethod !== 'cod' ? transactionId.trim() : null,
        paymentProofUrl: null,
        orderReference: null,
        cartItems: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          productName: item.product.name,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create order');
      }

      await clearCart(supabase);
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) return null;

  const subtotal = totalPrice;
  const tax = calculateTax(subtotal);
  const baseShipping = calculateShipping(subtotal);
  const codFee = paymentMethod === 'cod' ? 200 : 0;
  const shipping = baseShipping + codFee;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in 3 easy steps</p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
              <span className="ml-2 text-sm font-medium text-primary">Shipping</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</div>
              <span className="ml-2 text-sm font-medium text-primary">Payment</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold">3</div>
              <span className="ml-2 text-sm text-gray-500">Review</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Trust Badge */}
            <CheckoutTrustBadges />
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="fullName"
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Enter your full name" 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" 
                    autoComplete="name"
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="phone"
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="03001234567" 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" 
                    autoComplete="tel"
                    pattern="[0-9+\-\s]*"
                    required 
                  />
                  <p className="mt-1 text-xs text-gray-500">Format: 03001234567 or +923001234567</p>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    id="address"
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="House/Flat No., Street, Area" 
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all min-h-[80px]" 
                    autoComplete="street-address"
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="city"
                      type="text" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      placeholder="e.g., Karachi, Lahore" 
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" 
                      autoComplete="address-level2"
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="postalCode"
                      type="text" 
                      value={postalCode} 
                      onChange={(e) => setPostalCode(e.target.value)} 
                      placeholder="75500" 
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all" 
                      autoComplete="postal-code"
                      pattern="[0-9]{5,6}"
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              
              {/* Payment Security Badge */}
              <div className="mb-4">
                <PaymentSecurityBadge />
              </div>
              
              <div className="space-y-4">
                <label className="block cursor-pointer">
                  <div className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'cod' ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={paymentMethod === 'cod'} 
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} 
                        className="w-4 h-4 text-primary" 
                      />
                      <Banknote className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Cash on Delivery (COD)</div>
                        <div className="text-sm text-gray-600">Pay Rs. 200 COD fee when you receive your order</div>
                      </div>
                    </div>
                  </div>
                </label>
                <label className="block cursor-pointer">
                  <div className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'jazzcash' ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="jazzcash" 
                        checked={paymentMethod === 'jazzcash'} 
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} 
                        className="w-4 h-4 text-primary" 
                      />
                      <Smartphone className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">JazzCash</div>
                        <div className="text-sm text-gray-600">Phone: {PHONE_NUMBER}</div>
                      </div>
                    </div>
                  </div>
                </label>
                <label className="block cursor-pointer">
                  <div className={`p-4 border-2 rounded-lg transition-all ${paymentMethod === 'easypaisa' ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="easypaisa" 
                        checked={paymentMethod === 'easypaisa'} 
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} 
                        className="w-4 h-4 text-primary" 
                      />
                      <Smartphone className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">EasyPaisa</div>
                        <div className="text-sm text-gray-600">Phone: {PHONE_NUMBER}</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
              {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Payment Instructions:</p>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Send money to: <strong>{PHONE_NUMBER}</strong></li>
                      <li>Enter the transaction ID below</li>
                      <li>Your order will be confirmed after payment verification</li>
                    </ol>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={transactionId} 
                      onChange={(e) => setTransactionId(e.target.value)} 
                      placeholder="Enter transaction ID from payment confirmation" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" 
                      required 
                    />
                  </div>
                </div>
              )}
              {paymentMethod === 'cod' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Cash on Delivery:</strong> Your order will be confirmed immediately. You will pay Rs. 200 COD fee when you receive your order.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{item.product.name}</div>
                      <div className="text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-gray-900 font-medium">{formatPrice(item.product.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{formatPrice(baseShipping)}</span>
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">COD Fee</span>
                    <span className="text-gray-900">{formatPrice(codFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              <button 
                onClick={handlePlaceOrder} 
                disabled={isPlacingOrder} 
                className={`w-full mt-6 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center space-x-2 ${
                  isPlacingOrder ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                {isPlacingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}