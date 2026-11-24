import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { FitCategory, ProductSize } from '../types';
import { SlidersHorizontal, X, RotateCcw, ChevronDown } from 'lucide-react';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL Param Initializers
  const fitParam = searchParams.get('fit') as FitCategory | null;
  const filterParam = searchParams.get('filter');

  // Filter States
  const [selectedFits, setSelectedFits] = useState<FitCategory[]>(fitParam ? [fitParam] : []);
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<'all' | 'under1500' | 'above1500'>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync state if URL searchParam changes (e.g. from header links)
  useEffect(() => {
    if (fitParam && !selectedFits.includes(fitParam)) {
      setSelectedFits([fitParam]);
    }
  }, [fitParam]);

  // Color options extracted from products
  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    PRODUCTS.forEach((p) => {
      p.colors.forEach((c) => {
        map.set(c.name, c.hex);
      });
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  const fitsList: FitCategory[] = ['Oversized', 'Boxy', 'Regular'];
  const sizesList: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const toggleFit = (fit: FitCategory) => {
    setSelectedFits((prev) =>
      prev.includes(fit) ? prev.filter((f) => f !== fit) : [...prev, fit]
    );
  };

  const toggleSize = (size: ProductSize) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const resetFilters = () => {
    setSelectedFits([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange('all');
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedFits.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    priceRange !== 'all' ||
    inStockOnly;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // New arrivals filter from URL query
      if (filterParam === 'new' && !product.isNewArrival) {
        return false;
      }

      // Fit Filter
      if (selectedFits.length > 0 && !selectedFits.includes(product.fit)) {
        return false;
      }

      // Size Filter
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((sz) => product.availableSizes.includes(sz));
        if (!hasSize) return false;
      }

      // Color Filter
      if (selectedColors.length > 0) {
        const hasColor = product.colors.some((c) => selectedColors.includes(c.name));
        if (!hasColor) return false;
      }

      // Price Filter
      if (priceRange === 'under1500' && product.price >= 1500) return false;
      if (priceRange === 'above1500' && product.price < 1500) return false;

      // In Stock Filter
      if (inStockOnly && !product.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'gsm-high') return b.specifications.gsm - a.specifications.gsm;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0; // featured default
    });
  }, [selectedFits, selectedSizes, selectedColors, priceRange, inStockOnly, sortBy, filterParam]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="border-b border-brand-sand/30 pb-6 space-y-2">
        <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
          THE FULL ARCHIVE / DROP 001
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl text-brand-black font-normal">
              Shop The Collection
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary font-light mt-1 max-w-xl">
              Precision-cut heavyweight T-shirts. Engineered with 210–260 GSM combed cotton for effortless architectural drape.
            </p>
          </div>

          <span className="text-xs text-brand-secondary">
            Showing <strong className="text-brand-black">{filteredProducts.length}</strong> styles
          </span>
        </div>
      </div>

      {/* Controls Bar: Mobile filter toggle & Desktop Sort */}
      <div className="flex items-center justify-between gap-4 pt-2 pb-4">
        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center space-x-2 px-4 py-2 border border-brand-sand/40 bg-white text-xs uppercase tracking-luxury font-medium"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters {hasActiveFilters && `(${selectedFits.length + selectedSizes.length + selectedColors.length})`}</span>
        </button>

        {/* Active Filter Pills (Desktop & Mobile) */}
        <div className="hidden lg:flex flex-wrap items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] text-brand-mocha underline flex items-center gap-1 hover:text-brand-black mr-2"
            >
              <RotateCcw className="w-3 h-3" /> Clear All Filters
            </button>
          )}
          {selectedFits.map((fit) => (
            <span
              key={fit}
              className="bg-brand-ivory text-brand-black text-[11px] px-2.5 py-1 border border-brand-sand/40 flex items-center gap-1.5"
            >
              Fit: {fit}
              <button onClick={() => toggleFit(fit)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedSizes.map((sz) => (
            <span
              key={sz}
              className="bg-brand-ivory text-brand-black text-[11px] px-2.5 py-1 border border-brand-sand/40 flex items-center gap-1.5"
            >
              Size: {sz}
              <button onClick={() => toggleSize(sz)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedColors.map((col) => (
            <span
              key={col}
              className="bg-brand-ivory text-brand-black text-[11px] px-2.5 py-1 border border-brand-sand/40 flex items-center gap-1.5"
            >
              Color: {col}
              <button onClick={() => toggleColor(col)} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-[11px] uppercase tracking-editorial text-brand-secondary hidden sm:inline">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-brand-sand/40 text-xs px-3 py-2 text-brand-black focus:outline-none focus:border-brand-black font-medium"
          >
            <option value="featured">Featured (Drop Order)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="gsm-high">Fabric Weight: Heavy GSM First</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 border border-brand-sand/30 bg-white p-6">
          <div className="flex items-center justify-between border-b border-brand-sand/30 pb-3">
            <span className="text-xs uppercase tracking-editorial font-semibold text-brand-black">
              Refine Collection
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-brand-mocha hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Fit Filter */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-editorial font-medium text-brand-secondary">
              Silhouette / Fit
            </h4>
            <div className="space-y-2">
              {fitsList.map((fit) => (
                <label key={fit} className="flex items-center space-x-2.5 text-xs text-brand-black cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFits.includes(fit)}
                    onChange={() => toggleFit(fit)}
                    className="accent-brand-black rounded-none"
                  />
                  <span>{fit} Fit</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3 pt-4 border-t border-brand-sand/20">
            <h4 className="text-[11px] uppercase tracking-editorial font-medium text-brand-secondary">
              Available Sizes
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              {sizesList.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`py-1.5 text-xs font-medium border text-center transition-colors ${
                    selectedSizes.includes(size)
                      ? 'bg-brand-black text-brand-ivory border-brand-black'
                      : 'border-brand-sand/40 hover:border-brand-black text-brand-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3 pt-4 border-t border-brand-sand/20">
            <h4 className="text-[11px] uppercase tracking-editorial font-medium text-brand-secondary">
              Colour Palette
            </h4>
            <div className="space-y-1.5">
              {availableColors.map((c) => (
                <label
                  key={c.name}
                  className="flex items-center space-x-2.5 text-xs text-brand-black cursor-pointer hover:text-brand-mocha"
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(c.name)}
                    onChange={() => toggleColor(c.name)}
                    className="accent-brand-black rounded-none"
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/15 inline-block shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-brand-sand/20">
            <h4 className="text-[11px] uppercase tracking-editorial font-medium text-brand-secondary">
              Price (INR ₹)
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'all'}
                  onChange={() => setPriceRange('all')}
                  className="accent-brand-black"
                />
                <span>All Prices</span>
              </label>
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'under1500'}
                  onChange={() => setPriceRange('under1500')}
                  className="accent-brand-black"
                />
                <span>Under ₹1,500</span>
              </label>
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'above1500'}
                  onChange={() => setPriceRange('above1500')}
                  className="accent-brand-black"
                />
                <span>₹1,500 and Above</span>
              </label>
            </div>
          </div>

          {/* Availability Filter */}
          <div className="pt-4 border-t border-brand-sand/20">
            <label className="flex items-center space-x-2.5 text-xs text-brand-black cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-brand-black"
              />
              <span>In-Stock Ready to Dispatch</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white border border-brand-sand/30 p-8 space-y-4">
              <h3 className="font-serif text-2xl text-brand-black">No matching styles found</h3>
              <p className="text-xs text-brand-secondary max-w-sm mx-auto font-light leading-relaxed">
                We couldn't find any items matching your selected criteria. Try removing one or more active filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 bg-brand-black text-brand-ivory text-xs tracking-luxury uppercase font-medium hover:bg-brand-mocha transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Slide-out Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-brand-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-brand-off-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-50">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-sand/30">
                <span className="font-serif text-xl font-medium text-brand-black">Filters</span>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-brand-secondary hover:text-brand-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Fit */}
              <div className="space-y-2">
                <h4 className="text-[11px] uppercase tracking-editorial font-medium text-brand-secondary">
                  Silhouette / Fit
                </h4>
                {fitsList.map((fit) => (
                  <label key={fit} className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedFits.includes(fit)}
                      onChange={() => toggleFit(fit)}
                      className="accent-brand-black"
                    />
                    <span>{fit} Fit</span>
                  </label>
                ))}
              </div>

              {/* Mobile Sizes */}
              <div className="space-y-2 pt-4 border-t border-brand-sand/20">
                <h4 className="text-[11px] uppercase tracking-editorial font-medium text-brand-secondary">
                  Sizes
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {sizesList.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`py-1.5 text-xs font-medium border text-center ${
                        selectedSizes.includes(size)
                          ? 'bg-brand-black text-brand-ivory'
                          : 'border-brand-sand/40 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2 pt-4 border-t border-brand-sand/20 text-xs">
                <h4 className="text-[11px] uppercase tracking-editorial font-medium text-brand-secondary">
                  Price
                </h4>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="mobile-price"
                    checked={priceRange === 'all'}
                    onChange={() => setPriceRange('all')}
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="mobile-price"
                    checked={priceRange === 'under1500'}
                    onChange={() => setPriceRange('under1500')}
                  />
                  <span>Under ₹1,500</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="mobile-price"
                    checked={priceRange === 'above1500'}
                    onChange={() => setPriceRange('above1500')}
                  />
                  <span>₹1,500 & Above</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-sand/30 space-y-2">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-brand-black text-brand-ivory text-xs uppercase tracking-luxury font-medium"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full py-2 text-xs text-brand-secondary underline text-center block"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
