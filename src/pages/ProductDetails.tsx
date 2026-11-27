import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { ProductColor, ProductSize } from '../types';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { SizeChartModal } from '../components/SizeChartModal';
import { DeliveryChecker } from '../components/DeliveryChecker';
import { ProductCard } from '../components/ProductCard';
import { BennyzLogo } from '../components/BennyzLogo';
import { Ruler, ChevronRight, ChevronLeft, ChevronDown, Info } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = PRODUCTS.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];

  const imagesList = useMemo(() => {
    const items: { key: string; label: string; src: string }[] = [
      { key: 'front', label: 'Front View', src: product.images.frontImage },
    ];
    if (product.images.backImage && product.images.backImage !== product.images.frontImage) {
      items.push({ key: 'back', label: 'Back View', src: product.images.backImage });
    }
    if (product.images.detailImage) {
      items.push({ key: 'detail', label: 'Fabric & Detail', src: product.images.detailImage });
    }
    if (product.images.lifestyleImage) {
      items.push({ key: 'lifestyle', label: 'Lifestyle', src: product.images.lifestyleImage });
    }
    return items;
  }, [product]);

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.defaultColor);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>('fit');

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setSelectedColor(product.defaultColor);
    setSelectedSize(null);
    setQuantity(1);
    setActiveIndex(0);
    setSizeError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, product]);

  const activeImage = imagesList[activeIndex] || imagesList[0];

  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || imagesList.length <= 1) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > 36 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please select a size before adding to your bag.');
      return;
    }
    setSizeError(null);
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError('Please select a size to continue.');
      return;
    }
    setSizeError(null);
    const res = addToCart(product, selectedSize, selectedColor, quantity);
    if (res.success) {
      navigate('/checkout');
    }
  };

  const currentStock = selectedSize ? product.stockCount[selectedSize] || 0 : null;
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-secondary-text" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand-black transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-brand-black transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/shop?fit=${product.fit}`} className="hover:text-brand-black transition-colors">{product.fit} Fit</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-black font-medium">{product.name}</span>
      </nav>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Product Gallery with Swipe & Thumbnail Switching */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className="relative aspect-[3/4] bg-brand-ivory overflow-hidden border border-brand-border select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {imagesList.map((img, idx) => (
              <img
                key={img.key}
                src={img.src}
                alt={`${product.name} — ${img.label}`}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-400 ease-in-out ${
                  idx === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            ))}

            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <span className="bg-brand-black text-brand-ivory text-[10px] font-mono tracking-[0.16em] uppercase px-2.5 py-1">
                {product.fit} Fit
              </span>
              <span className="bg-white/95 text-brand-black text-[10px] font-mono tracking-[0.16em] uppercase px-2.5 py-1 border border-brand-border">
                {product.category}
              </span>
            </div>

            {imagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-brand-off-white/90 border border-brand-border flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-brand-ivory transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-brand-off-white/90 border border-brand-border flex items-center justify-center text-brand-black hover:bg-brand-black hover:text-brand-ivory transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="bg-brand-black/85 text-brand-ivory text-[10px] font-mono uppercase tracking-[0.14em] px-2.5 py-1">
                {activeImage.label}
              </span>
              {imagesList.length > 1 && (
                <div className="flex items-center gap-1.5 bg-brand-off-white/90 border border-brand-border px-2 py-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={img.key}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === activeIndex ? 'bg-brand-black' : 'bg-brand-sand/70'
                      }`}
                      aria-label={`View ${img.label}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3">
            {imagesList.map((img, idx) => (
              <button
                key={img.key}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`text-left border transition-all bg-white ${
                  activeIndex === idx
                    ? 'border-brand-black ring-1 ring-brand-black'
                    : 'border-brand-border opacity-75 hover:opacity-100'
                }`}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={img.src}
                    alt={`${product.name} ${img.label}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <span className="block px-2 py-1.5 text-[10px] font-mono uppercase tracking-[0.1em] text-brand-black truncate">
                  {img.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Purchase & Garment Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-brand-border pb-5">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] text-brand-mocha">
              <span>{product.category} / {product.fit} Fit</span>
              <span>{product.sku}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-brand-black">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary-text">
              {product.tagline}
            </p>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-semibold text-brand-black">
                {formatPrice(product.price)}
              </span>
              <span className="text-[11px] text-brand-secondary-text">
                Inclusive of taxes
              </span>
            </div>
          </div>

          {/* Colour Selection */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                Colour
              </span>
              <span className="font-medium text-brand-black">{selectedColor.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    selectedColor.code === c.code
                      ? 'ring-2 ring-offset-2 ring-brand-black scale-105'
                      : 'opacity-80 hover:opacity-100'
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

          {/* Size Selection */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                  Size
                </span>
                {selectedSize && (
                  <span className="font-semibold text-brand-black">({selectedSize})</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-brand-mocha hover:underline font-medium"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {product.availableSizes.map((size) => {
                const stock = product.stockCount[size] || 0;
                const isSelected = selectedSize === size;
                const isOutOfStock = stock <= 0;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(null);
                    }}
                    className={`py-3 text-xs font-mono font-medium border transition-colors ${
                      isSelected
                        ? 'bg-brand-black text-brand-ivory border-brand-black'
                        : isOutOfStock
                        ? 'bg-brand-ivory/40 border-brand-border/50 text-brand-secondary-text/40 cursor-not-allowed line-through'
                        : 'bg-white border-brand-border text-brand-black hover:border-brand-black'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {sizeError ? (
              <p className="text-xs text-red-700 font-medium">{sizeError}</p>
            ) : selectedSize ? (
              <p className="text-[11px] text-brand-secondary-text">
                {currentStock && currentStock <= 5
                  ? `Low stock in ${selectedSize} (${currentStock} remaining).`
                  : `Size ${selectedSize} selected and available.`}
              </p>
            ) : (
              <p className="text-[11px] text-brand-secondary-text">
                Select a size to add this T-shirt to your bag.
              </p>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-brand-border bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-sm text-brand-black hover:bg-brand-ivory"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-mono font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => {
                      if (selectedSize && product.stockCount[selectedSize]) {
                        return Math.min(product.stockCount[selectedSize], q + 1);
                      }
                      return q + 1;
                    })
                  }
                  className="w-10 h-12 flex items-center justify-center text-sm text-brand-black hover:bg-brand-ivory"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-brand-black text-brand-ivory text-xs tracking-[0.16em] uppercase font-semibold hover:bg-brand-mocha transition-colors"
              >
                Add to Cart
              </button>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 border border-brand-black text-brand-black hover:bg-brand-ivory transition-colors text-xs tracking-[0.16em] uppercase font-semibold"
            >
              Proceed to Demo Checkout
            </button>
          </div>

          <div className="pt-2 space-y-2 text-xs sm:text-sm text-brand-secondary-text leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Woven Neck Label Detail */}
          <div className="p-4 bg-brand-ivory/50 border border-brand-border flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-secondary-text block">
                Neck Label Detail
              </span>
              <p className="text-xs text-brand-black">
                {product.fit} Fit • {selectedSize || 'Select Size'}
              </p>
            </div>
            <div className="px-3.5 py-2 bg-brand-forest border border-brand-gold/40">
              <BennyzLogo variant="light" height={20} />
            </div>
          </div>

          <DeliveryChecker />

          {/* Accordions */}
          <div className="border-t border-brand-border divide-y divide-brand-border text-xs">
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'fit' ? '' : 'fit')}
                className="w-full flex justify-between items-center text-left font-mono uppercase tracking-[0.14em] text-brand-black"
              >
                <span>Fit Description</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeAccordion === 'fit' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeAccordion === 'fit' && (
                <div className="mt-3 space-y-2 text-brand-secondary-text leading-relaxed">
                  <p>{product.fitNotes}</p>
                  <p className="text-[11px] font-mono text-brand-black/80">
                    Model reference: {product.modelInfo.height} • Chest: {product.modelInfo.chest} • Wearing {product.modelInfo.sizeWorn}
                  </p>
                </div>
              )}
            </div>

            <div className="py-3.5">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'fabric' ? '' : 'fabric')}
                className="w-full flex justify-between items-center text-left font-mono uppercase tracking-[0.14em] text-brand-black"
              >
                <span>Fabric &amp; Care Information</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeAccordion === 'fabric' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeAccordion === 'fabric' && (
                <div className="mt-3 space-y-3 text-brand-secondary-text leading-relaxed">
                  <div className="p-3 bg-brand-ivory/50 border border-brand-border flex items-start gap-2 text-[11px]">
                    <Info className="w-3.5 h-3.5 text-brand-mocha shrink-0 mt-0.5" />
                    <span>{product.specifications.specNotice}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="font-semibold text-brand-black block">Fabric Weight</span>
                      <span>{product.specifications.fabricWeight}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-brand-black block">Composition</span>
                      <span>{product.specifications.composition}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-brand-black block">Knit / Weave</span>
                      <span>{product.specifications.weave}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-brand-black block">Origin</span>
                      <span>{product.specifications.origin}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-brand-black block text-[11px] mb-1">Care</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      {product.specifications.careInstructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="py-3.5">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
                className="w-full flex justify-between items-center text-left font-mono uppercase tracking-[0.14em] text-brand-black"
              >
                <span>Shipping &amp; Return Information</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeAccordion === 'shipping' && (
                <div className="mt-3 space-y-2 text-brand-secondary-text leading-relaxed text-[11px]">
                  <p>
                    • Complimentary shipping on orders of ₹1,999 or more. Flat ₹99 shipping below ₹1,999.
                  </p>
                  <p>
                    • Standard dispatch &amp; return window details can be reviewed on our{' '}
                    <Link to="/shipping-policy" className="underline text-brand-black">Shipping Policy</Link>{' '}
                    and{' '}
                    <Link to="/returns-and-refunds" className="underline text-brand-black">Returns &amp; Refunds</Link>{' '}
                    pages.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="border-t border-brand-border pt-14 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
              More From BENNYZ
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-black mt-1">
              Explore Other Cuts
            </h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.14em] font-medium text-brand-black hover:underline">
            Shop All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3.5 gap-y-8 sm:gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>

      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        activeFit={product.fit}
      />
    </div>
  );
};
