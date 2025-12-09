/**
 * FAQ (Frequently Asked Questions) Page
 * Helps with SEO and customer support
 */

import { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import InstagramLink from '@/components/ui/InstagramLink';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ)',
  description: 'Find answers to common questions about TickTee Style watches, shipping, returns, payments, and more. Get help with your luxury watch purchase.',
  keywords: ['FAQ', 'frequently asked questions', 'watch buying guide', 'shipping info', 'returns policy', 'payment methods'],
  alternates: {
    canonical: '/faq',
  },
};

const faqCategories = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 3-5 business days within Pakistan. Express delivery (1-2 days) is available in major cities for an additional fee.',
      },
      {
        question: 'Do you offer Cash on Delivery (COD)?',
        answer: 'Yes! COD is available nationwide with a Rs. 200 service fee. We also accept JazzCash and EasyPaisa for instant payment confirmation.',
      },
      {
        question: 'How can I track my order?',
        answer: 'Once shipped, you\'ll receive a tracking number via email and SMS. You can also check your order status in the "My Orders" section after logging in.',
      },
      {
        question: 'What are the shipping charges?',
        answer: 'Free shipping on orders over Rs. 5,000. Below that, standard shipping is Rs. 200. COD orders have an additional Rs. 200 fee.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within Pakistan. We are working on international shipping - stay tuned!',
      },
    ],
  },
  {
    category: 'Products & Quality',
    questions: [
      {
        question: 'Are all watches 100% authentic?',
        answer: 'Absolutely! We guarantee 100% authenticity on all watches. Each watch comes with a certificate of authenticity and original packaging.',
      },
      {
        question: 'What warranty do you offer?',
        answer: 'All watches come with a standard 1-year manufacturer warranty covering defects. Extended warranty options available at checkout.',
      },
      {
        question: 'How do I know if a watch is in stock?',
        answer: 'Product pages show real-time stock status. If "Out of Stock" is displayed, you can click "Notify Me" to get an email when it\'s back.',
      },
      {
        question: 'Can I see the watch before buying?',
        answer: 'We provide detailed photos and descriptions. For high-value purchases (over Rs. 50,000), video calls can be arranged - contact us!',
      },
      {
        question: 'What if the watch doesn\'t match the photos?',
        answer: 'We photograph all watches accurately. If there\'s a discrepancy, contact us within 24 hours of delivery for a full refund or exchange.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      {
        question: 'What is your return policy?',
        answer: '30-day hassle-free returns on unworn watches with original packaging. Buyer pays return shipping unless the product is defective.',
      },
      {
        question: 'How do I initiate a return?',
        answer: 'Login to your account, go to "My Orders", select the order, and click "Request Return". Our team will contact you within 24 hours.',
      },
      {
        question: 'When will I get my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item. Original payment method is credited.',
      },
      {
        question: 'Can I exchange for a different watch?',
        answer: 'Yes! Exchange requests are treated as returns + new orders. Price differences will be adjusted accordingly.',
      },
      {
        question: 'What items cannot be returned?',
        answer: 'Personalized/engraved watches, worn watches, and items without original packaging cannot be returned unless defective.',
      },
    ],
  },
  {
    category: 'Payment & Security',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept Cash on Delivery (COD), JazzCash, EasyPaisa, and bank transfers. All online payments are SSL encrypted for security.',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes! We use 256-bit SSL encryption and don\'t store your payment details. All transactions are secure and PCI-compliant.',
      },
      {
        question: 'How do I pay via JazzCash/EasyPaisa?',
        answer: 'Select the payment method at checkout, send payment to our number (03150374729), then enter your transaction ID. We verify within minutes.',
      },
      {
        question: 'Do you offer installment plans?',
        answer: 'Currently, we don\'t offer direct installments, but you can use your credit card\'s installment facility if available.',
      },
      {
        question: 'Can I use multiple payment methods for one order?',
        answer: 'No, each order requires a single payment method. However, you can split items into separate orders if needed.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    questions: [
      {
        question: 'Do I need an account to purchase?',
        answer: 'Yes, creating an account helps us track your orders, save addresses, and provide better customer service. It only takes 30 seconds!',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send a reset link. Check your spam folder if you don\'t see it.',
      },
      {
        question: 'Can I change my delivery address after ordering?',
        answer: 'Yes, if the order hasn\'t been shipped yet. Contact us immediately via WhatsApp or phone to update the address.',
      },
      {
        question: 'How do I update my profile information?',
        answer: 'Login and go to "My Profile" to update your name, phone, address, and other details. Changes are saved automatically.',
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, contact us at support@tickteestyle.com to request account deletion. Please note this will delete all order history.',
      },
    ],
  },
  {
    category: 'Contact & Support',
    questions: [
      {
        question: 'How can I contact customer support?',
        answer: (
          <span>
            Call/WhatsApp: 03150374729 | Email: support@tickteestyle.com | Instagram: <InstagramLink variant="inline" showIcon />. We respond within 2 hours during business hours.
          </span>
        ),
      },
      {
        question: 'What are your business hours?',
        answer: 'Monday-Saturday: 10 AM - 8 PM | Sunday: 12 PM - 6 PM (PKT). Online orders can be placed 24/7.',
      },
      {
        question: 'Do you have a physical store?',
        answer: 'We are primarily online-based for better prices. For high-value purchases, in-person meetups can be arranged in major cities.',
      },
      {
        question: 'How do I provide feedback or complaints?',
        answer: 'Email us at support@tickteestyle.com or message on Instagram. We take all feedback seriously and respond within 24 hours.',
      },
      {
        question: 'Are you on social media?',
        answer: (
          <span>
            Yes! Follow us on Instagram <InstagramLink variant="inline" showIcon /> for latest arrivals, exclusive deals, and style inspiration.
          </span>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background-light py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about ordering, shipping, returns, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Links:</h2>
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((cat) => (
              <a
                key={cat.category}
                href={`#${cat.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-primary hover:bg-primary hover:text-white transition-all duration-200 border border-primary"
              >
                {cat.category}
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        {faqCategories.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            id={category.category.toLowerCase().replace(/\s+/g, '-')}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-primary">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-lg border border-gray-200 hover:border-primary transition-all duration-200"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 font-medium text-gray-900 hover:text-primary">
                    <span className="text-lg">{faq.question}</span>
                    <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200 flex-shrink-0 ml-4" />
                  </summary>
                  <div className="px-5 pb-5 pt-2 text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still Have Questions */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 text-center text-white mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Our customer support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-secondary hover:bg-secondary-light text-primary font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/923150374729"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white hover:bg-gray-100 text-primary font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
