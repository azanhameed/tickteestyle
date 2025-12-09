'use client';

/**
 * Breadcrumb navigation component
 * Shows path: Home > Shop > Product Name
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Always include Home as first item
  const allItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    ...items,
  ];

  return (
    <nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index === 0 && item.href === '/' ? (
                <Link
                  href="/"
                  className="text-gray-500 hover:text-primary transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={isLast ? 'font-semibold text-gray-900' : 'text-gray-500'}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </>
              )}

              {!isLast && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}




