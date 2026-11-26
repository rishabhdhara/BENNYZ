import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { BennyzLogo } from './BennyzLogo';
import { BRAND_CONFIG } from '../data/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black text-brand-ivory pt-16 pb-10 border-t border-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Wordmark & Tagline Band */}
        <div className="pb-12 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Link to="/" className="inline-block" aria-label="BENNYZ Home">
              <BennyzLogo variant="light" height={24} />
            </Link>
            <p className="text-xs tracking-[0.16em] uppercase text-brand-sand font-medium">
              {BRAND_CONFIG.tagline}
            </p>
          </div>

          <p className="text-xs text-brand-ivory/65 max-w-sm leading-relaxed">
            Men&apos;s T-shirts designed around proportion, clean colour palettes, and everyday wearability.
          </p>
        </div>

        {/* Navigation Grid (2-col on mobile, 4-col on desktop) */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 border-b border-white/10">
          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-sand">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-ivory/80 font-light">
              <li>
                <Link to="/shop" className="hover:text-brand-ivory transition-colors">
                  All T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?fit=Oversized" className="hover:text-brand-ivory transition-colors">
                  Oversized T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?fit=Boxy" className="hover:text-brand-ivory transition-colors">
                  Boxy-Fit T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?fit=Regular" className="hover:text-brand-ivory transition-colors">
                  Regular-Fit T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Minimal" className="hover:text-brand-ivory transition-colors">
                  Minimal T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Graphic" className="hover:text-brand-ivory transition-colors">
                  Graphic T-Shirts
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-sand">
              Brand
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-ivory/80 font-light">
              <li>
                <Link to="/about" className="hover:text-brand-ivory transition-colors">
                  About BENNYZ
                </Link>
              </li>
              <li>
                <Link to="/lookbook" className="hover:text-brand-ivory transition-colors">
                  Lookbook
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-ivory transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-ivory transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-sand">
              Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-ivory/80 font-light">
              <li>
                <Link to="/shipping-policy" className="hover:text-brand-ivory transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns-and-refunds" className="hover:text-brand-ivory transition-colors">
                  Returns and Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-brand-ivory transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-brand-ivory transition-colors">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-sand">
              Connect
            </h4>
            <div className="space-y-2.5 text-xs text-brand-ivory/80 font-light">
              <a
                href={BRAND_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-brand-ivory transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Instagram</span>
                <ArrowUpRight className="w-3 h-3 text-brand-sand" />
              </a>
              <p className="text-[11px] text-brand-ivory/55">{BRAND_CONFIG.instagramHandle}</p>
              <p className="text-[11px] text-brand-ivory/55 pt-1">{BRAND_CONFIG.supportEmail}</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-brand-ivory/55 font-light">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} BENNYZ</span>
            <span className="text-white/20">·</span>
            <Link to="/terms-and-conditions" className="hover:text-brand-ivory transition-colors">
              Terms and Conditions
            </Link>
            <span className="text-white/20">·</span>
            <Link to="/privacy-policy" className="hover:text-brand-ivory transition-colors">
              Privacy Policy
            </Link>
          </div>
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-brand-sand/75">
            INR (₹) · India
          </span>
        </div>
      </div>
    </footer>
  );
};
