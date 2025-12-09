import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Manager Dashboard | TickTee Style',
  description: 'Manage your TickTee Style watch business - products, orders, payments, and Instagram inventory',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}




