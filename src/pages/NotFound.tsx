import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-28 text-center space-y-5">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
        404
      </span>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-brand-black">
        Page not found
      </h1>
      <p className="text-xs sm:text-sm text-brand-secondary-text max-w-md mx-auto leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-black text-brand-ivory text-xs font-semibold tracking-[0.15em] uppercase hover:bg-brand-mocha transition-colors"
        >
          <span>Back to BENNYZ</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
