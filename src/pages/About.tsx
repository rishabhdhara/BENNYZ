import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BennyzLogo, BennyzMonogram } from '../components/BennyzLogo';
import { BRAND_CONFIG } from '../data/siteConfig';

export const About: React.FC = () => {
  return (
    <div className="pb-20">
      {/* Editorial Intro */}
      <section className="border-b border-brand-border bg-brand-ivory/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
              About BENNYZ
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-semibold text-brand-black leading-[1.05]">
              {BRAND_CONFIG.tagline}
            </h1>
            <p className="text-sm text-brand-secondary-text leading-relaxed max-w-lg">
              BENNYZ is an independent men&apos;s T-shirt label created around a straightforward idea: make everyday T-shirts with considered fits and honest styling that work across real daily routines.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-mocha transition-colors"
              >
                <span>Shop T-Shirts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] border border-brand-border overflow-hidden bg-brand-ivory">
              <img
                src="/images/collection-essentials.jpg"
                alt="BENNYZ studio essentials table and rack"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Design Focus */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
              Focus
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-black mt-1">
              One garment, done properly.
            </h2>
          </div>

          <div className="md:col-span-8 space-y-4 text-sm text-brand-secondary-text leading-relaxed">
            <p>
              Instead of launching dozens of unrelated categories, BENNYZ concentrates on men&apos;s T-shirts — oversized cuts, boxy proportions, regular everyday blocks, clean minimal tees, and restrained graphics.
            </p>
            <p>
              Every piece is intended to pair effortlessly with what you already own: washed denim, relaxed trousers, chinos, and daily sneakers. No inflated price positioning, and no loud logos competing for attention.
            </p>
          </div>
        </div>

        {/* Three Fit Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-brand-border">
          <div className="p-6 bg-white border border-brand-border space-y-2">
            <span className="text-[10px] font-mono text-brand-mocha uppercase tracking-[0.16em]">01</span>
            <h3 className="font-display text-xl font-semibold text-brand-black">Oversized</h3>
            <p className="text-xs text-brand-secondary-text leading-relaxed">
              Dropped shoulder line and generous torso room for an easy, relaxed silhouette.
            </p>
          </div>
          <div className="p-6 bg-white border border-brand-border space-y-2">
            <span className="text-[10px] font-mono text-brand-mocha uppercase tracking-[0.16em]">02</span>
            <h3 className="font-display text-xl font-semibold text-brand-black">Boxy</h3>
            <p className="text-xs text-brand-secondary-text leading-relaxed">
              Squared chest width paired with a clean, slightly shorter hem that avoids fabric bunching.
            </p>
          </div>
          <div className="p-6 bg-white border border-brand-border space-y-2">
            <span className="text-[10px] font-mono text-brand-mocha uppercase tracking-[0.16em]">03</span>
            <h3 className="font-display text-xl font-semibold text-brand-black">Regular Fit</h3>
            <p className="text-xs text-brand-secondary-text leading-relaxed">
              Classic shoulder placement and balanced drape suited to solo wear or layering.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Wordmark & Identity System */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="border border-brand-border bg-white p-6 sm:p-10 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
              Visual Identity &amp; Palette
            </span>
            <h2 className="font-display text-2xl font-semibold text-brand-black">
              The OG BENNYZ Crest &amp; Wordmark
            </h2>
            <p className="text-xs text-brand-secondary-text max-w-xl">
              Signature serif wordmark integrated with the BENNYZ collar-crest monogram, paired with our Forest Green (#173B35), Oxblood (#702B3A), Burnt Copper (#A85F3D), Antique Gold (#C19A55), Midnight Blue (#263B5A), and Tobacco Tan (#C69B78) palette.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-8 bg-brand-off-white border border-brand-border flex flex-col items-center justify-center gap-3">
              <BennyzLogo variant="dark" height={34} />
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                Forest Green Wordmark
              </span>
            </div>
            <div className="p-8 bg-brand-forest border border-brand-forest flex flex-col items-center justify-center gap-3">
              <BennyzLogo variant="light" height={34} />
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-gold">
                Ivory on Forest Green
              </span>
            </div>
            <div className="p-8 bg-brand-oxblood border border-brand-oxblood flex flex-col items-center justify-center gap-3">
              <BennyzMonogram variant="gold" height={46} />
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-ivory">
                NN Crest on Oxblood
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
