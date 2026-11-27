import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface AdminOrderItem {
  id: string;
  product_name: string;
  color_name: string;
  size: string;
  quantity: number;
  line_total: number;
}

interface AdminOrderRow {
  id: string;
  order_number: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total: number;
  courier_name: string;
  tracking_number: string;
  tracking_url: string;
  estimated_delivery: string;
  created_at: string;
  order_items: AdminOrderItem[];
}

export const AdminOrders: React.FC = () => {
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<
    Record<
      string,
      {
        orderStatus: string;
        courierName: string;
        trackingNumber: string;
        trackingUrl: string;
        estimatedDelivery: string;
        note: string;
      }
    >
  >({});

  const loadOrders = async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin-orders', {
        headers: { 'x-admin-key': key },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not authenticate admin key.');
        setAuthenticated(false);
        return;
      }

      const rows = (data.orders || []) as AdminOrderRow[];
      setOrders(rows);
      setAuthenticated(true);

      const nextDrafts: typeof drafts = {};
      rows.forEach((r) => {
        nextDrafts[r.order_number] = {
          orderStatus: r.order_status,
          courierName: r.courier_name || '',
          trackingNumber: r.tracking_number || '',
          trackingUrl: r.tracking_url || '',
          estimatedDelivery: r.estimated_delivery || '',
          note: '',
        };
      });
      setDrafts(nextDrafts);
    } catch {
      setError('Unable to reach /api/admin-orders. Run via Vercel deployment or vercel dev.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    loadOrders(adminKey.trim());
  };

  const handleSaveOrderUpdate = async (orderNumber: string) => {
    const draft = drafts[orderNumber];
    if (!draft) return;

    setError(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin-orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey.trim(),
        },
        body: JSON.stringify({ orderNumber, ...draft }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not update order.');
        return;
      }

      setFeedback(`Updated ${orderNumber} (${draft.orderStatus}).`);
      await loadOrders(adminKey.trim());
    } catch {
      setError('Network error while updating order.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-brand-border pb-5">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
          Store Operations
        </span>
        <h1 className="font-display text-3xl font-semibold text-brand-black mt-1">
          Orders, Billing &amp; Fulfillment
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-start gap-2.5 text-xs text-red-900">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-2.5 text-xs text-emerald-950">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>{feedback}</span>
        </div>
      )}

      {!authenticated ? (
        <form
          onSubmit={handleLogin}
          className="max-w-md bg-white border border-brand-border p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-brand-black">
            <Lock className="w-4 h-4 text-brand-mocha" />
            <span>Admin Key Required</span>
          </div>
          <p className="text-xs text-brand-secondary-text leading-relaxed">
            Enter your <code className="font-mono text-brand-black">ADMIN_SECRET_KEY</code> configured in Vercel Environment Variables to manage orders and tracking updates.
          </p>
          <input
            type="password"
            required
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter ADMIN_SECRET_KEY"
            className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.15em] font-medium hover:bg-brand-mocha transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Unlock Orders Console'}
          </button>
        </form>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-brand-border p-10 text-center text-xs text-brand-secondary-text">
          No orders recorded in Supabase yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const draft = drafts[order.order_number];
            if (!draft) return null;

            return (
              <div key={order.id} className="bg-white border border-brand-border p-6 space-y-5 text-xs">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-border pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-sm text-brand-black">
                        {order.order_number}
                      </span>
                      <span className="font-mono text-[11px] text-brand-secondary-text">
                        {order.invoice_number}
                      </span>
                    </div>
                    <p className="text-brand-secondary-text">
                      {order.customer_name} · {order.customer_email} · +91 {order.customer_phone}
                    </p>
                    <p className="text-brand-black font-medium">
                      {formatPrice(order.total)} · {order.payment_method.toUpperCase()} ({order.payment_status})
                    </p>
                  </div>

                  <Link
                    to={`/invoice/${encodeURIComponent(order.order_number)}?contact=${encodeURIComponent(order.customer_email)}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-brand-border hover:border-brand-black text-[11px] uppercase tracking-[0.12em]"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Invoice</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <select
                    value={draft.orderStatus}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        [order.order_number]: { ...draft, orderStatus: e.target.value },
                      })
                    }
                    className="bg-brand-off-white border border-brand-border px-2.5 py-2 text-xs"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <input
                    type="text"
                    value={draft.courierName}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        [order.order_number]: { ...draft, courierName: e.target.value },
                      })
                    }
                    placeholder="Courier (e.g. Delhivery)"
                    className="bg-brand-off-white border border-brand-border px-2.5 py-2 text-xs"
                  />

                  <input
                    type="text"
                    value={draft.trackingNumber}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        [order.order_number]: { ...draft, trackingNumber: e.target.value },
                      })
                    }
                    placeholder="AWB / Tracking No."
                    className="bg-brand-off-white border border-brand-border px-2.5 py-2 text-xs font-mono"
                  />

                  <input
                    type="text"
                    value={draft.estimatedDelivery}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        [order.order_number]: { ...draft, estimatedDelivery: e.target.value },
                      })
                    }
                    placeholder="Est. delivery (e.g. 29 Nov)"
                    className="bg-brand-off-white border border-brand-border px-2.5 py-2 text-xs"
                  />

                  <button
                    type="button"
                    onClick={() => handleSaveOrderUpdate(order.order_number)}
                    className="bg-brand-black text-brand-ivory px-4 py-2 text-xs uppercase tracking-[0.12em] font-medium hover:bg-brand-mocha transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
