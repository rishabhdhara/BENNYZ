import {
  calculateServerOrderTotals,
  generateInvoiceNumber,
  ServerOrderItemInput,
} from './_lib/pricing';
import {
  persistConfirmedOrder,
  resolveUserIdFromAuthHeader,
} from './_lib/supabaseAdmin';

interface ApiRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: {
    items?: Array<ServerOrderItemInput & { fit?: string; colorName?: string }>;
    discountCode?: string;
    customerGstin?: string;
    billingAddress?: Record<string, unknown>;
    address?: {
      fullName?: string;
      email?: string;
      phone?: string;
      street?: string;
      apartment?: string;
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
    const {
      items = [],
      discountCode = '',
      customerGstin = '',
      billingAddress,
      address,
    } = req.body || {};
    if (!address?.fullName || !address?.email || !address?.phone || !address?.pinCode) {
      return res.status(400).json({ error: 'Complete shipping contact details are required.' });
    }

    const totals = calculateServerOrderTotals(items, discountCode);
    const orderNumber = `BZ-COD-${Date.now().toString().slice(-6)}`;
    const invoiceNumber = generateInvoiceNumber(orderNumber);

    const rawAuth = req.headers?.authorization || req.headers?.Authorization;
    const authHeader = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;
    const userId = await resolveUserIdFromAuthHeader(authHeader);

    const persistence = await persistConfirmedOrder({
      orderNumber,
      invoiceNumber,
      userId,
      customerEmail: address.email,
      customerName: address.fullName,
      customerPhone: address.phone,
      shippingAddress: address,
      billingAddress: billingAddress || address,
      customerGstin: customerGstin.trim().toUpperCase(),
      paymentMethod: 'cod',
      paymentStatus: 'cod_pending',
      discountCode,
      totals,
      itemMetadata: items,
    });

    return res.status(200).json({
      confirmed: true,
      orderNumber,
      invoiceNumber,
      orderSaved: persistence.saved,
      totals,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to place COD order.';
    return res.status(400).json({ error: message });
  }
}
