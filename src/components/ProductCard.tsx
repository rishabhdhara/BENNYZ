import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product, ProductSize, ProductColor } from '../types';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { Check, RotateCw } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isMobileBackView, setIsMobileBackView] = useState(false);
  const [backImageError, setBackImageError] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.defaultColor);
  const [quickAddSuccess, setQuickAddSuccess] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressNextLinkClickRef = useRef(false);
  const lastTouchTimeRef = useRef(0);

  const hasBackImage = Boolean(
    product.images.backImage &&
      product.images.backImage !== product.images.frontImage &&
      !backImageError
  );

  const showBackImage = hasBackImage && (isImageHovered || isMobileBackView);

  const handleQuickAdd = (size: ProductSize, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const res = addToCart(product, size, selectedColor, 1);
    if (res.success) {
      setQuickAddSuccess(true);
      setTimeout(() => {
        setQuickAddSuccess(false);
      }, 1400);
    }
  };

  const handleImageMouseEnter = () => {
    if (Date.now() - lastTouchTimeRef.current < 600) return;
    if (hasBackImage) {
      setIsImageHovered(true);
    }
  };

  const handleImageMouseLeave = () => {
    setIsImageHovered(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    lastTouchTimeRef.current = Date.now();
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    lastTouchTimeRef.current = Date.now();
    if (!hasBackImage || !touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > 32 && Math.abs(deltaX) > Math.abs(deltaY)) {
      suppressNextLinkClickRef.current = true;
      setIsMobileBackView((prev) => !prev);
      setTimeout(() => {
        suppressNextLinkClickRef.current = false;
      }, 350);
    }
  };

  const handleImageLinkClick = (e: React.MouseEvent) => {
    if (suppressNextLinkClickRef.current) {
      e.preventDefault();
    }
  };

  const handleToggleMobileView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileBackView((prev) => !prev);
  };

  return (
    <article
      className="group flex flex-col"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => {
        setIsCardHovered(false);
        setIsImageHovered(false);
      }}
    >
      {/* Fixed 3:4 Image Container */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-brand-ivory border border-brand-border/80"
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Link
          to={`/product/${product.slug}`}
          onClick={handleImageLinkClick}
          className="block relative w-full h-full"
          aria-label={`View ${product.name}`}
        >
          {/* Default Front Image */}
          <img
            src={product.images.frontImage}
            alt={`${product.name} — front view`}
            loading="eager"
            className={`absolute inset-0 w-full h-full object-cover object-[center_15%] transition-opacity duration-500 ease-in-out will-change-[opacity] ${
              showBackImage ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Back Image */}
          {hasBackImage && (
            <img
              src={product.images.backImage}
              alt={`${product.name} — back view`}
              loading="eager"
              onError={() => setBackImageError(true)}
              className={`absolute inset-0 w-full h-full object-cover object-[center_15%] transition-opacity duration-500 ease-in-out will-change-[opacity] ${
                showBackImage ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Minimal Single Corner Tag (New only, keeping photography unobstructed) */}
        {product.isNewArrival && (
          <span className="absolute top-2.5 left-2.5 z-10 pointer-events-none bg-brand-off-white/95 text-brand-black text-[9px] font-mono tracking-[0.16em] uppercase px-2 py-0.5 border border-brand-border">
            NEW
          </span>
        )}

        {/* Mobile / Touch Back Toggle Pill & Desktop Hover Micro-Label */}
        {hasBackImage && (
          <>
            <button
              type="button"
              onClick={handleToggleMobileView}
              className="lg:hidden absolute top-2.5 right-2.5 z-20 inline-flex items-center gap-1 bg-brand-off-white/95 text-brand-black border border-brand-border px-2 py-1 text-[9px] font-mono uppercase tracking-[0.12em] hover:bg-brand-black hover:text-brand-ivory transition-colors"
              aria-label={isMobileBackView ? 'Show front view' : 'Show back view'}
              aria-pressed={isMobileBackView}
            >
              <RotateCw className="w-2.5 h-2.5" />
              <span>{isMobileBackView ? 'Front' : 'Back'}</span>
            </button>

            <span
              className={`hidden lg:inline-block absolute top-2.5 right-2.5 z-10 pointer-events-none px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.14em] border transition-opacity duration-300 ${
                showBackImage
                  ? 'opacity-100 bg-brand-black text-brand-ivory border-brand-black'
                  : 'opacity-0 bg-brand-off-white/95 text-brand-black border-brand-border'
              }`}
            >
              Back
            </span>
          </>
        )}

        {/* Slim Quick Size Strip on Desktop Hover */}
        <div
          className={`hidden lg:block absolute inset-x-0 bottom-0 bg-brand-off-white/95 border-t border-brand-border px-2.5 py-2 transition-all duration-300 z-20 ${
            isCardHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          {quickAddSuccess ? (
            <div className="flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-brand-black">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span>Added to Bag</span>
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-1">
              {product.availableSizes.map((size) => {
                const inStock = (product.stockCount[size] || 0) > 0;
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!inStock}
                    onClick={(e) => handleQuickAdd(size, e)}
                    className={`py-1 text-[10px] font-mono border transition-colors ${
                      inStock
                        ? 'bg-white border-brand-border text-brand-black hover:bg-brand-black hover:text-brand-ivory hover:border-brand-black'
                        : 'bg-brand-ivory/50 border-brand-border/50 text-brand-secondary-text/40 cursor-not-allowed line-through'
                    }`}
                    aria-label={`Quick add size ${size}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Clean Product Metadata */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
            {product.fit} Fit
          </span>
          <div className="flex items-center gap-1.5">
            {product.colors.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-transform ${
                  selectedColor.code === c.code
                    ? 'ring-1 ring-offset-1 ring-brand-black scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: c.hex,
                  border:
                    c.hex.toUpperCase() === '#F9F8F5' || c.hex.toUpperCase() === '#FFFFFF'
                      ? '1px solid #C8C1B4'
                      : 'none',
                }}
                title={c.name}
                aria-label={`Select color ${c.name}`}
              />
            ))}
          </div>
        </div>

        <h3 className="text-xs sm:text-sm font-medium text-brand-black group-hover:text-brand-mocha transition-colors leading-snug">
          <Link to={`/product/${product.slug}`} className="block">
            {product.name}
          </Link>
        </h3>

        <div className="flex items-baseline justify-between">
          <span className="text-xs sm:text-sm font-semibold text-brand-black">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-brand-mocha">
            {product.category}
          </span>
        </div>
      </div>
    </article>
  );
};
