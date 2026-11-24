import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Scissors, Sparkles, Feather } from 'lucide-react';

export const OurStory: React.FC = () => {
  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* Editorial Hero Header */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center bg-[#E5DFD3] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1800&q=85"
            alt="BENNYS Workshop & Studio Portrait"
            className="w-full h-full object-cover object-center filter brightness-[0.88]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-brand-ivory space-y-4 pt-16">
          <span className="text-[10px] tracking-ultra uppercase text-brand-sand font-medium">
            ORIGIN & PHILOSOPHY
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-tight">
            BUILT AROUND THE EVERYDAY.
          </h1>
          <p className="text-xs sm:text-sm text-brand-sand/90 font-light max-w-xl mx-auto leading-relaxed tracking-wide">
            We started BENNYS with a singular obsession: to elevate the humble cotton t-shirt into an architectural essential of enduring quality.
          </p>
        </div>
      </section>

      {/* Chapter 1: The Core Belief */}
      <section className="max-w-4xl mx-auto px-6 space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
            CHAPTER 01 / THE MANIFESTO
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-black leading-snug">
            Everyday Clothing, Elevated.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-brand-secondary font-light leading-relaxed">
          <p>
            For too long, foundational menswear in India has been divided between two extremes: disposable, low-GSM fast fashion that distorts after a few cycles, or hyper-inflated luxury labels with four-figure markups that fail to justify their cost.
          </p>
          <p>
            BENNYS was founded on the belief that everyday clothing deserves the exact same craftsmanship, fabric weight, and silhouette calibration as bespoke tailoring. We focus exclusively on what you wear most often — starting with the essential t-shirt.
          </p>
        </div>
      </section>

      {/* Chapter 2: Visual Spread & Fabric Obsession */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-brand-sand/30 p-6 sm:p-12">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
              CHAPTER 02 / MATERIALITY
            </span>
            <h3 className="font-serif text-3xl text-brand-black">
              The Substance of Heavyweight Cotton
            </h3>
            <p className="text-xs sm:text-sm text-brand-secondary font-light leading-relaxed">
              We spent over eight months exploring yarn combinations, knitting gauges, and finishing washes across textile clusters in Tamil Nadu and Maharashtra. The result is our signature 210 to 260 GSM range: dense, tactile cotton that maintains its sculptural drape rather than adhering uncomfortably to the body.
            </p>
            <p className="text-xs sm:text-sm text-brand-secondary font-light leading-relaxed">
              Every roll of yarn is ring-spun with long-staple combed cotton, ensuring high tensile strength, resistance to pilling, and an exceptionally smooth surface handfeel.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 border-t border-brand-sand/20 text-xs">
              <div>
                <span className="font-serif text-2xl text-brand-black">240 GSM</span>
                <p className="text-[11px] text-brand-secondary mt-0.5">Heavyweight Studio Standard</p>
              </div>
              <div>
                <span className="font-serif text-2xl text-brand-black">1.5%</span>
                <p className="text-[11px] text-brand-secondary mt-0.5">Maximum Pre-Shrinkage Tolerance</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden bg-brand-sand/20">
            <img
              src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85"
              alt="Fabric weaving close-up"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Chapter 3: The Architecture of Fit */}
      <section className="max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
            CHAPTER 03 / CALIBRATION
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-brand-black">
            Three Cuts, Zero Guesswork
          </h2>
          <p className="text-xs sm:text-sm text-brand-secondary font-light max-w-xl mx-auto leading-relaxed">
            A great t-shirt begins at the collar and ends with the drape. Here is how our three signature cuts were engineered:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-brand-ivory/30 border border-brand-sand/30 space-y-3">
            <h4 className="font-serif text-xl text-brand-black">The Oversized</h4>
            <p className="text-xs text-brand-secondary font-light leading-relaxed">
              Extended dropped shoulder pitch, wider chest circumference, and elbow-skimming sleeves. Designed to fall straight down and flatter every physique.
            </p>
          </div>

          <div className="p-6 bg-brand-ivory/30 border border-brand-sand/30 space-y-3">
            <h4 className="font-serif text-xl text-brand-black">The Boxy Cut</h4>
            <p className="text-xs text-brand-secondary font-light leading-relaxed">
              Squared chest dimensions combined with a calibrated shorter body length. Engineered to sit perfectly above waistbands without bunching.
            </p>
          </div>

          <div className="p-6 bg-brand-ivory/30 border border-brand-sand/30 space-y-3">
            <h4 className="font-serif text-xl text-brand-black">The Regular Fit</h4>
            <p className="text-xs text-brand-secondary font-light leading-relaxed">
              Clean tailored shoulders with a subtle torso taper. The ultimate foundational piece for layering under unstructured blazers or knitwear.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 4: Thoughtful Indian Production */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-black text-brand-ivory p-8 sm:p-16 space-y-6">
          <span className="text-[10px] tracking-ultra uppercase text-brand-sand font-medium">
            CHAPTER 04 / CONSCIOUS CRAFT
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-brand-ivory leading-tight font-normal max-w-2xl">
            Rooted in India's Textile Heritage.
          </h2>
          <p className="text-xs sm:text-sm text-brand-sand/80 font-light max-w-3xl leading-relaxed">
            India has some of the world's finest cotton fields and spinning mills. We produce in intentional, small batches directly with specialized knitting houses in Tirupur and Coimbatore. No overproduction. No fast-fashion disposal. Only pieces created with care to last for years.
          </p>

          <div className="pt-6">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-brand-ivory text-brand-black text-xs font-semibold tracking-luxury uppercase hover:bg-brand-sand transition-colors"
            >
              <span>EXPERIENCE DROP 001</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
