import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { formatPrice } from '../utils/formatters';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const clean = query.toLowerCase().trim();
    const matched = PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(clean);
      const matchDesc = p.description.toLowerCase().includes(clean);
      const matchFit = p.fit.toLowerCase().includes(clean);
      const matchColor = p.colors.some((c) => c.name.toLowerCase().includes(clean));
      const matchTag = p.tagline.toLowerCase().includes(clean);
      return matchName || matchDesc || matchFit || matchColor || matchTag;
    });

    setResults(matched);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-brand-off-white w-full max-w-2xl shadow-2xl z-10 border border-brand-sand/40 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-brand-sand/30 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-brand-mocha shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by silhouette, color, fabric (e.g. Oversized, Mocha, White)..."
            className="w-full bg-transparent text-sm sm:text-base text-brand-black placeholder-brand-secondary/50 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-brand-secondary hover:text-brand-black"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-brand-secondary hover:text-brand-black ml-2"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Category Chips */}
        <div className="px-6 py-3 bg-brand-ivory/30 border-b border-brand-sand/20 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] tracking-editorial uppercase text-brand-secondary font-medium">
            Quick Filters:
          </span>
          {['Oversized', 'Boxy', 'Regular', 'White', 'Black', 'Mocha'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setQuery(chip)}
              className="px-2.5 py-1 bg-white border border-brand-sand/40 text-[11px] hover:border-brand-black transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-brand-secondary space-y-2">
              <p className="text-xs uppercase tracking-editorial font-medium text-brand-black">
                Popular Searches in Drop 001
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link
                  to="/shop?fit=Oversized"
                  onClick={onClose}
                  className="text-xs text-brand-mocha hover:underline"
                >
                  Heavyweight Oversized T-Shirts
                </Link>
                <span>•</span>
                <Link
                  to="/shop?fit=Boxy"
                  onClick={onClose}
                  className="text-xs text-brand-mocha hover:underline"
                >
                  The Stone Boxy Cut
                </Link>
                <span>•</span>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="text-xs text-brand-mocha hover:underline"
                >
                  The Essential Black Tee
                </Link>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-brand-secondary space-y-2">
              <p className="text-sm font-medium text-brand-black">No products found for "{query}"</p>
              <p className="text-xs font-light">
                Try searching for fits like "Oversized", "Boxy", or colors like "Mocha", "White", or "Sand".
              </p>
            </div>
          ) : (
            <div className="divide-y divide-brand-sand/20">
              <div className="pb-3 text-[11px] text-brand-secondary font-medium uppercase tracking-editorial">
                Found {results.length} Matching {results.length === 1 ? 'Piece' : 'Pieces'}:
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="py-3 flex items-center justify-between group hover:bg-brand-ivory/20 px-2 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={product.images.front}
                      alt={product.name}
                      className="w-12 h-14 object-cover border border-brand-sand/30"
                    />
                    <div>
                      <h4 className="text-xs font-medium text-brand-black group-hover:text-brand-mocha transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-brand-secondary">
                        <span>{product.fit} Fit</span>
                        <span>•</span>
                        <span>{product.specifications.gsm} GSM</span>
                        <span>•</span>
                        <span className="font-medium text-brand-black">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-secondary group-hover:text-brand-black group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
