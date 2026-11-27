import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { FitCategory, StyleCategory, PaletteCollection } from '../types';
import { SlidersHorizontal, X, RotateCcw, Search } from 'lucide-react';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const fitParam = searchParams.get('fit') as FitCategory | null;
  const categoryParam = searchParams.get('category') as StyleCategory | null;
  const collectionParam = searchParams.get('collection') as PaletteCollection | null;
  const filterParam = searchParams.get('filter');
  const queryParam = searchParams.get('q') || '';

  const [selectedFits, setSelectedFits] = useState<FitCategory[]>(fitParam ? [fitParam] : []);
  const [selectedCategories, setSelectedCategories] = useState<StyleCategory[]>(
    categoryParam ? [categoryParam] : []
  );
  const [selectedCollections, setSelectedCollections] = useState<PaletteCollection[]>(
    collectionParam ? [collectionParam] : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<'all' | 'under1200' | '1200to1350' | 'above1350'>('all');
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [sortBy, setSortBy] = useState<string>(filterParam === 'new' ? 'newest' : 'featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync URL query params when navigating from Header/Footer links
  useEffect(() => {
    setSelectedFits(fitParam ? [fitParam] : []);
    setSelectedCategories(categoryParam ? [categoryParam] : []);
    setSelectedCollections(collectionParam ? [collectionParam] : []);
    if (filterParam === 'new') {
      setSortBy('newest');
    }
  }, [fitParam, categoryParam, collectionParam, filterParam]);

  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    PRODUCTS.forEach((p) => {
      p.colors.forEach((c) => map.set(c.name, c.hex));
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  const fitsList: FitCategory[] = ['Oversized', 'Boxy', 'Regular'];
  const categoriesList: StyleCategory[] = ['Essentials', 'Minimal', 'Graphic'];
  const collectionsList: PaletteCollection[] = ['Forest Green', 'Oxblood', 'Vintage', 'Midnight'];

  const toggleFit = (fit: FitCategory) => {
    setSelectedFits((prev) =>
      prev.includes(fit) ? prev.filter((f) => f !== fit) : [...prev, fit]
    );
  };

  const toggleCategory = (cat: StyleCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleCollection = (col: PaletteCollection) => {
    setSelectedCollections((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const resetFilters = () => {
    setSelectedFits([]);
    setSelectedCategories([]);
    setSelectedCollections([]);
    setSelectedColors([]);
    setPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedFits.length > 0 ||
    selectedCategories.length > 0 ||
    selectedCollections.length > 0 ||
    selectedColors.length > 0 ||
    priceRange !== 'all' ||
    searchQuery.trim().length > 0 ||
    Boolean(filterParam);

  const filteredProducts = useMemo(() => {
    const cleanSearch = searchQuery.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      if (filterParam === 'new' && !product.isNewArrival) return false;
      if (filterParam === 'bestsellers' && !product.isBestseller) return false;

      if (selectedFits.length > 0 && !selectedFits.includes(product.fit)) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      if (
        selectedCollections.length > 0 &&
        (!product.collection || !selectedCollections.includes(product.collection))
      ) {
        return false;
      }

      if (selectedColors.length > 0) {
        const hasColor = product.colors.some((c) => selectedColors.includes(c.name));
        if (!hasColor) return false;
      }

      if (priceRange === 'under1200' && product.price >= 1200) return false;
      if (priceRange === '1200to1350' && (product.price < 1200 || product.price > 1350)) return false;
      if (priceRange === 'above1350' && product.price <= 1350) return false;

      if (cleanSearch) {
        const match =
          product.name.toLowerCase().includes(cleanSearch) ||
          product.tagline.toLowerCase().includes(cleanSearch) ||
          product.fit.toLowerCase().includes(cleanSearch) ||
          product.category.toLowerCase().includes(cleanSearch) ||
          product.colors.some((c) => c.name.toLowerCase().includes(cleanSearch));
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0;
    });
  }, [selectedFits, selectedCategories, selectedCollections, selectedColors, priceRange, searchQuery, sortBy, filterParam]);

  const pageHeading =
    collectionParam
      ? `${collectionParam} Collection`
      : filterParam === 'new'
      ? 'New Arrivals'
      : filterParam === 'bestsellers'
      ? 'Bestsellers'
      : 'All Men’s T-Shirts';

  const FilterPanelContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="space-y-6">
      {/* Palette Collections Filter */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-brand-secondary-text">
          Collection
        </h4>
        <div className="space-y-2">
          {collectionsList.map((col) => (
            <label key={col} className="flex items-center gap-2.5 text-xs text-brand-black cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCollections.includes(col)}
                onChange={() => toggleCollection(col)}
                className="accent-brand-forest"
              />
              <span>{col}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fit Filter */}
      <div className="space-y-2.5 pt-4 border-t border-brand-border">
        <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-brand-secondary-text">
          Fit
        </h4>
        <div className="space-y-2">
          {fitsList.map((fit) => (
            <label key={fit} className="flex items-center gap-2.5 text-xs text-brand-black cursor-pointer">
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
      </div>

      {/* Style / Collection Filter */}
      <div className="space-y-2.5 pt-4 border-t border-brand-border">
        <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-brand-secondary-text">
          Style
        </h4>
        <div className="space-y-2">
          {categoriesList.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 text-xs text-brand-black cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="accent-brand-black"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colour Filter */}
      <div className="space-y-2.5 pt-4 border-t border-brand-border">
        <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-brand-secondary-text">
          Colour
        </h4>
        <div className="space-y-2">
          {availableColors.map((c) => (
            <label
              key={c.name}
              className="flex items-center gap-2.5 text-xs text-brand-black cursor-pointer hover:text-brand-mocha"
            >
              <input
                type="checkbox"
                checked={selectedColors.includes(c.name)}
                onChange={() => toggleColor(c.name)}
                className="accent-brand-black"
              />
              <span
                className="w-3 h-3 rounded-full border border-black/20 inline-block shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-2.5 pt-4 border-t border-brand-border">
        <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-brand-secondary-text">
          Price (INR)
        </h4>
        <div className="space-y-2 text-xs">
          {[
            { value: 'all', label: 'All Prices' },
            { value: 'under1200', label: 'Under ₹1,200' },
            { value: '1200to1350', label: '₹1,200 – ₹1,350' },
            { value: 'above1350', label: 'Above ₹1,350' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name={mobile ? 'price-mobile' : 'price-desktop'}
                checked={priceRange === opt.value}
                onChange={() => setPriceRange(opt.value as typeof priceRange)}
                className="accent-brand-black"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Catalogue Header */}
      <div className="border-b border-brand-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
            BENNYZ Catalogue
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-brand-black">
            {pageHeading}
          </h1>
          <p className="text-xs sm:text-sm text-brand-secondary-text max-w-xl">
            Oversized, boxy, regular, minimal, and graphic T-shirts built for everyday wear.
          </p>
        </div>

        <span className="text-xs font-mono text-brand-secondary-text">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'style' : 'styles'}
        </span>
      </div>

      {/* Search, Filter Trigger & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 border border-brand-border bg-white text-xs uppercase tracking-[0.14em] font-medium shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          {/* Inline Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-brand-secondary-text absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search T-shirts by name, fit, colour..."
              aria-label="Search T-shirts"
              className="w-full bg-white border border-brand-border pl-9 pr-8 py-2.5 text-xs text-brand-black placeholder-brand-secondary-text/60 focus:outline-none focus:border-brand-black"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-secondary-text hover:text-brand-black"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="shop-sort" className="text-[11px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
            Sort:
          </label>
          <select
            id="shop-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-brand-border text-xs px-3 py-2.5 text-brand-black focus:outline-none focus:border-brand-black font-medium"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={resetFilters}
            className="text-[11px] text-brand-mocha underline inline-flex items-center gap-1 hover:text-brand-black mr-2"
          >
            <RotateCcw className="w-3 h-3" /> Clear all
          </button>
          {selectedFits.map((fit) => (
            <span key={fit} className="bg-brand-ivory text-brand-black text-[11px] px-2.5 py-1 border border-brand-border flex items-center gap-1.5">
              {fit} Fit
              <button type="button" onClick={() => toggleFit(fit)} aria-label={`Remove ${fit} filter`}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedCategories.map((cat) => (
            <span key={cat} className="bg-brand-ivory text-brand-black text-[11px] px-2.5 py-1 border border-brand-border flex items-center gap-1.5">
              {cat}
              <button type="button" onClick={() => toggleCategory(cat)} aria-label={`Remove ${cat} filter`}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedColors.map((col) => (
            <span key={col} className="bg-brand-ivory text-brand-black text-[11px] px-2.5 py-1 border border-brand-border flex items-center gap-1.5">
              {col}
              <button type="button" onClick={() => toggleColor(col)} aria-label={`Remove ${col} filter`}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 border border-brand-border bg-white p-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-5">
            <span className="text-xs font-mono uppercase tracking-[0.16em] font-semibold text-brand-black">
              Filters
            </span>
            {hasActiveFilters && (
              <button type="button" onClick={resetFilters} className="text-[11px] text-brand-mocha hover:underline">
                Reset
              </button>
            )}
          </div>
          <FilterPanelContent />
        </aside>

        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-brand-border p-8 space-y-4">
              <h3 className="font-display text-2xl font-semibold text-brand-black">
                No matching T-shirts found
              </h3>
              <p className="text-xs text-brand-secondary-text max-w-sm mx-auto">
                Try adjusting your search or clearing one of the active fit, colour, or price filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-3 bg-brand-black text-brand-ivory text-xs tracking-[0.14em] uppercase font-medium hover:bg-brand-mocha transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-brand-black/60"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-brand-off-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-50 border-l border-brand-border">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-brand-border">
                <span className="font-display text-lg font-semibold text-brand-black">Filters</span>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-brand-secondary-text hover:text-brand-black"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanelContent mobile />
            </div>

            <div className="pt-6 border-t border-brand-border space-y-2">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.15em] font-medium"
              >
                Show {filteredProducts.length} Results
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full py-2 text-xs text-brand-secondary-text underline"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
