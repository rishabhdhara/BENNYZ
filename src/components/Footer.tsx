import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RefreshCw, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-brand-black text-brand-ivory pt-20 pb-12 border-t border-brand-black">
      {/* Editorial Value Highlights Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full border border-brand-sand/30 flex items-center justify-center shrink-0 text-brand-sand">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-editorial font-medium text-brand-ivory">
                Pan-India Express Shipping
              </h4>
              <p className="text-[12px] text-brand-sand/80 mt-0.5">
                Complimentary delivery on all orders over ₹1,999.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full border border-brand-sand/30 flex items-center justify-center shrink-0 text-brand-sand">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-editorial font-medium text-brand-ivory">
                14-Day Effortless Exchange
              </h4>
              <p className="text-[12px] text-brand-sand/80 mt-0.5">
                Hassle-free doorstep size & color exchanges.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full border border-brand-sand/30 flex items-center justify-center shrink-0 text-brand-sand">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-editorial font-medium text-brand-ivory">
                Pure Heavyweight Cotton
              </h4>
              <p className="text-[12px] text-brand-sand/80 mt-0.5">
                210 - 260 GSM custom knit fabrics with zero compromise.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Philosophy Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.25em] font-semibold text-brand-ivory uppercase">
                BENNYS
              </span>
              <span className="block text-[9px] tracking-[0.35em] text-brand-sand uppercase mt-1">
                Everyday. Elevated.
              </span>
            </Link>
            <p className="text-xs text-brand-sand/90 leading-relaxed max-w-sm font-light">
              We design foundational menswear elevated through obsessive focus on fit, fabric weight, and subtle detailing. Designed in India for contemporary living.
            </p>
            <div className="pt-2 text-[11px] text-brand-sand/60">
              <span className="font-medium text-brand-sand">DROP 001 PROTOTYPE COLLECTION</span>
              <p className="mt-0.5">Indicative price points: ₹1,000 – ₹3,000.</p>
            </div>
          </div>

          {/* Quick Links Columns */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-[11px] font-semibold tracking-editorial uppercase text-brand-sand">
              Collection
            </h5>
            <ul className="space-y-2 text-xs text-brand-sand/80 font-light">
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
                  Regular Fit T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-brand-ivory transition-colors">
                  Minimal Solids
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=new" className="hover:text-brand-ivory transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-[11px] font-semibold tracking-editorial uppercase text-brand-sand">
              Client Care
            </h5>
            <ul className="space-y-2 text-xs text-brand-sand/80 font-light">
              <li>
                <Link to="/support#size-guide" className="hover:text-brand-ivory transition-colors">
                  Size Guide & Fit Matrix
                </Link>
              </li>
              <li>
                <Link to="/support#track" className="hover:text-brand-ivory transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link to="/support#shipping" className="hover:text-brand-ivory transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link to="/support#returns" className="hover:text-brand-ivory transition-colors">
                  14-Day Return Policy
                </Link>
              </li>
              <li>
                <Link to="/support#contact" className="hover:text-brand-ivory transition-colors">
                  Concierge & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription Column */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="text-[11px] font-semibold tracking-editorial uppercase text-brand-sand">
              The BENNYS Journal & Private Access
            </h5>
            <p className="text-xs text-brand-sand/80 font-light leading-relaxed">
              Receive private invitations to limited drops, architectural lookbooks, and early access to archival re-issues.
            </p>

            {subscribed ? (
              <div className="p-3 bg-brand-mocha/20 border border-brand-mocha/40 text-brand-ivory text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-sand shrink-0" />
                <span>You have been subscribed to early drop alerts. Welcome.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full bg-white/5 border border-white/20 text-xs px-3.5 py-2.5 text-brand-ivory placeholder-brand-sand/50 focus:outline-none focus:border-brand-sand transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-brand-ivory text-brand-black hover:bg-brand-sand transition-colors text-xs font-medium tracking-luxury uppercase shrink-0 flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {error && <p className="text-[11px] text-red-400">{error}</p>}
                <p className="text-[10px] text-brand-sand/50">
                  By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Legal, Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 text-[11px] text-brand-sand/60 flex flex-col md:flex-row items-center justify-between gap-4 font-light">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-center md:text-left">
          <span>© {new Date().getFullYear()} BENNYS APPAREL CO.</span>
          <Link to="/support#privacy" className="hover:text-brand-ivory transition-colors">
            Privacy Policy
          </Link>
          <Link to="/support#terms" className="hover:text-brand-ivory transition-colors">
            Terms of Service
          </Link>
          <span className="text-brand-sand/40">
            All prices in Indian Rupees (INR ₹)
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[10px] tracking-wider uppercase text-brand-sand/70">
          <span>UPI</span>
          <span>•</span>
          <span>VISA / MC</span>
          <span>•</span>
          <span>RUPAY</span>
          <span>•</span>
          <span>NET BANKING</span>
          <span>•</span>
          <span>COD</span>
        </div>
      </div>
    </footer>
  );
};
