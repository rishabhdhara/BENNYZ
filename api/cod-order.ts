import { calculateServerOrderTotals, ServerOrderItemInput } from './_lib/pricing';

interface ApiRequest {
  method?: string;
  body?: {
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

  try {
    const { items = [], discountCode = '', address } = req.body || {};
    if (!address?.fullName || !address?.email || !address?.phone || !address?.pinCode) {
      return res.status(400).json({ error: 'Complete shipping contact details are required.' });
    }

    const totals = calculateServerOrderTotals(items, discountCode);
    const orderNumber = `BZ-COD-${Date.now().toString().slice(-6)}`;

    // TODO: Persist Cash on Delivery order in your database / notify fulfillment service here.
    return res.status(200).json({
      confirmed: true,
      orderNumber,
      totals,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to place COD order.';
    return res.status(400).json({ error: message });
  }
}
