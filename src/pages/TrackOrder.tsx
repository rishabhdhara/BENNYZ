import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Truck, CheckCircle2, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

interface StatusEvent {
  status: string;
  label: string;
  timestamp: string;
  note?: string;
}

interface TrackedOrder {
  order_number: string;
  invoice_number: string;
  customer_email: string;
  customer_name: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total: number;
  courier_name: string;
  tracking_number: string;
  tracking_url: string;
  estimated_delivery: string;
  status_history: StatusEvent[];
  created_at: string;
  order_items: Array<{
    id: string;
    product_name: string;
    color_name: string;
    size: string;
    quantity: number;
    line_total: number;
  }>;
}

const MILESTONE_STEPS = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, session } = useAuth();

  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [contact, setContact] = useState(searchParams.get('contact') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const performLookup = async (orderNum: string, contactVal: string) => {
    const cleanOrder = orderNum.trim().toUpperCase();
    if (!cleanOrder) return;

    setLoading(true);
    setError(null);

    // Check local demo/recent order cache first for BENNYZ-DEMO-* orders
    try {
      const cached = sessionStorage.getItem(`bennyz_order_cache_${cleanOrder}`);
      if (cached) {
        const parsed = JSON.parse(cached) as TrackedOrder & { is_demo?: boolean };
        if (parsed.is_demo) {
          setOrder(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {
      // ignore
    }

    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }
      const query = new URLSearchParams({ orderNumber: cleanOrder });
      if (contactVal.trim()) query.set('contact', contactVal.trim());

      const res = await fetch(`/api/track-order?${query.toString()}`, { headers });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.order) {
        setOrder(null);
        setError(data.error || 'Could not locate that order.');
      } else {
        setOrder(data.order as TrackedOrder);
      }
    } catch {
      setError('Unable to connect to order tracking right now.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialOrder = searchParams.get('order');
    const initialContact = searchParams.get('contact') || user?.email || '';
    if (initialContact && !contact) setContact(initialContact);
    if (initialOrder) {
      performLookup(initialOrder, initialContact);
    }
  }, [searchParams, session?.access_token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(orderNumber, contact || user?.email || '');
  };

  const activeStepIndex = order
    ? Math.max(
        0,
        MILESTONE_STEPS.findIndex((s) => s.key === order.order_status)
      )
    : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-2 border-b border-brand-border pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
          Order Status
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-brand-black">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary-text">
          Enter your BENNYZ order number and the email or 10-digit mobile number used at checkout.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-brand-border p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end"
      >
        <div className="sm:col-span-5 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
            Order Number *
          </label>
          <input
            type="text"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="e.g. BZ-482910"
            className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-brand-black"
          />
        </div>

        <div className="sm:col-span-5 space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
            Email or Mobile {user ? '(Optional if signed in)' : '*'}
          </label>
          <input
            type="text"
            required={!user}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="you@example.com or 9876543210"
            className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 py-2.5 px-4 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.14em] font-medium hover:bg-brand-mocha transition-colors disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-xs text-red-900">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {order && (
        <div className="bg-white border border-brand-border p-6 sm:p-8 space-y-8">
          {/* Header Meta */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-border pb-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-mocha block">
                Order {order.order_number}
              </span>
              <h2 className="font-display text-2xl font-semibold text-brand-black capitalize">
                {order.order_status.replace(/_/g, ' ')}
              </h2>
              <p className="text-xs text-brand-secondary-text">
                Placed on{' '}
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {' · '}Total {formatPrice(order.total)} ({order.payment_method.toUpperCase()})
              </p>
            </div>

            <Link
              to={`/invoice/${encodeURIComponent(order.order_number)}${
                contact ? `?contact=${encodeURIComponent(contact)}` : ''
              }`}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-brand-black text-xs uppercase tracking-[0.14em] font-medium text-brand-black hover:bg-brand-ivory transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Invoice</span>
            </Link>
          </div>

          {/* 5-Stage Progress Bar */}
          {order.order_status !== 'cancelled' && (
            <div className="grid grid-cols-5 gap-2">
              {MILESTONE_STEPS.map((step, idx) => {
                const done = idx <= activeStepIndex;
                return (
                  <div key={step.key} className="space-y-2">
                    <div
                      className={`h-1.5 w-full ${done ? 'bg-brand-black' : 'bg-brand-border'}`}
                    />
                    <span
                      className={`block text-[10px] font-mono uppercase leading-tight ${
                        done ? 'text-brand-black font-semibold' : 'text-brand-secondary-text'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Courier & AWB Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-brand-ivory/50 border border-brand-border text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-brand-secondary-text block">
                Courier Partner
              </span>
              <span className="font-medium text-brand-black flex items-center gap-1.5 mt-0.5">
                <Truck className="w-3.5 h-3.5 text-brand-mocha" />
                {order.courier_name || 'Awaiting dispatch'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-brand-secondary-text block">
                Tracking / AWB Number
              </span>
              {order.tracking_number ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-semibold text-brand-black">
                    {order.tracking_number}
                  </span>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-mocha hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Track</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ) : (
                <span className="text-brand-secondary-text mt-0.5 block">Assigned upon shipment</span>
              )}
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-brand-secondary-text block">
                Estimated Delivery
              </span>
              <span className="font-medium text-brand-black mt-0.5 block">
                {order.estimated_delivery || 'Pending courier scan'}
              </span>
            </div>
          </div>

          {/* Status History Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black">
              Tracking Updates
            </h3>
            <div className="space-y-4 pl-4 border-l border-brand-border">
              {(order.status_history || [])
                .slice()
                .reverse()
                .map((ev, i) => (
                  <div key={`${ev.timestamp}-${i}`} className="relative pl-4">
                    <CheckCircle2
                      className={`w-4 h-4 absolute -left-[25px] top-0.5 bg-white ${
                        i === 0 ? 'text-brand-black' : 'text-brand-mocha'
                      }`}
                    />
                    <p className="text-xs font-semibold text-brand-black">{ev.label}</p>
                    {ev.note && <p className="text-[11px] text-brand-secondary-text">{ev.note}</p>}
                    <span className="text-[10px] font-mono text-brand-secondary-text">
                      {new Date(ev.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-brand-border pt-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-brand-black">
              <Package className="w-3.5 h-3.5 text-brand-mocha" />
              <span>Items in This Order</span>
            </div>
            <div className="divide-y divide-brand-border/60 text-xs">
              {order.order_items.map((it) => (
                <div key={it.id} className="py-2 flex justify-between gap-4">
                  <span>
                    {it.product_name}{' '}
                    <span className="text-brand-secondary-text">
                      ({it.color_name}, {it.size}) × {it.quantity}
                    </span>
                  </span>
                  <span className="font-mono font-medium">{formatPrice(it.line_total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
