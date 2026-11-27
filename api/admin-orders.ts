import crypto from 'node:crypto';
import { supabaseAdmin, OrderStatusEvent } from './_lib/supabaseAdmin';

interface ApiRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: {
    orderNumber?: string;
    orderStatus?: string;
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
    note?: string;
  };
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

const VALID_STATUSES = [
  'confirmed',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const;

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Order Confirmed',
  packed: 'Packed & Ready for Dispatch',
  shipped: 'Shipped via Courier',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Order Cancelled',
};

function isAdminAuthorized(req: ApiRequest): boolean {
  const adminKey = process.env.ADMIN_SECRET_KEY || '';
  if (!adminKey) return false;
  const raw = req.headers?.['x-admin-key'];
  const provided = Array.isArray(raw) ? raw[0] : raw || '';
  if (!provided) return false;

  const a = Buffer.from(adminKey, 'utf8');
  const b = Buffer.from(provided, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!process.env.ADMIN_SECRET_KEY) {
    return res.status(503).json({ error: 'ADMIN_SECRET_KEY is not configured on the server.' });
  }

  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: 'Invalid admin key.' });
  }

  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Supabase service role key is not configured.' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(
        `id, order_number, invoice_number, customer_name, customer_email, customer_phone,
         shipping_address, billing_address, customer_gstin, payment_method, payment_status,
         order_status, razorpay_payment_id, subtotal, discount, shipping_fee, taxable_amount,
         tax_amount, gst_rate_percent, total, courier_name, tracking_number, tracking_url,
         estimated_delivery, status_history, created_at,
         order_items (id, product_name, fit, color_name, size, quantity, line_total)`
      )
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ orders: data || [] });
  }

  if (req.method === 'PATCH') {
    const {
      orderNumber = '',
      orderStatus = '',
      courierName,
      trackingNumber,
      trackingUrl,
      estimatedDelivery,
      note,
    } = req.body || {};

    if (!orderNumber || !VALID_STATUSES.includes(orderStatus as (typeof VALID_STATUSES)[number])) {
      return res.status(400).json({ error: 'Valid orderNumber and orderStatus are required.' });
    }

    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('id, status_history')
      .eq('order_number', orderNumber.trim().toUpperCase())
      .maybeSingle();

    if (fetchErr || !existing) {
      return res.status(404).json({ error: `Order ${orderNumber} not found.` });
    }

    const prevHistory = Array.isArray(existing.status_history)
      ? (existing.status_history as OrderStatusEvent[])
      : [];

    const nextHistory: OrderStatusEvent[] = [
      ...prevHistory,
      {
        status: orderStatus,
        label: STATUS_LABELS[orderStatus] || orderStatus,
        timestamp: new Date().toISOString(),
        note: note?.trim() || (trackingNumber ? `AWB: ${trackingNumber.trim()}` : undefined),
      },
    ];

    const updates: Record<string, unknown> = {
      order_status: orderStatus,
      status_history: nextHistory,
    };

    if (courierName !== undefined) updates.courier_name = courierName.trim();
    if (trackingNumber !== undefined) updates.tracking_number = trackingNumber.trim();
    if (trackingUrl !== undefined) updates.tracking_url = trackingUrl.trim();
    if (estimatedDelivery !== undefined) updates.estimated_delivery = estimatedDelivery.trim();

    const { data: updated, error: updateErr } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();

    if (updateErr) {
      return res.status(500).json({ error: updateErr.message });
    }

    return res.status(200).json({ updated: true, order: updated });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
