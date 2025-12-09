/**
 * Global Loading Page
 * Displays during route transitions
 */

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center animate-fade-in">
      <div className="text-center">
        {/* Brand Logo/Icon */}
        <div className="mb-6 flex justify-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>

        {/* Brand Name */}
        <h2 className="text-2xl font-bold text-primary mb-2">TickTee Style</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}




