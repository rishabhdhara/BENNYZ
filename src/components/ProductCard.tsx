import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductSize, ProductColor } from '../types';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.defaultColor);
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickAddSuccess, setQuickAddSuccess] = useState(false);

  const handleQuickAdd = (size: ProductSize, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const res = addToCart(product, size, selectedColor, 1);
    if (res.success) {
      setQuickAddSuccess(true);
      setTimeout(() => {
        setQuickAddSuccess(false);
        setIsQuickAdding(false);
      }, 1500);
    }
  };

  return (
    <div
      className="group relative flex flex-col transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsQuickAdding(false);
      }}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE7DC] border border-brand-sand/15">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          {/* Main Primary Image */}
          <img
            src={product.images.front}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
          {/* Secondary Hover Image (Back or Lifestyle) */}
          <img
            src={product.images.lifestyle || product.images.back}
            alt={`${product.name} styling`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="bg-brand-black text-brand-ivory text-[9px] font-medium tracking-luxury uppercase px-2 py-0.5">
              NEW
            </span>
          )}
          <span className="bg-white/85 backdrop-blur-xs text-brand-black text-[9px] font-medium tracking-editorial uppercase px-2 py-0.5 border border-brand-sand/30">
            {product.fit} FIT
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="text-[9px] tracking-editorial font-medium text-brand-secondary bg-white/70 backdrop-blur-xs px-1.5 py-0.5">
            {product.specifications.gsm} GSM
          </span>
        </div>

        {/* Quick Add Overlay Drawer (appears on hover or quick add click) */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-brand-off-white/95 backdrop-blur-md p-3 transition-all duration-300 border-t border-brand-sand/30 ${
            isQuickAdding || isHovered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          {quickAddSuccess ? (
            <div className="flex items-center justify-center space-x-1.5 py-2 text-xs font-medium text-brand-black">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Added to Bag</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] tracking-editorial uppercase font-medium text-brand-secondary">
                  Quick Select Size:
                </span>
                <span className="text-[10px] text-brand-secondary">
                  Stock Verified
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {product.availableSizes.map((size) => {
                  const inStock = (product.stockCount[size] || 0) > 0;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!inStock}
                      onClick={(e) => handleQuickAdd(size, e)}
                      className={`text-[11px] py-1.5 font-medium transition-colors border ${
                        inStock
                          ? 'border-brand-sand/50 bg-white hover:bg-brand-black hover:text-brand-ivory hover:border-brand-black'
                          : 'border-brand-sand/20 bg-brand-sand/10 text-brand-secondary/40 cursor-not-allowed line-through'
                      }`}
                      title={inStock ? `Add size ${size}` : `Size ${size} out of stock`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Meta & Details */}
      <div className="mt-3.5 space-y-1.5 text-left">
        {/* Colour Swatches */}
        <div className="flex items-center space-x-1.5 pt-0.5">
          {product.colors.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setSelectedColor(c)}
              className={`w-3.5 h-3.5 rounded-full transition-transform ${
                selectedColor.code === c.code
                  ? 'ring-1 ring-offset-1 ring-brand-black scale-110'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex, border: c.hex === '#FFFFFF' ? '1px solid #ccc' : 'none' }}
              title={c.name}
              aria-label={`Select ${c.name}`}
            />
          ))}
          <span className="text-[10px] text-brand-secondary/70 ml-1 font-light">
            {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-medium tracking-wide text-brand-black group-hover:text-brand-mocha transition-colors">
          <Link to={`/product/${product.slug}`} className="block">
            {product.name}
          </Link>
        </h3>

        {/* Tagline / Subtitle */}
        <p className="text-[11px] text-brand-secondary line-clamp-1 font-light">
          {product.tagline}
        </p>

        {/* Price & Comparison */}
        <div className="flex items-baseline space-x-2 pt-0.5">
          <span className="text-sm font-medium text-brand-black">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-brand-secondary/60 line-through font-light">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
