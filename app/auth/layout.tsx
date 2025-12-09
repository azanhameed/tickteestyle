import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | TickTee Style',
  description: 'Sign in or create an account to access luxury watches at TickTee Style',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


