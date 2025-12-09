'use client';

/**
 * Horizontal or vertical divider line
 * Optional text in the middle
 */

import { ReactNode } from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  text?: string;
  className?: string;
}

export default function Divider({
  orientation = 'horizontal',
  text,
  className = '',
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={`w-px h-full bg-gray-200 ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (text) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-4 text-sm text-gray-500">{text}</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>
    );
  }

  return (
    <div
      className={`w-full border-t border-gray-200 ${className}`}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}




