import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BennyzLogo } from './BennyzLogo';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'login' | 'track'>('login');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [orderId, setOrderId] = useState('');
  const [trackingResult, setTrackingResult] = useState<{
    orderId: string;
    status: string;
    note: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoggedIn(true);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setTrackingResult({
      orderId: orderId.trim().toUpperCase(),
      status: 'Demo Preview — Backend Tracking Pending',
      note: 'Connect your courier tracking API (e.g. Shiprocket, Delhivery, or BlueDart) in production to display live order milestones.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-brand-black/65 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-brand-off-white w-full max-w-lg shadow-2xl z-10 border border-brand-border p-6 sm:p-8">
        <div className="flex justify-between items-start pb-4 border-b border-brand-border">
          <div className="space-y-1.5">
            <BennyzLogo variant="dark" height={16} />
            <h2 className="font-display text-xl font-semibold text-brand-black">
              Account &amp; Order Lookup
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-brand-secondary-text hover:text-brand-black transition-colors"
            aria-label="Close account modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-brand-border my-4">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setTrackingResult(null);
            }}
            className={`flex-1 py-2.5 text-xs tracking-[0.14em] uppercase font-medium border-b-2 transition-colors ${
              tab === 'login'
                ? 'border-brand-black text-brand-black'
                : 'border-transparent text-brand-secondary-text hover:text-brand-black'
            }`}
          >
            Sign In (Demo)
          </button>
          <button
            type="button"
            onClick={() => setTab('track')}
            className={`flex-1 py-2.5 text-xs tracking-[0.14em] uppercase font-medium border-b-2 transition-colors ${
              tab === 'track'
                ? 'border-brand-black text-brand-black'
                : 'border-transparent text-brand-secondary-text hover:text-brand-black'
            }`}
          >
            Order Lookup
          </button>
        </div>

        {tab === 'login' ? (
          isLoggedIn ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-8 h-8 text-brand-mocha mx-auto" />
              <div>
                <h3 className="font-display text-lg font-medium text-brand-black">Signed In (Demo Session)</h3>
                <p className="text-xs text-brand-secondary-text mt-1">
                  Active profile: <strong className="text-brand-black">{email}</strong>
                </p>
              </div>
              <p className="text-[11px] text-brand-secondary-text bg-brand-ivory/60 border border-brand-border p-3 text-left leading-relaxed">
                This is a frontend preview session. Connect an authentication provider (such as Firebase Auth or Shopify/custom backend) when deploying live customer accounts.
              </p>
              <button
                type="button"
                onClick={() => setIsLoggedIn(false)}
                className="text-xs text-brand-secondary-text underline hover:text-brand-black"
              >
                Sign out
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="py-2 space-y-4">
              <p className="text-xs text-brand-secondary-text leading-relaxed">
                Enter your email address to preview the BENNYZ account interface. No password or live backend authentication is active in this build.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-secondary-text block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white border border-brand-border px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-black text-brand-ivory text-xs tracking-[0.16em] uppercase font-medium hover:bg-brand-mocha transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )
        ) : (
          <div className="py-2 space-y-4">
            {!trackingResult ? (
              <form onSubmit={handleTrack} className="space-y-3.5">
                <p className="text-xs text-brand-secondary-text leading-relaxed">
                  Enter an order reference ID to preview how customer shipment lookup works.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-secondary-text block">
                    Order Reference
                  </label>
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. BENNYZ-1042"
                    className="w-full bg-white border border-brand-border px-3.5 py-2.5 text-xs uppercase text-brand-black focus:outline-none focus:border-brand-black"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-black text-brand-ivory text-xs tracking-[0.16em] uppercase font-medium hover:bg-brand-mocha transition-colors"
                >
                  Check Order Status
                </button>
              </form>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-brand-ivory/50 border border-brand-border text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-brand-secondary-text">Reference</span>
                    <strong className="font-mono text-brand-black">{trackingResult.orderId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-secondary-text">Status</span>
                    <span className="font-medium text-brand-mocha">{trackingResult.status}</span>
                  </div>
                  <p className="text-[11px] text-brand-secondary-text pt-2 border-t border-brand-border leading-relaxed">
                    {trackingResult.note}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTrackingResult(null)}
                  className="w-full py-2.5 border border-brand-border text-xs uppercase tracking-[0.14em] hover:bg-white"
                >
                  Search Another Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
