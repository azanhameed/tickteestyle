/**
 * Breadcrumb Helper Utilities
 * Generate breadcrumb paths dynamically
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Generate breadcrumbs for shop pages
 */
export function getShopBreadcrumbs(
  category?: string,
  brand?: string,
  productName?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Shop', href: '/shop' }];

  if (category) {
    breadcrumbs.push({
      label: category,
      href: `/shop?category=${encodeURIComponent(category)}`,
    });
  }

  if (brand) {
    breadcrumbs.push({
      label: brand,
      href: `/shop?brand=${encodeURIComponent(brand)}`,
    });
  }

  if (productName) {
    breadcrumbs.push({ label: productName });
  }

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for order pages
 */
export function getOrderBreadcrumbs(orderId?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Orders', href: '/orders' }];

  if (orderId) {
    breadcrumbs.push({ label: `Order #${orderId.slice(0, 8)}` });
  }

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for profile pages
 */
export function getProfileBreadcrumbs(section?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Profile', href: '/profile' }];

  if (section) {
    breadcrumbs.push({ label: section });
  }

  return breadcrumbs;
}

/**
 * Generate breadcrumbs for admin pages
 */
export function getAdminBreadcrumbs(section?: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Admin', href: '/admin' }];

  if (section) {
    breadcrumbs.push({ label: section });
  }

  return breadcrumbs;
}

/**
 * Format product name for breadcrumbs (shorten if too long)
 */
export function formatProductName(name: string, maxLength = 50): string {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + '...';
}
