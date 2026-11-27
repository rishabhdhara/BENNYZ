import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PRODUCTS, LOOKBOOK_LOOKS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { BRAND_CONFIG } from '../data/siteConfig';

export const Home: React.FC = () => {
  const paletteDrops = PRODUCTS.filter((p) => ['bennyz-010', 'bennyz-011', 'bennyz-012', 'bennyz-013'].includes(p.id));
  const newArrivals = paletteDrops.length === 4 ? paletteDrops : PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4);
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim());
    if (!valid) {
      setNewsletterStatus('error');
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterStatus('success');
    setNewsletterError('');
    setNewsletterEmail('');
  };

  return (
    <div className="bg-brand-off-white">
      {/* 1. EDITORIAL CAMPAIGN HERO — Full-bleed right visual on desktop, above-the-fold CTA on mobile */}
      <section className="border-b border-brand-border bg-brand-ivory/40">
        {/* Desktop Split Campaign Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 min-h-[78vh]">
          <div className="lg:col-span-5 flex flex-col justify-between px-10 xl:px-14 py-12 border-r border-brand-border">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-brand-secondary-text">
              <span className="text-brand-forest font-medium">BENNYZ / VINTAGE LUXURY</span>
              <span className="text-brand-oxblood font-medium">FOREST · OXBLOOD · COPPER</span>
            </div>

            <div className="space-y-6 my-auto py-8">
              <h1 className="font-display text-5xl xl:text-[62px] font-semibold tracking-tightest leading-[0.98] text-brand-black">
                {BRAND_CONFIG.tagline}
              </h1>
              <p className="text-sm text-brand-secondary-text leading-relaxed max-w-sm">
                Heavyweight men&apos;s T-shirts rooted in our signature palette — Forest Green, Oxblood, Burnt Copper, and Midnight Blue.
              </p>

              <div className="pt-2 flex items-center gap-6">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 px-7 py-4 bg-brand-forest text-brand-ivory text-xs font-semibold tracking-[0.16em] uppercase hover:bg-brand-oxblood transition-colors"
                >
                  <span>SHOP T-SHIRTS</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold" />
                </Link>
                <Link
                  to="/lookbook"
                  className="text-xs font-medium uppercase tracking-[0.14em] text-brand-forest underline underline-offset-4 hover:text-brand-oxblood transition-colors"
                >
                  Lookbook
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-brand-border pt-4 gap-4 text-[11px]">
              <Link to="/shop?collection=Forest+Green" className="group">
                <span className="font-mono text-[10px] text-brand-forest block">01</span>
                <span className="font-medium text-brand-black group-hover:text-brand-oxblood group-hover:underline">Forest Green</span>
              </Link>
              <Link to="/shop?collection=Oxblood" className="group">
                <span className="font-mono text-[10px] text-brand-oxblood block">02</span>
                <span className="font-medium text-brand-black group-hover:text-brand-oxblood group-hover:underline">Oxblood</span>
              </Link>
              <Link to="/shop?collection=Vintage" className="group">
                <span className="font-mono text-[10px] text-brand-copper block">03</span>
                <span className="font-medium text-brand-black group-hover:text-brand-oxblood group-hover:underline">Vintage Copper</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 relative overflow-hidden bg-brand-forest">
            <img
              src="/images/hero-palette-campaign.jpg"
              alt="BENNYZ Forest Green and Oxblood luxury streetwear campaign"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-6 left-6 bg-brand-forest/95 border border-brand-gold/50 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-ivory">
              Signature Palette Drop — Out Now
            </div>
          </div>
        </div>

        {/* Mobile Full-Bleed Campaign Hero (CTA visible above the fold) */}
        <div className="lg:hidden">
          <div className="relative h-[58vh] min-h-[380px] w-full overflow-hidden bg-brand-forest">
            <img
              src="/images/hero-palette-campaign.jpg"
              alt="BENNYZ Forest Green and Oxblood luxury streetwear campaign"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/90 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-brand-ivory">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gold block">
                BENNYZ / Forest · Oxblood · Vintage
              </span>
              <p className="font-display text-3xl font-semibold leading-[1.04] mt-1">
                {BRAND_CONFIG.tagline}
              </p>
            </div>
          </div>

          <div className="px-4 py-5 bg-brand-off-white flex items-center justify-between gap-3">
            <Link
              to="/shop"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-forest text-brand-ivory text-xs font-semibold tracking-[0.16em] uppercase"
            >
              <span>SHOP T-SHIRTS</span>
              <ArrowRight className="w-4 h-4 text-brand-gold" />
            </Link>
            <Link
              to="/lookbook"
              className="px-5 py-3.5 border border-brand-forest text-brand-forest text-xs font-medium tracking-[0.14em] uppercase"
            >
              Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* Architectural Lineup Index Strip */}
      <div className="border-b border-brand-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-secondary-text">
          <span>Oversized · Boxy · Regular</span>
          <span className="hidden sm:inline">Minimal &amp; Graphic Silhouettes</span>
          <span>Everyday Men&apos;s Essentials</span>
        </div>
      </div>

      {/* 2. NEW ARRIVALS (4-Column Clean Editorial Row, 2-Column on Mobile) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-7 sm:space-y-9">
        <div className="flex items-end justify-between border-b border-brand-border pb-4 gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
              01 / Latest Drop
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-semibold text-brand-black mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-medium text-brand-black hover:text-brand-mocha transition-colors shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. THE FOUR PALETTE COLLECTIONS */}
      <section className="border-y border-brand-border bg-brand-ivory/55 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-oxblood block">
                02 / Palette Editions
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold text-brand-black mt-1">
                Signature Collections
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-brand-secondary-text max-w-md">
              Built around four rich vintage luxury colourways — Forest Green, Oxblood, Burnt Copper, and Midnight Blue.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                title: 'Forest Green Collection',
                hex: '#173B35',
                role: 'Primary · Timeless',
                img: '/images/collection-forest.jpg',
                link: '/shop?collection=Forest+Green',
              },
              {
                title: 'Oxblood Collection',
                hex: '#702B3A',
                role: 'Secondary · Luxury',
                img: '/images/collection-oxblood.jpg',
                link: '/shop?collection=Oxblood',
              },
              {
                title: 'Vintage Collection',
                hex: '#A85F3D',
                role: 'Accent · Burnt Copper',
                img: '/images/collection-vintage.jpg',
                link: '/shop?collection=Vintage',
              },
              {
                title: 'Midnight Collection',
                hex: '#263B5A',
                role: 'Supporting · Modern',
                img: '/images/collection-midnight.jpg',
                link: '/shop?collection=Midnight',
              },
            ].map((col) => (
              <Link
                key={col.title}
                to={col.link}
                className="group block border border-brand-border bg-brand-off-white hover:border-brand-forest transition-colors"
              >
                <div className="aspect-[3/4] overflow-hidden bg-brand-forest/10 relative">
                  <img
                    src={col.img}
                    alt={col.title}
                    className="w-full h-full object-cover object-[center_15%] group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <span
                    className="absolute top-3 left-3 w-4 h-4 rounded-full border border-white/60 shadow-sm"
                    style={{ backgroundColor: col.hex }}
                    title={col.hex}
                  />
                </div>
                <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2 border-t border-brand-border">
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
                      {col.role}
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-semibold text-brand-black mt-0.5 truncate">
                      {col.title}
                    </h3>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-forest group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED COLLECTION — BENNYZ HERITAGE PALETTE CAMPAIGN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="bg-brand-forest text-brand-ivory grid grid-cols-1 lg:grid-cols-12 border border-brand-forest">
          <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[460px] overflow-hidden">
            <img
              src="/images/collection-oxblood.jpg"
              alt="BENNYZ Oxblood & Forest Green Heritage Palette"
              className="w-full h-full object-cover object-[center_15%]"
            />
          </div>

          <div className="lg:col-span-5 p-7 sm:p-10 lg:p-12 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-brand-gold block">
                Rich Vintage Luxury + Streetwear
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight text-brand-ivory">
                The BENNYZ Brand Palette
              </h2>
              <p className="text-xs sm:text-sm text-brand-ivory/80 leading-relaxed">
                Every tone is curated to pair naturally together — deep Forest Green and Oxblood anchored by Burnt Copper, Antique Gold, Midnight Blue, and Tobacco Tan.
              </p>

              <div className="pt-4 border-t border-brand-gold/25 space-y-2.5">
                <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-gold">
                  Official Palette
                </p>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                  {[
                    { name: 'Forest', hex: '#173B35' },
                    { name: 'Oxblood', hex: '#702B3A' },
                    { name: 'Copper', hex: '#A85F3D' },
                    { name: 'Gold', hex: '#C19A55' },
                    { name: 'Midnight', hex: '#263B5A' },
                    { name: 'Tobacco', hex: '#C69B78' },
                  ].map((sw) => (
                    <div key={sw.name} className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: sw.hex }}
                      />
                      <span className="text-brand-ivory/85 truncate">{sw.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/shop?collection=Forest+Green"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-gold text-brand-black text-xs font-semibold uppercase tracking-[0.15em] hover:bg-brand-ivory transition-colors"
              >
                <span>Shop Forest Green</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?collection=Oxblood"
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-brand-oxblood text-brand-ivory text-xs uppercase tracking-[0.14em] hover:bg-brand-copper transition-colors"
              >
                <span>Oxblood Drop</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BESTSELLERS — Asymmetric Editorial Column + 2x2 Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start border-t border-brand-border pt-12 sm:pt-14">
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
              03 / Core Rotation
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-black">
              Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-brand-secondary-text leading-relaxed max-w-sm">
              The everyday silhouettes customers reach for most — easy proportions in neutral tones and understated back graphics.
            </p>
            <div className="pt-2">
              <Link
                to="/shop?filter=bestsellers"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-brand-black border-b border-brand-black pb-1 hover:text-brand-mocha hover:border-brand-mocha transition-colors"
              >
                <span>Shop Bestsellers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-12">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. LOOKBOOK — Asymmetric Lifestyle Grid */}
      <section className="bg-white border-y border-brand-border py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
                04 / In Motion
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold text-brand-black mt-1">
                Lookbook
              </h2>
            </div>
            <Link
              to="/lookbook"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-medium text-brand-black hover:text-brand-mocha transition-colors shrink-0"
            >
              <span>Full Lookbook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            <Link
              to="/lookbook"
              className="md:col-span-6 group relative overflow-hidden border border-brand-border bg-brand-ivory aspect-[3/4] md:aspect-auto md:min-h-[480px]"
            >
              <img
                src={LOOKBOOK_LOOKS[1].image}
                alt={LOOKBOOK_LOOKS[1].title}
                className="w-full h-full object-cover object-[center_15%] group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-brand-black/90 text-brand-ivory flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-sand block">
                    {LOOKBOOK_LOOKS[1].edition}
                  </span>
                  <p className="text-sm font-medium mt-0.5">{LOOKBOOK_LOOKS[1].title}</p>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </div>
            </Link>

            <div className="md:col-span-6 grid grid-cols-2 gap-3.5 sm:gap-6">
              {[LOOKBOOK_LOOKS[4], LOOKBOOK_LOOKS[5]].map((look) => (
                <Link
                  key={look.id}
                  to="/lookbook"
                  className="group border border-brand-border bg-brand-off-white flex flex-col overflow-hidden"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-brand-ivory">
                    <img
                      src={look.image}
                      alt={look.title}
                      className="w-full h-full object-cover object-[center_15%] group-hover:scale-[1.02] transition-transform duration-700"
                    />
                  </div>
                  <div className="p-3.5 sm:p-4 space-y-1 border-t border-brand-border">
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] text-brand-mocha block">
                      {look.edition}
                    </span>
                    <h3 className="text-xs sm:text-sm font-medium text-brand-black group-hover:text-brand-mocha transition-colors">
                      {look.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. BRAND STATEMENT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-5">
        <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-brand-mocha block">
          BENNYZ — {BRAND_CONFIG.tagline}
        </span>
        <h2 className="font-display text-2xl sm:text-4xl font-semibold text-brand-black leading-snug">
          Everyday T-shirts made to fit naturally into how you actually live and dress.
        </h2>
        <p className="text-xs sm:text-sm text-brand-secondary-text max-w-xl mx-auto leading-relaxed">
          Focused on proportion, clean finishes, and wearable colourways across oversized, boxy, and regular blocks — designed to pair easily with denim, trousers, and sneakers.
        </p>
        <div className="pt-2">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-brand-black border-b border-brand-black pb-1 hover:text-brand-mocha hover:border-brand-mocha transition-colors"
          >
            <span>About BENNYZ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="border-t border-brand-border bg-brand-ivory/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-6 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
                Newsletter
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-brand-black">
                Updates on new T-shirt drops and restocks.
              </h3>
            </div>

            <div className="lg:col-span-6">
              {newsletterStatus === 'success' ? (
                <div className="p-4 bg-white border border-brand-border flex items-center gap-3 text-xs text-brand-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Subscribed. Thank you for joining BENNYZ updates.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterStatus === 'error') setNewsletterStatus('idle');
                      }}
                      placeholder="Enter your email address"
                      aria-label="Email address for newsletter"
                      className="flex-1 bg-white border border-brand-border px-4 py-3 text-xs text-brand-black placeholder-brand-secondary-text/60 focus:outline-none focus:border-brand-black"
                    />
                    <button
                      type="submit"
                      className="px-7 py-3 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-mocha transition-colors shrink-0"
                    >
                      Subscribe
                    </button>
                  </div>
                  {newsletterStatus === 'error' && (
                    <p className="text-[11px] text-red-700">{newsletterError}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
