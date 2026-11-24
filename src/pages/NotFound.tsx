import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 text-center space-y-6">
      <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
        ERROR 404
      </span>
      <h1 className="font-serif text-4xl sm:text-6xl text-brand-black">
        Page Not Located
      </h1>
      <p className="text-xs sm:text-sm text-brand-secondary max-w-md mx-auto font-light leading-relaxed">
        The editorial destination you requested does not exist or has been archived.
      </p>
      <div className="pt-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-brand-black text-brand-ivory text-xs font-semibold tracking-luxury uppercase hover:bg-brand-mocha transition-colors"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
