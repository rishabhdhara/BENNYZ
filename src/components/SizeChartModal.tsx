import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { SIZE_CHART_DATA } from '../data/products';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFit?: string;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  activeFit = 'Boxy'
}) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-brand-off-white w-full max-w-2xl shadow-2xl z-10 border border-brand-sand/40 max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex justify-between items-start pb-4 border-b border-brand-sand/30">
          <div>
            <div className="flex items-center space-x-2 text-brand-mocha mb-1">
              <Ruler className="w-4 h-4" />
              <span className="text-[10px] tracking-editorial uppercase font-medium">
                PRECISION SIZING MATRIX
              </span>
            </div>
            <h2 className="font-serif text-2xl font-medium text-brand-black">
              BENNYS Tailoring & Size Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-brand-secondary hover:text-brand-black transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Toggle & Fit Explanation */}
        <div className="my-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-brand-secondary">
            <span className="font-medium text-brand-black">Current Product Cut:</span>{' '}
            <span className="uppercase text-brand-mocha font-semibold">{activeFit} Fit</span>
          </div>

          <div className="inline-flex border border-brand-sand/50 bg-brand-ivory/40 p-0.5 rounded-none self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs tracking-luxury uppercase font-medium transition-colors ${
                unit === 'inches'
                  ? 'bg-brand-black text-brand-ivory'
                  : 'text-brand-black/70 hover:text-brand-black'
              }`}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs tracking-luxury uppercase font-medium transition-colors ${
                unit === 'cm'
                  ? 'bg-brand-black text-brand-ivory'
                  : 'text-brand-black/70 hover:text-brand-black'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-brand-sand/30 my-4 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-ivory text-brand-black uppercase tracking-editorial text-[10px] border-b border-brand-sand/30">
              <tr>
                <th className="py-3 px-4 font-semibold">Size</th>
                <th className="py-3 px-4 font-semibold">Chest Circumference</th>
                <th className="py-3 px-4 font-semibold">Garment Length</th>
                <th className="py-3 px-4 font-semibold">Shoulder Width</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-sand/20 font-light text-brand-black">
              {SIZE_CHART_DATA.map((row) => (
                <tr key={row.size} className="hover:bg-brand-off-white/80 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-brand-black">{row.size}</td>
                  <td className="py-2.5 px-4">
                    {unit === 'inches' ? `${row.chestInches}"` : `${row.chestCm} cm`}
                  </td>
                  <td className="py-2.5 px-4">
                    {unit === 'inches' ? `${row.lengthInches}"` : `${row.lengthCm} cm`}
                  </td>
                  <td className="py-2.5 px-4">
                    {unit === 'inches'
                      ? `${row.shoulderInches}"`
                      : `${Math.round(parseFloat(row.shoulderInches) * 2.54)} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fit Profiles Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-brand-sand/30 text-xs text-brand-secondary">
          <div className="p-3 bg-brand-ivory/30 border border-brand-sand/20">
            <h4 className="font-semibold text-brand-black text-[11px] uppercase tracking-editorial mb-1">
              Oversized Fit
            </h4>
            <p className="text-[11px] leading-relaxed">
              Extended dropped shoulders and generous chest volume. Take your normal size for the designed drape.
            </p>
          </div>
          <div className="p-3 bg-brand-ivory/30 border border-brand-sand/20">
            <h4 className="font-semibold text-brand-black text-[11px] uppercase tracking-editorial mb-1">
              Boxy Fit
            </h4>
            <p className="text-[11px] leading-relaxed">
              Wide torso with a subtly cropped body length. Eliminates fabric pooling around the waist.
            </p>
          </div>
          <div className="p-3 bg-brand-ivory/30 border border-brand-sand/20">
            <h4 className="font-semibold text-brand-black text-[11px] uppercase tracking-editorial mb-1">
              Regular Fit
            </h4>
            <p className="text-[11px] leading-relaxed">
              Clean tailored silhouette with standard shoulder placement. Perfect for layering under overshirts and jackets.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-brand-sand/30 flex justify-between items-center text-[11px] text-brand-secondary">
          <span>Need personalized fit assistance? Contact concierge at care@bennys.in</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-brand-black text-brand-ivory uppercase tracking-luxury text-xs font-medium hover:bg-brand-mocha transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
