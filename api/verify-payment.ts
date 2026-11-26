import {
  calculateServerOrderTotals,
  ServerOrderItemInput,
  verifyRazorpaySignature,
} from './_lib/pricing';

interface ApiRequest {
  method?: string;
  body?: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    items?: ServerOrderItemInput[];
    discountCode?: string;
    address?: {
      fullName?: string;
      email?: string;
      phone?: string;
      street?: string;
      city?: string;
      state?: string;
      pinCode?: string;
    };
  };
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(503).json({ error: 'Razorpay secret is not configured.' });
  }

  const {
    razorpay_order_id = '',
    razorpay_payment_id = '',
    razorpay_signature = '',
    items = [],
    discountCode = '',
  } = req.body || {};

  const valid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    keySecret
  );

  if (!valid) {
    return res.status(400).json({
      verified: false,
      error: 'Payment signature verification failed.',
    });
  }

  try {
    const totals = calculateServerOrderTotals(items, discountCode);
    const orderNumber = `BZ-${Date.now().toString().slice(-6)}`;

    // TODO: Persist confirmed order in your database / notify fulfillment service here.
    return res.status(200).json({
      verified: true,
      orderNumber,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      totals,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to finalize verified order.';
    return res.status(400).json({ verified: false, error: message });
  }
}
