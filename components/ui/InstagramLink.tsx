/**
 * Instagram Link Component
 * Clickable Instagram handle with icon
 */

import Link from 'next/link';
import { Instagram } from 'lucide-react';

interface InstagramLinkProps {
  handle?: string;
  className?: string;
  showIcon?: boolean;
  variant?: 'default' | 'button' | 'inline';
}

export default function InstagramLink({
  handle = '@tick.teestyle',
  className = '',
  showIcon = true,
  variant = 'default',
}: InstagramLinkProps) {
  const url = 'https://www.instagram.com/tick.teestyle/';
  
  const variants = {
    default: 'inline-flex items-center space-x-1 text-primary hover:text-primary-dark transition-colors',
    button: 'inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300',
    inline: 'inline-flex items-center space-x-1 text-pink-600 hover:text-pink-700 transition-colors underline',
  };

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${variants[variant]} ${className}`}
      aria-label={`Follow us on Instagram ${handle}`}
    >
      {showIcon && <Instagram className="w-4 h-4" />}
      <span>{handle}</span>
    </Link>
  );
}
