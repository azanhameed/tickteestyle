/**
 * Example Unit Tests for Utility Functions
 */

import { formatPrice, formatDate } from '../formatters';

describe('formatPrice', () => {
  it('should format price in PKR correctly', () => {
    expect(formatPrice(1000)).toBe('Rs. 1,000');
    expect(formatPrice(50000)).toBe('Rs. 50,000');
    expect(formatPrice(999.99)).toBe('Rs. 1,000');
  });

  it('should handle zero price', () => {
    expect(formatPrice(0)).toBe('Rs. 0');
  });

  it('should handle large numbers', () => {
    expect(formatPrice(1000000)).toBe('Rs. 1,000,000');
  });
});

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-12-09T12:00:00Z');
    const formatted = formatDate(date);
    expect(formatted).toContain('Dec');
    expect(formatted).toContain('2024');
  });

  it('should format date string', () => {
    const formatted = formatDate('2024-12-09');
    expect(formatted).toBeTruthy();
  });
});
