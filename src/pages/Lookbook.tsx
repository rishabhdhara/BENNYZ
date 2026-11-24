import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LOOKBOOK_LOOKS, PRODUCTS } from '../data/products';
import { ArrowRight, ShoppingBag, MapPin, Tag } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const Lookbook: React.FC = () => {
  const [activeLookId, setActiveLookId] = useState<string>(LOOKBOOK_LOOKS[0].id);

  const activeLook = LOOKBOOK_LOOKS.find((l) => l.id === activeLookId) || LOOKBOOK_LOOKS[0];

  const taggedProducts = PRODUCTS.filter((p) =>
    activeLook.taggedProductIds.includes(p.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
          DROP 001 EDITORIAL CAMPAIGN
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-brand-black font-normal">
          Lookbook: Form & Texture
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary font-light leading-relaxed">
          Captured across brutalist pavilions and warm daylight architectural studios. An exploration of heavy drape, sculpted silhouettes, and monochromatic restraint.
        </p>
      </div>

      {/* Featured Large Hero Look Showcase */}
      <div className="bg-brand-black text-brand-ivory grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-xl border border-brand-black">
        {/* Visual Column */}
        <div className="lg:col-span-8 relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto min-h-[480px]">
          <img
            src={activeLook.image}
            alt={activeLook.title}
            className="w-full h-full object-cover object-top filter brightness-[0.94]"
          />
          <div className="absolute top-6 left-6 bg-brand-black/70 backdrop-blur-md px-3.5 py-1.5 border border-white/20 text-[10px] tracking-editorial text-brand-sand uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{activeLook.location}</span>
          </div>
        </div>

        {/* Look Breakdown & Shoppable Tagged Items */}
        <div className="lg:col-span-4 p-8 sm:p-10 flex flex-col justify-between space-y-8 bg-[#1B1B1B]">
          <div className="space-y-4">
            <span className="text-[10px] tracking-ultra text-brand-sand uppercase font-medium">
              {activeLook.season}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-ivory font-normal leading-snug">
              {activeLook.title}
            </h2>
            <blockquote className="text-xs text-brand-sand/80 italic border-l border-brand-sand/40 pl-3 py-1 font-light">
              "{activeLook.quote}"
            </blockquote>
            <p className="text-xs text-brand-sand/70 font-light leading-relaxed pt-2">
              <strong className="text-brand-ivory font-medium">Styling Notes:</strong> {activeLook.stylingNotes}
            </p>
          </div>

          {/* Shoppable Tagged Products in This Look */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <span className="text-[10px] tracking-editorial uppercase text-brand-sand font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>SHOP PIECES FROM THIS LOOK:</span>
            </span>

            <div className="space-y-3">
              {taggedProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-white/5 border border-white/10 flex items-center justify-between hover:border-brand-sand/40 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={p.images.front}
                      alt={p.name}
                      className="w-10 h-12 object-cover border border-white/20"
                    />
                    <div>
                      <h4 className="text-xs text-brand-ivory font-medium line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-brand-sand font-light">
                        {p.fit} Fit • {formatPrice(p.price)}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/product/${p.slug}`}
                    className="p-2 bg-brand-ivory text-brand-black hover:bg-brand-sand transition-colors text-xs font-medium"
                    title={`View ${p.name}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All Looks for Discovery */}
      <div className="space-y-6 pt-8">
        <div className="flex items-end justify-between border-b border-brand-sand/30 pb-4">
          <div>
            <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
              COMPLETE EDITORIAL ARCHIVE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-black mt-1">
              Select Look to Explore
            </h2>
          </div>
          <span className="text-xs text-brand-secondary font-light">
            {LOOKBOOK_LOOKS.length} Curated Looks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {LOOKBOOK_LOOKS.map((look) => (
            <div
              key={look.id}
              onClick={() => {
                setActiveLookId(look.id);
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
              className={`group cursor-pointer bg-white border transition-all ${
                activeLookId === look.id
                  ? 'border-brand-black shadow-md ring-1 ring-brand-black'
                  : 'border-brand-sand/30 hover:border-brand-black'
              }`}
            >
              <div className="aspect-[4/5] overflow-hidden bg-brand-sand/20 relative">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {activeLookId === look.id && (
                  <span className="absolute top-3 right-3 bg-brand-black text-brand-ivory text-[9px] uppercase tracking-luxury px-2 py-0.5">
                    Currently Viewing
                  </span>
                )}
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[9px] tracking-editorial uppercase text-brand-secondary">
                  {look.location}
                </span>
                <h3 className="font-serif text-lg text-brand-black group-hover:text-brand-mocha transition-colors">
                  {look.title}
                </h3>
                <p className="text-xs text-brand-secondary line-clamp-2 font-light">
                  {look.stylingNotes}
                </p>
                <div className="pt-2 text-xs font-semibold text-brand-mocha flex items-center space-x-1">
                  <span>View Breakdown & Shop Pieces</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
