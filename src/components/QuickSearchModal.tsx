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
      const matchCategory = p.category.toLowerCase().includes(clean);
      const matchColor = p.colors.some((c) => c.name.toLowerCase().includes(clean));
      const matchTag = p.tagline.toLowerCase().includes(clean);
      return matchName || matchDesc || matchFit || matchCategory || matchColor || matchTag;
    });

    setResults(matched);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div
        className="fixed inset-0 bg-brand-black/65 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-brand-off-white w-full max-w-2xl shadow-2xl z-10 border border-brand-border overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-brand-border flex items-center gap-3 bg-white">
          <Search className="w-4 h-4 text-brand-mocha shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search T-shirts by fit, style, or colour (e.g. Oversized, Boxy, Graphic, Ivory)..."
            className="w-full bg-transparent text-sm text-brand-black placeholder-brand-secondary-text/60 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-brand-secondary-text hover:text-brand-black"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-brand-secondary-text hover:text-brand-black ml-1"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-3 bg-brand-ivory/50 border-b border-brand-border flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-secondary-text">
            Quick Filter:
          </span>
          {['Oversized', 'Boxy', 'Regular', 'Minimal', 'Graphic', 'Essentials'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setQuery(chip)}
              className="px-2.5 py-1 bg-white border border-brand-border text-[11px] hover:border-brand-black transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-brand-secondary-text space-y-3">
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-brand-black">
                Browse BENNYZ Categories
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <Link to="/shop?fit=Oversized" onClick={onClose} className="text-brand-mocha hover:underline">
                  Oversized T-Shirts
                </Link>
                <Link to="/shop?fit=Boxy" onClick={onClose} className="text-brand-mocha hover:underline">
                  Boxy-Fit T-Shirts
                </Link>
                <Link to="/shop?category=Graphic" onClick={onClose} className="text-brand-mocha hover:underline">
                  Graphic T-Shirts
                </Link>
                <Link to="/shop" onClick={onClose} className="text-brand-mocha hover:underline">
                  All Essentials
                </Link>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-brand-secondary-text space-y-2">
              <p className="text-sm font-medium text-brand-black">No T-shirts found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs">
                Try searching for fits like Oversized, Boxy, Regular, or styles like Graphic or Minimal.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-brand-border">
              <div className="pb-3 text-[11px] font-mono text-brand-secondary-text uppercase tracking-[0.14em]">
                {results.length} {results.length === 1 ? 'Result' : 'Results'}
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="py-3 flex items-center justify-between group hover:bg-brand-ivory/40 px-2 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={product.images.frontImage}
                      alt={product.name}
                      className="w-12 h-14 object-cover border border-brand-border"
                    />
                    <div>
                      <h4 className="text-xs font-medium text-brand-black group-hover:text-brand-mocha transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-brand-secondary-text">
                        <span>{product.fit} Fit</span>
                        <span>•</span>
                        <span>{product.category}</span>
                        <span>•</span>
                        <span className="font-medium text-brand-black">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-secondary-text group-hover:text-brand-black group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
