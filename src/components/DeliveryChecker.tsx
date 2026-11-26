import React, { useState } from 'react';
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { checkIndianPinCode, PinCodeResult } from '../utils/formatters';

export const DeliveryChecker: React.FC = () => {
  const [pinCode, setPinCode] = useState('');
  const [result, setResult] = useState<PinCodeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const res = checkIndianPinCode(pinCode);
      setResult(res);
      setLoading(false);
    }, 250);
  };

  return (
    <div className="border border-brand-border bg-white p-4 space-y-3">
      <div className="flex items-center gap-2 text-brand-black">
        <MapPin className="w-4 h-4 text-brand-mocha" />
        <span className="text-[11px] font-mono uppercase tracking-[0.14em] font-medium">
          Check Estimated Delivery
        </span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pinCode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            setPinCode(val);
            if (result) setResult(null);
          }}
          placeholder="Enter 6-digit PIN code"
          className="flex-1 bg-brand-off-white border border-brand-border px-3 py-2 text-xs font-mono placeholder:font-sans placeholder:text-brand-secondary-text/60 focus:outline-none focus:border-brand-black"
        />
        <button
          type="submit"
          disabled={loading || pinCode.length !== 6}
          className="px-5 py-2 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.14em] font-medium hover:bg-brand-mocha transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? 'Checking' : 'Check'}
        </button>
      </form>

      {result && (
        <div
          className={`text-xs p-3 border flex items-start gap-2.5 ${
            result.valid
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-red-50/70 border-red-200 text-red-950'
          }`}
        >
          {result.valid ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-medium">
                  Serviceable: {result.city}, {result.state}
                </p>
                <p className="text-[11px] text-emerald-800">
                  {result.deliveryDays} • Free shipping on orders over ₹1,999
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <p>{result.message}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
