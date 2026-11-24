import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Compass, Layers, Check } from 'lucide-react';
import { PRODUCTS, LOOKBOOK_LOOKS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { formatPrice } from '../utils/formatters';

export const Home: React.FC = () => {
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival);
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#E8E2D5]">
        {/* Editorial Background Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=2000&q=85"
            alt="BENNYS Drop 001 Editorial Campaign - Male model wearing premium oversized t-shirt"
            className="w-full h-full object-cover object-top filter brightness-[0.92] contrast-[1.02]"
          />
          {/* Subtle gradient vignette for editorial text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/75 via-brand-black/25 to-transparent" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center text-brand-ivory space-y-6 pt-16">
          <div className="inline-flex items-center space-x-2 bg-brand-black/40 backdrop-blur-md px-3.5 py-1.5 border border-brand-ivory/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sand animate-pulse" />
            <span className="text-[10px] tracking-ultra uppercase font-medium text-brand-sand">
              THE FIRST DROP / 001
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight font-normal leading-[1.05] uppercase">
            LESS, BUT BETTER.
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-brand-ivory/90 font-light tracking-wide leading-relaxed">
            Elevated essentials. Thoughtfully made for everyday wear. Heavyweight combed cotton, relaxed silhouettes, and obsessive attention to cut and drape.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-brand-ivory text-brand-black text-xs font-semibold tracking-luxury uppercase hover:bg-brand-sand hover:text-brand-black transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>EXPLORE THE COLLECTION</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/lookbook"
              className="w-full sm:w-auto px-8 py-4 bg-brand-black/50 backdrop-blur-sm text-brand-ivory border border-white/20 text-xs font-semibold tracking-luxury uppercase hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              VIEW LOOKBOOK 001
            </Link>
          </div>

          <div className="pt-8 text-[11px] tracking-editorial uppercase text-brand-sand/80 flex items-center justify-center gap-6">
            <span>210 – 260 GSM COTTON</span>
            <span className="opacity-40">•</span>
            <span>CUSTOM SILHOUETTES</span>
            <span className="opacity-40">•</span>
            <span>CRAFTED IN INDIA</span>
          </div>
        </div>
      </section>

      {/* 2. THE EDITORIAL MANIFESTO STATEMENT */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-4">
        <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
          THE BENNYS PHILOSOPHY
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-black leading-snug">
          "The modern t-shirt shouldn’t be disposable. It should be the quiet anchor of your personal uniform."
        </h2>
        <p className="text-xs sm:text-sm text-brand-secondary max-w-2xl mx-auto font-light leading-relaxed pt-2">
          We reject thin, flimsy fast-fashion tees that warp after three washes. Every piece in Drop 001 is engineered with substantial yarn counts, ribbed collars that hold their geometry, and cuts calibrated for effortless contemporary style.
        </p>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-brand-sand/30 pb-4 gap-2">
          <div>
            <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-medium block">
              SEASONAL SELECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-black font-normal mt-1">
              New Arrivals / Drop 001
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="text-xs tracking-luxury uppercase font-medium text-brand-black hover:text-brand-mocha transition-colors flex items-center space-x-1"
          >
            <span>View All New</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SHOP BY FIT (OVERSIZED, BOXY, REGULAR) */}
      <section className="bg-brand-ivory/40 py-20 border-y border-brand-sand/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
              CALIBRATED SILHOUETTES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-black">
              Shop by Fit
            </h2>
            <p className="text-xs sm:text-sm text-brand-secondary font-light">
              We engineered three distinct fits tailored for different body types and styling preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Oversized Fit */}
            <div className="group relative flex flex-col bg-white border border-brand-sand/30 overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden bg-brand-sand/20">
                <img
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85"
                  alt="BENNYS Oversized Fit"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] tracking-editorial uppercase text-brand-secondary font-medium">
                    240 – 260 GSM • Heavyweight
                  </span>
                  <h3 className="font-serif text-2xl text-brand-black mt-1">
                    The Oversized Cut
                  </h3>
                  <p className="text-xs text-brand-secondary font-light mt-2 leading-relaxed">
                    Dropped shoulders, relaxed chest volume, and extended sleeve pitch. A sculpted silhouette that hangs without clinging.
                  </p>
                </div>
                <Link
                  to="/shop?fit=Oversized"
                  className="pt-4 text-xs tracking-luxury uppercase font-medium text-brand-black group-hover:text-brand-mocha flex items-center space-x-1 border-t border-brand-sand/20"
                >
                  <span>Explore Oversized</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Boxy Fit */}
            <div className="group relative flex flex-col bg-white border border-brand-sand/30 overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden bg-brand-sand/20">
                <img
                  src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=85"
                  alt="BENNYS Boxy Fit"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] tracking-editorial uppercase text-brand-secondary font-medium">
                    220 GSM • Compact Cotton
                  </span>
                  <h3 className="font-serif text-2xl text-brand-black mt-1">
                    The Boxy Silhouette
                  </h3>
                  <p className="text-xs text-brand-secondary font-light mt-2 leading-relaxed">
                    Squared chest proportion with slightly cropped body length. Eliminates fabric bunching around trousers.
                  </p>
                </div>
                <Link
                  to="/shop?fit=Boxy"
                  className="pt-4 text-xs tracking-luxury uppercase font-medium text-brand-black group-hover:text-brand-mocha flex items-center space-x-1 border-t border-brand-sand/20"
                >
                  <span>Explore Boxy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Regular Fit */}
            <div className="group relative flex flex-col bg-white border border-brand-sand/30 overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden bg-brand-sand/20">
                <img
                  src="https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=85"
                  alt="BENNYS Regular Fit"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] tracking-editorial uppercase text-brand-secondary font-medium">
                    210 GSM • Mercerized Cotton
                  </span>
                  <h3 className="font-serif text-2xl text-brand-black mt-1">
                    The Classic Regular
                  </h3>
                  <p className="text-xs text-brand-secondary font-light mt-2 leading-relaxed">
                    Refined shoulders with subtle waist taper. Structured enough to wear under tailoring yet casual enough for daily rotation.
                  </p>
                </div>
                <Link
                  to="/shop?fit=Regular"
                  className="pt-4 text-xs tracking-luxury uppercase font-medium text-brand-black group-hover:text-brand-mocha flex items-center space-x-1 border-t border-brand-sand/20"
                >
                  <span>Explore Regular</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BESTSELLING T-SHIRTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-brand-sand/30 pb-4 gap-2">
          <div>
            <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-medium block">
              FOUNDATIONAL PIECES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-black font-normal mt-1">
              Bestselling Essentials
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs tracking-luxury uppercase font-medium text-brand-black hover:text-brand-mocha transition-colors flex items-center space-x-1"
          >
            <span>View Complete Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {bestsellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. EDITORIAL BRAND CAMPAIGN (Split Feature) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-black text-brand-ivory grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Visual Column */}
          <div className="lg:col-span-7 relative min-h-[400px] lg:min-h-[550px]">
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85"
              alt="BENNYS Editorial Campaign"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-6 left-6 bg-brand-black/70 backdrop-blur-md px-3 py-1 border border-white/20 text-[10px] tracking-editorial text-brand-sand uppercase">
              STUDIO ARCHIVE • NEW DELHI
            </div>
          </div>

          {/* Copy Column */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-16 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] tracking-ultra uppercase text-brand-sand font-medium">
                PRECISION ENGINEERING
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-brand-ivory leading-tight font-normal">
                Why 240 GSM Matters.
              </h2>
              <p className="text-xs sm:text-sm text-brand-sand/90 font-light leading-relaxed">
                Most commercial tees are made from 140–160 GSM open-end yarn that collapses after a single wash. BENNYS develops custom 210–260 GSM combed cotton fabrics that hold architectural drape, resist distortion, and breathe effortlessly in Indian climates.
              </p>

              <div className="pt-4 space-y-2 text-xs text-brand-ivory/80">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-sand" />
                  <span>Double-needle coverstitching on collar and hem</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-sand" />
                  <span>Enzyme pre-washed to prevent shrinkage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-sand" />
                  <span>High-retention 1x1 ribbed collar that never sags</span>
                </div>
              </div>
            </div>

            <Link
              to="/story"
              className="inline-flex items-center space-x-2 text-xs tracking-luxury uppercase font-semibold text-brand-sand hover:text-white transition-colors"
            >
              <span>READ THE COMPLETE BRAND STORY</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. WHY BENNYS? (Values & Craft) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
            THE BENNYS STANDARD
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-black">
            Built Without Compromise
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-6 bg-white border border-brand-sand/30 space-y-3">
            <span className="font-serif text-2xl text-brand-mocha">01</span>
            <h4 className="text-xs uppercase tracking-editorial font-semibold text-brand-black">
              Substantive GSM
            </h4>
            <p className="text-xs text-brand-secondary font-light leading-relaxed">
              Knitted from 210 to 260 GSM heavy cotton. Heavy enough to drape clean, lightweight enough for tropical heat.
            </p>
          </div>

          <div className="p-6 bg-white border border-brand-sand/30 space-y-3">
            <span className="font-serif text-2xl text-brand-mocha">02</span>
            <h4 className="text-xs uppercase tracking-editorial font-semibold text-brand-black">
              Anti-Sag Collar
            </h4>
            <p className="text-xs text-brand-secondary font-light leading-relaxed">
              Reinforced ribbed necklines engineered with high-density spandex weave that stay flat wash after wash.
            </p>
          </div>

          <div className="p-6 bg-white border border-brand-sand/30 space-y-3">
            <span className="font-serif text-2xl text-brand-mocha">03</span>
            <h4 className="text-xs uppercase tracking-editorial font-semibold text-brand-black">
              Calibrated Fits
            </h4>
            <p className="text-xs text-brand-secondary font-light leading-relaxed">
              Engineered specifically for Indian body proportions with calibrated sleeve length and clean shoulder drop.
            </p>
          </div>

          <div className="p-6 bg-white border border-brand-sand/30 space-y-3">
            <span className="font-serif text-2xl text-brand-mocha">04</span>
            <h4 className="text-xs uppercase tracking-editorial font-semibold text-brand-black">
              Accessible Luxury
            </h4>
            <p className="text-xs text-brand-secondary font-light leading-relaxed">
              Direct-to-consumer pricing between ₹1,000–₹3,000 without retail markups or distributor fluff.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FEATURED LOOKBOOK CAROUSEL PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-brand-sand/30 pb-4 gap-2">
          <div>
            <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-medium block">
              EDITORIAL CURATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-black font-normal mt-1">
              Lookbook Drop 001
            </h2>
          </div>
          <Link
            to="/lookbook"
            className="text-xs tracking-luxury uppercase font-medium text-brand-black hover:text-brand-mocha transition-colors flex items-center space-x-1"
          >
            <span>Explore All 5 Looks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LOOKBOOK_LOOKS.slice(0, 3).map((look) => (
            <div key={look.id} className="group relative bg-brand-sand/10 border border-brand-sand/30 overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5 space-y-2 bg-white">
                <span className="text-[9px] tracking-editorial text-brand-secondary uppercase block">
                  {look.location}
                </span>
                <h3 className="font-serif text-lg text-brand-black group-hover:text-brand-mocha transition-colors">
                  {look.title}
                </h3>
                <p className="text-[11px] text-brand-secondary italic font-light">
                  "{look.quote}"
                </p>
                <Link
                  to="/lookbook"
                  className="pt-2 text-[11px] tracking-luxury uppercase font-semibold text-brand-black flex items-center space-x-1"
                >
                  <span>Shop The Look</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. COMMUNITY & INSTAGRAM GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] tracking-ultra uppercase text-brand-secondary font-medium">
            COMMUNITY & DAILY STYLING
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-black">
            @bennys.studio
          </h2>
          <p className="text-xs text-brand-secondary font-light">
            Tag #EverydayElevated to be featured in our seasonal curation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="aspect-square bg-brand-sand/20 overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
              alt="BENNYS Community style 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-brand-sand/20 overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
              alt="BENNYS Community style 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-brand-sand/20 overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80"
              alt="BENNYS Community style 3"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-brand-sand/20 overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80"
              alt="BENNYS Community style 4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
