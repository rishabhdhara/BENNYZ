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
  activeFit = 'Boxy',
}) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-brand-black/65 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-brand-off-white w-full max-w-2xl shadow-2xl z-10 border border-brand-border max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex justify-between items-start pb-4 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 text-brand-mocha mb-1">
              <Ruler className="w-4 h-4" />
              <span className="text-[10px] font-mono tracking-[0.18em] uppercase font-medium">
                BENNYZ Size Guide
              </span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-brand-black">
              Garment Measurements
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-brand-secondary-text hover:text-brand-black transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-brand-secondary-text">
            <span className="font-medium text-brand-black">Active Fit:</span>{' '}
            <span className="uppercase font-mono text-brand-mocha font-medium">{activeFit} Fit</span>
          </div>

          <div className="inline-flex border border-brand-border bg-white p-0.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-mono uppercase transition-colors ${
                unit === 'inches'
                  ? 'bg-brand-black text-brand-ivory'
                  : 'text-brand-black/70 hover:text-brand-black'
              }`}
            >
              Inches
            </button>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-mono uppercase transition-colors ${
                unit === 'cm'
                  ? 'bg-brand-black text-brand-ivory'
                  : 'text-brand-black/70 hover:text-brand-black'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-brand-border my-4 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-ivory text-brand-black uppercase font-mono text-[10px] border-b border-brand-border">
              <tr>
                <th className="py-3 px-4 font-semibold">Size</th>
                <th className="py-3 px-4 font-semibold">Chest</th>
                <th className="py-3 px-4 font-semibold">Length</th>
                <th className="py-3 px-4 font-semibold">Shoulder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-brand-black">
              {SIZE_CHART_DATA.map((row) => (
                <tr key={row.size} className="hover:bg-brand-off-white transition-colors">
                  <td className="py-2.5 px-4 font-mono font-semibold">{row.size}</td>
                  <td className="py-2.5 px-4">
                    {unit === 'inches' ? `${row.chestInches}"` : `${row.chestCm} cm`}
                  </td>
                  <td className="py-2.5 px-4">
                    {unit === 'inches' ? `${row.lengthInches}"` : `${row.lengthCm} cm`}
                  </td>
                  <td className="py-2.5 px-4">
                    {unit === 'inches'
                      ? `${row.shoulderInches}"`
                      : `${(parseFloat(row.shoulderInches) * 2.54).toFixed(1)} cm`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-brand-secondary-text bg-brand-ivory/40 border border-brand-border p-3 leading-relaxed">
          Placeholder sizing matrix shown above. Replace measurements in <code className="font-mono text-brand-black">src/data/products.ts</code> with your final graded spec sheet before launch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 mt-4 border-t border-brand-border text-xs text-brand-secondary-text">
          <div className="p-3 bg-white border border-brand-border">
            <h4 className="font-semibold text-brand-black text-[11px] uppercase tracking-[0.12em] mb-1">
              Oversized Fit
            </h4>
            <p className="text-[11px] leading-relaxed">
              Dropped shoulders and generous chest room for a relaxed drape.
            </p>
          </div>
          <div className="p-3 bg-white border border-brand-border">
            <h4 className="font-semibold text-brand-black text-[11px] uppercase tracking-[0.12em] mb-1">
              Boxy Fit
            </h4>
            <p className="text-[11px] leading-relaxed">
              Wide chest proportion with a slightly shorter torso that sits cleanly at the waist.
            </p>
          </div>
          <div className="p-3 bg-white border border-brand-border">
            <h4 className="font-semibold text-brand-black text-[11px] uppercase tracking-[0.12em] mb-1">
              Regular Fit
            </h4>
            <p className="text-[11px] leading-relaxed">
              Clean shoulder alignment and balanced everyday profile.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-brand-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-brand-black text-brand-ivory uppercase tracking-[0.14em] text-xs font-medium hover:bg-brand-mocha transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
