import { verifyRazorpayWebhookSignature } from './_lib/pricing';
import { supabaseAdmin } from './_lib/supabaseAdmin';

interface ApiRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

/**
 * Razorpay Webhook receiver (payment.captured / payment.failed).
 * Ensures payment status updates reliably even if the customer closes their
 * browser mid-UPI app redirect.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(503).json({ error: 'RAZORPAY_WEBHOOK_SECRET is not configured.' });
  }

  const rawHeader = req.headers?.['x-razorpay-signature'];
  const signature = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader || '';
  const rawBody =
    typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});

  const valid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid Razorpay webhook signature.' });
  }

  const payload =
    typeof req.body === 'string'
      ? (JSON.parse(req.body) as Record<string, any>)
      : ((req.body || {}) as Record<string, any>);

  const event = payload.event as string | undefined;
  const paymentEntity = payload.payload?.payment?.entity;
  const razorpayOrderId = paymentEntity?.order_id as string | undefined;
  const razorpayPaymentId = paymentEntity?.id as string | undefined;

  if (supabaseAdmin && razorpayOrderId) {
    if (event === 'payment.captured') {
      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'paid',
          razorpay_payment_id: razorpayPaymentId || null,
        })
        .eq('razorpay_order_id', razorpayOrderId);
    } else if (event === 'payment.failed') {
      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'failed',
        })
        .eq('razorpay_order_id', razorpayOrderId);
    }
  }

  return res.status(200).json({ received: true, event: event || 'unknown' });
}
