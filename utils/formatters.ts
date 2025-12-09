/**
 * Utility functions for formatting data
 * Currency, dates, and other display formatting
 */

/**
 * Formats a number as currency in Pakistani Rupees (Rs.)
 * 
 * @param price - The price to format
 * @returns Formatted price string (e.g., "Rs. 2,499")
 * 
 * @example
 * formatPrice(2499) // "Rs. 2,499"
 * formatPrice(125000) // "Rs. 125,000"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats a date string to a readable format
 * 
 * @param date - Date string or Date object
 * @param options - Optional formatting options
 * @returns Formatted date string
 * 
 * @example
 * formatDate('2024-01-15') // "January 15, 2024"
 * formatDate('2024-01-15', { short: true }) // "Jan 15, 2024"
 */
export function formatDate(
  date: string | Date,
  options?: { short?: boolean }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  if (options?.short) {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Formats a date to relative time (e.g., "2 days ago", "in 3 days")
 * 
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}


