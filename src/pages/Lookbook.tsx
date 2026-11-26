import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LOOKBOOK_LOOKS, PRODUCTS } from '../data/products';
import { ArrowRight, MapPin, Tag } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const Lookbook: React.FC = () => {
  const [activeLookId, setActiveLookId] = useState<string>(LOOKBOOK_LOOKS[0].id);

  const activeLook = LOOKBOOK_LOOKS.find((l) => l.id === activeLookId) || LOOKBOOK_LOOKS[0];
  const taggedProducts = PRODUCTS.filter((p) => activeLook.taggedProductIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
          BENNYZ Lookbook
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-brand-black">
          Everyday Uniforms
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary-text leading-relaxed">
          Oversized, boxy, regular, minimal, and graphic T-shirts styled with denim, relaxed trousers, and sneakers for daily wear.
        </p>
      </div>

      {/* Featured Look Spread */}
      <div className="bg-brand-black text-brand-ivory grid grid-cols-1 lg:grid-cols-12 border border-brand-black">
        <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[520px] overflow-hidden">
          <img
            src={activeLook.image}
            alt={activeLook.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-5 left-5 bg-brand-black/85 px-3 py-1.5 border border-white/15 text-[10px] font-mono tracking-[0.14em] text-brand-sand uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{activeLook.setting}</span>
          </div>
        </div>

        <div className="lg:col-span-4 p-7 sm:p-10 flex flex-col justify-between gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-sand uppercase block">
              {activeLook.edition}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-ivory leading-snug">
              {activeLook.title}
            </h2>
            <p className="text-xs text-brand-ivory/80 leading-relaxed">
              {activeLook.caption}
            </p>
            <p className="text-xs text-brand-sand/90 leading-relaxed pt-2 border-t border-white/10">
              <strong className="text-brand-ivory font-medium">Styling:</strong> {activeLook.stylingNotes}
            </p>
          </div>

          <div className="border-t border-white/10 pt-5 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-brand-sand flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Featured Pieces</span>
            </span>

            <div className="space-y-2.5">
              {taggedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="p-3 bg-white/5 border border-white/10 flex items-center justify-between hover:border-brand-sand transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images.frontImage}
                      alt={p.name}
                      className="w-10 h-12 object-cover border border-white/15"
                    />
                    <div>
                      <h4 className="text-xs text-brand-ivory font-medium group-hover:text-brand-sand transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-brand-sand/80">
                        {p.fit} Fit • {formatPrice(p.price)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-ivory group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Looks Grid */}
      <div className="space-y-6">
        <div className="flex items-end justify-between border-b border-brand-border pb-4">
          <h2 className="font-display text-2xl font-semibold text-brand-black">
            All Looks
          </h2>
          <span className="text-xs font-mono text-brand-secondary-text">
            {LOOKBOOK_LOOKS.length} Looks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOOKBOOK_LOOKS.map((look) => (
            <button
              key={look.id}
              type="button"
              onClick={() => {
                setActiveLookId(look.id);
                window.scrollTo({ top: 140, behavior: 'smooth' });
              }}
              className={`text-left group bg-white border transition-all ${
                activeLookId === look.id
                  ? 'border-brand-black ring-1 ring-brand-black'
                  : 'border-brand-border hover:border-brand-black'
              }`}
            >
              <div className="aspect-[3/4] overflow-hidden bg-brand-ivory relative">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                />
                {activeLookId === look.id && (
                  <span className="absolute top-3 right-3 bg-brand-black text-brand-ivory text-[9px] font-mono uppercase tracking-[0.14em] px-2 py-0.5">
                    Selected
                  </span>
                )}
              </div>
              <div className="p-5 space-y-1.5 border-t border-brand-border">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-mocha block">
                  {look.edition}
                </span>
                <h3 className="font-display text-lg font-medium text-brand-black">
                  {look.title}
                </h3>
                <p className="text-xs text-brand-secondary-text line-clamp-2">
                  {look.stylingNotes}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
