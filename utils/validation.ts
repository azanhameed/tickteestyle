/**
 * Validation utilities for input sanitization and security
 * Prevents XSS attacks and enforces password policies
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes dangerous HTML/script tags and encodes special characters
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Encode special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  // Trim whitespace
  return sanitized.trim();
}

/**
 * Sanitize HTML content but allow safe tags
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Allow only safe tags
  const allowedTags = ['p', 'br', 'b', 'i', 'u', 'strong', 'em', 'ul', 'ol', 'li'];
  const tagPattern = new RegExp(`<(?!\/?(${allowedTags.join('|')})\\b)[^>]+>`, 'gi');
  
  return html.replace(tagPattern, '');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Pakistan format)
 * Accepts: 03001234567, +923001234567, 0300-1234567
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+92|0)?3[0-9]{2}[-\s]?[0-9]{7}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Validate Pakistan postal code (5-6 digits)
 */
export function isValidPostalCode(postalCode: string): boolean {
  const postalRegex = /^\d{5,6}$/;
  return postalRegex.test(postalCode.replace(/\s+/g, ''));
}

/**
 * Password strength validation
 * Returns object with validation results and error messages
 */
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (!password) {
    return { isValid: false, errors: ['Password is required'], strength: 'weak' };
  }
  
  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Maximum length (prevent DOS attacks)
  if (password.length > 128) {
    errors.push('Password is too long (max 128 characters)');
  }
  
  // Must contain uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Must contain lowercase
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Must contain number
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Must contain special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Calculate strength
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isLongEnough = password.length >= 12;
  
  const strengthScore = [hasUppercase, hasLowercase, hasNumber, hasSpecial, isLongEnough]
    .filter(Boolean).length;
  
  if (strengthScore >= 4) {
    strength = 'strong';
  } else if (strengthScore >= 3) {
    strength = 'medium';
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Common dangerous patterns to block
 */
const DANGEROUS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onclick, onerror, etc.
  /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
  /<embed[\s\S]*?>/gi,
];

/**
 * Check if input contains dangerous patterns
 */
export function containsDangerousContent(input: string): boolean {
  if (!input) return false;
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Validate and sanitize form data
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate transaction ID format (alphanumeric, 8-20 characters)
 */
export function isValidTransactionId(transactionId: string): boolean {
  const txRegex = /^[A-Za-z0-9]{8,20}$/;
  return txRegex.test(transactionId.trim());
}

/**
 * Validate product name (3-100 characters, alphanumeric with spaces and common symbols)
 */
export function isValidProductName(name: string): boolean {
  if (!name || name.length < 3 || name.length > 100) return false;
  const nameRegex = /^[A-Za-z0-9\s\-'&.()]+$/;
  return nameRegex.test(name);
}

/**
 * Validate price (positive number, max 2 decimal places)
 */
export function isValidPrice(price: number): boolean {
  if (typeof price !== 'number' || isNaN(price)) return false;
  if (price <= 0 || price > 10000000) return false;
  
  // Check max 2 decimal places
  const decimals = (price.toString().split('.')[1] || '').length;
  return decimals <= 2;
}

/**
 * Validate stock quantity (non-negative integer)
 */
export function isValidStock(stock: number): boolean {
  return Number.isInteger(stock) && stock >= 0 && stock <= 999999;
}
