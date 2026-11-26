import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BennyzLogo } from './BennyzLogo';
import { ANNOUNCEMENT_CONFIG, BRAND_CONFIG } from '../data/siteConfig';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { user, profile } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const firstName = (profile?.full_name || (user?.user_metadata?.full_name as string) || '').split(' ')[0];
  const accountLink = user ? '/account' : '/login';
  const accountLabel = user ? (firstName || 'Account') : 'Sign In';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'New Arrivals', path: '/shop?filter=new' },
    { label: 'Bestsellers', path: '/shop?filter=bestsellers' },
    { label: 'Lookbook', path: '/lookbook' },
    { label: 'About', path: '/about' },
  ];

  const isLinkActive = (path: string) => {
    const current = location.pathname + location.search;
    if (path === '/shop') {
      return location.pathname === '/shop' && !location.search;
    }
    return current === path;
  };

  return (
    <>
      {/* Editable Slim Announcement Bar */}
      {ANNOUNCEMENT_CONFIG.enabled && (
        <div className="bg-brand-black text-brand-ivory text-[10px] sm:text-[11px] tracking-[0.12em] uppercase py-2 px-3 sm:px-4 text-center font-medium">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5">
            <span>{ANNOUNCEMENT_CONFIG.message}</span>
            {ANNOUNCEMENT_CONFIG.ctaText && ANNOUNCEMENT_CONFIG.ctaLink && (
              <>
                <span className="text-brand-sand/40 hidden xs:inline">/</span>
                <Link
                  to={ANNOUNCEMENT_CONFIG.ctaLink}
                  className="underline underline-offset-4 text-brand-sand hover:text-brand-ivory transition-colors whitespace-nowrap"
                >
                  {ANNOUNCEMENT_CONFIG.ctaText}
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Refined Fashion Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-brand-off-white border-b ${
          isScrolled ? 'border-brand-black/15 py-3 shadow-sm' : 'border-brand-border py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 lg:grid-cols-12 items-center gap-4">
            {/* Left: Mobile Menu & Search OR Desktop Nav */}
            <div className="flex items-center gap-2 lg:col-span-5">
              <div className="flex items-center gap-1 lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-1.5 -ml-1.5 text-brand-black hover:text-brand-mocha transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5 stroke-[1.5]" />
                </button>
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="p-1.5 text-brand-black hover:text-brand-mocha transition-colors"
                  aria-label="Search T-shirts"
                >
                  <Search className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>

              <nav className="hidden lg:flex items-center gap-6 xl:gap-7" aria-label="Primary navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`nav-link whitespace-nowrap ${
                      isLinkActive(link.path)
                        ? 'text-brand-black active'
                        : 'text-brand-secondary-text hover:text-brand-black'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: Brand Wordmark */}
            <div className="flex justify-center lg:col-span-2">
              <Link to="/" className="inline-flex items-center group" aria-label="BENNYZ Home">
                <BennyzLogo variant="dark" height={19} className="w-auto transition-opacity group-hover:opacity-75" />
              </Link>
            </div>

            {/* Right: Balanced Utility Actions */}
            <div className="flex items-center justify-end gap-3.5 sm:gap-5 lg:col-span-5">
              <button
                type="button"
                onClick={onOpenSearch}
                className="hidden lg:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-brand-secondary-text hover:text-brand-black transition-colors"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5 stroke-[1.6]" />
                <span>Search</span>
              </button>

              <Link
                to={accountLink}
                className="inline-flex items-center gap-1.5 p-1 text-[11px] uppercase tracking-[0.14em] text-brand-secondary-text hover:text-brand-black transition-colors whitespace-nowrap"
                aria-label={accountLabel}
                title={accountLabel}
              >
                <span className="relative">
                  <User className="w-4 h-4 stroke-[1.6] text-brand-black" />
                  {user && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-brand-mocha" />
                  )}
                </span>
                <span className="hidden xl:inline">{accountLabel}</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 p-1 text-brand-black hover:text-brand-mocha transition-colors whitespace-nowrap"
                aria-label={`Shopping bag with ${totalItemsCount} items`}
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.6] shrink-0" />
                <span className="text-[11px] font-mono font-medium">
                  <span className="hidden sm:inline">Bag </span>({totalItemsCount})
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-brand-black/60 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-brand-off-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto border-r border-brand-border">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-brand-border">
                <BennyzLogo variant="dark" height={17} />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-brand-black/70 hover:text-brand-black"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <nav className="py-5 space-y-0.5" aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="flex items-center justify-between py-3 border-b border-brand-border/60 text-xs uppercase tracking-[0.16em] font-medium text-brand-black hover:text-brand-mocha transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-secondary-text" />
                  </Link>
                ))}
              </nav>

              <div className="pt-4 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-secondary-text block">
                  Shop by Fit
                </span>
                <div className="space-y-1.5 text-xs text-brand-black">
                  <Link to="/shop?fit=Oversized" className="block py-1 hover:text-brand-mocha">
                    Oversized T-Shirts
                  </Link>
                  <Link to="/shop?fit=Boxy" className="block py-1 hover:text-brand-mocha">
                    Boxy-Fit T-Shirts
                  </Link>
                  <Link to="/shop?fit=Regular" className="block py-1 hover:text-brand-mocha">
                    Regular-Fit T-Shirts
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-border space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="flex-1 flex items-center justify-between py-2.5 px-3 bg-white border border-brand-border text-xs uppercase tracking-[0.14em] text-brand-black"
                >
                  <span>Search</span>
                  <Search className="w-4 h-4 stroke-[1.5]" />
                </button>
                <Link
                  to={accountLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-between py-2.5 px-3 bg-white border border-brand-border text-xs uppercase tracking-[0.14em] text-brand-black"
                >
                  <span>{accountLabel}</span>
                  <User className="w-4 h-4 stroke-[1.5]" />
                </Link>
              </div>

              <div className="text-[11px] text-brand-secondary-text space-y-1">
                <p className="font-medium text-brand-black">{BRAND_CONFIG.tagline}</p>
                <p>{BRAND_CONFIG.supportEmail}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
