import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, checkIndianPinCode } from '../utils/formatters';
import { loadRazorpayScript, RazorpaySuccessResponse } from '../utils/razorpay';
import { PaymentMethod, ShippingAddress } from '../types';
import {
  ArrowRight,
  CheckCircle2,
  Info,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  AlertCircle,
  Lock,
  FileText,
  Package,
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi NCR',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const ENV_RAZORPAY_KEY_ID = (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined)?.trim() || '';

interface OrderConfirmation {
  orderId: string;
  invoiceNumber: string;
  paymentId?: string;
  razorpayOrderId?: string;
  isDemo: boolean;
  date: string;
  address: ShippingAddress;
  billingAddress: ShippingAddress;
  customerGstin: string;
  items: ReturnType<typeof useCart>['cart'];
  subtotal: number;
  discount: number;
  shippingFee: number;
  taxableAmount: number;
  taxAmount: number;
  gstRatePercent: number;
  total: number;
  paymentMethod: PaymentMethod;
}

export const Checkout: React.FC = () => {
  const { cart, subtotal, discount, discountCode, shippingFee, total, clearCart } = useCart();
  const { user, session, profile } = useAuth();
  const navigate = useNavigate();

  const [razorpayKeyId, setRazorpayKeyId] = useState<string>(ENV_RAZORPAY_KEY_ID);
  const [razorpayMode, setRazorpayMode] = useState<'demo' | 'test' | 'live'>(
    ENV_RAZORPAY_KEY_ID
      ? ENV_RAZORPAY_KEY_ID.startsWith('rzp_test_')
        ? 'test'
        : 'live'
      : 'demo'
  );

  // Check server payment readiness (/api/payment-config) in case keys are set on Vercel server env
  useEffect(() => {
    fetch('/api/payment-config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.razorpayEnabled && data?.keyId) {
          setRazorpayKeyId(data.keyId);
          setRazorpayMode(data.mode || (data.keyId.startsWith('rzp_test_') ? 'test' : 'live'));
        }
      })
      .catch(() => {
        // Static preview without /api/ runtime — keep ENV fallback
      });
  }, []);

  const isRazorpayConfigured = Boolean(razorpayKeyId);
  const isTestModeKey = razorpayMode === 'test';

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

  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: 'Karnataka',
    pinCode: '',
  });
  const [customerGstin, setCustomerGstin] = useState('');

  useEffect(() => {
    if (!user && !profile) return;
    setAddress((prev) => ({
      ...prev,
      fullName: prev.fullName || profile?.full_name || (user?.user_metadata?.full_name as string) || '',
      email: prev.email || user?.email || '',
      phone: prev.phone || profile?.phone || (user?.user_metadata?.phone as string) || '',
      street: prev.street || profile?.default_address?.street || '',
      city: prev.city || profile?.default_address?.city || '',
      state: prev.state || profile?.default_address?.state || 'Karnataka',
      pinCode: prev.pinCode || profile?.default_address?.pinCode || '',
    }));
  }, [user, profile]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderConfirmation | null>(null);

  const gstRatePercent = 5;
  const taxableAmount = Number((total / (1 + gstRatePercent / 100)).toFixed(2));
  const taxAmount = Number((total - taxableAmount).toFixed(2));

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

  const buildSerializedItems = () =>
    cart.map((item) => ({
      productId: item.productId,
      size: item.size,
      colorCode: item.color.code,
      colorName: item.color.name,
      fit: item.fit,
      quantity: item.quantity,
    }));

  const buildAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
    return headers;
  };

  const resolvedBillingAddress = sameBillingAddress ? address : billingAddress;

  const finalizeOrderScreen = (params: {
    orderId: string;
    invoiceNumber: string;
    isDemo: boolean;
    paymentId?: string;
    razorpayOrderId?: string;
  }) => {
    const summary: OrderConfirmation = {
      orderId: params.orderId,
      invoiceNumber: params.invoiceNumber,
      paymentId: params.paymentId,
      razorpayOrderId: params.razorpayOrderId,
      isDemo: params.isDemo,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      address: { ...address },
      billingAddress: { ...resolvedBillingAddress },
      customerGstin: customerGstin.trim().toUpperCase(),
      items: [...cart],
      subtotal,
      discount,
      shippingFee,
      taxableAmount,
      taxAmount,
      gstRatePercent,
      total,
      paymentMethod,
    };

    try {
      sessionStorage.setItem(
        `bennyz_order_cache_${params.orderId}`,
        JSON.stringify({
          order_number: params.orderId,
          invoice_number: params.invoiceNumber,
          customer_email: summary.address.email,
          customer_name: summary.address.fullName,
          customer_phone: summary.address.phone,
          shipping_address: summary.address,
          billing_address: summary.billingAddress,
          customer_gstin: summary.customerGstin,
          payment_method: summary.paymentMethod,
          payment_status: params.isDemo ? 'demo' : paymentMethod === 'cod' ? 'cod_pending' : 'paid',
          order_status: 'confirmed',
          razorpay_order_id: params.razorpayOrderId || null,
          razorpay_payment_id: params.paymentId || null,
          discount_code: discountCode || null,
          subtotal: summary.subtotal,
          discount: summary.discount,
          shipping_fee: summary.shippingFee,
          taxable_amount: summary.taxableAmount,
          tax_amount: summary.taxAmount,
          gst_rate_percent: summary.gstRatePercent,
          total: summary.total,
          courier_name: '',
          tracking_number: '',
          tracking_url: '',
          estimated_delivery: '',
          is_demo: params.isDemo,
          created_at: new Date().toISOString(),
          status_history: [
            {
              status: 'confirmed',
              label: params.isDemo
                ? 'Demo Order Placed'
                : paymentMethod === 'cod'
                ? 'Order Confirmed (Cash on Delivery)'
                : 'Order Confirmed & Payment Verified',
              timestamp: new Date().toISOString(),
              note: params.paymentId ? `Razorpay Payment ID: ${params.paymentId}` : undefined,
            },
          ],
          order_items: summary.items.map((it) => ({
            id: it.id,
            product_name: it.name,
            fit: it.fit,
            color_name: it.color.name,
            size: it.size,
            quantity: it.quantity,
            unit_price: it.price,
            line_total: it.price * it.quantity,
          })),
        })
      );
    } catch {
      // ignore storage errors
    }

    setCompletedOrder(summary);
    clearCart();
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoOrder = () => {
    setTimeout(() => {
      const orderId = `BENNYZ-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
      finalizeOrderScreen({
        orderId,
        invoiceNumber: `INV-DEMO-${orderId.slice(-6)}`,
        isDemo: true,
      });
    }, 450);
  };

  const handleCodOrder = async () => {
    const res = await fetch('/api/cod-order', {
      method: 'POST',
      headers: buildAuthHeaders(),
      body: JSON.stringify({
        items: buildSerializedItems(),
        discountCode,
        customerGstin: customerGstin.trim().toUpperCase(),
        billingAddress: resolvedBillingAddress,
        address,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Could not confirm Cash on Delivery order.');
    }

    finalizeOrderScreen({
      orderId: data.orderNumber,
      invoiceNumber: data.invoiceNumber || `INV-BZ-${data.orderNumber.slice(-6)}`,
      isDemo: false,
    });
  };

  const handleRazorpayOrder = async () => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay || !razorpayKeyId) {
      throw new Error('Could not load Razorpay Checkout SDK. Check your connection and try again.');
    }

    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: buildSerializedItems(),
        discountCode,
        preferredMethod: paymentMethod,
      }),
    });

    const orderData = await orderRes.json().catch(() => ({}));
    if (!orderRes.ok || !orderData.orderId) {
      throw new Error(orderData.error || 'Unable to initialize Razorpay order on server.');
    }

    const rzp = new window.Razorpay({
      key: razorpayKeyId,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'BENNYZ',
      description: 'Built for your everyday.',
      order_id: orderData.orderId,
      prefill: {
        name: address.fullName,
        email: address.email,
        contact: `+91${address.phone}`,
      },
      method: {
        upi: paymentMethod === 'upi' || true,
        card: paymentMethod === 'card' || true,
        netbanking: paymentMethod === 'netbanking' || true,
      },
      theme: {
        color: '#171717',
      },
      handler: async (response: RazorpaySuccessResponse) => {
        try {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: buildAuthHeaders(),
            body: JSON.stringify({
              ...response,
              items: buildSerializedItems(),
              discountCode,
              paymentMethod,
              customerGstin: customerGstin.trim().toUpperCase(),
              billingAddress: resolvedBillingAddress,
              address,
            }),
          });

          const verifyData = await verifyRes.json().catch(() => ({}));
          if (!verifyRes.ok || !verifyData.verified) {
            setCheckoutError(
              verifyData.error ||
                'Payment could not be verified on server. Please contact support with your payment ID.'
            );
            setIsSubmitting(false);
            return;
          }

          finalizeOrderScreen({
            orderId: verifyData.orderNumber,
            invoiceNumber: verifyData.invoiceNumber || `INV-BZ-${verifyData.orderNumber.slice(-6)}`,
            paymentId: verifyData.razorpayPaymentId,
            razorpayOrderId: verifyData.razorpayOrderId,
            isDemo: false,
          });
        } catch (err) {
          setCheckoutError(
            err instanceof Error ? err.message : 'Error verifying payment on server.'
          );
          setIsSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsSubmitting(false);
        },
      },
    });

    rzp.on('payment.failed', (failure) => {
      setCheckoutError(failure?.error?.description || 'Payment failed. Please try again.');
      setIsSubmitting(false);
    });

    rzp.open();
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (cart.length === 0) {
      navigate('/shop');
      return;
    }

    if (address.phone.length !== 10) {
      setCheckoutError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (address.pinCode.length !== 6) {
      setCheckoutError('Please enter a valid 6-digit PIN code.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isRazorpayConfigured) {
        handleDemoOrder();
        return;
      }

      if (paymentMethod === 'cod') {
        await handleCodOrder();
      } else {
        await handleRazorpayOrder();
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    const invoiceUrl = `/invoice/${encodeURIComponent(completedOrder.orderId)}?contact=${encodeURIComponent(completedOrder.address.email)}`;
    const trackUrl = `/track-order?order=${encodeURIComponent(completedOrder.orderId)}&contact=${encodeURIComponent(completedOrder.address.email)}`;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="bg-white border border-brand-border p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-3 pb-6 border-b border-brand-border">
            <CheckCircle2 className="w-10 h-10 text-brand-mocha mx-auto" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
              {completedOrder.isDemo ? 'Demo Order Summary (No Payment Charged)' : 'Order Confirmed'}
            </span>
            <h1 className="font-display text-3xl font-semibold text-brand-black">
              {completedOrder.isDemo ? 'Demo Checkout Complete' : 'Thank You for Your Order'}
            </h1>
            <p className="text-xs text-brand-secondary-text max-w-md mx-auto leading-relaxed">
              {completedOrder.isDemo
                ? `Simulated demo order for ${completedOrder.address.email}. Add your Razorpay keys to process live UPI, card, and net banking payments.`
                : `Confirmation and billing details generated for ${completedOrder.address.email}.`}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-brand-ivory/50 border border-brand-border text-xs">
            <div>
              <span className="text-[10px] font-mono text-brand-secondary-text uppercase block">
                Order ID
              </span>
              <strong className="text-brand-black font-mono">{completedOrder.orderId}</strong>
            </div>
            <div>
              <span className="text-[10px] font-mono text-brand-secondary-text uppercase block">
                Invoice No.
              </span>
              <strong className="text-brand-black font-mono">{completedOrder.invoiceNumber}</strong>
            </div>
            <div>
              <span className="text-[10px] font-mono text-brand-secondary-text uppercase block">
                Method
              </span>
              <span className="text-brand-black uppercase font-medium">
                {completedOrder.paymentMethod}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-brand-secondary-text uppercase block">
                Total
              </span>
              <strong className="text-brand-black">{formatPrice(completedOrder.total)}</strong>
            </div>
          </div>

          {completedOrder.paymentId && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-mono flex flex-wrap justify-between gap-2">
              <span>Razorpay Payment ID: {completedOrder.paymentId}</span>
              {completedOrder.razorpayOrderId && <span>Order Ref: {completedOrder.razorpayOrderId}</span>}
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black">
              Billed Items ({completedOrder.items.length})
            </h2>
            <div className="divide-y divide-brand-border border-y border-brand-border">
              {completedOrder.items.map((it) => (
                <div key={it.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-12 h-14 object-cover border border-brand-border"
                    />
                    <div>
                      <h3 className="font-medium text-brand-black">{it.name}</h3>
                      <p className="text-[11px] text-brand-secondary-text">
                        {it.color.name} • Size {it.size} • Qty {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-brand-black">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-brand-secondary-text flex flex-wrap justify-between gap-2 pt-1">
              <span>Taxable Value: {formatPrice(completedOrder.taxableAmount)}</span>
              <span>
                GST ({completedOrder.gstRatePercent}% incl.): ₹{completedOrder.taxAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to={invoiceUrl}
              className="py-3.5 bg-brand-black text-brand-ivory text-xs tracking-[0.15em] uppercase font-medium text-center hover:bg-brand-mocha transition-colors inline-flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>View / Print Invoice</span>
            </Link>
            <Link
              to={trackUrl}
              className="py-3.5 border border-brand-black text-brand-black text-xs tracking-[0.15em] uppercase font-medium text-center hover:bg-brand-ivory transition-colors inline-flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Track Order</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Status Banner */}
      {isRazorpayConfigured ? (
        <div className="bg-brand-ivory border border-brand-border p-4 flex items-start gap-3 text-xs">
          <Lock className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-mono uppercase tracking-[0.14em] text-[10px] font-semibold text-brand-black">
              {isTestModeKey
                ? 'Razorpay Test Mode Active (UPI / Cards / Net Banking)'
                : 'Razorpay Checkout Enabled (UPI / Cards / Net Banking)'}
            </p>
            <p className="text-brand-secondary-text leading-relaxed">
              {isTestModeKey
                ? 'Test mode active. In the Razorpay popup, choose UPI and test using success@razorpay without charging real funds.'
                : 'Secured by Razorpay Checkout with server-side order creation, HMAC verification, and automated invoice generation.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-brand-ivory border border-brand-border p-4 flex items-start gap-3 text-xs">
          <Info className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-mono uppercase tracking-[0.14em] text-[10px] font-semibold text-brand-black">
              Demo Checkout — Razorpay Keys Not Configured Yet
            </p>
            <p className="text-brand-secondary-text leading-relaxed">
              Add <code className="font-mono text-brand-black">RAZORPAY_KEY_ID</code>,{' '}
              <code className="font-mono text-brand-black">RAZORPAY_KEY_SECRET</code>, and{' '}
              <code className="font-mono text-brand-black">SUPABASE_SERVICE_ROLE_KEY</code> in Vercel Environment Variables to activate live UPI, Card, and Net Banking billing. Until then, submitting generates a clearly labelled demo order and demo invoice.
            </p>
          </div>
        </div>
      )}

      {checkoutError && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-xs text-red-900">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <span>{checkoutError}</span>
        </div>
      )}

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
          <form onSubmit={handleSubmitCheckout} className="lg:col-span-7 space-y-6">
            {/* 1. Contact */}
            <div className="bg-white border border-brand-border p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border pb-3">
                <h2 className="text-xs font-mono uppercase tracking-[0.16em] font-semibold text-brand-black">
                  1. Contact Information
                </h2>
                {user ? (
                  <span className="text-[11px] text-brand-mocha">Signed in as {user.email}</span>
                ) : (
                  <Link
                    to="/login?redirect=/checkout"
                    className="text-[11px] underline text-brand-mocha hover:text-brand-black"
                  >
                    Sign in for faster checkout
                  </Link>
                )}
              </div>

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

            {/* 2. Shipping */}
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

            {/* 3. Billing Information */}
            <div className="bg-white border border-brand-border p-6 sm:p-8 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.16em] font-semibold text-brand-black border-b border-brand-border pb-3">
                3. Billing Details &amp; Invoice
              </h2>

              <label className="flex items-center gap-2.5 text-xs text-brand-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameBillingAddress}
                  onChange={(e) => setSameBillingAddress(e.target.checked)}
                  className="accent-brand-black"
                />
                <span>Billing address is the same as shipping address</span>
              </label>

              {!sameBillingAddress && (
                <div className="space-y-3 pt-2 border-t border-brand-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={billingAddress.fullName}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, fullName: e.target.value })
                      }
                      placeholder="Billing Name / Company *"
                      className="bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                    />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={billingAddress.phone}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          phone: e.target.value.replace(/\D/g, ''),
                        })
                      }
                      placeholder="Billing Phone *"
                      className="bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={billingAddress.street}
                    onChange={(e) =>
                      setBillingAddress({ ...billingAddress, street: e.target.value })
                    }
                    placeholder="Billing Street Address *"
                    className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={billingAddress.pinCode}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          pinCode: e.target.value.replace(/\D/g, '').slice(0, 6),
                        })
                      }
                      placeholder="PIN Code *"
                      className="bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-brand-black"
                    />
                    <input
                      type="text"
                      required
                      value={billingAddress.city}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, city: e.target.value })
                      }
                      placeholder="City *"
                      className="bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                    />
                    <select
                      value={billingAddress.state}
                      onChange={(e) =>
                        setBillingAddress({ ...billingAddress, state: e.target.value })
                      }
                      className="bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                  Customer GSTIN (Optional — for business tax invoice)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-brand-black"
                />
              </div>
            </div>

            {/* 4. Payment Method */}
            <div className="bg-white border border-brand-border p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <h2 className="text-xs font-mono uppercase tracking-[0.16em] font-semibold text-brand-black">
                  4. Payment Method
                </h2>
                <span className="text-[10px] font-mono uppercase text-brand-mocha">
                  {isRazorpayConfigured ? 'Razorpay Secured' : 'Demo Mode'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'upi' as const, label: 'UPI (GPay / PhonePe / QR)', icon: Smartphone },
                  { id: 'card' as const, label: 'Credit / Debit Card', icon: CreditCard },
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
                      <Icon className="w-4 h-4 text-brand-mocha shrink-0" />
                    </label>
                  );
                })}
              </div>
              <p className="text-[11px] text-brand-secondary-text leading-relaxed">
                {paymentMethod === 'cod'
                  ? 'Pay in cash or UPI upon doorstep delivery.'
                  : 'Complete payment securely inside the Razorpay popup using UPI QR, GPay, PhonePe, Paytm, Card, or Net Banking.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-brand-black text-brand-ivory text-xs tracking-[0.16em] uppercase font-semibold hover:bg-brand-mocha transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? 'Processing...'
                  : !isRazorpayConfigured
                  ? `Place Demo Order (${formatPrice(total)})`
                  : paymentMethod === 'cod'
                  ? `Place COD Order (${formatPrice(total)})`
                  : `Pay ${formatPrice(total)} with Razorpay`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Order Summary & Tax Breakdown */}
          <div className="lg:col-span-5 bg-white border border-brand-border p-6 sm:p-8 space-y-6 sticky top-24">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <h2 className="font-display text-xl font-semibold text-brand-black">Billing Summary</h2>
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
                <span>Subtotal (incl. taxes)</span>
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
              <div className="flex justify-between text-[11px] pt-1 border-t border-dashed border-brand-border">
                <span>Taxable Value</span>
                <span>₹{taxableAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Estimated GST ({gstRatePercent}% incl.)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-brand-border text-base font-semibold text-brand-black">
                <span>{isRazorpayConfigured ? 'Total Payable' : 'Total (Demo)'}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
