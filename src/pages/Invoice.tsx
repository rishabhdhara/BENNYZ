import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Printer, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BennyzLogo } from '../components/BennyzLogo';
import { formatPrice } from '../utils/formatters';
import { TERMS_META } from '../data/termsContent';

interface InvoiceOrderData {
  order_number: string;
  invoice_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: Record<string, string>;
  billing_address?: Record<string, string>;
  customer_gstin?: string;
  payment_method: string;
  payment_status: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  taxable_amount: number;
  tax_amount: number;
  gst_rate_percent: number;
  total: number;
  is_demo?: boolean;
  created_at: string;
  order_items: Array<{
    id: string;
    product_name: string;
    fit?: string;
    color_name?: string;
    size: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }>;
}

export const Invoice: React.FC = () => {
  const { orderNumber = '' } = useParams<{ orderNumber: string }>();
  const [searchParams] = useSearchParams();
  const { session } = useAuth();

  const [contactInput, setContactInput] = useState(searchParams.get('contact') || '');
  const [order, setOrder] = useState<InvoiceOrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = async (contact: string) => {
    setLoading(true);
    setError(null);

    // Check sessionStorage cache first (useful right after checkout or in demo mode)
    try {
      const cached = sessionStorage.getItem(`bennyz_order_cache_${orderNumber}`);
      if (cached) {
        setOrder(JSON.parse(cached) as InvoiceOrderData);
        setLoading(false);
        return;
      }
    } catch {
      // ignore storage errors
    }

    try {
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }
      const query = new URLSearchParams({ orderNumber });
      if (contact) query.set('contact', contact);

      const res = await fetch(`/api/track-order?${query.toString()}`, { headers });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.order) {
        setError(data.error || 'Could not load invoice.');
        setOrder(null);
      } else {
        setOrder(data.order as InvoiceOrderData);
      }
    } catch {
      setError('Unable to reach the billing service right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice(contactInput);
  }, [orderNumber, session?.access_token]);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoice(contactInput);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-xs text-brand-secondary-text">
        Loading invoice {orderNumber}...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <Link to="/track-order" className="inline-flex items-center gap-1.5 text-xs text-brand-secondary-text hover:text-brand-black">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Order Tracking</span>
        </Link>

        <div className="bg-white border border-brand-border p-6 sm:p-8 space-y-4">
          <h1 className="font-display text-2xl font-semibold text-brand-black">
            View Invoice ({orderNumber})
          </h1>
          {error && (
            <div className="bg-brand-ivory border border-brand-border p-3 flex items-start gap-2 text-xs text-brand-black">
              <AlertCircle className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleVerifySubmit} className="space-y-3">
            <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
              Order Email or 10-Digit Mobile
            </label>
            <input
              type="text"
              required
              value={contactInput}
              onChange={(e) => setContactInput(e.target.value)}
              placeholder="you@example.com or 9876543210"
              className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
            />
            <button
              type="submit"
              className="w-full py-3 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.15em] font-medium hover:bg-brand-mocha transition-colors"
            >
              Verify &amp; Load Invoice
            </button>
          </form>
        </div>
      </div>
    );
  }

  const billing = order.billing_address || order.shipping_address;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <Link
          to={`/track-order?order=${encodeURIComponent(order.order_number)}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-brand-black hover:text-brand-mocha"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Track Order</span>
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.15em] font-medium hover:bg-brand-mocha transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Printable Invoice Sheet */}
      <div className="print-sheet bg-white border border-brand-border p-6 sm:p-10 space-y-8 text-xs">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-brand-border pb-6">
          <div className="space-y-2">
            <BennyzLogo variant="dark" height={34} />
            <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-brand-mocha">
              {TERMS_META.tagline}
            </p>
            <div className="text-[11px] text-brand-secondary-text space-y-0.5 pt-1">
              <p>{TERMS_META.legalBusinessName}</p>
              <p>{TERMS_META.businessAddress}</p>
              <p>GSTIN: {TERMS_META.gstin}</p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <h1 className="font-display text-2xl font-semibold text-brand-black">
              {order.is_demo ? 'DEMO INVOICE' : 'TAX / RETAIL INVOICE'}
            </h1>
            <p className="font-mono text-brand-black font-medium">
              Invoice No: {order.invoice_number || `INV-${order.order_number}`}
            </p>
            <p className="font-mono text-brand-secondary-text">
              Order No: {order.order_number}
            </p>
            <p className="text-brand-secondary-text">
              Date:{' '}
              {new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Addresses & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-brand-border pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
              Billed To
            </span>
            <p className="font-semibold text-brand-black">{billing.fullName || order.customer_name}</p>
            <p className="text-brand-secondary-text">{billing.street}</p>
            <p className="text-brand-secondary-text">
              {billing.city}, {billing.state} {billing.pinCode}
            </p>
            <p className="text-brand-secondary-text">+91 {billing.phone || order.customer_phone}</p>
            {order.customer_gstin && (
              <p className="font-mono text-brand-black pt-1">GSTIN: {order.customer_gstin}</p>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
              Shipped To
            </span>
            <p className="font-semibold text-brand-black">{order.shipping_address.fullName || order.customer_name}</p>
            <p className="text-brand-secondary-text">{order.shipping_address.street}</p>
            <p className="text-brand-secondary-text">
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pinCode}
            </p>
            <p className="text-brand-secondary-text">{order.customer_email}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
              Payment Details
            </span>
            <p className="text-brand-black uppercase font-medium">
              Method: {order.payment_method}
            </p>
            <p className="text-brand-secondary-text uppercase">
              Status: {order.payment_status}
            </p>
            {order.razorpay_payment_id && (
              <p className="font-mono text-[11px] text-brand-secondary-text break-all">
                Ref: {order.razorpay_payment_id}
              </p>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                <th className="py-2.5 pr-4">Description</th>
                <th className="py-2.5 px-3">Variant</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Rate</th>
                <th className="py-2.5 pl-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {order.order_items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 pr-4 font-medium text-brand-black">
                    {item.product_name}
                    {item.fit ? <span className="text-brand-secondary-text font-normal"> · {item.fit} Fit</span> : null}
                  </td>
                  <td className="py-3 px-3 text-brand-secondary-text">
                    {item.color_name ? `${item.color_name}, ` : ''}
                    {item.size}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono">
                    {formatPrice(item.unit_price || Math.round(item.line_total / item.quantity))}
                  </td>
                  <td className="py-3 pl-3 text-right font-mono font-medium text-brand-black">
                    {formatPrice(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="flex justify-end border-t border-brand-border pt-6">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-brand-secondary-text">
              <span>Subtotal</span>
              <span className="font-mono text-brand-black">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Discount</span>
                <span className="font-mono">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-secondary-text">
              <span>Shipping</span>
              <span className="font-mono">
                {order.shipping_fee === 0 ? '₹0' : formatPrice(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between text-brand-secondary-text pt-2 border-t border-dashed border-brand-border">
              <span>Taxable Value</span>
              <span className="font-mono">₹{Number(order.taxable_amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-secondary-text">
              <span>GST ({order.gst_rate_percent || 5}% incl.)</span>
              <span className="font-mono">₹{Number(order.tax_amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-brand-border text-sm font-semibold text-brand-black">
              <span>Grand Total</span>
              <span className="font-mono">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-brand-secondary-text border-t border-brand-border pt-4 leading-relaxed">
          Computer-generated invoice for BENNYZ. Verify seller legal entity name, GSTIN, and applicable HSN/GST slab before production tax filing.
        </p>
      </div>
    </div>
  );
};
