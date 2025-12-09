/**
 * SEO Component - JSON-LD Structured Data
 * Provides rich snippets for better search engine visibility
 */

interface Organization {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
}

interface Product {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': string;
    name: string;
  };
  offers: {
    '@type': string;
    url: string;
    priceCurrency: string;
    price: number;
    availability: string;
    priceValidUntil?: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: number;
    reviewCount: number;
  };
}

interface BreadcrumbList {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

export function OrganizationSchema() {
  const schema: Organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TickTee Style',
    url: 'https://tickteestyle.com',
    logo: 'https://tickteestyle.com/logo.png',
    sameAs: [
      'https://www.instagram.com/tick.teestyle',
      'https://www.facebook.com/tickteestyle',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-315-0374729',
      contactType: 'Customer Service',
      areaServed: 'PK',
      availableLanguage: ['English', 'Urdu'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  images,
  brand,
  price,
  url,
  availability = 'InStock',
  rating,
  reviewCount,
}: {
  name: string;
  description: string;
  images: string[];
  brand: string;
  price: number;
  url: string;
  availability?: 'InStock' | 'OutOfStock';
  rating?: number;
  reviewCount?: number;
}) {
  const schema: Product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: images,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'PKR',
      price,
      availability: `https://schema.org/${availability}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  };

  if (rating && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema: BreadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://tickteestyle.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TickTee Style',
    url: 'https://tickteestyle.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tickteestyle.com/shop?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'TickTee Style',
    image: 'https://tickteestyle.com/logo.png',
    '@id': 'https://tickteestyle.com',
    url: 'https://tickteestyle.com',
    telephone: '+92-315-0374729',
    priceRange: 'Rs. 5,000 - Rs. 500,000',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.8669,
      longitude: 68.5170,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [
      'https://www.instagram.com/tick.teestyle',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
