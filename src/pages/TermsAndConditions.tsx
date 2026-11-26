import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { TERMS_META, TERMS_SECTIONS } from '../data/termsContent';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Page Header */}
      <header className="space-y-4 border-b border-brand-border pb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha">
          <span>BENNYZ — {TERMS_META.tagline}</span>
          <span className="text-brand-secondary-text">
            Last Updated: {TERMS_META.lastUpdated}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-brand-black">
          {TERMS_META.pageTitle}
        </h1>

        <p className="text-xs sm:text-sm text-brand-secondary-text leading-relaxed max-w-3xl">
          {TERMS_META.intro}
        </p>

        {/* Related Policy Quick Links */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
            Related Policies:
          </span>
          <Link
            to="/privacy-policy"
            className="underline underline-offset-4 text-brand-black hover:text-brand-mocha transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-brand-border">|</span>
          <Link
            to="/shipping-policy"
            className="underline underline-offset-4 text-brand-black hover:text-brand-mocha transition-colors"
          >
            Shipping Policy
          </Link>
          <span className="text-brand-border">|</span>
          <Link
            to="/returns-and-refunds"
            className="underline underline-offset-4 text-brand-black hover:text-brand-mocha transition-colors"
          >
            Returns and Refunds
          </Link>
        </div>
      </header>

      {/* Pre-launch Placeholder Notice */}
      <div className="bg-brand-ivory/60 border border-brand-border p-4 sm:p-5 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
        <p className="text-brand-secondary-text leading-relaxed">
          <strong className="text-brand-black font-medium">Editable Legal Draft Notice:</strong>{' '}
          {TERMS_META.draftNotice}
        </p>
      </div>

      {/* Main Content Layout: Quick Index + Numbered Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Desktop Section Index */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-white border border-brand-border p-6 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-mocha block border-b border-brand-border pb-3">
            Contents (20 Sections)
          </span>
          <nav aria-label="Terms and Conditions sections" className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
            {TERMS_SECTIONS.map((sec) => (
              <a
                key={sec.number}
                href={`#section-${sec.number}`}
                className="flex items-baseline gap-2.5 text-xs text-brand-secondary-text hover:text-brand-black py-1 transition-colors"
              >
                <span className="font-mono text-[10px] text-brand-mocha w-5 shrink-0">
                  {String(sec.number).padStart(2, '0')}
                </span>
                <span className="leading-snug">{sec.title}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Numbered Legal Sections */}
        <div className="lg:col-span-8 bg-white border border-brand-border divide-y divide-brand-border">
          {TERMS_SECTIONS.map((section) => (
            <section
              key={section.number}
              id={`section-${section.number}`}
              className="p-6 sm:p-8 space-y-3 scroll-mt-24"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-mono text-brand-mocha font-medium shrink-0">
                  {String(section.number).padStart(2, '0')}.
                </span>
                <h2 className="font-display text-lg sm:text-xl font-semibold text-brand-black">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3 pl-0 sm:pl-7 text-xs sm:text-sm text-brand-secondary-text leading-relaxed">
                {section.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                {section.linkTo && (
                  <div className="pt-1">
                    <Link
                      to={section.linkTo.path}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-black underline underline-offset-4 hover:text-brand-mocha transition-colors"
                    >
                      <span>{section.linkTo.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
