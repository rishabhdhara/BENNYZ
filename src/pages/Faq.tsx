import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_ITEMS = [
  {
    q: 'What fits does BENNYZ offer?',
    a: 'BENNYZ T-shirts are available in three distinct fits: Oversized (dropped shoulders and relaxed volume), Boxy (wide chest with a slightly cropped torso length), and Regular Fit (classic shoulder alignment for solo wear or layering).',
  },
  {
    q: 'How do I choose the right size?',
    a: 'Take your normal size for the intended silhouette in Oversized, Boxy, or Regular cuts. You can check the measurement chart on every product detail page before adding an item to your bag.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Estimated delivery timelines depend on your PIN code and courier hub. Standard dispatch and delivery estimates are outlined on our Shipping Policy page.',
  },
  {
    q: 'What is your return and exchange policy?',
    a: 'Unworn, unwashed T-shirts with original tags intact are eligible for size exchanges or returns within the return window specified on our Returns and Refunds page.',
  },
  {
    q: 'How do I care for BENNYZ T-shirts?',
    a: 'Machine wash cold inside out with similar colours using mild detergent, avoid bleach, and line dry in shade to maintain shape and colour.',
  },
  {
    q: 'Is online payment active on this site?',
    a: 'This storefront currently includes a clearly labelled demo checkout. Live payment processing via a gateway such as Razorpay will be enabled when backend order APIs are connected.',
  },
];

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-2 border-b border-brand-border pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
          Support
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-brand-black">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary-text">
          Quick answers about fits, sizing, care, shipping, and orders.
        </p>
      </div>

      <div className="divide-y divide-brand-border border border-brand-border bg-white">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item.q} className="p-5">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex justify-between items-center text-left gap-4 text-xs sm:text-sm font-semibold text-brand-black hover:text-brand-mocha transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-brand-mocha' : ''}`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-xs sm:text-sm text-brand-secondary-text leading-relaxed">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-brand-ivory/50 border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <span className="text-brand-black">Still have a question about a product or order?</span>
        <Link
          to="/contact"
          className="px-5 py-2.5 bg-brand-black text-brand-ivory uppercase tracking-[0.14em] font-medium text-center hover:bg-brand-mocha transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};
