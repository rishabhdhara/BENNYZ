import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenAccount }) => {
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'SHOP ALL', path: '/shop' },
    { label: 'NEW ARRIVALS', path: '/shop?filter=new' },
    { label: 'LOOKBOOK', path: '/lookbook' },
    { label: 'OUR STORY', path: '/story' },
    { label: 'SUPPORT', path: '/support' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-brand-black text-brand-ivory text-[11px] tracking-editorial py-2 px-4 text-center font-medium border-b border-brand-black/20 flex items-center justify-center gap-2">
        <span>THE FIRST DROP / 001 IS LIVE</span>
        <span className="opacity-40">•</span>
        <span>COMPLIMENTARY EXPRESS SHIPPING OVER ₹1,999</span>
        <span className="hidden md:inline opacity-40">•</span>
        <span className="hidden md:inline text-brand-sand">USE CODE: FIRSTDROP FOR 10% OFF</span>
      </div>

      {/* Main Luxury Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-off-white/95 backdrop-blur-md shadow-sm border-b border-brand-sand/30 py-3.5'
            : 'bg-brand-off-white border-b border-brand-sand/20 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 -ml-1.5 text-brand-black hover:text-brand-mocha transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-1.5 ml-2 text-brand-black hover:text-brand-mocha transition-colors"
                aria-label="Search collection"
              >
                <Search className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            {/* Desktop Left Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`nav-link text-xs tracking-luxury font-medium transition-colors ${
                    location.pathname + location.search === link.path
                      ? 'text-brand-black active'
                      : 'text-brand-black/80 hover:text-brand-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Centered Brand Wordmark */}
            <div className="text-center">
              <Link to="/" className="inline-block group">
                <span className="font-serif text-2xl sm:text-3xl lg:text-3xl tracking-[0.28em] font-semibold text-brand-black group-hover:text-brand-mocha transition-colors uppercase">
                  BENNYS
                </span>
                <span className="block text-[8px] sm:text-[9px] tracking-[0.35em] text-brand-secondary uppercase mt-0.5 font-light">
                  Everyday. Elevated.
                </span>
              </Link>
            </div>

            {/* Desktop Right Navigation & Actions */}
            <div className="flex items-center space-x-6 sm:space-x-7">
              <nav className="hidden lg:flex items-center space-x-8">
                {navLinks.slice(3).map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`nav-link text-xs tracking-luxury font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'text-brand-black active'
                        : 'text-brand-black/80 hover:text-brand-black'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Action Icons */}
              <div className="flex items-center space-x-4 sm:space-x-5">
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="hidden lg:flex items-center text-brand-black/80 hover:text-brand-black transition-colors"
                  aria-label="Search"
                  title="Search products"
                >
                  <Search className="w-4 h-4 stroke-[1.5]" />
                </button>

                <button
                  type="button"
                  onClick={onOpenAccount}
                  className="flex items-center text-brand-black/80 hover:text-brand-black transition-colors"
                  aria-label="Account"
                  title="Client Account"
                >
                  <User className="w-4 h-4 stroke-[1.5]" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="relative p-1 text-brand-black hover:text-brand-mocha transition-colors"
                  aria-label={`Shopping bag containing ${totalItemsCount} items`}
                >
                  <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 bg-brand-black text-brand-ivory text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                      {totalItemsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-brand-off-white shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-brand-sand/30">
                <span className="font-serif text-2xl tracking-[0.25em] font-medium text-brand-black">
                  BENNYS
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-brand-black/70 hover:text-brand-black"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="block text-sm tracking-editorial font-medium text-brand-black hover:text-brand-mocha transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Shop by Fit Quick Links */}
              <div className="pt-4 pb-6 border-t border-brand-sand/30">
                <span className="text-[10px] tracking-editorial font-semibold text-brand-secondary uppercase block mb-3">
                  Shop by Silhouette
                </span>
                <div className="space-y-2 text-xs text-brand-black/80 font-normal">
                  <Link to="/shop?fit=Oversized" className="block hover:text-brand-black py-1">
                    • The Oversized Cut
                  </Link>
                  <Link to="/shop?fit=Boxy" className="block hover:text-brand-black py-1">
                    • The Boxy Silhouette
                  </Link>
                  <Link to="/shop?fit=Regular" className="block hover:text-brand-black py-1">
                    • The Classic Regular Fit
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Info */}
            <div className="pt-6 border-t border-brand-sand/30 space-y-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-between py-2 text-xs tracking-editorial text-brand-black/80 border-b border-brand-sand/20"
              >
                <span>SEARCH STORE</span>
                <Search className="w-4 h-4 stroke-[1.5]" />
              </button>

              <div className="text-[11px] text-brand-secondary space-y-1">
                <p>Currency: INR (₹) / Delivery Across India</p>
                <p>Support: care@bennys.in</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
