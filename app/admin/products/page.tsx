'use client';

/**
 * Products Management Page
 * List, search, filter, and manage all products
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Loader2, Package } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Product } from '@/types/database.types';
import ProductTable from '@/components/admin/ProductTable';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ProductsPage() {
  const router = useRouter();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    productId: string | null;
    productName: string;
  }>({
    isOpen: false,
    productId: null,
    productName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!adminLoading) {
      if (!isAdmin) {
        router.push('/unauthorized');
        return;
      }
      fetchProducts();
    }
  }, [isAdmin, adminLoading, router]);

  useEffect(() => {
    // Apply filters and search
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return a.stock - b.stock;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, categoryFilter, sortBy]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data.products || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      toast.error(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/edit/${product.id}`);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteConfirm({
      isOpen: true,
      productId: product.id,
      productName: product.name,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.productId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${deleteConfirm.productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      toast.success('Product deleted successfully');
      setDeleteConfirm({ isOpen: false, productId: null, productName: '' });
      fetchProducts(); // Refresh list
    } catch (err: any) {
      console.error('Error deleting product:', err);
      toast.error(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect handled in useEffect
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Inventory Management
              </h1>
              <p className="text-gray-600">
                Manage watches for website & Instagram (@tick.teestyle) - {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <Link href="/admin/products/add">
              <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
                Add New Watch
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-w-[180px]"
            >
              <option value="">All Categories</option>
              <option value="Men's">Men's Watches</option>
              <option value="Women's">Women's Watches</option>
              <option value="Luxury">Luxury Collection</option>
              <option value="Sports">Sports Watches</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-w-[180px]"
            >
              <option value="name">Name A-Z</option>
              <option value="price">Price Low-High</option>
              <option value="stock">Stock</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {products.length === 0 ? 'No products found' : 'No products match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0
                ? 'Add your first product to get started!'
                : 'Try adjusting your search or filters'}
            </p>
            {products.length === 0 && (
              <Link href="/admin/products/add">
                <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
                  Add New Product
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            loading={false}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, productId: null, productName: '' })}
          onConfirm={handleDeleteConfirm}
          itemName={deleteConfirm.productName}
          loading={isDeleting}
        />
      </div>
    </div>
  );
}

