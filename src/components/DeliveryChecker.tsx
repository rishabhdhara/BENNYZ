import React, { useState } from 'react';
import { MapPin, CheckCircle, AlertCircle, Truck } from 'lucide-react';
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
    }, 350);
  };

  return (
    <div className="border border-brand-sand/30 bg-brand-ivory/20 p-4 space-y-3">
      <div className="flex items-center space-x-2 text-brand-black">
        <MapPin className="w-4 h-4 text-brand-mocha" />
        <span className="text-xs font-semibold uppercase tracking-editorial">
          Estimated Delivery & COD Checker
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
          placeholder="ENTER 6-DIGIT PIN CODE (e.g. 560001)"
          className="flex-1 bg-white border border-brand-sand/50 px-3 py-2 text-xs uppercase tracking-wider placeholder:tracking-normal placeholder:text-brand-secondary/50 focus:outline-none focus:border-brand-black"
        />
        <button
          type="submit"
          disabled={loading || pinCode.length !== 6}
          className="px-5 py-2 bg-brand-black text-brand-ivory text-xs uppercase tracking-luxury font-medium hover:bg-brand-mocha transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {result && (
        <div
          className={`text-xs p-3 border flex items-start space-x-2.5 ${
            result.valid
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-red-50/80 border-red-200 text-red-900'
          }`}
        >
          {result.valid ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">
                  Dispatch in 24 hrs to {result.city}, {result.state}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-emerald-800">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" /> {result.deliveryDays}
                  </span>
                  <span>•</span>
                  <span>Cash on Delivery Available</span>
                  <span>•</span>
                  <span>Complimentary on orders &gt; ₹1,999</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p>{result.message}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
