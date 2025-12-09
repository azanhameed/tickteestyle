/**
 * Payment Instructions Page
 * Detailed instructions for each payment method
 */

import { Metadata } from 'next';
import { Banknote, Building2, Smartphone, Copy, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Payment Instructions',
  description: 'Learn how to pay for your order using Cash on Delivery, Bank Transfer, JazzCash, or EasyPaisa.',
  keywords: ['payment instructions', 'how to pay', 'bank transfer', 'jazzcash', 'easypaisa'],
  openGraph: {
    title: 'Payment Instructions | TickTee Style',
    description: 'Learn how to pay for your order using various payment methods.',
    type: 'website',
  },
  alternates: {
    canonical: '/payment-instructions',
  },
};

export default function PaymentInstructionsPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Payment Instructions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the payment method that works best for you. All methods are secure and verified.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Cash on Delivery */}
          <Card padding="large">
            <div className="flex items-center space-x-3 mb-6">
              <Banknote className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">Cash on Delivery (COD)</h2>
              <Badge variant="success">Available</Badge>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Pay when you receive your order. Our delivery partner will collect the payment at your doorstep.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">COD Fee</h3>
                <p className="text-blue-800">A COD fee of Rs. 200 will be added to your order total.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How it works:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Place your order and select "Cash on Delivery"</li>
                  <li>Your order will be confirmed immediately</li>
                  <li>We'll process and ship your order</li>
                  <li>Pay the delivery person when you receive your order</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Bank Transfer */}
          <Card padding="large">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">Bank Transfer</h2>
              <Badge variant="info">Manual Verification</Badge>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Bank Account Details</h3>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                    <span className="text-sm text-gray-500">Bank Name</span>
                    <span className="font-semibold">HBL</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                    <span className="text-sm text-gray-500">Account Title</span>
                    <span className="font-semibold">TickTee Style</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                    <span className="text-sm text-gray-500">Account Number</span>
                    <span className="font-mono font-semibold">1234567890</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                    <span className="text-sm text-gray-500">IBAN</span>
                    <span className="font-mono font-semibold">PK12HABB1234567890</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                    <span className="text-sm text-gray-500">Branch</span>
                    <span className="font-semibold">Main Branch</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step-by-Step Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700">
                  <li>Place your order and select "Bank Transfer"</li>
                  <li>Transfer the exact order amount to the bank account above</li>
                  <li>Include your order reference number in the transfer description</li>
                  <li>Upload a screenshot or photo of your payment confirmation</li>
                  <li>Your order will be processed after payment verification (usually within 24 hours)</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Make sure to transfer the exact amount and include your order reference number. 
                  Payment verification usually takes 24 hours during business days.
                </p>
              </div>
            </div>
          </Card>

          {/* JazzCash */}
          <Card padding="large">
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">JazzCash</h2>
              <Badge variant="info">Mobile Wallet</Badge>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">JazzCash Number</h3>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                  <div className="flex justify-between items-center p-4 bg-white rounded border border-gray-200">
                    <span className="text-sm text-gray-500">JazzCash Number</span>
                    <span className="text-2xl font-mono font-bold text-primary">03XX-XXXXXXX</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How to Pay via JazzCash:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700">
                  <li>Place your order and select "JazzCash"</li>
                  <li>Open your JazzCash app or dial *786#</li>
                  <li>Select "Send Money" or "Transfer"</li>
                  <li>Enter the JazzCash number: <strong>03XX-XXXXXXX</strong></li>
                  <li>Enter the exact order amount</li>
                  <li>Complete the transaction</li>
                  <li>Enter the Transaction ID from your confirmation SMS</li>
                  <li>Optionally upload a screenshot of the payment confirmation</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Keep your transaction ID safe. You'll need it to complete your order.
                </p>
              </div>
            </div>
          </Card>

          {/* EasyPaisa */}
          <Card padding="large">
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">EasyPaisa</h2>
              <Badge variant="info">Mobile Wallet</Badge>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">EasyPaisa Number</h3>
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6">
                  <div className="flex justify-between items-center p-4 bg-white rounded border border-gray-200">
                    <span className="text-sm text-gray-500">EasyPaisa Number</span>
                    <span className="text-2xl font-mono font-bold text-primary">03XX-XXXXXXX</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How to Pay via EasyPaisa:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-700">
                  <li>Place your order and select "EasyPaisa"</li>
                  <li>Open your EasyPaisa app or visit an EasyPaisa shop</li>
                  <li>Select "Send Money" or "Transfer"</li>
                  <li>Enter the EasyPaisa number: <strong>03XX-XXXXXXX</strong></li>
                  <li>Enter the exact order amount</li>
                  <li>Complete the transaction</li>
                  <li>Enter the Transaction ID from your confirmation SMS</li>
                  <li>Optionally upload a screenshot of the payment confirmation</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Keep your transaction ID safe. You'll need it to complete your order.
                </p>
              </div>
            </div>
          </Card>

          {/* FAQs */}
          <Card padding="large">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  How long does payment verification take?
                </h3>
                <p className="text-gray-700">
                  Payment verification usually takes 24 hours during business days. For COD orders, 
                  verification is instant.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What if I made a mistake in my payment?
                </h3>
                <p className="text-gray-700">
                  Contact our support team immediately at support@tickteestyle.com or call +1-234-567-8900 
                  with your order ID and payment details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I change my payment method after placing an order?
                </h3>
                <p className="text-gray-700">
                  Once an order is placed, you cannot change the payment method. If you need to change it, 
                  please cancel the order and place a new one.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What happens if my payment is rejected?
                </h3>
                <p className="text-gray-700">
                  If your payment is rejected, you'll receive an email with the reason. You can contact 
                  our support team to resolve the issue or place a new order with a different payment method.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Support */}
          <Card padding="large" className="bg-primary/5">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about payments or need assistance, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@tickteestyle.com">
                  <Button variant="primary">Email Support</Button>
                </a>
                <a href="tel:+12345678900">
                  <Button variant="outline">Call Us</Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}




