'use client';

/**
 * Filter sidebar component
 * Handles product filtering: price range, brand, category, stock
 */

import { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  category: string;
  inStockOnly: boolean;
  searchQuery: string;
}

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  availableBrands: string[];
  minPrice: number;
  maxPrice: number;
  totalProducts: number;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  availableBrands,
  minPrice,
  maxPrice,
  totalProducts,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    category: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    if (type === 'min') {
      newRange[0] = Math.min(value, newRange[1] - 1000);
    } else {
      newRange[1] = Math.max(value, newRange[0] + 1000);
    }
    onFilterChange({ priceRange: newRange });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ brands: newBrands });
  };

  const handleClearFilters = () => {
    onFilterChange({
      priceRange: [minPrice, maxPrice],
      brands: [],
      category: 'all',
      inStockOnly: false,
      searchQuery: '',
    });
  };

  const hasActiveFilters =
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice ||
    filters.brands.length > 0 ||
    filters.category !== 'all' ||
    filters.inStockOnly ||
    filters.searchQuery !== '';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky lg:top-20 top-0 left-0 h-screen lg:h-auto w-80 max-w-[85vw] bg-white shadow-xl z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } overflow-y-auto`}
        aria-label="Product filters"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Results Count */}
          <div className="mb-6 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-primary">{totalProducts}</span> products found
            </p>
          </div>

          {/* Price Range */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="font-semibold text-gray-900">Price Range</h3>
              {expandedSections.price ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.price && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Min: {formatPrice(filters.priceRange[0])}</span>
                  <span className="text-gray-600">Max: {formatPrice(filters.priceRange[1])}</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <button
              onClick={() => toggleSection('brand')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="font-semibold text-gray-900">Brand</h3>
              {expandedSections.brand ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.brand && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between mb-4"
            >
              <h3 className="font-semibold text-gray-900">Category</h3>
              {expandedSections.category ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {expandedSections.category && (
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'All Categories' },
                  { value: 'mens', label: "Men's Watches" },
                  { value: 'womens', label: "Women's Watches" },
                  { value: 'luxury', label: 'Luxury Collection' },
                  { value: 'sports', label: 'Sports Watches' },
                ].map((category) => (
                  <label
                    key={category.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={filters.category === category.value}
                      onChange={(e) => onFilterChange({ category: e.target.value })}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{category.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Stock Availability */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">In Stock Only</span>
            </label>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full py-2 px-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </aside>
    </>
  );
}


