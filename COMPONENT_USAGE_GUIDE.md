# Quick Reference Guide - New Components

## 📋 Table of Contents
1. [Breadcrumbs](#breadcrumbs)
2. [Pagination](#pagination)
3. [Announcements](#announcements)
4. [FAQ Page](#faq-page)
5. [Focus Indicators](#focus-indicators)

---

## 🧭 Breadcrumbs

### Import
```tsx
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getShopBreadcrumbs, getOrderBreadcrumbs, getProfileBreadcrumbs, getAdminBreadcrumbs } from '@/utils/breadcrumbs';
```

### Usage Example

#### Manual Breadcrumbs
```tsx
<Breadcrumbs
  items={[
    { label: 'Shop', href: '/shop' },
    { label: 'Men\'s Watches', href: '/shop?category=mens' },
    { label: 'Rolex Submariner' }, // Last item (current page) - no href
  ]}
/>
```

#### Shop Page Breadcrumbs
```tsx
const breadcrumbs = getShopBreadcrumbs('mens', 'Rolex', 'Submariner Date');
<Breadcrumbs items={breadcrumbs} />
// Output: Home > Shop > Mens > Rolex > Submariner Date
```

#### Order Page Breadcrumbs
```tsx
const breadcrumbs = getOrderBreadcrumbs('abc123');
<Breadcrumbs items={breadcrumbs} />
// Output: Home > Orders > Order #abc123
```

#### Profile Page Breadcrumbs
```tsx
const breadcrumbs = getProfileBreadcrumbs('Change Password');
<Breadcrumbs items={breadcrumbs} />
// Output: Home > Profile > Change Password
```

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `BreadcrumbItem[]` | Yes | Array of breadcrumb items |
| `className` | `string` | No | Additional CSS classes |

### BreadcrumbItem Interface
```typescript
interface BreadcrumbItem {
  label: string;    // Display text
  href?: string;    // Link URL (omit for current page)
}
```

---

## 📄 Pagination

### Import
```tsx
import Pagination, { usePagination } from '@/components/ui/Pagination';
```

### Usage Example

#### With Hook (Recommended)
```tsx
'use client';

export default function ProductList({ products }: { products: Product[] }) {
  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(
    products.length,
    12 // items per page
  );

  const visibleProducts = products.slice(startIndex, endIndex);

  return (
    <div>
      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        className="mt-8"
      />
    </div>
  );
}
```

#### Manual State
```tsx
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(products.length / 12);

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentPage` | `number` | Yes | Current active page (1-indexed) |
| `totalPages` | `number` | Yes | Total number of pages |
| `onPageChange` | `(page: number) => void` | Yes | Callback when page changes |
| `className` | `string` | No | Additional CSS classes |

### usePagination Hook Return Value
```typescript
{
  currentPage: number;      // Current page number
  totalPages: number;       // Total pages calculated
  startIndex: number;       // Start index for slicing array
  endIndex: number;         // End index for slicing array
  goToPage: (page: number) => void;  // Function to change page
  setCurrentPage: (page: number) => void; // Direct setter
}
```

---

## 📢 Announcements (ARIA Live Regions)

### Import
```tsx
import Announcement, { useAnnouncement } from '@/components/ui/Announcement';
```

### Usage Example

#### With Hook (Recommended)
```tsx
'use client';

export default function MyForm() {
  const { announcement, showError, showSuccess, showInfo, clear } = useAnnouncement();

  const handleSubmit = async () => {
    try {
      const response = await submitForm();
      if (response.ok) {
        showSuccess('Form submitted successfully!');
      } else {
        showError('Failed to submit form. Please try again.');
      }
    } catch (error) {
      showError('Network error. Please check your connection.');
    }
  };

  return (
    <div>
      {announcement && <Announcement {...announcement} onClose={clear} />}
      
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </div>
  );
}
```

#### Direct Component Usage
```tsx
<Announcement
  type="error"
  message="Invalid email address"
  onClose={() => setError(null)}
  autoClose={true}
  duration={5000}
/>
```

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `'error' \| 'success' \| 'info'` | Yes | Announcement type |
| `message` | `string` | Yes | Message to display |
| `onClose` | `() => void` | No | Callback when closed |
| `autoClose` | `boolean` | No | Auto-close after duration (default: true) |
| `duration` | `number` | No | Auto-close duration in ms (default: 5000) |

### useAnnouncement Hook
```typescript
{
  announcement: AnnouncementProps | null;  // Current announcement
  showError: (message: string) => void;    // Show error message
  showSuccess: (message: string) => void;  // Show success message
  showInfo: (message: string) => void;     // Show info message
  clear: () => void;                       // Clear announcement
}
```

### Accessibility Features
- **Error messages**: `aria-live="assertive"` (announced immediately)
- **Success/Info**: `aria-live="polite"` (announced when convenient)
- **Icons**: `aria-hidden="true"` (decorative only)
- **Close button**: `aria-label="Close notification"`

---

## ❓ FAQ Page

### Location
`/faq` - Already created and added to sitemap

### Structure
- 6 categories, 30+ questions
- Collapsible accordion design
- Quick navigation links
- WhatsApp CTA at bottom

### How to Add/Edit FAQs
Edit `app/faq/page.tsx`:

```typescript
const faqCategories = [
  {
    category: 'Your Category Name',
    questions: [
      {
        question: 'Your question here?',
        answer: 'Your detailed answer here.',
      },
      // Add more questions...
    ],
  },
  // Add more categories...
];
```

### SEO Benefits
- **Long-tail keywords**: Each Q&A targets specific search queries
- **Structured content**: Easy for search engines to parse
- **Internal linking**: Links to shop, contact pages
- **User engagement**: Reduces bounce rate, increases time on site

---

## 🎯 Focus Indicators

### Already Implemented Globally
No import needed - works automatically on all pages!

### Styles Applied (in `app/globals.css`)
```css
*:focus-visible {
  outline: 3px solid var(--color-secondary); /* Gold */
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
}
```

### Test Focus Indicators
1. Press `Tab` on any page
2. Gold outline should appear on focused element
3. Press `Tab` again to move to next element

### Skip to Content Link
- Press `Tab` on page load
- Gold link appears at top: "Skip to Content"
- Press `Enter` to jump to main content
- Useful for keyboard users to skip navigation

---

## 🎨 Design Tokens Used

### Colors
```css
--color-primary: #1e3a8a;       /* Navy Blue */
--color-secondary: #d4af37;     /* Gold */
--color-primary-dark: #1e40af;
--color-secondary-light: #f4d03f;
```

### Spacing
```css
--spacing-scale: 0.25rem; /* 4px base unit */
```

### Breakpoints
```typescript
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
```

---

## 📱 Responsive Design

### All New Components Are Mobile-Friendly
- **Breadcrumbs**: Text wraps on small screens
- **Pagination**: Buttons stack on mobile
- **Announcements**: Max width with proper margins
- **FAQ**: Collapsible accordion, touch-friendly

### Testing
```bash
# Open DevTools (F12)
# Click "Toggle Device Toolbar" (Ctrl+Shift+M)
# Test on iPhone, iPad, Android sizes
```

---

## ♿ Accessibility Checklist

### All New Components Meet WCAG 2.1 AA
- ✅ Focus indicators (3px, high contrast)
- ✅ ARIA labels (`aria-label`, `aria-current`, `aria-live`)
- ✅ Semantic HTML (`<nav>`, `<button>`, `<details>`)
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Touch targets ≥ 48x48px
- ✅ Color contrast ratios (AAA where possible)

### Screen Reader Testing
```bash
# Windows: NVDA (free)
# Mac: VoiceOver (built-in, Cmd+F5)
# Test: Navigate with Tab, listen to announcements
```

---

## 🚀 Performance Tips

### Breadcrumbs
- Render on server (SSR) for SEO
- Keep item array small (< 5 items)

### Pagination
- Use `usePagination` hook to avoid re-renders
- `goToPage` includes smooth scroll to top

### Announcements
- Auto-dismiss after 5 seconds (configurable)
- Only render when `announcement` is not null
- Clear properly to avoid memory leaks

### FAQ
- Use `<details>` element (native browser performance)
- Sections expand/collapse without JS overhead

---

## 🐛 Common Issues & Solutions

### Issue: Breadcrumbs not showing
**Solution**: Check if `items` array is not empty
```tsx
{breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
```

### Issue: Pagination not working
**Solution**: Ensure `totalPages > 1`
```tsx
{totalPages > 1 && <Pagination ... />}
```

### Issue: Announcement not appearing
**Solution**: Check if component is rendered
```tsx
{announcement && <Announcement {...announcement} onClose={clear} />}
```

### Issue: Focus indicator not visible
**Solution**: Check if element has `tabindex` attribute
```tsx
<div tabIndex={0}>Focusable div</div>
```

---

## 📚 Further Reading

### Official Docs
- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit tool
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation

---

**Last Updated**: December 2024  
**Project**: TickTee Style  
**Instagram**: @tick.teestyle
