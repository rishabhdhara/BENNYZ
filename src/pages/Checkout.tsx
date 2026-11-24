import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, checkIndianPinCode } from '../utils/formatters';
import { PaymentMethod, ShippingAddress } from '../types';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Info,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  Truck,
  Download,
  AlertTriangle
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCR', 'Chandigarh', 'Jammu & Kashmir'
];

export const Checkout: React.FC = () => {
  const { cart, subtotal, discount, discountCode, shippingFee, total, clearCart } = useCart();
  const navigate = useNavigate();

  // Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
    pinCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // Validate PIN code on change
  const handlePinChange = (pin: string) => {
    const val = pin.replace(/\D/g, '').slice(0, 6);
    setAddress((prev) => ({ ...prev, pinCode: val }));

    if (val.length === 6) {
      const res = checkIndianPinCode(val);
      if (res.valid) {
        setPinFeedback(`✓ ${res.city}, ${res.state} (${res.deliveryDays})`);
        if (res.city && !address.city) {
          setAddress((prev) => ({ ...prev, city: res.city || prev.city }));
        }
      } else {
        setPinFeedback('Invalid Indian postal PIN');
      }
    } else {
      setPinFeedback(null);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      navigate('/shop');
      return;
    }

    setIsSubmitting(true);

    // Simulate order generation and processing (DEMO MODE)
    setTimeout(() => {
      const generatedOrderId = `BENNYS-IND-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const orderSummary = {
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
        estimatedDeliveryDate: 'Within 3 - 4 Business Days'
      };

      setOrderComplete(orderSummary);
      setIsSubmitting(false);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  // If order completed, render Order Confirmation Receipt
  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 animate-fade-in">
        <div className="bg-white border border-brand-sand/40 p-6 sm:p-10 shadow-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 pb-6 border-b border-brand-sand/30">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold block">
              ORDER CONFIRMED & QUEUED
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-brand-black">
              Thank You for Your Order
            </h1>
            <p className="text-xs text-brand-secondary max-w-md mx-auto font-light leading-relaxed">
              We have received your reservation for Drop 001. A confirmation dispatch note has been sent to{' '}
              <strong className="text-brand-black">{orderComplete.address.email}</strong>.
            </p>
          </div>

          {/* Reference Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-brand-ivory/30 border border-brand-sand/30 text-xs">
            <div>
              <span className="text-[10px] text-brand-secondary uppercase block">Order Number</span>
              <strong className="text-brand-black font-semibold">{orderComplete.orderId}</strong>
            </div>
            <div>
              <span className="text-[10px] text-brand-secondary uppercase block">Date</span>
              <span className="text-brand-black">{orderComplete.date}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-secondary uppercase block">Payment Method</span>
              <span className="text-brand-black uppercase font-medium">{orderComplete.paymentMethod}</span>
            </div>
            <div>
              <span className="text-[10px] text-brand-secondary uppercase block">Total Paid</span>
              <strong className="text-brand-black font-semibold">{formatPrice(orderComplete.total)}</strong>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-editorial text-brand-black">
              Allocated Garments ({orderComplete.items.length})
            </h3>
            <div className="divide-y divide-brand-sand/20 border-t border-b border-brand-sand/20">
              {orderComplete.items.map((it: any) => (
                <div key={it.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-12 h-14 object-cover border border-brand-sand/30"
                    />
                    <div>
                      <h4 className="font-semibold text-brand-black">{it.name}</h4>
                      <p className="text-[11px] text-brand-secondary">
                        {it.color.name} • Size {it.size} • Qty: {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-brand-black">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-brand-off-white border border-brand-sand/30 text-xs text-brand-secondary leading-relaxed">
            <div>
              <h4 className="font-semibold uppercase tracking-editorial text-[10px] text-brand-black mb-1">
                Recipient Shipping Address
              </h4>
              <p className="font-medium text-brand-black">{orderComplete.address.fullName}</p>
              <p>{orderComplete.address.street}</p>
              {orderComplete.address.apartment && <p>{orderComplete.address.apartment}</p>}
              <p>
                {orderComplete.address.city}, {orderComplete.address.state} - {orderComplete.address.pinCode}
              </p>
              <p>Mobile: +91 {orderComplete.address.phone}</p>
            </div>

            <div>
              <h4 className="font-semibold uppercase tracking-editorial text-[10px] text-brand-black mb-1">
                Logistics Timeline
              </h4>
              <p className="text-emerald-800 font-medium">✓ BlueDart Express Air Courier</p>
              <p>Estimated Doorstep Delivery: {orderComplete.estimatedDeliveryDate}</p>
              <p className="text-[11px] text-brand-secondary/70 mt-2">
                Garments are packaged in signature matte black recyclable cartons with custom dust covers.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              to="/shop"
              className="flex-1 py-3.5 bg-brand-black text-brand-ivory text-xs tracking-luxury uppercase font-medium text-center hover:bg-brand-mocha transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/support#track"
              className="flex-1 py-3.5 border border-brand-sand/60 text-brand-black text-xs tracking-luxury uppercase font-medium text-center hover:bg-brand-ivory transition-colors flex items-center justify-center space-x-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Dispatch Status</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Checkout Form
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Checkout Notice */}
      <div className="bg-brand-ivory/60 border border-brand-sand/40 p-4 flex items-start space-x-3 text-xs text-brand-black">
        <Info className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold uppercase tracking-editorial text-[10px] text-brand-mocha">
            DEMONSTRATION CHECKOUT MODE
          </p>
          <p className="text-brand-secondary font-light">
            This checkout interface simulates an authentic Indian e-commerce transaction. No real credit cards or UPI funds will be charged. Architecture is fully prepared for future Razorpay integration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Customer Info & Shipping & Payment Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer Contact */}
          <div className="bg-white border border-brand-sand/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-sand/30 pb-3">
              <h2 className="text-xs uppercase tracking-editorial font-semibold text-brand-black">
                1. Contact Details
              </h2>
              <span className="text-[11px] text-brand-secondary">Express Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="e.g. Vikramaditya Rathore"
                  className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  placeholder="vikram@example.com"
                  className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                Phone Number (for Courier SMS updates) *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-xs bg-brand-sand/20 border border-r-0 border-brand-sand/40 text-brand-black font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '') })}
                  placeholder="9876543210"
                  className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Destination */}
          <div className="bg-white border border-brand-sand/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-sand/30 pb-3">
              <h2 className="text-xs uppercase tracking-editorial font-semibold text-brand-black">
                2. Shipping Address (India)
              </h2>
              <span className="text-[11px] text-brand-secondary">Doorstep Courier Delivery</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                Flat / House No. / Building / Street Address *
              </label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="e.g. 402, Signature Enclave, 12th Main Road"
                className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                Locality / Landmark / Area (Optional)
              </label>
              <input
                type="text"
                value={address.apartment}
                onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                placeholder="e.g. Near Indiranagar Metro Station"
                className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={address.pinCode}
                  onChange={(e) => handlePinChange(e.target.value)}
                  placeholder="e.g. 560001"
                  className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-brand-black"
                />
                {pinFeedback && (
                  <p className="text-[10px] text-emerald-800 font-medium pt-0.5">{pinFeedback}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="e.g. Bengaluru"
                  className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                  State *
                </label>
                <select
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="bg-white border border-brand-sand/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-sand/30 pb-3">
              <h2 className="text-xs uppercase tracking-editorial font-semibold text-brand-black">
                3. Payment Gateway (India)
              </h2>
              <div className="flex items-center space-x-1 text-xs text-emerald-800">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Option 1: UPI */}
              <label
                className={`p-4 border block cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-brand-black bg-brand-ivory/20 ring-1 ring-brand-black'
                    : 'border-brand-sand/30 bg-white hover:border-brand-black'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-brand-black"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase text-brand-black">
                        Instant UPI (GPay / PhonePe / Paytm / QR)
                      </span>
                      <p className="text-[11px] text-brand-secondary font-light">
                        Fastest payment via any UPI app with zero transaction charges.
                      </p>
                    </div>
                  </div>
                  <Smartphone className="w-4 h-4 text-brand-mocha shrink-0" />
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-3 pt-3 border-t border-brand-sand/20 space-y-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter UPI VPA (e.g. yourname@okhdfcbank)"
                      className="w-full bg-white border border-brand-sand/50 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                    />
                    <p className="text-[10px] text-brand-secondary">
                      You will receive an instant payment request on your authorized UPI application.
                    </p>
                  </div>
                )}
              </label>

              {/* Option 2: Credit / Debit Cards */}
              <label
                className={`p-4 border block cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-brand-black bg-brand-ivory/20 ring-1 ring-brand-black'
                    : 'border-brand-sand/30 bg-white hover:border-brand-black'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-brand-black"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase text-brand-black">
                        Credit / Debit Card
                      </span>
                      <p className="text-[11px] text-brand-secondary font-light">
                        Visa, Mastercard, RuPay, and American Express.
                      </p>
                    </div>
                  </div>
                  <CreditCard className="w-4 h-4 text-brand-mocha shrink-0" />
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-3 pt-3 border-t border-brand-sand/20 space-y-3">
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on Card"
                      className="w-full bg-white border border-brand-sand/50 px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number (Demo: 4242 •••• •••• 4242)"
                      className="w-full bg-white border border-brand-sand/50 px-3 py-2 text-xs"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="bg-white border border-brand-sand/50 px-3 py-2 text-xs"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="CVV"
                        className="bg-white border border-brand-sand/50 px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                )}
              </label>

              {/* Option 3: Net Banking */}
              <label
                className={`p-4 border block cursor-pointer transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-brand-black bg-brand-ivory/20 ring-1 ring-brand-black'
                    : 'border-brand-sand/30 bg-white hover:border-brand-black'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="accent-brand-black"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase text-brand-black">
                        Net Banking
                      </span>
                      <p className="text-[11px] text-brand-secondary font-light">
                        All major Indian scheduled banks supported.
                      </p>
                    </div>
                  </div>
                  <Landmark className="w-4 h-4 text-brand-mocha shrink-0" />
                </div>

                {paymentMethod === 'netbanking' && (
                  <div className="mt-3 pt-3 border-t border-brand-sand/20">
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-white border border-brand-sand/50 px-3 py-2 text-xs font-medium"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}
              </label>

              {/* Option 4: Cash on Delivery (COD) */}
              <label
                className={`p-4 border block cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-black bg-brand-ivory/20 ring-1 ring-brand-black'
                    : 'border-brand-sand/30 bg-white hover:border-brand-black'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-brand-black"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase text-brand-black">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-brand-secondary font-light">
                        Pay upon doorstep verification across India.
                      </p>
                    </div>
                  </div>
                  <Banknote className="w-4 h-4 text-brand-mocha shrink-0" />
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-black text-brand-ivory text-xs tracking-luxury uppercase font-medium hover:bg-brand-mocha transition-colors flex items-center justify-center space-x-2 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>PROCESSING RESERVATION...</span>
            ) : (
              <>
                <span>CONFIRM ORDER ({formatPrice(total)})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Right: Order Summary Breakdown Sidebar */}
        <div className="lg:col-span-5 bg-white border border-brand-sand/30 p-6 sm:p-8 space-y-6 sticky top-28">
          <div className="flex justify-between items-center border-b border-brand-sand/30 pb-3">
            <h3 className="font-serif text-xl text-brand-black">Your Order Summary</h3>
            <Link to="/cart" className="text-[11px] uppercase tracking-editorial text-brand-mocha hover:underline">
              Edit Bag
            </Link>
          </div>

          {/* Items preview list */}
          <div className="divide-y divide-brand-sand/20 max-h-64 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover border border-brand-sand/30 shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-medium text-brand-black line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-brand-secondary">
                      {item.color.name} • {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-brand-black">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Math */}
          <div className="space-y-2 text-xs text-brand-secondary font-light border-t border-brand-sand/30 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-brand-black">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-800 font-medium">
                <span>Promotional Code ({discountCode})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Express Logistics</span>
              <span>{shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-brand-sand/30 text-base font-semibold text-brand-black">
              <span>Final Payable Amount</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-[10px] text-brand-secondary/70 text-right">
              All applicable GST included.
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-brand-sand/20 space-y-2 text-[11px] text-brand-secondary">
            <div className="flex items-center space-x-2 text-brand-black font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-mocha" />
              <span>BENNYS Quality Promise</span>
            </div>
            <p className="font-light">
              • 14-day hassle-free doorstep size exchanges across India.
            </p>
            <p className="font-light">
              • Dispatched in our signature architectural luxury packaging.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
