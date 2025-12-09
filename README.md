# TickTee Style - Luxury Watches E-Commerce Platform

A modern, full-featured e-commerce platform for luxury watches built with Next.js, Supabase, and TypeScript.

**Business Model:** Shop manager/owner runs a watch business through both a professional website and Instagram (@tick.teestyle), managing inventory, orders, and payments through an integrated admin dashboard.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse and search through a curated collection of luxury watches
- **Product Details**: Detailed product pages with images, descriptions, and specifications
- **Shopping Cart**: Add items to cart with quantity management
- **Checkout**: Secure checkout process with shipping address collection
- **Order Management**: View order history and track order status
- **User Profile**: Manage account information and shipping addresses
- **Authentication**: Secure sign up, login, and password reset
- **Responsive Design**: Fully responsive design optimized for all devices

### Shop Manager Features (Admin Dashboard)
- **Inventory Management**: Add, edit, delete watches for website and Instagram shop
- **Order Processing**: View all customer orders and update status
- **Payment Verification**: Verify JazzCash/EasyPaisa payments with proof review
- **Business Analytics**: Sales statistics, revenue tracking, low stock alerts
- **Multi-Image Upload**: Add up to 5 high-quality product images
- **Shop Management**: Coordinate inventory between website and Instagram (@tick.teestyle)

### Technical Features
- **SEO Optimized**: Comprehensive metadata, sitemap, and structured data
- **Performance**: Optimized images, lazy loading, and code splitting
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Type Safety**: Full TypeScript coverage
- **Modern UI**: Luxury brand styling with smooth animations

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **State Management**: Zustand
- **Forms**: React Hook Form (where applicable)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TickTee
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   
   See [Supabase Setup](#supabase-setup) section below.

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄 Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

### 2. Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_intent_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  product_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust as needed)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
```

### 3. Storage Bucket Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `product-images`
3. Set it to **Public**
4. Add the following policy:
   ```sql
   CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
   CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
     bucket_id = 'product-images' AND auth.role() = 'authenticated'
   );
   CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (
     bucket_id = 'product-images' AND auth.role() = 'authenticated'
   );
   CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (
     bucket_id = 'product-images' AND auth.role() = 'authenticated'
   );
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

Make sure to set all environment variables in your deployment platform.

## 📁 Project Structure

```
TickTee/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/           # Checkout page
│   ├── orders/             # Order pages
│   ├── profile/            # User profile pages
│   ├── shop/               # Shop pages
│   ├── about/              # About page
│   ├── contact/             # Contact page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── error.tsx           # Error boundary
│   ├── not-found.tsx       # 404 page
│   ├── loading.tsx         # Loading page
│   ├── sitemap.ts          # Sitemap generation
│   └── robots.ts            # Robots.txt
├── components/             # React components
│   ├── admin/             # Admin components
│   ├── auth/              # Auth components
│   ├── cart/              # Cart components
│   ├── checkout/           # Checkout components
│   ├── layout/             # Layout components
│   ├── orders/              # Order components
│   ├── profile/             # Profile components
│   ├── shop/                # Shop components
│   └── ui/                   # UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries
│   ├── supabase/           # Supabase helpers
│   ├── store/              # Zustand stores
│   └── toast.ts            # Toast helpers
├── types/                   # TypeScript types
├── utils/                   # Utility functions
└── public/                  # Static assets
```

## 🔐 Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
```

## 📝 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check

### Protected Endpoints
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product (admin)
- `GET /api/admin/products/[id]` - Get product (admin)
- `PUT /api/admin/products/[id]` - Update product (admin)
- `DELETE /api/admin/products/[id]` - Delete product (admin)
- `GET /api/admin/orders` - Get all orders (admin)
- `PUT /api/admin/orders/[id]` - Update order status (admin)
- `GET /api/admin/stats` - Get admin statistics (admin)
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details
- `POST /api/contact` - Submit contact form

## 🧪 Testing

Currently, the project doesn't include automated tests. To add testing:

1. Install testing dependencies:
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
   ```

2. Set up Jest configuration
3. Write tests for components and utilities

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- All open-source contributors

## 📞 Support

For support, email support@tickteestyle.com or open an issue in the repository.

---

Built with ❤️ by the TickTee Style team




