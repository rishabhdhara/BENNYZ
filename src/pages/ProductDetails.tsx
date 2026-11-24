import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { Product, ProductColor, ProductSize } from '../types';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { SizeChartModal } from '../components/SizeChartModal';
import { DeliveryChecker } from '../components/DeliveryChecker';
import { ProductCard } from '../components/ProductCard';
import {
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Info,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0];

  // Component States
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.defaultColor);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageKey, setActiveImageKey] = useState<'front' | 'back' | 'detail' | 'lifestyle'>('front');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>('details');

  // Reset states when slug changes
  useEffect(() => {
    setSelectedColor(product.defaultColor);
    setSelectedSize(null);
    setQuantity(1);
    setActiveImageKey('front');
    setSizeError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, product]);

  const imagesList = [
    { key: 'front', label: 'Front Architecture', src: product.images.front },
    { key: 'back', label: 'Back & Silhouette', src: product.images.back },
    { key: 'detail', label: 'Fabric & Seam Detail', src: product.images.detail },
    { key: 'lifestyle', label: 'On-Model Styling', src: product.images.lifestyle },
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please select a size before adding to your shopping bag.');
      return;
    }
    setSizeError(null);
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError('Please select a size to proceed with Buy Now.');
      return;
    }
    setSizeError(null);
    const res = addToCart(product, selectedSize, selectedColor, quantity);
    if (res.success) {
      navigate('/checkout');
    }
  };

  const currentStock = selectedSize ? product.stockCount[selectedSize] || 0 : null;

  // Related products from same category or different fit
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-brand-secondary font-light">
        <Link to="/" className="hover:text-brand-black transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-brand-sand" />
        <Link to="/shop" className="hover:text-brand-black transition-colors">Collection</Link>
        <ChevronRight className="w-3 h-3 text-brand-sand" />
        <Link to={`/shop?fit=${product.fit}`} className="hover:text-brand-black transition-colors">{product.fit} Fit</Link>
        <ChevronRight className="w-3 h-3 text-brand-sand" />
        <span className="text-brand-black font-medium">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Product Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-[4/5] bg-[#EAE5DA] overflow-hidden border border-brand-sand/30 shadow-sm">
            <img
              src={product.images[activeImageKey] || product.images.front}
              alt={`${product.name} - ${activeImageKey}`}
              className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-brand-black text-brand-ivory text-[10px] tracking-luxury uppercase px-2.5 py-1 font-medium">
                {product.dropNumber}
              </span>
              <span className="bg-white/85 backdrop-blur-xs text-brand-black text-[10px] tracking-editorial uppercase px-2.5 py-1 border border-brand-sand/30 font-medium">
                {product.fit} SILHOUETTE
              </span>
            </div>
            <div className="absolute bottom-4 left-4 bg-brand-black/60 backdrop-blur-xs text-brand-ivory text-[10px] tracking-editorial px-2.5 py-1">
              VIEW: {activeImageKey.toUpperCase()}
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3">
            {imagesList.map((img) => (
              <button
                key={img.key}
                type="button"
                onClick={() => setActiveImageKey(img.key as any)}
                className={`relative aspect-[3/4] overflow-hidden border transition-all ${
                  activeImageKey === img.key
                    ? 'border-brand-black ring-1 ring-brand-black'
                    : 'border-brand-sand/40 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover object-center"
                />
                <span className="sr-only">{img.label}</span>
              </button>
            ))}
          </div>

          {/* Model Fit Metadata Badge */}
          <div className="p-4 bg-brand-ivory/30 border border-brand-sand/30 flex items-center justify-between text-xs text-brand-secondary">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-brand-mocha" />
              <span>
                Model is <strong className="text-brand-black">{product.modelInfo.height}</strong> with a{' '}
                <strong className="text-brand-black">{product.modelInfo.chest}</strong> chest, wearing size{' '}
                <strong className="text-brand-black">{product.modelInfo.sizeWorn}</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Product Purchase Details & Specs */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Pricing */}
          <div className="space-y-2 border-b border-brand-sand/30 pb-5">
            <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
              {product.category} COLLECTION • {product.specifications.gsm} GSM
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-brand-black font-normal">
              {product.name}
            </h1>
            <p className="text-xs text-brand-secondary font-light">
              {product.tagline}
            </p>

            <div className="flex items-baseline space-x-3 pt-2">
              <span className="text-2xl font-semibold text-brand-black font-sans">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-brand-secondary/60 line-through font-light">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                Inclusive of all taxes
              </span>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold uppercase tracking-editorial text-brand-secondary">
                Select Shade:
              </span>
              <span className="font-medium text-brand-black">{selectedColor.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              {product.colors.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full transition-all relative ${
                    selectedColor.code === c.code
                      ? 'ring-2 ring-offset-2 ring-brand-black scale-110'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: c.hex,
                    border: c.hex === '#FFFFFF' ? '1px solid #c4c4c4' : 'none'
                  }}
                  title={c.name}
                  aria-label={`Select color ${c.name}`}
                >
                  {selectedColor.code === c.code && (
                    <span className="sr-only">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection (MANDATORY) */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1">
                <span className="font-semibold uppercase tracking-editorial text-brand-secondary">
                  Select Size:
                </span>
                <span className="text-red-500 font-bold">*</span>
                {selectedSize && (
                  <span className="font-semibold text-brand-black ml-1">({selectedSize})</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(true)}
                className="inline-flex items-center space-x-1 text-xs text-brand-mocha hover:underline"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide & Measurements</span>
              </button>
            </div>

            {/* Sizes Grid */}
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
                    className={`py-3 text-xs font-semibold border transition-all text-center ${
                      isSelected
                        ? 'bg-brand-black text-brand-ivory border-brand-black shadow-sm'
                        : isOutOfStock
                        ? 'bg-brand-sand/10 border-brand-sand/20 text-brand-secondary/40 cursor-not-allowed line-through'
                        : 'bg-white border-brand-sand/40 text-brand-black hover:border-brand-black'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Error or Stock feedback */}
            {sizeError ? (
              <p className="text-xs text-red-600 font-medium animate-pulse">{sizeError}</p>
            ) : selectedSize ? (
              <p className="text-[11px] text-emerald-800">
                {currentStock && currentStock <= 5 ? (
                  <span className="text-amber-800 font-medium">
                    ⚡ Only {currentStock} units remaining in size {selectedSize} for Drop 001.
                  </span>
                ) : (
                  <span>✓ Size {selectedSize} is in stock. Ready to dispatch in 24 hours.</span>
                )}
              </p>
            ) : (
              <p className="text-[11px] text-brand-secondary/70 italic">
                * Please select your size to activate checkout.
              </p>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3">
              {/* Qty Counter */}
              <div className="flex items-center border border-brand-sand/50 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-sm text-brand-black hover:bg-brand-sand/20 transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-semibold text-brand-black">
                  {quantity}
                </span>
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
                  className="w-10 h-12 flex items-center justify-center text-sm text-brand-black hover:bg-brand-sand/20 transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-brand-black text-brand-ivory text-xs tracking-luxury uppercase font-medium hover:bg-brand-mocha transition-all duration-300 shadow-sm"
              >
                ADD TO BAG
              </button>
            </div>

            {/* Buy Now CTA */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 border border-brand-black text-brand-black hover:bg-brand-ivory transition-colors text-xs tracking-luxury uppercase font-semibold text-center"
            >
              BUY NOW WITH 1-CLICK CHECKOUT
            </button>
          </div>

          {/* Delivery PIN Code Checker */}
          <div className="pt-2">
            <DeliveryChecker />
          </div>

          {/* Sample Product Data Notice (as instructed: clearly labelled sample data) */}
          <div className="p-3 bg-brand-sand/15 border border-brand-sand/40 text-[11px] text-brand-secondary space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-brand-black uppercase tracking-wider text-[10px]">
              <Info className="w-3.5 h-3.5 text-brand-mocha" />
              <span>PROTOTYPE DATA SPECIFICATION</span>
            </div>
            <p className="font-light leading-relaxed">
              {product.specifications.sampleNotice}
            </p>
          </div>

          {/* Collapsible Accordions: Description, Fabric & Care, Shipping */}
          <div className="border-t border-brand-sand/30 pt-4 divide-y divide-brand-sand/20 text-xs">
            {/* Description Tab */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'details' ? '' : 'details')}
                className="w-full flex justify-between items-center text-left font-semibold uppercase tracking-editorial text-brand-black"
              >
                <span>Garment Architecture & Fit Description</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeAccordion === 'details' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'details' && (
                <div className="mt-3 space-y-2.5 text-brand-secondary font-light leading-relaxed">
                  <p>{product.description}</p>
                  <p className="text-brand-black font-medium">{product.story}</p>
                  <ul className="list-disc list-inside space-y-1 pt-1 text-[11px]">
                    <li>Silhouette: {product.fit} fit with ergonomic shoulder drop.</li>
                    <li>Neckline: 1x1 rib knit with internal herringbone tape reinforcement.</li>
                    <li>Origin: {product.specifications.origin}.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Fabric & Care Tab */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'fabric' ? '' : 'fabric')}
                className="w-full flex justify-between items-center text-left font-semibold uppercase tracking-editorial text-brand-black"
              >
                <span>Fabric Composition & GSM Details</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeAccordion === 'fabric' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'fabric' && (
                <div className="mt-3 space-y-2.5 text-brand-secondary font-light leading-relaxed">
                  <div className="grid grid-cols-2 gap-2 p-3 bg-brand-ivory/30 border border-brand-sand/20 text-[11px]">
                    <div>
                      <span className="font-semibold text-brand-black block">Fabric Weight:</span>
                      <span>{product.specifications.gsm} GSM</span>
                    </div>
                    <div>
                      <span className="font-semibold text-brand-black block">Composition:</span>
                      <span>{product.specifications.composition}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-brand-black block">Knit Weave:</span>
                      <span>{product.specifications.weave}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-brand-black block">Pre-Shrunk:</span>
                      <span>Enzyme washed (1.5% max)</span>
                    </div>
                  </div>

                  <p className="font-medium text-brand-black text-[11px] uppercase tracking-editorial">
                    Care Guidelines:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {product.specifications.careInstructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Shipping & Returns Tab */}
            <div className="py-3">
              <button
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
                className="w-full flex justify-between items-center text-left font-semibold uppercase tracking-editorial text-brand-black"
              >
                <span>Delivery & 14-Day Doorstep Exchanges</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeAccordion === 'shipping' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeAccordion === 'shipping' && (
                <div className="mt-3 space-y-2 text-brand-secondary font-light leading-relaxed text-[11px]">
                  <p>
                    • <strong>Complimentary Express Shipping:</strong> Automatically applied to all orders above ₹1,999. Flat ₹99 for orders below.
                  </p>
                  <p>
                    • <strong>Dispatch Schedule:</strong> All orders placed before 2:00 PM IST dispatch the same day from our fulfillment hub.
                  </p>
                  <p>
                    • <strong>14-Day Exchanges:</strong> If your tee does not fit as desired, our courier picks it up directly from your doorstep and delivers the replacement size.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="border-t border-brand-sand/30 pt-16 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold block">
              COMPLETE THE WARDROBE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-black mt-1">
              You May Also Appreciate
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-luxury font-medium text-brand-black hover:underline"
          >
            View All Pieces
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>

      {/* Sizing Modal Component */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        activeFit={product.fit}
      />
    </div>
  );
};
