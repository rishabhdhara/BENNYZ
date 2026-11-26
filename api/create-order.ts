import { calculateServerOrderTotals, ServerOrderItemInput } from './_lib/pricing';

interface ApiRequest {
  method?: string;
  body?: {
    items?: ServerOrderItemInput[];
    discountCode?: string;
    preferredMethod?: string;
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

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(503).json({
      error: 'Razorpay credentials are not configured on the server.',
    });
  }

  try {
    const items = req.body?.items || [];
    const discountCode = req.body?.discountCode || '';
    const totals = calculateServerOrderTotals(items, discountCode);

    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totals.amountInPaise,
        currency: 'INR',
        receipt: `bennyz_${Date.now()}`,
        notes: {
          brand: 'BENNYZ',
          preferredMethod: req.body?.preferredMethod || 'upi',
          discountCode: discountCode || 'NONE',
        },
      }),
    });

    const rzpData = await rzpResponse.json();
    if (!rzpResponse.ok) {
      return res.status(rzpResponse.status).json({
        error: rzpData?.error?.description || 'Failed to create Razorpay order.',
      });
    }

    return res.status(200).json({
      orderId: rzpData.id,
      amount: rzpData.amount,
      currency: rzpData.currency,
      totals: {
        subtotal: totals.subtotal,
        discount: totals.discount,
        shippingFee: totals.shippingFee,
        total: totals.total,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to initialize order.';
    return res.status(400).json({ error: message });
  }
}
