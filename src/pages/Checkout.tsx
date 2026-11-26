import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, checkIndianPinCode } from '../utils/formatters';
import { PaymentMethod, ShippingAddress } from '../types';
import { ArrowRight, CheckCircle2, Info, CreditCard, Smartphone, Landmark, Banknote } from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi NCR',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export const Checkout: React.FC = () => {
  const { cart, subtotal, discount, discountCode, shippingFee, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
    pinCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoOrder, setDemoOrder] = useState<{
    orderId: string;
    date: string;
    address: ShippingAddress;
    items: typeof cart;
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
    paymentMethod: PaymentMethod;
  } | null>(null);

  const handlePinChange = (pin: string) => {
    const val = pin.replace(/\D/g, '').slice(0, 6);
    setAddress((prev) => ({ ...prev, pinCode: val }));

    if (val.length === 6) {
      const res = checkIndianPinCode(val);
      if (res.valid) {
        setPinFeedback(`${res.city}, ${res.state} — ${res.deliveryDays}`);
        if (res.city && !address.city) {
          setAddress((prev) => ({ ...prev, city: res.city || prev.city }));
        }
      } else {
        setPinFeedback('Invalid 6-digit PIN code');
      }
    } else {
      setPinFeedback(null);
    }
  };

  const handlePlaceDemoOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      navigate('/shop');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedOrderId = `BENNYZ-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
      setDemoOrder({
        orderId: generatedOrderId,
        date: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        address: { ...address },
        items: [...cart],
        subtotal,
        discount,
        shippingFee,
        total,
        paymentMethod,
      });
      setIsSubmitting(false);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  if (demoOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="bg-white border border-brand-border p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-3 pb-6 border-b border-brand-border">
            <CheckCircle2 className="w-10 h-10 text-brand-mocha mx-auto" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
              Demo Order Summary (No Payment Charged)
            </span>
            <h1 className="font-display text-3xl font-semibold text-brand-black">
              Demo Checkout Complete
            </h1>
            <p className="text-xs text-brand-secondary-text max-w-md mx-auto leading-relaxed">
              This is a simulated demonstration order for <strong className="text-brand-black">{demoOrder.address.email}</strong>. No payment gateway was invoked and no money was charged.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-brand-ivory/50 border border-brand-border text-xs">
            <div>
              <span className="text-[10px] font-mono text-brand-secondary-text uppercase block">Demo ID</span>
              <strong className="text-brand-black font-mono">{demoOrder.orderId}</strong>
            </div>
            <div>
              <span className="text-[10px] font-mono text-brand-secondary-text uppercase block">Date</span>
              <span className="text-brand-black">{demoOrder.date}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-brand-secondary-text uppercase block">Selected Mode</span>
              <span className="text-brand-black uppercase font-medium">{demoOrder.paymentMethod}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-brand-secondary-text uppercase block">Demo Total</span>
              <strong className="text-brand-black">{formatPrice(demoOrder.total)}</strong>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black">
              Items ({demoOrder.items.length})
            </h2>
            <div className="divide-y divide-brand-border border-y border-brand-border">
              {demoOrder.items.map((it) => (
                <div key={it.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={it.image} alt={it.name} className="w-12 h-14 object-cover border border-brand-border" />
                    <div>
                      <h3 className="font-medium text-brand-black">{it.name}</h3>
                      <p className="text-[11px] text-brand-secondary-text">
                        {it.color.name} • Size {it.size} • Qty {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-brand-black">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-brand-off-white border border-brand-border text-xs text-brand-secondary-text space-y-2">
            <p className="font-semibold text-brand-black">Connecting Live Payments (Razorpay)</p>
            <p className="leading-relaxed">
              To accept live UPI, Card, and Net Banking payments in production: create a server endpoint using the Razorpay Orders API (<code className="font-mono text-brand-black">orders.create</code>), load <code className="font-mono text-brand-black">https://checkout.razorpay.com/v1/checkout.js</code>, open the Razorpay Checkout modal with your public Key ID, and verify the HMAC signature on your backend before fulfilling the order.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/shop"
              className="flex-1 py-3.5 bg-brand-black text-brand-ivory text-xs tracking-[0.15em] uppercase font-medium text-center hover:bg-brand-mocha transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="flex-1 py-3.5 border border-brand-black text-brand-black text-xs tracking-[0.15em] uppercase font-medium text-center hover:bg-brand-ivory transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Clear Demo Checkout Notice */}
      <div className="bg-brand-ivory border border-brand-border p-4 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-mono uppercase tracking-[0.14em] text-[10px] font-semibold text-brand-black">
            Demo Checkout — Payment Gateway Not Configured
          </p>
          <p className="text-brand-secondary-text leading-relaxed">
            This is a clearly labelled demo checkout flow. No real payments are processed, and card details are intentionally not collected here. In production, integrate a gateway such as <strong>Razorpay</strong> (via server-side order creation and Razorpay Checkout SDK) to securely process UPI, cards, and net banking.
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white border border-brand-border p-12 text-center space-y-4">
          <h1 className="font-display text-2xl font-semibold text-brand-black">Your bag is empty</h1>
          <p className="text-xs text-brand-secondary-text">Add T-shirts to your bag before opening checkout.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.15em]"
          >
            <span>Browse T-Shirts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <form onSubmit={handlePlaceDemoOrder} className="lg:col-span-7 space-y-6">
            {/* Contact */}
            <div className="bg-white border border-brand-border p-6 sm:p-8 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.16em] font-semibold text-brand-black border-b border-brand-border pb-3">
                1. Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Full name"
                    className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                  Mobile Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-xs bg-brand-ivory border border-r-0 border-brand-border text-brand-black font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="10-digit number"
                    className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-brand-border p-6 sm:p-8 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.16em] font-semibold text-brand-black border-b border-brand-border pb-3">
                2. Shipping Address
              </h2>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="House/Flat No., Building, Street"
                  className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                  Landmark / Area (Optional)
                </label>
                <input
                  type="text"
                  value={address.apartment}
                  onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                  placeholder="Apartment, suite, landmark"
                  className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pinCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    placeholder="560001"
                    className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-brand-black"
                  />
                  {pinFeedback && <p className="text-[10px] text-emerald-800">{pinFeedback}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                    State *
                  </label>
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Preference (Demo Only) */}
            <div className="bg-white border border-brand-border p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <h2 className="text-xs font-mono uppercase tracking-[0.16em] font-semibold text-brand-black">
                  3. Payment Method (Demo Preview)
                </h2>
                <span className="text-[10px] font-mono uppercase text-brand-mocha">
                  Razorpay Ready
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'upi' as const, label: 'UPI (GPay / PhonePe)', icon: Smartphone },
                  { id: 'card' as const, label: 'Card (via Razorpay)', icon: CreditCard },
                  { id: 'netbanking' as const, label: 'Net Banking', icon: Landmark },
                  { id: 'cod' as const, label: 'Cash on Delivery', icon: Banknote },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const active = paymentMethod === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`p-3.5 border cursor-pointer flex items-center justify-between transition-colors ${
                        active ? 'border-brand-black bg-brand-ivory/50' : 'border-brand-border bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={active}
                          onChange={() => setPaymentMethod(opt.id)}
                          className="accent-brand-black"
                        />
                        <span className="text-xs font-medium text-brand-black">{opt.label}</span>
                      </div>
                      <Icon className="w-4 h-4 text-brand-mocha" />
                    </label>
                  );
                })}
              </div>
              <p className="text-[11px] text-brand-secondary-text leading-relaxed">
                Selecting a payment option above records your preference for the demo order preview. Live payment processing requires connecting a Razorpay backend order endpoint and Checkout SDK.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-black text-brand-ivory text-xs tracking-[0.16em] uppercase font-semibold hover:bg-brand-mocha transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Generating Demo Order...' : `Place Demo Order (${formatPrice(total)})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-white border border-brand-border p-6 sm:p-8 space-y-6 sticky top-24">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <h2 className="font-display text-xl font-semibold text-brand-black">Order Summary</h2>
              <Link to="/cart" className="text-[11px] uppercase tracking-[0.14em] text-brand-mocha hover:underline">
                Edit Bag
              </Link>
            </div>

            <div className="divide-y divide-brand-border max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-14 object-cover border border-brand-border shrink-0" />
                    <div>
                      <h3 className="text-xs font-medium text-brand-black line-clamp-1">{item.name}</h3>
                      <p className="text-[11px] text-brand-secondary-text">
                        {item.color.name} • {item.size} • Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-brand-black">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-brand-secondary-text border-t border-brand-border pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-brand-black">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Promo ({discountCode})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-brand-border text-base font-semibold text-brand-black">
                <span>Total (Demo)</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
