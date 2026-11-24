import React, { useState } from 'react';
import { X, User, Package, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'login' | 'track'>('login');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Track Order State
  const [orderId, setOrderId] = useState('');
  const [trackingPhone, setTrackingPhone] = useState('');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);

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
      orderId: orderId.toUpperCase(),
      status: 'In Transit',
      carrier: 'BlueDart Express',
      awb: 'BLU-884920491',
      destination: 'Bengaluru, KA',
      estimatedDelivery: 'Tomorrow by 7:00 PM',
      steps: [
        { label: 'Order Confirmed & Quality Checked', date: 'Yesterday, 4:30 PM', done: true },
        { label: 'Packed in Signature Recycled Matte Box', date: 'Yesterday, 8:15 PM', done: true },
        { label: 'Dispatched via Air Express Hub', date: 'Today, 6:00 AM', done: true },
        { label: 'Out for Delivery to Doorstep', date: 'Pending', done: false }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-brand-off-white w-full max-w-lg shadow-2xl z-10 border border-brand-sand/40 p-6 sm:p-8">
        <div className="flex justify-between items-start pb-4 border-b border-brand-sand/30">
          <div>
            <span className="text-[10px] tracking-editorial uppercase text-brand-mocha font-medium block">
              BENNYS CLIENT SUITE
            </span>
            <h2 className="font-serif text-2xl font-medium text-brand-black">
              Private Concierge & Orders
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-brand-secondary hover:text-brand-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-brand-sand/30 my-4">
          <button
            type="button"
            onClick={() => { setTab('login'); setTrackingResult(null); }}
            className={`flex-1 py-2.5 text-xs tracking-editorial uppercase font-medium border-b-2 transition-colors ${
              tab === 'login'
                ? 'border-brand-black text-brand-black'
                : 'border-transparent text-brand-secondary hover:text-brand-black'
            }`}
          >
            Client Access
          </button>
          <button
            type="button"
            onClick={() => setTab('track')}
            className={`flex-1 py-2.5 text-xs tracking-editorial uppercase font-medium border-b-2 transition-colors ${
              tab === 'track'
                ? 'border-brand-black text-brand-black'
                : 'border-transparent text-brand-secondary hover:text-brand-black'
            }`}
          >
            Track Order
          </button>
        </div>

        {tab === 'login' ? (
          isLoggedIn ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 bg-brand-mocha/20 rounded-full flex items-center justify-center mx-auto text-brand-mocha">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-brand-black">Welcome to BENNYS Club</h3>
                <p className="text-xs text-brand-secondary mt-1 font-light">
                  Logged in as <strong className="text-brand-black">{email}</strong>
                </p>
              </div>

              <div className="p-4 bg-brand-ivory/40 border border-brand-sand/30 text-left text-xs space-y-2">
                <p className="font-medium text-brand-black text-[11px] uppercase tracking-editorial">
                  Member Privileges
                </p>
                <ul className="text-brand-secondary space-y-1 text-[11px]">
                  <li>• Guaranteed priority allocation on Drop 002.</li>
                  <li>• Automatic complimentary express shipping.</li>
                  <li>• 14-day direct doorstep garment exchanges.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setIsLoggedIn(false)}
                className="text-xs text-brand-secondary underline hover:text-brand-black"
              >
                Sign out of session
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="py-4 space-y-4">
              <p className="text-xs text-brand-secondary font-light leading-relaxed">
                Sign in with your mobile or email to manage active reservations, view archived invoices, and access private drop allocations.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] tracking-editorial uppercase font-semibold text-brand-secondary">
                  Email Address or Mobile (+91)
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aditya@example.com or 9876543210"
                  className="w-full bg-white border border-brand-sand/50 px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-black text-brand-ivory text-xs tracking-luxury uppercase font-medium hover:bg-brand-mocha transition-colors flex items-center justify-center space-x-2"
              >
                <span>CONTINUE TO CLIENT SUITE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-brand-secondary/70">
                Demo authentication active. Enter any email to experience the client suite.
              </p>
            </form>
          )
        ) : (
          <div className="py-2 space-y-4">
            {!trackingResult ? (
              <form onSubmit={handleTrack} className="space-y-3.5">
                <p className="text-xs text-brand-secondary font-light leading-relaxed">
                  Enter your order ID (sent via SMS/Email after order confirmation) to monitor your courier dispatch timeline.
                </p>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-editorial uppercase font-semibold text-brand-secondary">
                    Order Reference ID
                  </label>
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. BENNYS-7492"
                    className="w-full bg-white border border-brand-sand/50 px-3.5 py-2 text-xs uppercase text-brand-black focus:outline-none focus:border-brand-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-editorial uppercase font-semibold text-brand-secondary">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={trackingPhone}
                    onChange={(e) => setTrackingPhone(e.target.value)}
                    placeholder="10-digit registered number"
                    className="w-full bg-white border border-brand-sand/50 px-3.5 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-black text-brand-ivory text-xs tracking-luxury uppercase font-medium hover:bg-brand-mocha transition-colors"
                >
                  TRACK LIVE SHIPMENT
                </button>
              </form>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center p-3 bg-brand-ivory/50 border border-brand-sand/30 text-xs">
                  <div>
                    <span className="text-[10px] text-brand-secondary uppercase block">Order ID</span>
                    <strong className="text-brand-black font-semibold">{trackingResult.orderId}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-brand-secondary uppercase block">Carrier</span>
                    <span className="text-brand-black font-medium">{trackingResult.carrier}</span>
                  </div>
                </div>

                <div className="space-y-3 pl-2 border-l-2 border-brand-black/20 my-2">
                  {trackingResult.steps.map((st: any, idx: number) => (
                    <div key={idx} className="relative pl-4">
                      <div
                        className={`absolute -left-[17px] top-1 w-3 h-3 rounded-full border-2 ${
                          st.done
                            ? 'bg-brand-black border-brand-black'
                            : 'bg-white border-brand-sand'
                        }`}
                      />
                      <p className={`text-xs ${st.done ? 'font-medium text-brand-black' : 'text-brand-secondary'}`}>
                        {st.label}
                      </p>
                      <p className="text-[10px] text-brand-secondary/70">{st.date}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setTrackingResult(null)}
                  className="w-full py-2 border border-brand-sand/50 text-xs uppercase tracking-editorial hover:bg-white"
                >
                  Track Another Shipment
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
