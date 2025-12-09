import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - TickTee Style | WhatsApp: +92 315 0374729',
  description: '📞 Contact TickTee Style for luxury watch inquiries. WhatsApp: +92 315 0374729 | Email: support@tickteestyle.com | Instagram: @tick.teestyle. Fast response within 2 hours!',
  keywords: [
    'contact TickTee Style',
    'watch shop contact Pakistan',
    'customer support',
    'WhatsApp watch shop',
    '+92 315 0374729',
    'tick.teestyle contact',
  ],
  openGraph: {
    title: 'Contact Us - TickTee Style | WhatsApp: +92 315 0374729',
    description: 'Contact TickTee Style for luxury watch inquiries. WhatsApp available! Fast response within 2 hours.',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}