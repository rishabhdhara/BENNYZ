import {
  resolveUserIdFromAuthHeader,
  supabaseAdmin,
} from './_lib/supabaseAdmin';

interface ApiRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

const getQueryValue = (
  val: string | string[] | undefined
): string => (Array.isArray(val) ? val[0] : val || '').trim();

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseAdmin) {
    return res.status(503).json({
      error: 'Order tracking database is not configured yet (missing SUPABASE_SERVICE_ROLE_KEY).',
    });
  }

  const orderNumber = getQueryValue(req.query?.orderNumber).toUpperCase();
  const contact = getQueryValue(req.query?.contact);

  if (!orderNumber) {
    return res.status(400).json({ error: 'Please provide an order number.' });
  }

  const rawAuth = req.headers?.authorization || req.headers?.Authorization;
  const authHeader = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;
  const requesterUserId = await resolveUserIdFromAuthHeader(authHeader);

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(
      `id, order_number, invoice_number, user_id, customer_email, customer_name, customer_phone,
       shipping_address, billing_address, customer_gstin, payment_method, payment_status,
       order_status, razorpay_order_id, razorpay_payment_id, discount_code, subtotal, discount,
       shipping_fee, taxable_amount, tax_amount, gst_rate_percent, total, courier_name,
       tracking_number, tracking_url, estimated_delivery, status_history, created_at,
       order_items (id, product_id, product_name, fit, color_name, size, quantity, unit_price, line_total)`
    )
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ error: 'Unable to look up order right now.' });
  }

  if (!order) {
    return res.status(404).json({ error: `No order found matching ${orderNumber}.` });
  }

  // Authorization: either logged-in order owner OR matching email / 10-digit phone
  const isOwner = Boolean(requesterUserId && order.user_id && requesterUserId === order.user_id);
  const cleanContactEmail = contact.toLowerCase();
  const cleanContactDigits = contact.replace(/\D/g, '').slice(-10);
  const orderDigits = String(order.customer_phone || '').replace(/\D/g, '').slice(-10);

  const contactMatches =
    Boolean(contact) &&
    ((cleanContactEmail && cleanContactEmail === String(order.customer_email || '').toLowerCase()) ||
      (cleanContactDigits.length === 10 && cleanContactDigits === orderDigits));

  if (!isOwner && !contactMatches) {
    return res.status(403).json({
      error: 'Please enter the email address or 10-digit phone number used on this order to verify access.',
    });
  }

  return res.status(200).json({ order });
}
